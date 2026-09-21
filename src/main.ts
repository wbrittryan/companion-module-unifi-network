import { InstanceBase, InstanceStatus, type SomeCompanionConfigField } from '@companion-module/base'
import { UniFiClient, type UniFiDevice } from 'unifi-api-ts'
import { GetConfigFields, type ModuleConfig, type ModuleSecrets } from './config.js'
import { UpdateVariableDefinitions, type VariablesSchema } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions, type ActionsSchema } from './actions.js'
import { UpdateFeedbacks, type FeedbacksSchema } from './feedbacks.js'
import { UpdatePresets } from './presets.js'

export type ModuleSchema = {
	config: ModuleConfig
	secrets: ModuleSecrets
	actions: ActionsSchema
	feedbacks: FeedbacksSchema
	variables: VariablesSchema
}

export { UpgradeScripts }

// Minimal structural typing for the axios instance unifi-api-ts's HTTPClient wraps internally.
// unifi-api-ts doesn't expose this in its public API (or its own types), so this only describes
// the two interceptor hooks attachCsrfTokenHandling() below actually uses.
interface AxiosLikeClient {
	interceptors: {
		request: {
			use: (onFulfilled: (config: { headers?: Record<string, string> }) => { headers?: Record<string, string> }) => void
		}
		response: {
			use: (
				onFulfilled: (response: { headers?: Record<string, string> }) => { headers?: Record<string, string> },
			) => void
		}
	}
	// Used only by completeMfaLogin() below, to replay the login POST with a TOTP code attached.
	// Rejects (throws) on any non-2xx response, same as the rest of axios's default behavior.
	post: (url: string, data?: unknown) => Promise<unknown>
}

// unifi-api-ts's SessionManager tracks auth state on a plain (TS-only, not runtime-enforced) `private
// sessionInfo` field. There's no public setter for it, so completeMfaLogin() below reaches in and writes
// it directly — same "cast through unknown" approach as the axios client above — after a successful
// out-of-band MFA login, so the library's own ensureAuthenticated() doesn't try to log in again (which
// would call httpClient.clearCookies() and wipe the session we just established) on the next API call.
interface SessionManagerLike {
	sessionInfo: {
		isAuthenticated: boolean
		loginTime?: Date
		lastActivity?: Date
		username?: string
		site?: string
	}
}

// unifi-api-ts's package root exports a `UniFiClient` API-class (imported above as `UniFiClient`) and,
// separately, a `UniFiClient` *interface* describing a connected client record, from its types module.
// Both share the same name — per standard ES module resolution the explicit class export wins and the
// interface is shadowed, unreachable via the package root. This is the minimal shape of that interface
// we actually use (per unifi-api-ts's types/generated.d.ts), declared locally to sidestep the collision.
interface UniFiClientRecord {
	mac: string
	name?: string
	hostname?: string
	is_guest?: boolean
	is_wired?: boolean
}

// UniFi OS consoles (UDM/UDR/UDM Pro/Cloud Gateway, anything running UniFi OS rather than a standalone
// UniFi Network Controller) reject every state-changing request (POST/PUT/DELETE) with "Access forbidden"
// unless it carries an X-Csrf-Token header, echoed back from an earlier response. unifi-api-ts's HTTP
// client never reads or resends that header, so we reach into the axios instance it wraps internally and
// handle it ourselves: capture the token from every response, and attach it to every outgoing request.
function attachCsrfTokenHandling(unifi: UniFiClient): void {
	let csrfToken: string | undefined

	// unifi-api-ts's HTTPClient declares this field `private` in its own types, but doesn't actually
	// enforce that at runtime — casting through `unknown` is how we reach the real axios instance.
	const axiosClient = (unifi.getHttpClient() as unknown as { client: AxiosLikeClient }).client

	axiosClient.interceptors.request.use((config) => {
		if (csrfToken) {
			config.headers = { ...config.headers, 'X-Csrf-Token': csrfToken }
		}
		return config
	})

	axiosClient.interceptors.response.use((response) => {
		const token = response.headers?.['x-csrf-token']
		if (token) {
			csrfToken = token
		}
		return response
	})
}

// True when unifi.login() failed because the account has multi-factor authentication (2FA/TOTP) turned
// on. Confirmed against real UniFi OS behavior (not guessed): a login attempt with no/invalid token gets
// rejected with HTTP 499 and a body of the form {meta: {msg: "api.err.Ubic2faTokenRequired"}} — unifi-api-ts's
// HTTPClient surfaces that meta.msg text as the thrown error's message, so we can match on it here.
function isMfaRequiredError(error: unknown): boolean {
	const message = error instanceof Error ? error.message : String(error)
	return /ubic2fatokenrequired|2fa|mfa/i.test(message)
}

