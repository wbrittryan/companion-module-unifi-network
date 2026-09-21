export function buildSecurityActions(self) {
    return {
        // Create Firewall Group: Creates a new firewall group for organizing IP addresses or ports.
        // Backed by unifi-api-ts: unifi.getSecurityAPI().create_firewallgroup(...)
        security_create_firewallgroup: {
            name: 'Security: Create Firewall Group',
            description: 'Creates a new firewall group for organizing IP addresses or ports.',
            options: [
                // unifi-api-ts parameter "group_name" (required)
                {
                    id: 'group_name',
                    type: 'textinput',
                    label: 'Group Name',
                    default: '',
                },
                // unifi-api-ts parameter "group_type" (required) — one of: address-group, ipv6-address-group, port-group
                {
                    id: 'group_type',
                    type: 'dropdown',
                    label: 'Group Type',
                    choices: [
                        { id: 'address-group', label: 'address-group' },
                        { id: 'ipv6-address-group', label: 'ipv6-address-group' },
                        { id: 'port-group', label: 'port-group' },
                    ],
                    default: 'address-group',
                },
                // unifi-api-ts parameter "group_members" (optional) — a string[], entered here as a comma-separated list
                {
                    id: 'group_members',
                    type: 'textinput',
                    label: 'Group Members',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Security: Create Firewall Group - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Narrow the dropdown's plain string back to the exact literal type unifi-api-ts expects
                    const group_typeValue = event.options.group_type;
                    // Split "Group Members" on commas into the array unifi-api-ts expects
                    const group_membersList = event.options.group_members
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getSecurityAPI()
                        .create_firewallgroup(event.options.group_name, group_typeValue, group_membersList, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Security: Create Firewall Group: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Security: Create Firewall Group failed: ${message}`);
                }
            },
        },
        // List Firewall Groups: Retrieves all firewall groups configured in the UniFi Controller.
        // Backed by unifi-api-ts: unifi.getSecurityAPI().list_firewallgroups(...)
        security_list_firewallgroups: {
            name: 'Security: List Firewall Groups',
            description: 'Retrieves all firewall groups configured in the UniFi Controller.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Security: List Firewall Groups - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getSecurityAPI().list_firewallgroups(self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Security: List Firewall Groups: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Security: List Firewall Groups failed: ${message}`);
                }
            },
        },
        // List Firewall Rules: Retrieves all firewall rules configured in the UniFi Controller.
        // Backed by unifi-api-ts: unifi.getSecurityAPI().list_firewallrules(...)
        security_list_firewallrules: {
            name: 'Security: List Firewall Rules',
            description: 'Retrieves all firewall rules configured in the UniFi Controller.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Security: List Firewall Rules - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getSecurityAPI().list_firewallrules(self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Security: List Firewall Rules: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Security: List Firewall Rules failed: ${message}`);
                }
            },
        },
        // Delete Firewall Group: Deletes a firewall group from the UniFi Controller.
        // Backed by unifi-api-ts: unifi.getSecurityAPI().delete_firewallgroup(...)
        security_delete_firewallgroup: {
            name: 'Security: Delete Firewall Group',
            description: 'Deletes a firewall group from the UniFi Controller.',
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
                    self.log('warn', 'Security: Delete Firewall Group - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getSecurityAPI().delete_firewallgroup(event.options.group_id, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Security: Delete Firewall Group: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Security: Delete Firewall Group failed: ${message}`);
                }
            },
        },
        // Edit Firewall Group: Updates an existing firewall group with new members or settings.
        // Backed by unifi-api-ts: unifi.getSecurityAPI().edit_firewallgroup(...)
        security_edit_firewallgroup: {
            name: 'Security: Edit Firewall Group',
            description: 'Updates an existing firewall group with new members or settings.',
            options: [
                // unifi-api-ts parameter "group_id" (required)
                {
                    id: 'group_id',
                    type: 'textinput',
                    label: 'Group ID',
                    default: '',
                },
                // unifi-api-ts parameter "site_id" (required)
                {
                    id: 'site_id',
                    type: 'textinput',
                    label: 'Site ID',
                    default: '',
                },
                // unifi-api-ts parameter "group_name" (required)
                {
                    id: 'group_name',
                    type: 'textinput',
                    label: 'Group Name',
                    default: '',
                },
                // unifi-api-ts parameter "group_type" (required) — one of: address-group, ipv6-address-group, port-group
                {
                    id: 'group_type',
                    type: 'dropdown',
                    label: 'Group Type',
                    choices: [
                        { id: 'address-group', label: 'address-group' },
                        { id: 'ipv6-address-group', label: 'ipv6-address-group' },
                        { id: 'port-group', label: 'port-group' },
                    ],
                    default: 'address-group',
                },
                // unifi-api-ts parameter "group_members" (optional) — a string[], entered here as a comma-separated list
                {
                    id: 'group_members',
                    type: 'textinput',
                    label: 'Group Members',
                    default: '',
                    tooltip: 'Comma-separated list',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Security: Edit Firewall Group - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Narrow the dropdown's plain string back to the exact literal type unifi-api-ts expects
                    const group_typeValue = event.options.group_type;
                    // Split "Group Members" on commas into the array unifi-api-ts expects
                    const group_membersList = event.options.group_members
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getSecurityAPI()
                        .edit_firewallgroup(event.options.group_id, event.options.site_id, event.options.group_name, group_typeValue, group_membersList, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Security: Edit Firewall Group: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Security: Edit Firewall Group failed: ${message}`);
                }
            },
        },
        // Create RADIUS Account: Creates a new RADIUS user account for network authentication.
        // Backed by unifi-api-ts: unifi.getSecurityAPI().create_radius_account(...)
        security_create_radius_account: {
            name: 'Security: Create RADIUS Account',
            description: 'Creates a new RADIUS user account for network authentication.',
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
                // unifi-api-ts parameter "tunnel_type" (optional)
                {
                    id: 'tunnel_type',
                    type: 'number',
                    label: 'Tunnel Type',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
                // unifi-api-ts parameter "tunnel_medium_type" (optional)
                {
                    id: 'tunnel_medium_type',
                    type: 'number',
                    label: 'Tunnel Medium Type',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
                // unifi-api-ts parameter "vlan" (optional)
                {
                    id: 'vlan',
                    type: 'number',
                    label: 'VLAN',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Security: Create RADIUS Account - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getSecurityAPI()
                        .create_radius_account(event.options.name, event.options.x_password, event.options.tunnel_type, event.options.tunnel_medium_type, event.options.vlan, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Security: Create RADIUS Account: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Security: Create RADIUS Account failed: ${message}`);
                }
            },
        },
        // List RADIUS Accounts: Retrieves all RADIUS user accounts configured in the UniFi Controller.
        // Backed by unifi-api-ts: unifi.getSecurityAPI().list_radius_accounts(...)
        security_list_radius_accounts: {
            name: 'Security: List RADIUS Accounts',
            description: 'Retrieves all RADIUS user accounts configured in the UniFi Controller.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Security: List RADIUS Accounts - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getSecurityAPI().list_radius_accounts(self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Security: List RADIUS Accounts: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Security: List RADIUS Accounts failed: ${message}`);
                }
            },
        },
        // List RADIUS Profiles: Retrieves all RADIUS server profiles configured in the UniFi Controller.
        // Backed by unifi-api-ts: unifi.getSecurityAPI().list_radius_profiles(...)
        security_list_radius_profiles: {
            name: 'Security: List RADIUS Profiles',
            description: 'Retrieves all RADIUS server profiles configured in the UniFi Controller.',
            options: [],
            callback: async () => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Security: List RADIUS Profiles - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getSecurityAPI().list_radius_profiles(self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Security: List RADIUS Profiles: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Security: List RADIUS Profiles failed: ${message}`);
                }
            },
        },
        // Delete RADIUS Account: Removes a RADIUS user account from the UniFi Controller.
        // Backed by unifi-api-ts: unifi.getSecurityAPI().delete_radius_account(...)
        security_delete_radius_account: {
            name: 'Security: Delete RADIUS Account',
            description: 'Removes a RADIUS user account from the UniFi Controller.',
            options: [
                // unifi-api-ts parameter "account_id" (required)
                {
                    id: 'account_id',
                    type: 'textinput',
                    label: 'Account ID',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Security: Delete RADIUS Account - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi.getSecurityAPI().delete_radius_account(event.options.account_id, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Security: Delete RADIUS Account: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Security: Delete RADIUS Account failed: ${message}`);
                }
            },
        },
        // Update RADIUS Account: Updates an existing RADIUS account with new settings.
        // Backed by unifi-api-ts: unifi.getSecurityAPI().set_radius_account_base(...)
        security_set_radius_account_base: {
            name: 'Security: Update RADIUS Account',
            description: 'Updates an existing RADIUS account with new settings.',
            options: [
                // unifi-api-ts parameter "account_id" (required)
                {
                    id: 'account_id',
                    type: 'textinput',
                    label: 'Account ID',
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
                    self.log('warn', 'Security: Update RADIUS Account - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Parse the JSON the user typed into "Payload" before sending it
                    const payloadPayload = JSON.parse(event.options.payload);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getSecurityAPI()
                        .set_radius_account_base(event.options.account_id, payloadPayload, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Security: Update RADIUS Account: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Security: Update RADIUS Account failed: ${message}`);
                }
            },
        },
        // Update IPS/IDS Settings: Updates Intrusion Prevention System (IPS) and Intrusion Detection System (IDS) settings.
        // Backed by unifi-api-ts: unifi.getSecurityAPI().set_ips_settings_base(...)
        security_set_ips_settings_base: {
            name: 'Security: Update IPS/IDS Settings',
            description: 'Updates Intrusion Prevention System (IPS) and Intrusion Detection System (IDS) settings.',
            options: [
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
                    self.log('warn', 'Security: Update IPS/IDS Settings - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Parse the JSON the user typed into "Payload" before sending it
                    const payloadPayload = JSON.parse(event.options.payload);
                    // Run the command against the UniFi console
                    const result = await unifi.getSecurityAPI().set_ips_settings_base(payloadPayload, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Security: Update IPS/IDS Settings: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Security: Update IPS/IDS Settings failed: ${message}`);
                }
            },
        },
        // Set WLAN MAC Filter: Configures MAC address filtering for a wireless network (WLAN).
        // Backed by unifi-api-ts: unifi.getSecurityAPI().set_wlan_mac_filter(...)
        security_set_wlan_mac_filter: {
            name: 'Security: Set WLAN MAC Filter',
            description: 'Configures MAC address filtering for a wireless network (WLAN).',
            options: [
                // unifi-api-ts parameter "wlan_id" (required)
                {
                    id: 'wlan_id',
                    type: 'textinput',
                    label: 'WLAN ID',
                    default: '',
                },
                // unifi-api-ts parameter "mac_filter_policy" (required) — one of: allow, deny
                {
                    id: 'mac_filter_policy',
                    type: 'dropdown',
                    label: 'MAC Filter Policy',
                    choices: [
                        { id: 'allow', label: 'allow' },
                        { id: 'deny', label: 'deny' },
                    ],
                    default: 'allow',
                },
                // unifi-api-ts parameter "mac_filter_enabled" (required)
                {
                    id: 'mac_filter_enabled',
                    type: 'checkbox',
                    label: 'MAC Filter Enabled',
                    default: false,
                },
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
                    self.log('warn', 'Security: Set WLAN MAC Filter - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Narrow the dropdown's plain string back to the exact literal type unifi-api-ts expects
                    const mac_filter_policyValue = event.options.mac_filter_policy;
                    // Split "MACs" on commas into the array unifi-api-ts expects
                    const macsList = event.options.macs
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getSecurityAPI()
                        .set_wlan_mac_filter(event.options.wlan_id, mac_filter_policyValue, event.options.mac_filter_enabled, macsList, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Security: Set WLAN MAC Filter: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Security: Set WLAN MAC Filter failed: ${message}`);
                }
            },
        },
        // Update Guest Login Settings: Configures guest portal settings for wireless networks.
        // Backed by unifi-api-ts: unifi.getSecurityAPI().set_guestlogin_settings(...)
        security_set_guestlogin_settings: {
            name: 'Security: Update Guest Login Settings',
            description: 'Configures guest portal settings for wireless networks.',
            options: [
                // unifi-api-ts parameter "portal_enabled" (required)
                {
                    id: 'portal_enabled',
                    type: 'checkbox',
                    label: 'Portal Enabled',
                    default: false,
                },
                // unifi-api-ts parameter "portal_customized" (required)
                {
                    id: 'portal_customized',
                    type: 'checkbox',
                    label: 'Portal Customized',
                    default: false,
                },
                // unifi-api-ts parameter "redirect_enabled" (required)
                {
                    id: 'redirect_enabled',
                    type: 'checkbox',
                    label: 'Redirect Enabled',
                    default: false,
                },
                // unifi-api-ts parameter "redirect_url" (required)
                {
                    id: 'redirect_url',
                    type: 'textinput',
                    label: 'Redirect URL',
                    default: '',
                },
                // unifi-api-ts parameter "x_password" (required)
                {
                    id: 'x_password',
                    type: 'textinput',
                    label: 'X Password',
                    default: '',
                },
                // unifi-api-ts parameter "expire_number" (required)
                {
                    id: 'expire_number',
                    type: 'number',
                    label: 'Expire Number',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
                // unifi-api-ts parameter "expire_unit" (required)
                {
                    id: 'expire_unit',
                    type: 'number',
                    label: 'Expire Unit',
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
                // unifi-api-ts parameter "section_id" (required)
                {
                    id: 'section_id',
                    type: 'textinput',
                    label: 'Section ID',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Security: Update Guest Login Settings - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getSecurityAPI()
                        .set_guestlogin_settings(event.options.portal_enabled, event.options.portal_customized, event.options.redirect_enabled, event.options.redirect_url, event.options.x_password, event.options.expire_number, event.options.expire_unit, event.options.section_id, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Security: Update Guest Login Settings: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Security: Update Guest Login Settings failed: ${message}`);
                }
            },
        },
        // Update Guest Login Settings Base: Advanced method for updating guest access settings with a custom payload.
        // Backed by unifi-api-ts: unifi.getSecurityAPI().set_guestlogin_settings_base(...)
        security_set_guestlogin_settings_base: {
            name: 'Security: Update Guest Login Settings Base',
            description: 'Advanced method for updating guest access settings with a custom payload.',
            options: [
                // unifi-api-ts parameter "payload" (required) — a raw JSON payload, typed here as text
                {
                    id: 'payload',
                    type: 'textinput',
                    label: 'Payload',
                    default: '{}',
                    tooltip: 'JSON payload',
                    multiline: true,
                },
                // unifi-api-ts parameter "section_id" (optional)
                {
                    id: 'section_id',
                    type: 'textinput',
                    label: 'Section ID',
                    default: '',
                },
            ],
            callback: async (event) => {
                // Every action bails out early if the module isn't currently connected to the console
                const unifi = self.unifi;
                if (!unifi) {
                    self.log('warn', 'Security: Update Guest Login Settings Base - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Parse the JSON the user typed into "Payload" before sending it
                    const payloadPayload = JSON.parse(event.options.payload);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getSecurityAPI()
                        .set_guestlogin_settings_base(payloadPayload, event.options.section_id, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Security: Update Guest Login Settings Base: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Security: Update Guest Login Settings Base failed: ${message}`);
                }
            },
        },
        // Update Site Guest Access: Updates guest access settings for a specific site configuration.
        // Backed by unifi-api-ts: unifi.getSecurityAPI().set_site_guest_access(...)
        security_set_site_guest_access: {
            name: 'Security: Update Site Guest Access',
            description: 'Updates guest access settings for a specific site configuration.',
            options: [
                // unifi-api-ts parameter "guest_access_id" (required)
                {
                    id: 'guest_access_id',
                    type: 'textinput',
                    label: 'Guest Access ID',
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
                    self.log('warn', 'Security: Update Site Guest Access - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Parse the JSON the user typed into "Payload" before sending it
                    const payloadPayload = JSON.parse(event.options.payload);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getSecurityAPI()
                        .set_site_guest_access(event.options.guest_access_id, payloadPayload, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Security: Update Site Guest Access: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Security: Update Site Guest Access failed: ${message}`);
                }
            },
        },
        // Update Site SNMP: Configures SNMP (Simple Network Management Protocol) settings for network monitoring.
        // Backed by unifi-api-ts: unifi.getSecurityAPI().set_site_snmp(...)
        security_set_site_snmp: {
            name: 'Security: Update Site SNMP',
            description: 'Configures SNMP (Simple Network Management Protocol) settings for network monitoring.',
            options: [
                // unifi-api-ts parameter "snmp_id" (required)
                {
                    id: 'snmp_id',
                    type: 'textinput',
                    label: 'Snmp ID',
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
                    self.log('warn', 'Security: Update Site SNMP - not connected');
                    return;
                }
                try {
                    // "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
                    // Parse the JSON the user typed into "Payload" before sending it
                    const payloadPayload = JSON.parse(event.options.payload);
                    // Run the command against the UniFi console
                    const result = await unifi
                        .getSecurityAPI()
                        .set_site_snmp(event.options.snmp_id, payloadPayload, self.config.site);
                    // Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
                    self.log('debug', `Security: Update Site SNMP: ${JSON.stringify(result)}`);
                }
                catch (error) {
                    // The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
                    const message = error instanceof Error ? error.message : String(error);
                    self.log('error', `Security: Update Site SNMP failed: ${message}`);
                }
            },
        },
    };
}
//# sourceMappingURL=security.js.map