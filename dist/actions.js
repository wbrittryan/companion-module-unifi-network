import { InstanceStatus } from '@companion-module/base';
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
    });
}
//# sourceMappingURL=actions.js.map