import { InstanceBase, InstanceStatus } from '@companion-module/base';
import { GetConfigFields } from './config.js';
import { UpdateVariableDefinitions } from './variables.js';
import { UpgradeScripts } from './upgrades.js';
import { UpdateActions } from './actions.js';
import { UpdateFeedbacks } from './feedbacks.js';
import { UpdatePresets } from './presets.js';
import { createUnifiClient } from './connection.js';
export { UpgradeScripts };
export default class ModuleInstance extends InstanceBase {
    config; // Setup in init()
    secrets; // Setup in init()
    unifi;
    // Live inventory of what's on the console, refreshed on a timer once connected — lets actions
    // like "Utility: Send Device Command" offer a picker instead of a raw MAC address text field.
    devices = [];
    clients = [];
    inventoryTimer;
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
        if (this.inventoryTimer) {
            clearInterval(this.inventoryTimer);
            this.inventoryTimer = undefined;
        }
    }
    // Pull the current device/client list from the console and rebuild action definitions so any
    // device/client picker dropdowns reflect it. Failures are logged, not thrown — a stale inventory
    // shouldn't take down the connection, and the picker fields fall back to free text either way.
    async refreshInventory() {
        const unifi = this.unifi;
        if (!unifi)
            return;
        try {
            const [devices, clients] = await Promise.all([unifi.listDevices(), unifi.listUsers()]);
            this.devices = devices;
            this.clients = clients;
            this.updateActions();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.log('warn', `Failed to refresh device/client inventory: ${message}`);
        }
    }
    async configUpdated(config, secrets) {
        this.config = config;
        this.secrets = secrets;
        await this.connectToUnifi();
    }
    // Connect to the UniFi Network application using the configured connection method (see connection.ts)
    async connectToUnifi() {
        this.updateStatus(InstanceStatus.Connecting);
        if (this.inventoryTimer) {
            clearInterval(this.inventoryTimer);
            this.inventoryTimer = undefined;
        }
        try {
            this.unifi = await createUnifiClient(this.config, this.secrets);
            this.updateStatus(InstanceStatus.Ok);
            // Populate the picker dropdowns immediately, then keep them in sync every 60s. 60s is
            // conservative on purpose — polling faster risks tripping the console's own login/request
            // rate limiter, which happened earlier during unrelated rapid reconnect testing.
            await this.refreshInventory();
            this.inventoryTimer = setInterval(() => {
                void this.refreshInventory();
            }, 60_000);
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