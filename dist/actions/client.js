export function buildClientActions(self) {
    return {
        // List Users: Retrieves a list of all client devices, both currently connected and previously connected, that have connected to the UniFi network.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().list_users(...)
        client_list_users: {
            name: 'Clients: List Users',
            description: 'Retrieves a list of all client devices, both currently connected and previously connected, that have connected to the UniFi network.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Clients: List Users - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getClientManagementAPI().list_users(self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: List Users: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: List Users failed: ${message}`);
                }
            },
        },
        // List Active Clients: Lists currently active client devices, optionally including traffic usage data and UniFi infrastructure devices in the results.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().list_active_clients(...)
        client_list_active_clients: {
            name: 'Clients: List Active Clients',
            description: 'Lists currently active client devices, optionally including traffic usage data and UniFi infrastructure devices in the results.',
            options: [
                // unifi-api-ts parameter "include_traffic_usage" (optional)
                {
                    id: 'include_traffic_usage',
                    type: 'checkbox',
                    label: 'Include Traffic Usage',
                    default: false,
                },
                // unifi-api-ts parameter "include_unifi_devices" (optional)
                {
                    id: 'include_unifi_devices',
                    type: 'checkbox',
                    label: 'Include Unifi Devices',
                    default: false,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Clients: List Active Clients - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getClientManagementAPI()
                        .list_active_clients(self.config.site, event.options.include_traffic_usage, event.options.include_unifi_devices);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: List Active Clients: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: List Active Clients failed: ${message}`);
                }
            },
        },
        // List Clients: Lists client devices, optionally filtered to a single client by MAC address.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().list_clients(...)
        client_list_clients: {
            name: 'Clients: List Clients',
            description: 'Lists client devices, optionally filtered to a single client by MAC address.',
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
                    self.log('warn', 'Clients: List Clients - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getClientManagementAPI().list_clients(self.config.site, event.options.mac);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: List Clients: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: List Clients failed: ${message}`);
                }
            },
        },
        // List Client History: Lists historical client device data over a configurable lookback period and time range.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().list_clients_history(...)
        client_list_clients_history: {
            name: 'Clients: List Client History',
            description: 'Lists historical client device data over a configurable lookback period and time range.',
            options: [
                // unifi-api-ts parameter "historyhours" (optional)
                {
                    id: 'historyhours',
                    type: 'number',
                    label: 'Historyhours',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
                // unifi-api-ts parameter "start" (optional)
                {
                    id: 'start',
                    type: 'number',
                    label: 'Start',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
                // unifi-api-ts parameter "end" (optional)
                {
                    id: 'end',
                    type: 'number',
                    label: 'End',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
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
                    self.log('warn', 'Clients: List Client History - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getClientManagementAPI()
                        .list_clients_history(self.config.site, event.options.historyhours, event.options.start, event.options.end, event.options.mac);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: List Client History: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: List Client History failed: ${message}`);
                }
            },
        },
        // Get Client Details: Fetches detailed information for a single client device by MAC address.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().stat_client(...)
        client_stat_client: {
            name: 'Clients: Get Client Details',
            description: 'Fetches detailed information for a single client device by MAC address.',
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
                    self.log('warn', 'Clients: Get Client Details - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getClientManagementAPI().stat_client(self.config.site, event.options.mac);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: Get Client Details: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: Get Client Details failed: ${message}`);
                }
            },
        },
        // Block Client: Blocks network access for a specific client device by MAC address until it is explicitly unblocked.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().block_sta(...)
        client_block_sta: {
            name: 'Clients: Block Client',
            description: 'Blocks network access for a specific client device by MAC address until it is explicitly unblocked.',
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
                    self.log('warn', 'Clients: Block Client - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getClientManagementAPI().block_sta(self.config.site, event.options.mac);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: Block Client: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: Block Client failed: ${message}`);
                }
            },
        },
        // Unblock Client: Restores network access for a previously blocked client device.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().unblock_sta(...)
        client_unblock_sta: {
            name: 'Clients: Unblock Client',
            description: 'Restores network access for a previously blocked client device.',
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
                    self.log('warn', 'Clients: Unblock Client - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getClientManagementAPI().unblock_sta(self.config.site, event.options.mac);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: Unblock Client: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: Unblock Client failed: ${message}`);
                }
            },
        },
        // Reconnect Client: Kicks a connected client device and forces it to reconnect to the network.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().reconnect_sta(...)
        client_reconnect_sta: {
            name: 'Clients: Reconnect Client',
            description: 'Kicks a connected client device and forces it to reconnect to the network.',
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
                    self.log('warn', 'Clients: Reconnect Client - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getClientManagementAPI().reconnect_sta(self.config.site, event.options.mac);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: Reconnect Client: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: Reconnect Client failed: ${message}`);
                }
            },
        },
        // Forget Client: Removes one or more client devices from the controller's known client list.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().forget_sta(...)
        client_forget_sta: {
            name: 'Clients: Forget Client',
            description: "Removes one or more client devices from the controller's known client list.",
            options: [
                // unifi-api-ts parameter "macs" (required) — a string[], entered here as a comma-separated list
                {
                    id: 'macs',
                    type: 'textinput',
                    label: 'MACs',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Clients: Forget Client - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Split "MACs" on commas into the array unifi-api-ts expects
                    const macsList = event.options.macs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi.getClientManagementAPI().forget_sta(self.config.site, macsList);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: Forget Client: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: Forget Client failed: ${message}`);
                }
            },
        },
        // Edit Client Fixed IP: Enables or disables a fixed IP assignment for a client and sets its network and IP address.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().edit_client_fixedip(...)
        client_edit_client_fixedip: {
            name: 'Clients: Edit Client Fixed IP',
            description: 'Enables or disables a fixed IP assignment for a client and sets its network and IP address.',
            options: [
                // unifi-api-ts parameter "client_id" (required)
                {
                    id: 'client_id',
                    type: 'textinput',
                    label: 'Client ID',
                    default: '',
                },
                // unifi-api-ts parameter "use_fixedip" (required)
                {
                    id: 'use_fixedip',
                    type: 'checkbox',
                    label: 'Use Fixedip',
                    default: false,
                },
                // unifi-api-ts parameter "network_id" (optional)
                {
                    id: 'network_id',
                    type: 'textinput',
                    label: 'Network ID',
                    default: '',
                },
                // unifi-api-ts parameter "fixed_ip" (optional)
                {
                    id: 'fixed_ip',
                    type: 'textinput',
                    label: 'Fixed IP',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Clients: Edit Client Fixed IP - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getClientManagementAPI()
                        .edit_client_fixedip(self.config.site, event.options.client_id, event.options.use_fixedip, event.options.network_id, event.options.fixed_ip);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: Edit Client Fixed IP: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: Edit Client Fixed IP failed: ${message}`);
                }
            },
        },
        // Edit Client Name: Renames a client device.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().edit_client_name(...)
        client_edit_client_name: {
            name: 'Clients: Edit Client Name',
            description: 'Renames a client device.',
            options: [
                // unifi-api-ts parameter "client_id" (required)
                {
                    id: 'client_id',
                    type: 'textinput',
                    label: 'Client ID',
                    default: '',
                },
                // unifi-api-ts parameter "name" (required)
                {
                    id: 'name',
                    type: 'textinput',
                    label: 'Name',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Clients: Edit Client Name - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getClientManagementAPI()
                        .edit_client_name(self.config.site, event.options.client_id, event.options.name);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: Edit Client Name: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: Edit Client Name failed: ${message}`);
                }
            },
        },
        // Set Client Name: Sets the display name for a client device.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().set_sta_name(...)
        client_set_sta_name: {
            name: 'Clients: Set Client Name',
            description: 'Sets the display name for a client device.',
            options: [
                // unifi-api-ts parameter "user_id" (required)
                {
                    id: 'user_id',
                    type: 'textinput',
                    label: 'User ID',
                    default: '',
                },
                // unifi-api-ts parameter "name" (optional)
                {
                    id: 'name',
                    type: 'textinput',
                    label: 'Name',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Clients: Set Client Name - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getClientManagementAPI()
                        .set_sta_name(self.config.site, event.options.user_id, event.options.name);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: Set Client Name: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: Set Client Name failed: ${message}`);
                }
            },
        },
        // Set Client Note: Sets a note on a client device.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().set_sta_note(...)
        client_set_sta_note: {
            name: 'Clients: Set Client Note',
            description: 'Sets a note on a client device.',
            options: [
                // unifi-api-ts parameter "user_id" (required)
                {
                    id: 'user_id',
                    type: 'textinput',
                    label: 'User ID',
                    default: '',
                },
                // unifi-api-ts parameter "note" (optional)
                {
                    id: 'note',
                    type: 'textinput',
                    label: 'Note',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Clients: Set Client Note - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getClientManagementAPI()
                        .set_sta_note(self.config.site, event.options.user_id, event.options.note);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: Set Client Note: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: Set Client Note failed: ${message}`);
                }
            },
        },
        // Authorize Guest: Grants a guest device network access for a specified duration, with optional bandwidth limits, a data quota, and AP restriction.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().authorize_guest(...)
        client_authorize_guest: {
            name: 'Clients: Authorize Guest',
            description: 'Grants a guest device network access for a specified duration, with optional bandwidth limits, a data quota, and AP restriction.',
            options: [
                // unifi-api-ts parameter "mac" (required)
                {
                    id: 'mac',
                    type: 'textinput',
                    label: 'MAC',
                    default: '',
                },
                // unifi-api-ts parameter "minutes" (required)
                {
                    id: 'minutes',
                    type: 'number',
                    label: 'Minutes',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
                // unifi-api-ts parameter "up" (optional)
                {
                    id: 'up',
                    type: 'number',
                    label: 'Up',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
                // unifi-api-ts parameter "down" (optional)
                {
                    id: 'down',
                    type: 'number',
                    label: 'Down',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
                // unifi-api-ts parameter "megabytes" (optional)
                {
                    id: 'megabytes',
                    type: 'number',
                    label: 'Megabytes',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
                // unifi-api-ts parameter "ap_mac" (optional)
                {
                    id: 'ap_mac',
                    type: 'textinput',
                    label: 'AP MAC',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Clients: Authorize Guest - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getClientManagementAPI()
                        .authorize_guest(self.config.site, event.options.mac, event.options.minutes, event.options.up, event.options.down, event.options.megabytes, event.options.ap_mac);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: Authorize Guest: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: Authorize Guest failed: ${message}`);
                }
            },
        },
        // Unauthorize Guest: Revokes network access for a previously authorized guest device.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().unauthorize_guest(...)
        client_unauthorize_guest: {
            name: 'Clients: Unauthorize Guest',
            description: 'Revokes network access for a previously authorized guest device.',
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
                    self.log('warn', 'Clients: Unauthorize Guest - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getClientManagementAPI().unauthorize_guest(self.config.site, event.options.mac);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: Unauthorize Guest: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: Unauthorize Guest failed: ${message}`);
                }
            },
        },
        // Extend Guest Validity: Extends the validity period of an existing guest session.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().extend_guest_validity(...)
        client_extend_guest_validity: {
            name: 'Clients: Extend Guest Validity',
            description: 'Extends the validity period of an existing guest session.',
            options: [
                // unifi-api-ts parameter "guest_id" (required)
                {
                    id: 'guest_id',
                    type: 'textinput',
                    label: 'Guest ID',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Clients: Extend Guest Validity - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getClientManagementAPI()
                        .extend_guest_validity(self.config.site, event.options.guest_id);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: Extend Guest Validity: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: Extend Guest Validity failed: ${message}`);
                }
            },
        },
        // List Guests: Lists guest devices that have had access within a given time window.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().list_guests(...)
        client_list_guests: {
            name: 'Clients: List Guests',
            description: 'Lists guest devices that have had access within a given time window.',
            options: [
                // unifi-api-ts parameter "within" (optional)
                {
                    id: 'within',
                    type: 'number',
                    label: 'Within',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Clients: List Guests - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getClientManagementAPI().list_guests(self.config.site, event.options.within);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: List Guests: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: List Guests failed: ${message}`);
                }
            },
        },
        // Get Sessions: Fetches client session records, optionally filtered by time range, MAC address, and session type.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().stat_sessions(...)
        client_stat_sessions: {
            name: 'Clients: Get Sessions',
            description: 'Fetches client session records, optionally filtered by time range, MAC address, and session type.',
            options: [
                // unifi-api-ts parameter "start" (optional)
                {
                    id: 'start',
                    type: 'number',
                    label: 'Start',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
                // unifi-api-ts parameter "end" (optional)
                {
                    id: 'end',
                    type: 'number',
                    label: 'End',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
                // unifi-api-ts parameter "mac" (optional)
                {
                    id: 'mac',
                    type: 'textinput',
                    label: 'MAC',
                    default: '',
                },
                // unifi-api-ts parameter "type" (optional) — one of: all, guest, user
                {
                    id: 'type',
                    type: 'dropdown',
                    label: 'Type',
                    choices: [
                        { id: 'all', label: 'all' },
                        { id: 'guest', label: 'guest' },
                        { id: 'user', label: 'user' },
                    ],
                    default: 'all',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Clients: Get Sessions - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Narrow the dropdown's plain string back to the exact literal type unifi-api-ts expects
                    const typeValue = event.options.type;
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getClientManagementAPI()
                        .stat_sessions(self.config.site, event.options.start, event.options.end, event.options.mac, typeValue);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: Get Sessions: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: Get Sessions failed: ${message}`);
                }
            },
        },
        // Get Latest Station Sessions: Fetches the most recent sessions for a specific station.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().stat_sta_sessions_latest(...)
        client_stat_sta_sessions_latest: {
            name: 'Clients: Get Latest Station Sessions',
            description: 'Fetches the most recent sessions for a specific station.',
            options: [
                // unifi-api-ts parameter "mac" (required)
                {
                    id: 'mac',
                    type: 'textinput',
                    label: 'MAC',
                    default: '',
                },
                // unifi-api-ts parameter "limit" (optional)
                {
                    id: 'limit',
                    type: 'number',
                    label: 'Limit',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Clients: Get Latest Station Sessions - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getClientManagementAPI()
                        .stat_sta_sessions_latest(self.config.site, event.options.mac, event.options.limit);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: Get Latest Station Sessions: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: Get Latest Station Sessions failed: ${message}`);
                }
            },
        },
        // Create Tag: Creates a new tag for organizing client devices, optionally assigning an initial set of devices to it.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().create_tag(...)
        client_create_tag: {
            name: 'Clients: Create Tag',
            description: 'Creates a new tag for organizing client devices, optionally assigning an initial set of devices to it.',
            options: [
                // unifi-api-ts parameter "name" (required)
                {
                    id: 'name',
                    type: 'textinput',
                    label: 'Name',
                    default: '',
                },
                // unifi-api-ts parameter "macs" (optional) — a string[], entered here as a comma-separated list
                {
                    id: 'macs',
                    type: 'textinput',
                    label: 'MACs',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Clients: Create Tag - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Split "MACs" on commas into the array unifi-api-ts expects
                    const macsList = event.options.macs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi.getClientManagementAPI().create_tag(event.options.name, macsList, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: Create Tag: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: Create Tag failed: ${message}`);
                }
            },
        },
        // Delete Tag: Permanently deletes a tag and removes all of its device associations.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().delete_tag(...)
        client_delete_tag: {
            name: 'Clients: Delete Tag',
            description: 'Permanently deletes a tag and removes all of its device associations.',
            options: [
                // unifi-api-ts parameter "tag_id" (required)
                {
                    id: 'tag_id',
                    type: 'textinput',
                    label: 'Tag ID',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Clients: Delete Tag - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getClientManagementAPI().delete_tag(event.options.tag_id, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: Delete Tag: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: Delete Tag failed: ${message}`);
                }
            },
        },
        // Get Tag: Retrieves detailed information about a specific tag, including its member devices.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().get_tag(...)
        client_get_tag: {
            name: 'Clients: Get Tag',
            description: 'Retrieves detailed information about a specific tag, including its member devices.',
            options: [
                // unifi-api-ts parameter "tag_id" (required)
                {
                    id: 'tag_id',
                    type: 'textinput',
                    label: 'Tag ID',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Clients: Get Tag - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getClientManagementAPI().get_tag(event.options.tag_id, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: Get Tag: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: Get Tag failed: ${message}`);
                }
            },
        },
        // List Tags: Lists all tags configured on the controller.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().list_tags(...)
        client_list_tags: {
            name: 'Clients: List Tags',
            description: 'Lists all tags configured on the controller.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Clients: List Tags - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getClientManagementAPI().list_tags(self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: List Tags: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: List Tags failed: ${message}`);
                }
            },
        },
        // Set Tagged Devices: Replaces the list of devices assigned to a tag with the given set of MAC addresses.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().set_tagged_devices(...)
        client_set_tagged_devices: {
            name: 'Clients: Set Tagged Devices',
            description: 'Replaces the list of devices assigned to a tag with the given set of MAC addresses.',
            options: [
                // unifi-api-ts parameter "tag_id" (required)
                {
                    id: 'tag_id',
                    type: 'textinput',
                    label: 'Tag ID',
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
                    self.log('warn', 'Clients: Set Tagged Devices - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Split "Device MACs" on commas into the array unifi-api-ts expects
                    const device_macsList = event.options.device_macs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getClientManagementAPI()
                        .set_tagged_devices(event.options.tag_id, device_macsList, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: Set Tagged Devices: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: Set Tagged Devices failed: ${message}`);
                }
            },
        },
        // Create Voucher: Creates one or more guest access vouchers with a specified duration, usage quota, and optional bandwidth or data limits.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().create_voucher(...)
        client_create_voucher: {
            name: 'Clients: Create Voucher',
            description: 'Creates one or more guest access vouchers with a specified duration, usage quota, and optional bandwidth or data limits.',
            options: [
                // unifi-api-ts parameter "minutes" (required)
                {
                    id: 'minutes',
                    type: 'number',
                    label: 'Minutes',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
                // unifi-api-ts parameter "count" (optional)
                {
                    id: 'count',
                    type: 'number',
                    label: 'Count',
                    default: 1,
                    min: 0,
                    max: 999999999,
                },
                // unifi-api-ts parameter "quota" (optional)
                {
                    id: 'quota',
                    type: 'number',
                    label: 'Quota',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
                // unifi-api-ts parameter "note" (optional)
                {
                    id: 'note',
                    type: 'textinput',
                    label: 'Note',
                    default: '',
                },
                // unifi-api-ts parameter "up" (optional)
                {
                    id: 'up',
                    type: 'number',
                    label: 'Up',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
                // unifi-api-ts parameter "down" (optional)
                {
                    id: 'down',
                    type: 'number',
                    label: 'Down',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
                // unifi-api-ts parameter "megabytes" (optional)
                {
                    id: 'megabytes',
                    type: 'number',
                    label: 'Megabytes',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Clients: Create Voucher - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getClientManagementAPI()
                        .create_voucher(event.options.minutes, event.options.count, event.options.quota, event.options.note, event.options.up, event.options.down, event.options.megabytes, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: Create Voucher: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: Create Voucher failed: ${message}`);
                }
            },
        },
        // Revoke Voucher: Revokes a specific voucher, making it invalid for future use.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().revoke_voucher(...)
        client_revoke_voucher: {
            name: 'Clients: Revoke Voucher',
            description: 'Revokes a specific voucher, making it invalid for future use.',
            options: [
                // unifi-api-ts parameter "voucher_id" (required)
                {
                    id: 'voucher_id',
                    type: 'textinput',
                    label: 'Voucher ID',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Clients: Revoke Voucher - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getClientManagementAPI().revoke_voucher(event.options.voucher_id, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: Revoke Voucher: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: Revoke Voucher failed: ${message}`);
                }
            },
        },
        // Create Hotspot Operator: Creates a new hotspot operator account for managing guest access and vouchers.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().create_hotspotop(...)
        client_create_hotspotop: {
            name: 'Clients: Create Hotspot Operator',
            description: 'Creates a new hotspot operator account for managing guest access and vouchers.',
            options: [
                // unifi-api-ts parameter "name" (required)
                {
                    id: 'name',
                    type: 'textinput',
                    label: 'Name',
                    default: '',
                },
                // unifi-api-ts parameter "x_password" (required)
                {
                    id: 'x_password',
                    type: 'textinput',
                    label: 'X Password',
                    default: '',
                },
                // unifi-api-ts parameter "note" (optional)
                {
                    id: 'note',
                    type: 'textinput',
                    label: 'Note',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Clients: Create Hotspot Operator - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getClientManagementAPI()
                        .create_hotspotop(event.options.name, event.options.x_password, event.options.note, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: Create Hotspot Operator: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: Create Hotspot Operator failed: ${message}`);
                }
            },
        },
        // List Hotspot Operators: Lists all hotspot operators configured on the controller.
        // Backed by unifi-api-ts: unifi.getClientManagementAPI().list_hotspotop(...)
        client_list_hotspotop: {
            name: 'Clients: List Hotspot Operators',
            description: 'Lists all hotspot operators configured on the controller.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Clients: List Hotspot Operators - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getClientManagementAPI().list_hotspotop(self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Clients: List Hotspot Operators: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Clients: List Hotspot Operators failed: ${message}`);
                }
            },
        },
    };
}
//# sourceMappingURL=client.js.map