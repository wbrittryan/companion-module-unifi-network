import { InstanceStatus } from '@companion-module/base';
import { buildClientActions } from './actions/client.js';
import { buildDeviceActions } from './actions/device.js';
import { buildNetworkActions } from './actions/network.js';
import { buildSecurityActions } from './actions/security.js';
import { buildSiteActions } from './actions/site.js';
import { buildStatsActions } from './actions/stats.js';
import { buildUserActions } from './actions/user.js';
export function UpdateActions(self) {
    self.setActionDefinitions({
        test_connection: {
            name: 'Test Connection',
            options: [],
            callback: async () => {
                if (!self.unifi) {
                    self.log('warn', 'Test Connection: not connected, attempting to reconnect');
                    await self.connectToUnifi();
                    return;
                }
                try {
                    const [sysinfo] = await self.unifi.statSysinfo();
                    self.log('info', `Test Connection: reached UniFi console "${sysinfo?.name ?? sysinfo?.hostname ?? self.config.host}" (version ${sysinfo?.version ?? 'unknown'})`);
                    self.updateStatus(InstanceStatus.Ok);
                }
                catch (error) {
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Test Connection failed: ${message}`);
                    self.updateStatus(InstanceStatus.ConnectionFailure, message);
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
    });
}
//# sourceMappingURL=actions.js.map