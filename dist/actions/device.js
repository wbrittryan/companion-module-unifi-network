export function buildDeviceActions(self) {
    return {
        // List Devices: Retrieves information about UniFi devices (Access Points, Switches, Gateways, etc.) in the network, optionally filtered by MAC address(es).
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().list_devices(...)
        device_list_devices: {
            name: 'Devices: List Devices',
            description: 'Retrieves information about UniFi devices (Access Points, Switches, Gateways, etc.) in the network, optionally filtered by MAC address(es).',
            options: [
                // unifi-api-ts parameter "macs" (optional) — a raw JSON payload, typed here as text
                {
                    id: 'macs',
                    type: 'textinput',
                    label: 'MACs',
                    default: '{}',
                    tooltip: 'JSON payload',
                    multiline: true,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: List Devices - not connected');
                    return;
                }
                try {
                    // Parse the JSON the user typed into "MACs" before sending it
                    const macsPayload = JSON.parse(event.options.macs);
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().list_devices(macsPayload);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: List Devices: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: List Devices failed: ${message}`);
                }
            },
        },
        // Adopt Device: Adopts one or more UniFi devices to the current site.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().adopt_device(...)
        device_adopt_device: {
            name: 'Devices: Adopt Device',
            description: 'Adopts one or more UniFi devices to the current site.',
            options: [
                // unifi-api-ts parameter "macs" (required) — a raw JSON payload, typed here as text
                {
                    id: 'macs',
                    type: 'textinput',
                    label: 'MACs',
                    default: '{}',
                    tooltip: 'JSON payload',
                    multiline: true,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Adopt Device - not connected');
                    return;
                }
                try {
                    // Parse the JSON the user typed into "MACs" before sending it
                    const macsPayload = JSON.parse(event.options.macs);
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().adopt_device(macsPayload);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Adopt Device: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Adopt Device failed: ${message}`);
                }
            },
        },
        // Advanced Adopt Device: Adopts a UniFi device using custom SSH credentials for advanced adoption scenarios.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().advanced_adopt_device(...)
        device_advanced_adopt_device: {
            name: 'Devices: Advanced Adopt Device',
            description: 'Adopts a UniFi device using custom SSH credentials for advanced adoption scenarios.',
            options: [
                // unifi-api-ts parameter "mac" (required)
                {
                    id: 'mac',
                    type: 'textinput',
                    label: 'MAC',
                    default: '',
                },
                // unifi-api-ts parameter "ip" (required)
                {
                    id: 'ip',
                    type: 'textinput',
                    label: 'IP',
                    default: '',
                },
                // unifi-api-ts parameter "username" (required)
                {
                    id: 'username',
                    type: 'textinput',
                    label: 'Username',
                    default: '',
                },
                // unifi-api-ts parameter "password" (required)
                {
                    id: 'password',
                    type: 'textinput',
                    label: 'Password',
                    default: '',
                },
                // unifi-api-ts parameter "url" (required)
                {
                    id: 'url',
                    type: 'textinput',
                    label: 'URL',
                    default: '',
                },
                // unifi-api-ts parameter "port" (optional)
                {
                    id: 'port',
                    type: 'number',
                    label: 'Port',
                    default: 22,
                    min: 0,
                    max: 999999999,
                },
                // unifi-api-ts parameter "ssh_key_verify" (optional)
                {
                    id: 'ssh_key_verify',
                    type: 'checkbox',
                    label: 'SSH Key Verify',
                    default: true,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Advanced Adopt Device - not connected');
                    return;
                }
                try {
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getDeviceManagementAPI()
                        .advanced_adopt_device(event.options.mac, event.options.ip, event.options.username, event.options.password, event.options.url, event.options.port, event.options.ssh_key_verify);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Advanced Adopt Device: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Advanced Adopt Device failed: ${message}`);
                }
            },
        },
        // Cancel Device Migration: Cancels an ongoing device migration process for one or more UniFi devices.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().cancel_migrate_device(...)
        device_cancel_migrate_device: {
            name: 'Devices: Cancel Device Migration',
            description: 'Cancels an ongoing device migration process for one or more UniFi devices.',
            options: [
                // unifi-api-ts parameter "macs" (required) — a raw JSON payload, typed here as text
                {
                    id: 'macs',
                    type: 'textinput',
                    label: 'MACs',
                    default: '{}',
                    tooltip: 'JSON payload',
                    multiline: true,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Cancel Device Migration - not connected');
                    return;
                }
                try {
                    // Parse the JSON the user typed into "MACs" before sending it
                    const macsPayload = JSON.parse(event.options.macs);
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().cancel_migrate_device(macsPayload);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Cancel Device Migration: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Cancel Device Migration failed: ${message}`);
                }
            },
        },
        // Cancel Rolling Upgrade: Cancels an ongoing rolling firmware upgrade process across UniFi devices.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().cancel_rolling_upgrade(...)
        device_cancel_rolling_upgrade: {
            name: 'Devices: Cancel Rolling Upgrade',
            description: 'Cancels an ongoing rolling firmware upgrade process across UniFi devices.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Cancel Rolling Upgrade - not connected');
                    return;
                }
                try {
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().cancel_rolling_upgrade();
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Cancel Rolling Upgrade: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Cancel Rolling Upgrade failed: ${message}`);
                }
            },
        },
        // Check Firmware Update: Initiates a check for available firmware updates for all UniFi devices in the site.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().check_firmware_update(...)
        device_check_firmware_update: {
            name: 'Devices: Check Firmware Update',
            description: 'Initiates a check for available firmware updates for all UniFi devices in the site.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Check Firmware Update - not connected');
                    return;
                }
                try {
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().check_firmware_update();
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Check Firmware Update: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Check Firmware Update failed: ${message}`);
                }
            },
        },
        // Delete Device: Permanently removes a device from the UniFi Controller.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().delete_device(...)
        device_delete_device: {
            name: 'Devices: Delete Device',
            description: 'Permanently removes a device from the UniFi Controller.',
            options: [
                // unifi-api-ts parameter "mac" (required)
                {
                    id: 'mac',
                    type: 'textinput',
                    label: 'MAC',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Delete Device - not connected');
                    return;
                }
                try {
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().delete_device(event.options.mac);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Delete Device: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Delete Device failed: ${message}`);
                }
            },
        },
        // Disable Access Point: Disables or enables an Access Point device; when disabled the AP stops broadcasting wireless networks.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().disable_ap(...)
        device_disable_ap: {
            name: 'Devices: Disable Access Point',
            description: 'Disables or enables an Access Point device; when disabled the AP stops broadcasting wireless networks.',
            options: [
                // unifi-api-ts parameter "ap_id" (required)
                {
                    id: 'ap_id',
                    type: 'textinput',
                    label: 'AP ID',
                    default: '',
                },
                // unifi-api-ts parameter "disable" (required)
                {
                    id: 'disable',
                    type: 'checkbox',
                    label: 'Disable',
                    default: false,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Disable Access Point - not connected');
                    return;
                }
                try {
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().disable_ap(event.options.ap_id, event.options.disable);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Disable Access Point: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Disable Access Point failed: ${message}`);
                }
            },
        },
        // Force Provision: Forces provisioning of one or more UniFi devices, triggering them to re-download their configuration.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().force_provision(...)
        device_force_provision: {
            name: 'Devices: Force Provision',
            description: 'Forces provisioning of one or more UniFi devices, triggering them to re-download their configuration.',
            options: [
                // unifi-api-ts parameter "macs" (required) — a raw JSON payload, typed here as text
                {
                    id: 'macs',
                    type: 'textinput',
                    label: 'MACs',
                    default: '{}',
                    tooltip: 'JSON payload',
                    multiline: true,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Force Provision - not connected');
                    return;
                }
                try {
                    // Parse the JSON the user typed into "MACs" before sending it
                    const macsPayload = JSON.parse(event.options.macs);
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().force_provision(macsPayload);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Force Provision: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Force Provision failed: ${message}`);
                }
            },
        },
        // Override LED: Sets the LED override mode (on, off, or default) for a device (no JSDoc description present in source).
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().led_override(...)
        device_led_override: {
            name: 'Devices: Override LED',
            description: 'Sets the LED override mode (on, off, or default) for a device (no JSDoc description present in source).',
            options: [
                // unifi-api-ts parameter "device_id" (required)
                {
                    id: 'device_id',
                    type: 'textinput',
                    label: 'Device ID',
                    default: '',
                },
                // unifi-api-ts parameter "override_mode" (required) — one of: off, on, default
                {
                    id: 'override_mode',
                    type: 'dropdown',
                    label: 'Override Mode',
                    choices: [
                        { id: 'off', label: 'off' },
                        { id: 'on', label: 'on' },
                        { id: 'default', label: 'default' },
                    ],
                    default: 'off',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Override LED - not connected');
                    return;
                }
                try {
                    // Narrow the dropdown's plain string back to the exact literal type unifi-api-ts expects
                    const override_modeValue = event.options.override_mode;
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().led_override(event.options.device_id, override_modeValue);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Override LED: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Override LED failed: ${message}`);
                }
            },
        },
        // List AP Groups: Retrieves all Access Point groups configured in the site.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().list_apgroups(...)
        device_list_apgroups: {
            name: 'Devices: List AP Groups',
            description: 'Retrieves all Access Point groups configured in the site.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: List AP Groups - not connected');
                    return;
                }
                try {
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().list_apgroups();
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: List AP Groups: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: List AP Groups failed: ${message}`);
                }
            },
        },
        // List Access Points: Retrieves information about Access Point devices, optionally filtered by MAC address.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().list_aps(...)
        device_list_aps: {
            name: 'Devices: List Access Points',
            description: 'Retrieves information about Access Point devices, optionally filtered by MAC address.',
            options: [
                // unifi-api-ts parameter "mac" (optional)
                {
                    id: 'mac',
                    type: 'textinput',
                    label: 'MAC',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: List Access Points - not connected');
                    return;
                }
                try {
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().list_aps(event.options.mac);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: List Access Points: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: List Access Points failed: ${message}`);
                }
            },
        },
        // List Device Name Mappings: Retrieves device name mappings, showing custom names assigned to devices, from the controller.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().list_device_name_mappings(...)
        device_list_device_name_mappings: {
            name: 'Devices: List Device Name Mappings',
            description: 'Retrieves device name mappings, showing custom names assigned to devices, from the controller.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: List Device Name Mappings - not connected');
                    return;
                }
                try {
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().list_device_name_mappings();
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: List Device Name Mappings: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: List Device Name Mappings failed: ${message}`);
                }
            },
        },
        // List Device States: Retrieves current state information for all devices, including connection status and operational state.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().list_device_states(...)
        device_list_device_states: {
            name: 'Devices: List Device States',
            description: 'Retrieves current state information for all devices, including connection status and operational state.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: List Device States - not connected');
                    return;
                }
                try {
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().list_device_states();
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: List Device States: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: List Device States failed: ${message}`);
                }
            },
        },
        // List Devices (Basic): Retrieves basic device information with a reduced data payload, faster than the full device listing.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().list_devices_basic(...)
        device_list_devices_basic: {
            name: 'Devices: List Devices (Basic)',
            description: 'Retrieves basic device information with a reduced data payload, faster than the full device listing.',
            options: [
                // unifi-api-ts parameter "device_mac" (optional)
                {
                    id: 'device_mac',
                    type: 'textinput',
                    label: 'Device MAC',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: List Devices (Basic) - not connected');
                    return;
                }
                try {
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().list_devices_basic(event.options.device_mac);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: List Devices (Basic): ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: List Devices (Basic) failed: ${message}`);
                }
            },
        },
        // List Firmware: Retrieves available firmware versions for devices, optionally filtered by device type.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().list_firmware(...)
        device_list_firmware: {
            name: 'Devices: List Firmware',
            description: 'Retrieves available firmware versions for devices, optionally filtered by device type.',
            options: [
                // unifi-api-ts parameter "device_type" (optional)
                {
                    id: 'device_type',
                    type: 'textinput',
                    label: 'Device Type',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: List Firmware - not connected');
                    return;
                }
                try {
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().list_firmware(event.options.device_type);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: List Firmware: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: List Firmware failed: ${message}`);
                }
            },
        },
        // List Device Models: Retrieves information about supported device models, including names, capabilities, and specifications.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().list_models(...)
        device_list_models: {
            name: 'Devices: List Device Models',
            description: 'Retrieves information about supported device models, including names, capabilities, and specifications.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: List Device Models - not connected');
                    return;
                }
                try {
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().list_models();
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: List Device Models: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: List Device Models failed: ${message}`);
                }
            },
        },
        // Locate Access Point: Enables or disables the locate LED feature on an Access Point to help physically locate the device.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().locate_ap(...)
        device_locate_ap: {
            name: 'Devices: Locate Access Point',
            description: 'Enables or disables the locate LED feature on an Access Point to help physically locate the device.',
            options: [
                // unifi-api-ts parameter "mac" (required)
                {
                    id: 'mac',
                    type: 'textinput',
                    label: 'MAC',
                    default: '',
                },
                // unifi-api-ts parameter "enable" (required)
                {
                    id: 'enable',
                    type: 'checkbox',
                    label: 'Enable',
                    default: false,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Locate Access Point - not connected');
                    return;
                }
                try {
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().locate_ap(event.options.mac, event.options.enable);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Locate Access Point: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Locate Access Point failed: ${message}`);
                }
            },
        },
        // Migrate Device: Migrates one or more UniFi devices to a different controller using the target controller's inform URL.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().migrate_device(...)
        device_migrate_device: {
            name: 'Devices: Migrate Device',
            description: "Migrates one or more UniFi devices to a different controller using the target controller's inform URL.",
            options: [
                // unifi-api-ts parameter "macs" (required) — a raw JSON payload, typed here as text
                {
                    id: 'macs',
                    type: 'textinput',
                    label: 'MACs',
                    default: '{}',
                    tooltip: 'JSON payload',
                    multiline: true,
                },
                // unifi-api-ts parameter "inform_url" (required)
                {
                    id: 'inform_url',
                    type: 'textinput',
                    label: 'Inform URL',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Migrate Device - not connected');
                    return;
                }
                try {
                    // Parse the JSON the user typed into "MACs" before sending it
                    const macsPayload = JSON.parse(event.options.macs);
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().migrate_device(macsPayload, event.options.inform_url);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Migrate Device: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Migrate Device failed: ${message}`);
                }
            },
        },
        // Power Cycle Switch Port: Power cycles a specific port on a UniFi switch, turning it off and back on to reset connected devices.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().power_cycle_switch_port(...)
        device_power_cycle_switch_port: {
            name: 'Devices: Power Cycle Switch Port',
            description: 'Power cycles a specific port on a UniFi switch, turning it off and back on to reset connected devices.',
            options: [
                // unifi-api-ts parameter "mac" (required)
                {
                    id: 'mac',
                    type: 'textinput',
                    label: 'MAC',
                    default: '',
                },
                // unifi-api-ts parameter "port_idx" (required)
                {
                    id: 'port_idx',
                    type: 'number',
                    label: 'Port Idx',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Power Cycle Switch Port - not connected');
                    return;
                }
                try {
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getDeviceManagementAPI()
                        .power_cycle_switch_port(event.options.mac, event.options.port_idx);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Power Cycle Switch Port: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Power Cycle Switch Port failed: ${message}`);
                }
            },
        },
        // Reboot Cloud Key: Reboots the UniFi Cloud Key device, temporarily interrupting controller services.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().reboot_cloudkey(...)
        device_reboot_cloudkey: {
            name: 'Devices: Reboot Cloud Key',
            description: 'Reboots the UniFi Cloud Key device, temporarily interrupting controller services.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Reboot Cloud Key - not connected');
                    return;
                }
                try {
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().reboot_cloudkey();
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Reboot Cloud Key: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Reboot Cloud Key failed: ${message}`);
                }
            },
        },
        // Rename Access Point: Changes the display name of an Access Point device.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().rename_ap(...)
        device_rename_ap: {
            name: 'Devices: Rename Access Point',
            description: 'Changes the display name of an Access Point device.',
            options: [
                // unifi-api-ts parameter "ap_id" (required)
                {
                    id: 'ap_id',
                    type: 'textinput',
                    label: 'AP ID',
                    default: '',
                },
                // unifi-api-ts parameter "ap_name" (required)
                {
                    id: 'ap_name',
                    type: 'textinput',
                    label: 'AP Name',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Rename Access Point - not connected');
                    return;
                }
                try {
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().rename_ap(event.options.ap_id, event.options.ap_name);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Rename Access Point: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Rename Access Point failed: ${message}`);
                }
            },
        },
        // Restart Device: Restarts one or more UniFi devices, performing either a soft (graceful) or hard (forced) restart.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().restart_device(...)
        device_restart_device: {
            name: 'Devices: Restart Device',
            description: 'Restarts one or more UniFi devices, performing either a soft (graceful) or hard (forced) restart.',
            options: [
                // unifi-api-ts parameter "macs" (required) — a raw JSON payload, typed here as text
                {
                    id: 'macs',
                    type: 'textinput',
                    label: 'MACs',
                    default: '{}',
                    tooltip: 'JSON payload',
                    multiline: true,
                },
                // unifi-api-ts parameter "reboot_type" (optional) — one of: soft, hard
                {
                    id: 'reboot_type',
                    type: 'dropdown',
                    label: 'Reboot Type',
                    choices: [
                        { id: 'soft', label: 'soft' },
                        { id: 'hard', label: 'hard' },
                    ],
                    default: 'soft',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Restart Device - not connected');
                    return;
                }
                try {
                    // Parse the JSON the user typed into "MACs" before sending it
                    const macsPayload = JSON.parse(event.options.macs);
                    // Narrow the dropdown's plain string back to the exact literal type unifi-api-ts expects
                    const reboot_typeValue = event.options.reboot_type;
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().restart_device(macsPayload, reboot_typeValue);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Restart Device: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Restart Device failed: ${message}`);
                }
            },
        },
        // Set AP Radio Settings: Configures radio settings for an Access Point, including channel, HT mode, and transmit power.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().set_ap_radiosettings(...)
        device_set_ap_radiosettings: {
            name: 'Devices: Set AP Radio Settings',
            description: 'Configures radio settings for an Access Point, including channel, HT mode, and transmit power.',
            options: [
                // unifi-api-ts parameter "ap_id" (required)
                {
                    id: 'ap_id',
                    type: 'textinput',
                    label: 'AP ID',
                    default: '',
                },
                // unifi-api-ts parameter "radio" (required)
                {
                    id: 'radio',
                    type: 'textinput',
                    label: 'Radio',
                    default: '',
                },
                // unifi-api-ts parameter "channel" (required)
                {
                    id: 'channel',
                    type: 'number',
                    label: 'Channel',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
                // unifi-api-ts parameter "ht" (required)
                {
                    id: 'ht',
                    type: 'number',
                    label: 'Ht',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
                // unifi-api-ts parameter "tx_power_mode" (required)
                {
                    id: 'tx_power_mode',
                    type: 'textinput',
                    label: 'Tx Power Mode',
                    default: '',
                },
                // unifi-api-ts parameter "tx_power" (required)
                {
                    id: 'tx_power',
                    type: 'textinput',
                    label: 'Tx Power',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Set AP Radio Settings - not connected');
                    return;
                }
                try {
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getDeviceManagementAPI()
                        .set_ap_radiosettings(event.options.ap_id, event.options.radio, event.options.channel, event.options.ht, event.options.tx_power_mode, event.options.tx_power);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Set AP Radio Settings: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Set AP Radio Settings failed: ${message}`);
                }
            },
        },
        // Set AP WLAN Group: Assigns an Access Point's radio to a specific WLAN group, controlling which networks broadcast on which radio.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().set_ap_wlangroup(...)
        device_set_ap_wlangroup: {
            name: 'Devices: Set AP WLAN Group',
            description: "Assigns an Access Point's radio to a specific WLAN group, controlling which networks broadcast on which radio.",
            options: [
                // unifi-api-ts parameter "type_id" (required) — one of: ng, na
                {
                    id: 'type_id',
                    type: 'dropdown',
                    label: 'Type ID',
                    choices: [
                        { id: 'ng', label: 'ng' },
                        { id: 'na', label: 'na' },
                    ],
                    default: 'ng',
                },
                // unifi-api-ts parameter "device_id" (required)
                {
                    id: 'device_id',
                    type: 'textinput',
                    label: 'Device ID',
                    default: '',
                },
                // unifi-api-ts parameter "group_id" (required)
                {
                    id: 'group_id',
                    type: 'textinput',
                    label: 'Group ID',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Set AP WLAN Group - not connected');
                    return;
                }
                try {
                    // Narrow the dropdown's plain string back to the exact literal type unifi-api-ts expects
                    const type_idValue = event.options.type_id;
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getDeviceManagementAPI()
                        .set_ap_wlangroup(type_idValue, event.options.device_id, event.options.group_id);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Set AP WLAN Group: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Set AP WLAN Group failed: ${message}`);
                }
            },
        },
        // Set Device Settings: Updates a device's settings using a custom configuration payload; a low-level method for advanced device configuration.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().set_device_settings_base(...)
        device_set_device_settings_base: {
            name: 'Devices: Set Device Settings',
            description: "Updates a device's settings using a custom configuration payload; a low-level method for advanced device configuration.",
            options: [
                // unifi-api-ts parameter "device_id" (required)
                {
                    id: 'device_id',
                    type: 'textinput',
                    label: 'Device ID',
                    default: '',
                },
                // unifi-api-ts parameter "payload" (required) — a raw JSON payload, typed here as text
                {
                    id: 'payload',
                    type: 'textinput',
                    label: 'Payload',
                    default: '{}',
                    tooltip: 'JSON payload',
                    multiline: true,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Set Device Settings - not connected');
                    return;
                }
                try {
                    // Parse the JSON the user typed into "Payload" before sending it
                    const payloadPayload = JSON.parse(event.options.payload);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getDeviceManagementAPI()
                        .set_device_settings_base(event.options.device_id, payloadPayload);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Set Device Settings: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Set Device Settings failed: ${message}`);
                }
            },
        },
        // Set Element Adoption: Enables or disables automatic adoption of new devices for the site.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().set_element_adoption(...)
        device_set_element_adoption: {
            name: 'Devices: Set Element Adoption',
            description: 'Enables or disables automatic adoption of new devices for the site.',
            options: [
                // unifi-api-ts parameter "enable" (required)
                {
                    id: 'enable',
                    type: 'checkbox',
                    label: 'Enable',
                    default: false,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Set Element Adoption - not connected');
                    return;
                }
                try {
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().set_element_adoption(event.options.enable);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Set Element Adoption: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Set Element Adoption failed: ${message}`);
                }
            },
        },
        // Start Rolling Upgrade: Initiates a rolling firmware upgrade for specified device types, upgrading them automatically in sequence.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().start_rolling_upgrade(...)
        device_start_rolling_upgrade: {
            name: 'Devices: Start Rolling Upgrade',
            description: 'Initiates a rolling firmware upgrade for specified device types, upgrading them automatically in sequence.',
            options: [
                // unifi-api-ts parameter "payload" (optional) — a string[], entered here as a comma-separated list
                {
                    id: 'payload',
                    type: 'textinput',
                    label: 'Payload',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Start Rolling Upgrade - not connected');
                    return;
                }
                try {
                    // Split "Payload" on commas into the array unifi-api-ts expects
                    const payloadList = event.options.payload
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().start_rolling_upgrade(payloadList);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Start Rolling Upgrade: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Start Rolling Upgrade failed: ${message}`);
                }
            },
        },
        // Upgrade All Devices: Initiates a firmware upgrade for all devices of a specified type simultaneously.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().upgrade_all_devices(...)
        device_upgrade_all_devices: {
            name: 'Devices: Upgrade All Devices',
            description: 'Initiates a firmware upgrade for all devices of a specified type simultaneously.',
            options: [
                // unifi-api-ts parameter "type" (optional)
                {
                    id: 'type',
                    type: 'textinput',
                    label: 'Type',
                    default: 'uap',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Upgrade All Devices - not connected');
                    return;
                }
                try {
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().upgrade_all_devices(event.options.type);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Upgrade All Devices: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Upgrade All Devices failed: ${message}`);
                }
            },
        },
        // Upgrade Device: Initiates a firmware upgrade for a specific device.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().upgrade_device(...)
        device_upgrade_device: {
            name: 'Devices: Upgrade Device',
            description: 'Initiates a firmware upgrade for a specific device.',
            options: [
                // unifi-api-ts parameter "mac" (required)
                {
                    id: 'mac',
                    type: 'textinput',
                    label: 'MAC',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Upgrade Device - not connected');
                    return;
                }
                try {
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().upgrade_device(event.options.mac);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Upgrade Device: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Upgrade Device failed: ${message}`);
                }
            },
        },
        // Upgrade Device (External Firmware): Upgrades one or more devices using firmware retrieved from an external URL, allowing custom or beta firmware.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().upgrade_device_external(...)
        device_upgrade_device_external: {
            name: 'Devices: Upgrade Device (External Firmware)',
            description: 'Upgrades one or more devices using firmware retrieved from an external URL, allowing custom or beta firmware.',
            options: [
                // unifi-api-ts parameter "firmware_url" (required)
                {
                    id: 'firmware_url',
                    type: 'textinput',
                    label: 'Firmware URL',
                    default: '',
                },
                // unifi-api-ts parameter "macs" (required) — a raw JSON payload, typed here as text
                {
                    id: 'macs',
                    type: 'textinput',
                    label: 'MACs',
                    default: '{}',
                    tooltip: 'JSON payload',
                    multiline: true,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Upgrade Device (External Firmware) - not connected');
                    return;
                }
                try {
                    // Parse the JSON the user typed into "MACs" before sending it
                    const macsPayload = JSON.parse(event.options.macs);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getDeviceManagementAPI()
                        .upgrade_device_external(event.options.firmware_url, macsPayload);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Upgrade Device (External Firmware): ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Upgrade Device (External Firmware) failed: ${message}`);
                }
            },
        },
        // Create AP Group: Creates a new Access Point group for organizing and managing multiple APs together.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().create_apgroup(...)
        device_create_apgroup: {
            name: 'Devices: Create AP Group',
            description: 'Creates a new Access Point group for organizing and managing multiple APs together.',
            options: [
                // unifi-api-ts parameter "group_name" (required)
                {
                    id: 'group_name',
                    type: 'textinput',
                    label: 'Group Name',
                    default: '',
                },
                // unifi-api-ts parameter "device_macs" (optional) — a string[], entered here as a comma-separated list
                {
                    id: 'device_macs',
                    type: 'textinput',
                    label: 'Device MACs',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Create AP Group - not connected');
                    return;
                }
                try {
                    // Split "Device MACs" on commas into the array unifi-api-ts expects
                    const device_macsList = event.options.device_macs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().create_apgroup(event.options.group_name, device_macsList);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Create AP Group: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Create AP Group failed: ${message}`);
                }
            },
        },
        // Delete AP Group: Permanently removes an Access Point group from the controller; devices in it move to the default group.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().delete_apgroup(...)
        device_delete_apgroup: {
            name: 'Devices: Delete AP Group',
            description: 'Permanently removes an Access Point group from the controller; devices in it move to the default group.',
            options: [
                // unifi-api-ts parameter "group_id" (required)
                {
                    id: 'group_id',
                    type: 'textinput',
                    label: 'Group ID',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Delete AP Group - not connected');
                    return;
                }
                try {
                    // Run the command against the UniFi console
                    const result = await unifi.getDeviceManagementAPI().delete_apgroup(event.options.group_id);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Delete AP Group: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Delete AP Group failed: ${message}`);
                }
            },
        },
        // Edit AP Group: Updates an existing Access Point group's name and device membership.
        // Backed by unifi-api-ts: unifi.getDeviceManagementAPI().edit_apgroup(...)
        device_edit_apgroup: {
            name: 'Devices: Edit AP Group',
            description: "Updates an existing Access Point group's name and device membership.",
            options: [
                // unifi-api-ts parameter "group_id" (required)
                {
                    id: 'group_id',
                    type: 'textinput',
                    label: 'Group ID',
                    default: '',
                },
                // unifi-api-ts parameter "group_name" (required)
                {
                    id: 'group_name',
                    type: 'textinput',
                    label: 'Group Name',
                    default: '',
                },
                // unifi-api-ts parameter "device_macs" (required) — a string[], entered here as a comma-separated list
                {
                    id: 'device_macs',
                    type: 'textinput',
                    label: 'Device MACs',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Devices: Edit AP Group - not connected');
                    return;
                }
                try {
                    // Split "Device MACs" on commas into the array unifi-api-ts expects
                    const device_macsList = event.options.device_macs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getDeviceManagementAPI()
                        .edit_apgroup(event.options.group_id, event.options.group_name, device_macsList);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Devices: Edit AP Group: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Devices: Edit AP Group failed: ${message}`);
                }
            },
        },
    };
}
//# sourceMappingURL=device.js.map