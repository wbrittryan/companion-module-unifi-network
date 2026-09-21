import { InstanceBase, InstanceStatus } from '@companion-module/base';
import { UniFiClient } from 'unifi-api-ts';
import { GetConfigFields } from './config.js';
import { UpdateVariableDefinitions } from './variables.js';
import { UpgradeScripts } from './upgrades.js';
import { UpdateActions } from './actions.js';
import { UpdateFeedbacks } from './feedbacks.js';
import { UpdatePresets } from './presets.js';
export { UpgradeScripts };
export default class ModuleInstance extends InstanceBase {
    config; // Setup in init()
    secrets; // Setup in init()
    unifi;
    constructor(internal) {
        super(internal);
    }
    async init(config, _isFirstInit, secrets) {
        this.config = config;
        this.secrets = secrets;
        await this.connectToUnifi();
        this.updateActions(); // export actions
        this.updateFeedbacks(); // export feedbacks
        this.updatePresets(); // export Presets
        this.updateVariableDefinitions(); // export variable definitions
    }
    // When module gets deleted
    async destroy() {
        this.log('debug', 'destroy');
    }
    async configUpdated(config, secrets) {
        this.config = config;
        this.secrets = secrets;
        await this.connectToUnifi();
    }
    // Connect to the UniFi Network application exposed by a UniFi console (tooling from unifi-api-ts)
    async connectToUnifi() {
        this.updateStatus(InstanceStatus.Connecting);
        try {
            this.unifi = new UniFiClient({
                baseUrl: `https://${this.config.host}:${this.config.port}`,
                username: this.config.username,
                password: this.secrets.password,
                site: this.config.site || 'default',
                verifySsl: this.config.verifySsl,
            });
            await this.unifi.login();
            this.updateStatus(InstanceStatus.Ok);
        }
        catch (error) {
            this.unifi = undefined;
            this.log('error', `Failed to connect to UniFi console: ${error instanceof Error ? error.message : String(error)}`);
            this.updateStatus(InstanceStatus.ConnectionFailure, error instanceof Error ? error.message : String(error));
        }
    }
    // Return config fields for web config
    getConfigFields() {
        return GetConfigFields();
    }
    updateActions() {
        UpdateActions(this);
    }
    updateFeedbacks() {
        UpdateFeedbacks(this);
    }
    updatePresets() {
        UpdatePresets(this);
    }
    updateVariableDefinitions() {
        UpdateVariableDefinitions(this);
    }
}
//# sourceMappingURL=main.js.map