import type { CompanionStaticUpgradeScript } from '@companion-module/base'
import type { ModuleConfig } from './config.js'

// The connection-method dropdown was added after username/password was the only option. Connections made
// before that have no authMethod, so pin them to 'userpass' rather than letting them pick up the new
// default ('networkApiKey') and suddenly fail for want of a key they never entered.
const addConnectionMethod: CompanionStaticUpgradeScript<ModuleConfig> = (_context, props) => {
	if (!props.config || props.config.authMethod) {
		return { updatedConfig: null, updatedActions: [], updatedFeedbacks: [] }
	}
	return {
		updatedConfig: { ...props.config, authMethod: 'userpass' },
		updatedActions: [],
		updatedFeedbacks: [],
	}
}

// The Port field became a Console Type dropdown that fills in the standard port. Map existing connections
// onto whichever choice matches the port they already had, so nothing changes for them.
const addConsoleType: CompanionStaticUpgradeScript<ModuleConfig> = (_context, props) => {
	if (!props.config || props.config.consoleType) {
		return { updatedConfig: null, updatedActions: [], updatedFeedbacks: [] }
	}
	const port = Number(props.config.port)
	const consoleType = port === 443 ? 'unifiOs' : port === 8443 ? 'selfHosted' : 'custom'
	return {
		updatedConfig: { ...props.config, consoleType },
		updatedActions: [],
		updatedFeedbacks: [],
	}
}

export const UpgradeScripts: CompanionStaticUpgradeScript<ModuleConfig>[] = [
	/*
	 * Place your upgrade scripts here
	 * Remember that once it has been added it cannot be removed!
	 */
	addConnectionMethod,
	addConsoleType,
]