// unifi-api-ts has no concept of MFA at all — its login() always POSTs just {username, password}, with
// no field for a TOTP code and no handling of the 499 challenge above. This replays that same login POST
// by hand, through the same axios instance (so it shares its cookie jar and the CSRF interceptor already
// attached by attachCsrfTokenHandling), but with the extra `token` field UniFi OS expects for the second,
// MFA-completing attempt. On success it hand-writes the library's internal session state to "authenticated"
// (see SessionManagerLike above) so every later action/inventory call just works through the normal API.
async function completeMfaLogin(
	unifi: UniFiClient,
	username: string,
	password: string,
	mfaToken: string,
): Promise<void> {
	const axiosClient = (unifi.getHttpClient() as unknown as { client: AxiosLikeClient }).client

	// Throws on any non-2xx response (axios's default), e.g. a wrong/expired code — that rejection
	// propagates straight up to connectToUnifi()'s catch block, same as any other login failure.
	await axiosClient.post('/api/auth/login', {
		username,
		password,
		token: mfaToken,
		remember: false,
		strict: true,
	})

	const sessionManager = unifi.getSessionManager() as unknown as SessionManagerLike
	sessionManager.sessionInfo = {
		isAuthenticated: true,
		loginTime: new Date(),
		lastActivity: new Date(),
		username,
	}
}

export default class ModuleInstance extends InstanceBase<ModuleSchema> {
	config!: ModuleConfig // Setup in init()
	secrets!: ModuleSecrets // Setup in init()
	unifi?: UniFiClient

	// Live inventory of what's on the console, refreshed on a timer once connected — lets actions
	// like "Utility: Send Device Command" offer a picker instead of a raw MAC address text field.
	devices: UniFiDevice[] = []
	clients: UniFiClientRecord[] = []
	inventoryTimer?: NodeJS.Timeout

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig, _isFirstInit: boolean, secrets: ModuleSecrets): Promise<void> {
		this.config = config
		this.secrets = secrets

		await this.connectToUnifi()

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updatePresets() // export Presets
		this.updateVariableDefinitions() // export variable definitions
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.log('debug', 'destroy')

		if (this.inventoryTimer) {
			clearInterval(this.inventoryTimer)
			this.inventoryTimer = undefined
		}
	}

	// Pull the current device/client list from the console and rebuild action definitions so any
	// device/client picker dropdowns reflect it. Failures are logged, not thrown — a stale inventory
	// shouldn't take down the connection, and the picker fields fall back to free text either way.
	async refreshInventory(): Promise<void> {
		const unifi = this.unifi
		if (!unifi) return

		try {
			const [devices, clients] = await Promise.all([unifi.listDevices(), unifi.listUsers()])
			this.devices = devices
			this.clients = clients
			this.updateActions()
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			this.log('warn', `Failed to refresh device/client inventory: ${message}`)
		}
	}

	async configUpdated(config: ModuleConfig, secrets: ModuleSecrets): Promise<void> {
		this.config = config
		this.secrets = secrets

		await this.connectToUnifi()
	}

	// Connect to the UniFi Network application exposed by a UniFi console (tooling from unifi-api-ts)
	async connectToUnifi(): Promise<void> {
		this.updateStatus(InstanceStatus.Connecting)

		if (this.inventoryTimer) {
			clearInterval(this.inventoryTimer)
			this.inventoryTimer = undefined
		}

		try {
			this.unifi = new UniFiClient({
				baseUrl: `https://${this.config.host}:${this.config.port}`,
				username: this.config.username,
				password: this.secrets.password,
				site: this.config.site || 'default',
				verifySsl: this.config.verifySsl,
			})
			attachCsrfTokenHandling(this.unifi)

			try {
				await this.unifi.login()
			} catch (error) {
				if (!isMfaRequiredError(error)) {
					throw error
				}
				// Plain login was rejected specifically because this account needs an MFA code. If one was
				// supplied, replay the login with it attached; otherwise fail with a message that tells the
				// user exactly what to do, instead of surfacing the console's raw "Ubic2faTokenRequired".
				if (!this.secrets.mfaToken) {
					throw new Error(
						'This account requires a multi-factor authentication code. Enter the current 6-digit code ' +
							'from your authenticator app in the "MFA / TOTP Code" config field and save the connection.',
						{ cause: error },
					)
				}
				await completeMfaLogin(this.unifi, this.config.username, this.secrets.password, this.secrets.mfaToken)
			}

			this.updateStatus(InstanceStatus.Ok)

			// Populate the picker dropdowns immediately, then keep them in sync every 60s. 60s is
			// conservative on purpose — polling faster risks tripping the console's own login/request
			// rate limiter, which happened earlier during unrelated rapid reconnect testing.
			await this.refreshInventory()
			this.inventoryTimer = setInterval(() => {
				void this.refreshInventory()
			}, 60_000)
		} catch (error) {
			this.unifi = undefined
			this.log('error', `Failed to connect to UniFi console: ${error instanceof Error ? error.message : String(error)}`)
			this.updateStatus(InstanceStatus.ConnectionFailure, error instanceof Error ? error.message : String(error))
		}
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updatePresets(): void {
		UpdatePresets(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}
}
