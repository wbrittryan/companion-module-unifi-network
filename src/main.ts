import { InstanceBase, InstanceStatus, type SomeCompanionConfigField } from '@companion-module/base'
import type { UniFiClient, UniFiDevice } from 'unifi-api-ts'
import { DEFAULT_STATUS_INTERVAL, GetConfigFields, type ModuleConfig, type ModuleSecrets } from './config.js'
import { UpdateVariableDefinitions, type VariablesSchema } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions, type ActionsSchema } from './actions.js'
import { LIVE_FEEDBACK_IDS, UpdateFeedbacks, type FeedbacksSchema } from './feedbacks.js'
import { UpdatePresets } from './presets.js'
import { createUnifiClient } from './connection.js'
import { definitionsSignature } from './devices.js'

export type ModuleSchema = {
	config: ModuleConfig
	secrets: ModuleSecrets
	actions: ActionsSchema
	feedbacks: FeedbacksSchema
	variables: VariablesSchema
}

export { UpgradeScripts }

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

export default class ModuleInstance extends InstanceBase<ModuleSchema> {
	config!: ModuleConfig // Setup in init()
	secrets!: ModuleSecrets // Setup in init()
	unifi?: UniFiClient

	// Live inventory of what's on the console, refreshed on timers once connected. Devices drive both the
	// pickers in actions/feedbacks and the feedbacks' live state (port links, PoE, outlets), so they refresh
	// on the configurable Status Refresh Interval. Clients only feed pickers and can number in the hundreds,
	// so they stay on a slow 60s refresh.
	devices: UniFiDevice[] = []
	clients: UniFiClientRecord[] = []
	deviceTimer?: NodeJS.Timeout
	clientTimer?: NodeJS.Timeout
	// Skip a poll while the previous one is still in flight (slow console, Site Manager round trips), rather
	// than letting requests stack up.
	devicePollInFlight = false
	// See definitionsSignature(): definitions are only rebuilt when this changes, not on every poll.
	lastDefinitionsSignature = ''

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

		this.stopPolling()
	}

	stopPolling(): void {
		clearInterval(this.deviceTimer)
		clearInterval(this.clientTimer)
		this.deviceTimer = undefined
		this.clientTimer = undefined
	}

	// Failures here are logged, not thrown — a stale inventory shouldn't take down the connection, and the
	// picker fields fall back to free text either way.
	async pollDevices(): Promise<void> {
		const unifi = this.unifi
		if (!unifi || this.devicePollInFlight) return

		this.devicePollInFlight = true
		try {
			this.devices = await unifi.listDevices()
			this.refreshDefinitionsIfChanged()
			this.checkFeedbacks(...LIVE_FEEDBACK_IDS)
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			this.log('warn', `Failed to refresh device status: ${message}`)
		} finally {
			this.devicePollInFlight = false
		}
	}

	async pollClients(): Promise<void> {
		const unifi = this.unifi
		if (!unifi) return

		try {
			this.clients = await unifi.listUsers()
			this.refreshDefinitionsIfChanged()
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			this.log('warn', `Failed to refresh client list: ${message}`)
		}
	}

	// Rebuild action/feedback definitions (their pickers and visibility rules are built from the inventory)
	// only when the inventory's makeup changed, e.g. a device was added or a port renamed. Re-sending
	// definitions on every status poll would churn Companion's UI for no reason.
	refreshDefinitionsIfChanged(): void {
		const signature = definitionsSignature(this.devices, this.clients)
		if (signature === this.lastDefinitionsSignature) return
		this.lastDefinitionsSignature = signature
		this.updateActions()
		this.updateFeedbacks()
	}

	async configUpdated(config: ModuleConfig, secrets: ModuleSecrets): Promise<void> {
		this.config = config
		this.secrets = secrets

		await this.connectToUnifi()
	}

	// Connect to the UniFi Network application using the configured connection method (see connection.ts)
	async connectToUnifi(): Promise<void> {
		this.updateStatus(InstanceStatus.Connecting)

		this.stopPolling()

		try {
			this.unifi = await createUnifiClient(this.config, this.secrets)

			this.updateStatus(InstanceStatus.Ok)

			// Populate the pickers and feedback state immediately, then keep them in sync. Polling only reads
			// data; it never logs in again, so it doesn't touch the console's login rate limiter.
			await Promise.all([this.pollDevices(), this.pollClients()])
			const statusSeconds = this.config.statusInterval || DEFAULT_STATUS_INTERVAL
			this.deviceTimer = setInterval(() => void this.pollDevices(), statusSeconds * 1000)
			this.clientTimer = setInterval(() => void this.pollClients(), 60_000)
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
