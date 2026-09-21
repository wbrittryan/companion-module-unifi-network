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

			await this.unifi.login()

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
