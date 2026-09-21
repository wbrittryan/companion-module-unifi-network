export function buildStatsActions(self) {
    return {
        // Get System Info: Retrieves comprehensive system information including controller version, uptime, memory usage, CPU information, and other system statistics.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_sysinfo(...)
        stats_stat_sysinfo: {
            name: 'Statistics: Get System Info',
            description: 'Retrieves comprehensive system information including controller version, uptime, memory usage, CPU information, and other system statistics.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get System Info - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getStatisticsAPI().stat_sysinfo(self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get System Info: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get System Info failed: ${message}`);
                }
            },
        },
        // List Health Metrics: Retrieves health metrics for the UniFi site including subsystem status, connectivity information, and overall site health indicators.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().list_health(...)
        stats_list_health: {
            name: 'Statistics: List Health Metrics',
            description: 'Retrieves health metrics for the UniFi site including subsystem status, connectivity information, and overall site health indicators.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: List Health Metrics - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getStatisticsAPI().list_health(self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: List Health Metrics: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: List Health Metrics failed: ${message}`);
                }
            },
        },
        // Get Full Status: Retrieves comprehensive status information from the UniFi Controller, including detailed system status, configuration, and operational data.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_full_status(...)
        stats_stat_full_status: {
            name: 'Statistics: Get Full Status',
            description: 'Retrieves comprehensive status information from the UniFi Controller, including detailed system status, configuration, and operational data.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get Full Status - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getStatisticsAPI().stat_full_status(self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get Full Status: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get Full Status failed: ${message}`);
                }
            },
        },
        // Check Controller Update: Checks for available UniFi Controller software updates and returns information about the latest available version.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().check_controller_update(...)
        stats_check_controller_update: {
            name: 'Statistics: Check Controller Update',
            description: 'Checks for available UniFi Controller software updates and returns information about the latest available version.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Check Controller Update - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getStatisticsAPI().check_controller_update(self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Check Controller Update: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Check Controller Update failed: ${message}`);
                }
            },
        },
        // Check Firmware Update: Initiates a check for available firmware updates for all UniFi devices in the site.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().check_firmware_update(...)
        stats_check_firmware_update: {
            name: 'Statistics: Check Firmware Update',
            description: 'Initiates a check for available firmware updates for all UniFi devices in the site.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Check Firmware Update - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getStatisticsAPI().check_firmware_update(self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Check Firmware Update: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Check Firmware Update failed: ${message}`);
                }
            },
        },
        // List Events: Retrieves system events from the UniFi Controller with optional time filtering, such as device connections, disconnections, configuration changes, and system alerts.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().list_events(...)
        stats_list_events: {
            name: 'Statistics: List Events',
            description: 'Retrieves system events from the UniFi Controller with optional time filtering, such as device connections, disconnections, configuration changes, and system alerts.',
            options: [
                // unifi-api-ts parameter "historyhours" (optional)
                {
                    id: 'historyhours',
                    type: 'number',
                    label: 'Historyhours',
                    default: 720,
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
                // unifi-api-ts parameter "limit" (optional)
                {
                    id: 'limit',
                    type: 'number',
                    label: 'Limit',
                    default: 3000,
                    min: 0,
                    max: 999999999,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: List Events - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .list_events(event.options.historyhours, event.options.start, event.options.end, event.options.limit, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: List Events: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: List Events failed: ${message}`);
                }
            },
        },
        // List Alarms: Retrieves system alarms from the UniFi Controller representing significant events that require attention.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().list_alarms(...)
        stats_list_alarms: {
            name: 'Statistics: List Alarms',
            description: 'Retrieves system alarms from the UniFi Controller representing significant events that require attention.',
            options: [
                // unifi-api-ts parameter "payload" (optional) — a raw JSON payload, typed here as text
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
                    self.log('warn', 'Statistics: List Alarms - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Parse the JSON the user typed into "Payload" before sending it
                    const payloadPayload = JSON.parse(event.options.payload);
                    // Run the command against the UniFi console
                    const result = await unifi.getStatisticsAPI().list_alarms(payloadPayload, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: List Alarms: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: List Alarms failed: ${message}`);
                }
            },
        },
        // Count Alarms: Retrieves the count of alarms, optionally filtered by archived status.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().count_alarms(...)
        stats_count_alarms: {
            name: 'Statistics: Count Alarms',
            description: 'Retrieves the count of alarms, optionally filtered by archived status.',
            options: [
                // unifi-api-ts parameter "archived" (optional)
                {
                    id: 'archived',
                    type: 'checkbox',
                    label: 'Archived',
                    default: false,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Count Alarms - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getStatisticsAPI().count_alarms(event.options.archived, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Count Alarms: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Count Alarms failed: ${message}`);
                }
            },
        },
        // Get 5-Minute Site Stats: Retrieves 5-minute interval statistics for the entire site, covering network usage, performance, and activity.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_5minutes_site(...)
        stats_stat_5minutes_site: {
            name: 'Statistics: Get 5-Minute Site Stats',
            description: 'Retrieves 5-minute interval statistics for the entire site, covering network usage, performance, and activity.',
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
                // unifi-api-ts parameter "attribs" (optional) — a string[], entered here as a comma-separated list
                {
                    id: 'attribs',
                    type: 'textinput',
                    label: 'Attribs',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get 5-Minute Site Stats - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Split "Attribs" on commas into the array unifi-api-ts expects
                    const attribsList = event.options.attribs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .stat_5minutes_site(event.options.start, event.options.end, attribsList, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get 5-Minute Site Stats: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get 5-Minute Site Stats failed: ${message}`);
                }
            },
        },
        // Get 5-Minute AP Stats: Retrieves 5-minute interval statistics for access points, optionally filtered by MAC address.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_5minutes_aps(...)
        stats_stat_5minutes_aps: {
            name: 'Statistics: Get 5-Minute AP Stats',
            description: 'Retrieves 5-minute interval statistics for access points, optionally filtered by MAC address.',
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
                // unifi-api-ts parameter "attribs" (optional) — a string[], entered here as a comma-separated list
                {
                    id: 'attribs',
                    type: 'textinput',
                    label: 'Attribs',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get 5-Minute AP Stats - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Split "Attribs" on commas into the array unifi-api-ts expects
                    const attribsList = event.options.attribs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .stat_5minutes_aps(event.options.start, event.options.end, event.options.mac, attribsList, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get 5-Minute AP Stats: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get 5-Minute AP Stats failed: ${message}`);
                }
            },
        },
        // Get 5-Minute Gateway Stats: Retrieves 5-minute interval statistics for the gateway/router, covering WAN/LAN traffic, routing, and performance.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_5minutes_gateway(...)
        stats_stat_5minutes_gateway: {
            name: 'Statistics: Get 5-Minute Gateway Stats',
            description: 'Retrieves 5-minute interval statistics for the gateway/router, covering WAN/LAN traffic, routing, and performance.',
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
                // unifi-api-ts parameter "attribs" (optional) — a string[], entered here as a comma-separated list
                {
                    id: 'attribs',
                    type: 'textinput',
                    label: 'Attribs',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get 5-Minute Gateway Stats - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Split "Attribs" on commas into the array unifi-api-ts expects
                    const attribsList = event.options.attribs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .stat_5minutes_gateway(event.options.start, event.options.end, attribsList, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get 5-Minute Gateway Stats: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get 5-Minute Gateway Stats failed: ${message}`);
                }
            },
        },
        // Get 5-Minute User Stats: Retrieves 5-minute interval statistics for users/clients, optionally filtered by MAC address.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_5minutes_user(...)
        stats_stat_5minutes_user: {
            name: 'Statistics: Get 5-Minute User Stats',
            description: 'Retrieves 5-minute interval statistics for users/clients, optionally filtered by MAC address.',
            options: [
                // unifi-api-ts parameter "mac" (optional)
                {
                    id: 'mac',
                    type: 'textinput',
                    label: 'MAC',
                    default: '',
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
                // unifi-api-ts parameter "attribs" (optional) — a string[], entered here as a comma-separated list
                {
                    id: 'attribs',
                    type: 'textinput',
                    label: 'Attribs',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get 5-Minute User Stats - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Split "Attribs" on commas into the array unifi-api-ts expects
                    const attribsList = event.options.attribs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .stat_5minutes_user(event.options.mac, event.options.start, event.options.end, attribsList, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get 5-Minute User Stats: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get 5-Minute User Stats failed: ${message}`);
                }
            },
        },
        // Get Hourly AP Stats: Retrieves hourly statistics for access points with optional filtering by MAC address.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_hourly_aps(...)
        stats_stat_hourly_aps: {
            name: 'Statistics: Get Hourly AP Stats',
            description: 'Retrieves hourly statistics for access points with optional filtering by MAC address.',
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
                // unifi-api-ts parameter "attribs" (optional) — a string[], entered here as a comma-separated list
                {
                    id: 'attribs',
                    type: 'textinput',
                    label: 'Attribs',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get Hourly AP Stats - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Split "Attribs" on commas into the array unifi-api-ts expects
                    const attribsList = event.options.attribs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .stat_hourly_aps(event.options.start, event.options.end, event.options.mac, attribsList, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get Hourly AP Stats: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get Hourly AP Stats failed: ${message}`);
                }
            },
        },
        // Get Hourly Gateway Stats: Retrieves hourly statistics for the gateway/router.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_hourly_gateway(...)
        stats_stat_hourly_gateway: {
            name: 'Statistics: Get Hourly Gateway Stats',
            description: 'Retrieves hourly statistics for the gateway/router.',
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
                // unifi-api-ts parameter "attribs" (optional) — a string[], entered here as a comma-separated list
                {
                    id: 'attribs',
                    type: 'textinput',
                    label: 'Attribs',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get Hourly Gateway Stats - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Split "Attribs" on commas into the array unifi-api-ts expects
                    const attribsList = event.options.attribs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .stat_hourly_gateway(event.options.start, event.options.end, attribsList, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get Hourly Gateway Stats: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get Hourly Gateway Stats failed: ${message}`);
                }
            },
        },
        // Get Hourly Site Stats: Retrieves hourly statistics for the entire site.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_hourly_site(...)
        stats_stat_hourly_site: {
            name: 'Statistics: Get Hourly Site Stats',
            description: 'Retrieves hourly statistics for the entire site.',
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
                // unifi-api-ts parameter "attribs" (optional) — a string[], entered here as a comma-separated list
                {
                    id: 'attribs',
                    type: 'textinput',
                    label: 'Attribs',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get Hourly Site Stats - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Split "Attribs" on commas into the array unifi-api-ts expects
                    const attribsList = event.options.attribs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .stat_hourly_site(event.options.start, event.options.end, attribsList, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get Hourly Site Stats: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get Hourly Site Stats failed: ${message}`);
                }
            },
        },
        // Get Hourly User Stats: Retrieves hourly statistics for users/clients.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_hourly_user(...)
        stats_stat_hourly_user: {
            name: 'Statistics: Get Hourly User Stats',
            description: 'Retrieves hourly statistics for users/clients.',
            options: [
                // unifi-api-ts parameter "mac" (optional)
                {
                    id: 'mac',
                    type: 'textinput',
                    label: 'MAC',
                    default: '',
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
                // unifi-api-ts parameter "attribs" (optional) — a string[], entered here as a comma-separated list
                {
                    id: 'attribs',
                    type: 'textinput',
                    label: 'Attribs',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get Hourly User Stats - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Split "Attribs" on commas into the array unifi-api-ts expects
                    const attribsList = event.options.attribs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .stat_hourly_user(event.options.mac, event.options.start, event.options.end, attribsList, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get Hourly User Stats: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get Hourly User Stats failed: ${message}`);
                }
            },
        },
        // Get Daily AP Stats: Retrieves daily statistics for access points with optional filtering by MAC address.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_daily_aps(...)
        stats_stat_daily_aps: {
            name: 'Statistics: Get Daily AP Stats',
            description: 'Retrieves daily statistics for access points with optional filtering by MAC address.',
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
                // unifi-api-ts parameter "attribs" (optional) — a string[], entered here as a comma-separated list
                {
                    id: 'attribs',
                    type: 'textinput',
                    label: 'Attribs',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get Daily AP Stats - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Split "Attribs" on commas into the array unifi-api-ts expects
                    const attribsList = event.options.attribs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .stat_daily_aps(event.options.start, event.options.end, event.options.mac, attribsList, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get Daily AP Stats: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get Daily AP Stats failed: ${message}`);
                }
            },
        },
        // Get Daily Gateway Stats: Retrieves daily statistics for the gateway/router.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_daily_gateway(...)
        stats_stat_daily_gateway: {
            name: 'Statistics: Get Daily Gateway Stats',
            description: 'Retrieves daily statistics for the gateway/router.',
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
                // unifi-api-ts parameter "attribs" (optional) — a string[], entered here as a comma-separated list
                {
                    id: 'attribs',
                    type: 'textinput',
                    label: 'Attribs',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get Daily Gateway Stats - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Split "Attribs" on commas into the array unifi-api-ts expects
                    const attribsList = event.options.attribs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .stat_daily_gateway(event.options.start, event.options.end, attribsList, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get Daily Gateway Stats: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get Daily Gateway Stats failed: ${message}`);
                }
            },
        },
        // Get Daily Site Stats: Retrieves daily statistics for the entire site.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_daily_site(...)
        stats_stat_daily_site: {
            name: 'Statistics: Get Daily Site Stats',
            description: 'Retrieves daily statistics for the entire site.',
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
                // unifi-api-ts parameter "attribs" (optional) — a string[], entered here as a comma-separated list
                {
                    id: 'attribs',
                    type: 'textinput',
                    label: 'Attribs',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get Daily Site Stats - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Split "Attribs" on commas into the array unifi-api-ts expects
                    const attribsList = event.options.attribs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .stat_daily_site(event.options.start, event.options.end, attribsList, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get Daily Site Stats: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get Daily Site Stats failed: ${message}`);
                }
            },
        },
        // Get Daily User Stats: Retrieves daily statistics for users/clients with optional filtering by MAC address.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_daily_user(...)
        stats_stat_daily_user: {
            name: 'Statistics: Get Daily User Stats',
            description: 'Retrieves daily statistics for users/clients with optional filtering by MAC address.',
            options: [
                // unifi-api-ts parameter "mac" (optional)
                {
                    id: 'mac',
                    type: 'textinput',
                    label: 'MAC',
                    default: '',
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
                // unifi-api-ts parameter "attribs" (optional) — a string[], entered here as a comma-separated list
                {
                    id: 'attribs',
                    type: 'textinput',
                    label: 'Attribs',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get Daily User Stats - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Split "Attribs" on commas into the array unifi-api-ts expects
                    const attribsList = event.options.attribs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .stat_daily_user(event.options.mac, event.options.start, event.options.end, attribsList, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get Daily User Stats: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get Daily User Stats failed: ${message}`);
                }
            },
        },
        // Get Monthly AP Stats: Retrieves monthly statistics for access points with optional filtering by MAC address.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_monthly_aps(...)
        stats_stat_monthly_aps: {
            name: 'Statistics: Get Monthly AP Stats',
            description: 'Retrieves monthly statistics for access points with optional filtering by MAC address.',
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
                // unifi-api-ts parameter "attribs" (optional) — a string[], entered here as a comma-separated list
                {
                    id: 'attribs',
                    type: 'textinput',
                    label: 'Attribs',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get Monthly AP Stats - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Split "Attribs" on commas into the array unifi-api-ts expects
                    const attribsList = event.options.attribs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .stat_monthly_aps(event.options.start, event.options.end, event.options.mac, attribsList, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get Monthly AP Stats: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get Monthly AP Stats failed: ${message}`);
                }
            },
        },
        // Get Monthly Gateway Stats: Retrieves monthly statistics for the gateway/router.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_monthly_gateway(...)
        stats_stat_monthly_gateway: {
            name: 'Statistics: Get Monthly Gateway Stats',
            description: 'Retrieves monthly statistics for the gateway/router.',
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
                // unifi-api-ts parameter "attribs" (optional) — a string[], entered here as a comma-separated list
                {
                    id: 'attribs',
                    type: 'textinput',
                    label: 'Attribs',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get Monthly Gateway Stats - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Split "Attribs" on commas into the array unifi-api-ts expects
                    const attribsList = event.options.attribs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .stat_monthly_gateway(event.options.start, event.options.end, attribsList, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get Monthly Gateway Stats: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get Monthly Gateway Stats failed: ${message}`);
                }
            },
        },
        // Get Monthly Site Stats: Retrieves monthly statistics for the entire site.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_monthly_site(...)
        stats_stat_monthly_site: {
            name: 'Statistics: Get Monthly Site Stats',
            description: 'Retrieves monthly statistics for the entire site.',
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
                // unifi-api-ts parameter "attribs" (optional) — a string[], entered here as a comma-separated list
                {
                    id: 'attribs',
                    type: 'textinput',
                    label: 'Attribs',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get Monthly Site Stats - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Split "Attribs" on commas into the array unifi-api-ts expects
                    const attribsList = event.options.attribs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .stat_monthly_site(event.options.start, event.options.end, attribsList, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get Monthly Site Stats: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get Monthly Site Stats failed: ${message}`);
                }
            },
        },
        // Get Monthly User Stats: Retrieves monthly statistics for users/clients with optional filtering by MAC address.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_monthly_user(...)
        stats_stat_monthly_user: {
            name: 'Statistics: Get Monthly User Stats',
            description: 'Retrieves monthly statistics for users/clients with optional filtering by MAC address.',
            options: [
                // unifi-api-ts parameter "mac" (optional)
                {
                    id: 'mac',
                    type: 'textinput',
                    label: 'MAC',
                    default: '',
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
                // unifi-api-ts parameter "attribs" (optional) — a string[], entered here as a comma-separated list
                {
                    id: 'attribs',
                    type: 'textinput',
                    label: 'Attribs',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get Monthly User Stats - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Split "Attribs" on commas into the array unifi-api-ts expects
                    const attribsList = event.options.attribs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .stat_monthly_user(event.options.mac, event.options.start, event.options.end, attribsList, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get Monthly User Stats: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get Monthly User Stats failed: ${message}`);
                }
            },
        },
        // Get All Users Stats: Retrieves comprehensive statistics for all users/clients over a specified time period.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_allusers(...)
        stats_stat_allusers: {
            name: 'Statistics: Get All Users Stats',
            description: 'Retrieves comprehensive statistics for all users/clients over a specified time period.',
            options: [
                // unifi-api-ts parameter "historyhours" (optional)
                {
                    id: 'historyhours',
                    type: 'number',
                    label: 'Historyhours',
                    default: 8760,
                    min: 0,
                    max: 999999999,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get All Users Stats - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getStatisticsAPI().stat_allusers(event.options.historyhours, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get All Users Stats: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get All Users Stats failed: ${message}`);
                }
            },
        },
        // Get Client Stats: Retrieves detailed statistics and information for a specific client device by MAC address.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_client(...)
        stats_stat_client: {
            name: 'Statistics: Get Client Stats',
            description: 'Retrieves detailed statistics and information for a specific client device by MAC address.',
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
                    self.log('warn', 'Statistics: Get Client Stats - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getStatisticsAPI().stat_client(event.options.mac, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get Client Stats: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get Client Stats failed: ${message}`);
                }
            },
        },
        // Get Auth Events: Retrieves authentication and authorization events for the site.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_auths(...)
        stats_stat_auths: {
            name: 'Statistics: Get Auth Events',
            description: 'Retrieves authentication and authorization events for the site.',
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
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get Auth Events - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .stat_auths(event.options.start, event.options.end, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get Auth Events: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get Auth Events failed: ${message}`);
                }
            },
        },
        // Get Sessions: Retrieves user session information with optional filtering by time range, MAC address, or session type.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_sessions(...)
        stats_stat_sessions: {
            name: 'Statistics: Get Sessions',
            description: 'Retrieves user session information with optional filtering by time range, MAC address, or session type.',
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
                // unifi-api-ts parameter "type" (optional)
                {
                    id: 'type',
                    type: 'textinput',
                    label: 'Type',
                    default: 'all',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get Sessions - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .stat_sessions(event.options.start, event.options.end, event.options.mac, event.options.type, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get Sessions: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get Sessions failed: ${message}`);
                }
            },
        },
        // Get IPS Events: Retrieves Intrusion Prevention System (IPS) security events for the site.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_ips_events(...)
        stats_stat_ips_events: {
            name: 'Statistics: Get IPS Events',
            description: 'Retrieves Intrusion Prevention System (IPS) security events for the site.',
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
                    self.log('warn', 'Statistics: Get IPS Events - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .stat_ips_events(event.options.start, event.options.end, event.options.limit, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get IPS Events: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get IPS Events failed: ${message}`);
                }
            },
        },
        // Get Speed Test Results: Retrieves network speed test results performed by the UniFi system.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_speedtest_results(...)
        stats_stat_speedtest_results: {
            name: 'Statistics: Get Speed Test Results',
            description: 'Retrieves network speed test results performed by the UniFi system.',
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
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get Speed Test Results - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .stat_speedtest_results(event.options.start, event.options.end, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get Speed Test Results: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get Speed Test Results failed: ${message}`);
                }
            },
        },
        // Get Payments: Retrieves payment information for guest access or hotspot services.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_payment(...)
        stats_stat_payment: {
            name: 'Statistics: Get Payments',
            description: 'Retrieves payment information for guest access or hotspot services.',
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
                    self.log('warn', 'Statistics: Get Payments - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getStatisticsAPI().stat_payment(event.options.within, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get Payments: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get Payments failed: ${message}`);
                }
            },
        },
        // Get Voucher Stats: Retrieves statistics about guest access vouchers.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_voucher(...)
        stats_stat_voucher: {
            name: 'Statistics: Get Voucher Stats',
            description: 'Retrieves statistics about guest access vouchers.',
            options: [
                // unifi-api-ts parameter "create_time" (optional)
                {
                    id: 'create_time',
                    type: 'number',
                    label: 'Create Time',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get Voucher Stats - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getStatisticsAPI().stat_voucher(event.options.create_time, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get Voucher Stats: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get Voucher Stats failed: ${message}`);
                }
            },
        },
        // Archive Alarm: Archives (dismisses) a specific alarm by ID, or all current alarms if no ID is provided.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().archive_alarm(...)
        stats_archive_alarm: {
            name: 'Statistics: Archive Alarm',
            description: 'Archives (dismisses) a specific alarm by ID, or all current alarms if no ID is provided.',
            options: [
                // unifi-api-ts parameter "alarm_id" (optional)
                {
                    id: 'alarm_id',
                    type: 'textinput',
                    label: 'Alarm ID',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Archive Alarm - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getStatisticsAPI().archive_alarm(event.options.alarm_id, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Archive Alarm: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Archive Alarm failed: ${message}`);
                }
            },
        },
        // Execute Stat Command: Executes a system statistics command, currently supporting a DPI (Deep Packet Inspection) reset operation.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().cmd_stat(...)
        stats_cmd_stat: {
            name: 'Statistics: Execute Stat Command',
            description: 'Executes a system statistics command, currently supporting a DPI (Deep Packet Inspection) reset operation.',
            options: [
                // unifi-api-ts parameter "command" (required)
                {
                    id: 'command',
                    type: 'textinput',
                    label: 'Command',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Execute Stat Command - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getStatisticsAPI().cmd_stat(event.options.command, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Execute Stat Command: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Execute Stat Command failed: ${message}`);
                }
            },
        },
        // List Dashboard: Retrieves dashboard statistics and metrics for the UniFi site, in standard or 5-minute interval resolution.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().list_dashboard(...)
        stats_list_dashboard: {
            name: 'Statistics: List Dashboard',
            description: 'Retrieves dashboard statistics and metrics for the UniFi site, in standard or 5-minute interval resolution.',
            options: [
                // unifi-api-ts parameter "five_minutes" (optional)
                {
                    id: 'five_minutes',
                    type: 'checkbox',
                    label: 'Five Minutes',
                    default: false,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: List Dashboard - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getStatisticsAPI().list_dashboard(event.options.five_minutes, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: List Dashboard: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: List Dashboard failed: ${message}`);
                }
            },
        },
        // List DPI Stats: Retrieves Deep Packet Inspection (DPI) statistics showing application usage and traffic patterns across the network.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().list_dpi_stats(...)
        stats_list_dpi_stats: {
            name: 'Statistics: List DPI Stats',
            description: 'Retrieves Deep Packet Inspection (DPI) statistics showing application usage and traffic patterns across the network.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: List DPI Stats - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getStatisticsAPI().list_dpi_stats(self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: List DPI Stats: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: List DPI Stats failed: ${message}`);
                }
            },
        },
        // List Filtered DPI Stats: Retrieves filtered Deep Packet Inspection (DPI) statistics with specific categorization and filtering options.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().list_dpi_stats_filtered(...)
        stats_list_dpi_stats_filtered: {
            name: 'Statistics: List Filtered DPI Stats',
            description: 'Retrieves filtered Deep Packet Inspection (DPI) statistics with specific categorization and filtering options.',
            options: [
                // unifi-api-ts parameter "type" (optional)
                {
                    id: 'type',
                    type: 'textinput',
                    label: 'Type',
                    default: 'by_app',
                },
                // unifi-api-ts parameter "cat_filter" (optional)
                {
                    id: 'cat_filter',
                    type: 'textinput',
                    label: 'Cat Filter',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: List Filtered DPI Stats - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getStatisticsAPI()
                        .list_dpi_stats_filtered(event.options.type, event.options.cat_filter, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: List Filtered DPI Stats: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: List Filtered DPI Stats failed: ${message}`);
                }
            },
        },
        // Get Status: Retrieves comprehensive status information for the UniFi site including device states, network health, and system performance metrics.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().stat_status(...)
        stats_stat_status: {
            name: 'Statistics: Get Status',
            description: 'Retrieves comprehensive status information for the UniFi site including device states, network health, and system performance metrics.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get Status - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getStatisticsAPI().stat_status(self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get Status: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get Status failed: ${message}`);
                }
            },
        },
        // Get System Log: Retrieves system log entries from the UniFi Controller, providing access to system events, errors, and operational messages.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().get_system_log(...)
        stats_get_system_log: {
            name: 'Statistics: Get System Log',
            description: 'Retrieves system log entries from the UniFi Controller, providing access to system events, errors, and operational messages.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: Get System Log - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getStatisticsAPI().get_system_log(self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: Get System Log: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: Get System Log failed: ${message}`);
                }
            },
        },
        // List Extensions: Retrieves information about UniFi Controller extensions and add-ons, including installed plugins, modules, and additional functionality.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().list_extension(...)
        stats_list_extension: {
            name: 'Statistics: List Extensions',
            description: 'Retrieves information about UniFi Controller extensions and add-ons, including installed plugins, modules, and additional functionality.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: List Extensions - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getStatisticsAPI().list_extension(self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: List Extensions: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: List Extensions failed: ${message}`);
                }
            },
        },
        // List Fingerprint Devices: Retrieves device fingerprinting information showing detected device types, operating systems, and other identifying characteristics based on network behavior.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().list_fingerprint_devices(...)
        stats_list_fingerprint_devices: {
            name: 'Statistics: List Fingerprint Devices',
            description: 'Retrieves device fingerprinting information showing detected device types, operating systems, and other identifying characteristics based on network behavior.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: List Fingerprint Devices - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getStatisticsAPI().list_fingerprint_devices(self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: List Fingerprint Devices: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: List Fingerprint Devices failed: ${message}`);
                }
            },
        },
        // List Rogue APs: Retrieves a list of rogue (unauthorized) access points detected within the specified time period.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().list_rogueaps(...)
        stats_list_rogueaps: {
            name: 'Statistics: List Rogue APs',
            description: 'Retrieves a list of rogue (unauthorized) access points detected within the specified time period.',
            options: [
                // unifi-api-ts parameter "within" (optional)
                {
                    id: 'within',
                    type: 'number',
                    label: 'Within',
                    default: 24,
                    min: 0,
                    max: 999999999,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: List Rogue APs - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getStatisticsAPI().list_rogueaps(event.options.within, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: List Rogue APs: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: List Rogue APs failed: ${message}`);
                }
            },
        },
        // List Known Rogue APs: Retrieves a list of known (whitelisted) rogue access points that have been marked as safe or authorized.
        // Backed by unifi-api-ts: unifi.getStatisticsAPI().list_known_rogueaps(...)
        stats_list_known_rogueaps: {
            name: 'Statistics: List Known Rogue APs',
            description: 'Retrieves a list of known (whitelisted) rogue access points that have been marked as safe or authorized.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Statistics: List Known Rogue APs - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getStatisticsAPI().list_known_rogueaps(self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Statistics: List Known Rogue APs: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Statistics: List Known Rogue APs failed: ${message}`);
                }
            },
        },
    };
}
//# sourceMappingURL=stats.js.map