import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

// How the module authenticates with the UniFi Network application. See connection.ts for what each does.
export type AuthMethod = 'userpass' | 'networkApiKey' | 'siteManagerApiKey'

// What kind of UniFi install a local connection talks to. Picks the port for the two standard cases, so the
// Port field only needs filling in for non-standard setups (remapped Docker ports, reverse proxies, etc.).
export type ConsoleType = 'unifiOs' | 'selfHosted' | 'custom'

const CONSOLE_TYPE_PORTS: Record<Exclude<ConsoleType, 'custom'>, number> = {
	unifiOs: 443,
	selfHosted: 8443,
}

export function resolvePort(config: ModuleConfig): number {
	const consoleType = config.consoleType ?? 'custom'
	return consoleType === 'custom' ? config.port : CONSOLE_TYPE_PORTS[consoleType]
}

export type ModuleConfig = {
	authMethod: AuthMethod
	consoleType: ConsoleType
	host: string
	port: number
	username: string
	consoleId: string
	site: string
	verifySsl: boolean
}

export type ModuleSecrets = {
	password: string
	mfaToken: string
	apiKey: string
	siteManagerApiKey: string
}

// isVisibleExpression snippets, so each field below only shows up for the method(s) that use it.
const IS_USERPASS = `$(options:authMethod) == 'userpass'`
const IS_NETWORK_API_KEY = `$(options:authMethod) == 'networkApiKey'`
const IS_SITE_MANAGER = `$(options:authMethod) == 'siteManagerApiKey'`
const IS_LOCAL = `$(options:authMethod) != 'siteManagerApiKey'`
const IS_CUSTOM_PORT = `${IS_LOCAL} && $(options:consoleType) == 'custom'`

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'dropdown',
			id: 'authMethod',
			label: 'Connection Method',
			width: 12,
			default: 'networkApiKey',
			disableAutoExpression: true,
			choices: [
				{ id: 'networkApiKey', label: 'Network API Key (local, recommended)' },
				{ id: 'userpass', label: 'Username / Password (local)' },
				{ id: 'siteManagerApiKey', label: 'Site Manager API Key (cloud, via unifi.ui.com)' },
			],
			tooltip:
				'Network API Key: talks straight to the console on your network using a key created in the Network ' +
				'application. Stateless and no MFA prompts; UniFi OS consoles only. ' +
				'Username / Password: logs in as a local admin account; the only option for a legacy self-hosted ' +
				'Network Controller. ' +
				"Site Manager API Key: goes through Ubiquiti's cloud (api.ui.com) instead of your local network, so " +
				'Companion needs internet access and every button press takes a round trip to the cloud.',
		},

		// --- Local connection (Network API key or username/password) ---
		{
			type: 'dropdown',
			id: 'consoleType',
			label: 'Console Type',
			width: 12,
			default: 'unifiOs',
			disableAutoExpression: true,
			choices: [
				{ id: 'unifiOs', label: 'UniFi OS Console (UDM, UDR, UCG, Cloud Key Gen2+)' },
				{ id: 'selfHosted', label: 'Self-hosted Network Controller' },
				{ id: 'custom', label: 'Custom (specify port #)' },
			],
			tooltip:
				'UniFi OS consoles always use port 443, and self-hosted Network Controllers default to 8443. Choose ' +
				'Custom if yours listens somewhere else, e.g. a remapped Docker port, a controller behind a reverse ' +
				'proxy, or UniFi OS Server.',
			isVisibleExpression: IS_LOCAL,
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 8,
			regex: Regex.IP,
			tooltip: 'The IP address of your UniFi console',
			isVisibleExpression: IS_LOCAL,
		},
		{
			type: 'number',
			id: 'port',
			label: 'Target Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 443,
			tooltip: 'The HTTPS port your UniFi console or controller listens on.',
			isVisibleExpression: IS_CUSTOM_PORT,
		},

		// --- Network API key ---
		{
			type: 'secret-text',
			id: 'apiKey',
			label: 'Network API Key',
			width: 12,
			tooltip:
				'Create one in the UniFi Network application under Settings → Control Plane → Integrations → ' +
				'Create New API Key (the exact menu location varies between Network versions 8.x, 9.x and 10.x). ' +
				'The key is only shown once, so copy it before closing the dialog. API keys are only supported on ' +
				'UniFi OS consoles (UDM, UDR, UCG, UniFi OS Server, etc.), not the legacy self-hosted Network ' +
				'Controller. The key acts as the admin that created it, so that admin needs read/write access to ' +
				'UniFi Network for the control actions to work.',
			isVisibleExpression: IS_NETWORK_API_KEY,
		},

		// --- Username / password ---
		{
			type: 'textinput',
			id: 'username',
			label: 'Username',
			width: 6,
			tooltip: 'Recommend using a new local admin account with read/write access to UniFi Network.',
			isVisibleExpression: IS_USERPASS,
		},
		{
			type: 'secret-text',
			id: 'password',
			label: 'Password',
			width: 6,
			isVisibleExpression: IS_USERPASS,
		},
		{
			type: 'secret-text',
			id: 'mfaToken',
			label: 'MFA / TOTP Code (optional)',
			width: 6,
			tooltip:
				'Only needed if the account above has multi-factor authentication (2FA/TOTP, e.g. an authenticator ' +
				'app) turned on — including Ubiquiti accounts used for remote/cloud management, since this module ' +
				"still authenticates against the console's local login endpoint. Enter the CURRENT 6-digit code " +
				'from your authenticator app and save. IMPORTANT: TOTP codes are single-use and expire after about ' +
				'30 seconds, so this is not a "set once" field — it only gets the module connected right now. Every ' +
				'future reconnect (Companion restart, network drop, editing this config again) needs a fresh code ' +
				'typed in here first, or the connection will fail until you do. If you can create a local admin ' +
				'account without MFA instead, that avoids this entirely and is the more reliable long-term setup — ' +
				'or switch the connection method to Network API Key. Leave this blank if the account has no MFA.',
			default: '',
			isVisibleExpression: IS_USERPASS,
		},

		// --- Site Manager API key ---
		{
			type: 'textinput',
			id: 'consoleId',
			label: 'Console ID',
			width: 12,
			tooltip:
				'The long ID of your console as it appears in the unifi.ui.com address bar when you open it: ' +
				'https://unifi.ui.com/consoles/{Console ID}/network/default/dashboard. Copy just the part between ' +
				'"/consoles/" and the next "/".',
			isVisibleExpression: IS_SITE_MANAGER,
		},
		{
			type: 'secret-text',
			id: 'siteManagerApiKey',
			label: 'Site Manager API Key',
			width: 12,
			tooltip:
				'Create one at unifi.ui.com under the API section (Site Manager API) — this is a different key from ' +
				'the Network API Key created on the console itself. The console must be online, running firmware ' +
				"5.0.3 or later, and belong to the key's owner (or to its organization, for an organization key).",
			isVisibleExpression: IS_SITE_MANAGER,
		},

		// --- Common ---
		{
			type: 'textinput',
			id: 'site',
			label: 'Site',
			width: 6,
			default: 'default',
			tooltip: 'Leave as "default" unless you know what you are doing.',
		},
		{
			type: 'checkbox',
			id: 'verifySsl',
			label: 'Verify SSL Certificate',
			width: 6,
			default: false,
			tooltip: 'Disable for consoles using a self-signed certificate',
			isVisibleExpression: IS_LOCAL,
		},
	]
}
