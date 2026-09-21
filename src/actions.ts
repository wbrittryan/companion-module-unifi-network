import { InstanceStatus } from '@companion-module/base'
import type ModuleInstance from './main.js'
import { buildClientActions, type ClientActionsSchema } from './actions/client.js'
import { buildDeviceActions, type DeviceActionsSchema } from './actions/device.js'
import { buildNetworkActions, type NetworkActionsSchema } from './actions/network.js'
import { buildSecurityActions, type SecurityActionsSchema } from './actions/security.js'
import { buildSiteActions, type SiteActionsSchema } from './actions/site.js'
import { buildStatsActions, type StatsActionsSchema } from './actions/stats.js'
import { buildUserActions, type UserActionsSchema } from './actions/user.js'

// The Network application is the only UniFi application unifi-api-ts talks to — it has no support for
// Protect, Access, Talk, etc, so those can't be added here without a different API client. Everything
// below is grouped by Network sub-system (Clients, Devices, Networks, Security, Sites, Statistics,
// Users), matching the "<Category>: <Action>" prefix each generated action's name uses.
export type ActionsSchema = {
	test_connection: {
		options: Record<string, never>
	}
} & ClientActionsSchema &
	DeviceActionsSchema &
	NetworkActionsSchema &
	SecurityActionsSchema &
	SiteActionsSchema &
	StatsActionsSchema &
	UserActionsSchema

export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		test_connection: {
			name: 'Test Connection',
			options: [],
			callback: async () => {
				if (!self.unifi) {
					self.log('warn', 'Test Connection: not connected, attempting to reconnect')
					await self.connectToUnifi()
					return
				}

				try {
					const [sysinfo] = await self.unifi.statSysinfo()
					self.log(
						'info',
						`Test Connection: reached UniFi console "${sysinfo?.name ?? sysinfo?.hostname ?? self.config.host}" (version ${sysinfo?.version ?? 'unknown'})`,
					)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Test Connection failed: ${message}`)
					self.updateStatus(InstanceStatus.ConnectionFailure, message)
				}
			},
		},
		// Every command unifi-api-ts exposes, one action per method — see src/actions/*.ts.
		...buildClientActions(self),
		...buildDeviceActions(self),
		...buildNetworkActions(self),
		...buildSecurityActions(self),
		...buildSiteActions(self),
		...buildStatsActions(self),
		...buildUserActions(self),
	})
}
