import type ModuleInstance from '../main.js'
import type { CompanionActionDefinitions } from '@companion-module/base'

// Auto-generated from unifi-api-ts's NetworkManagementAPI class: every public method it exposes becomes one
// Companion action below, named "Networks: <action>". Do not hand-edit call sites here without also
// checking unifi-api-ts's NetworkManagementAPI.d.ts, since the argument order must match it exactly.

// The shape of each action's options, so Companion's editor UI and the callback below stay in sync.
export type NetworkActionsSchema = {
	// Networks: Create Network — options Companion stores for this action's button
	network_create_network: {
		options: {
			payload: string
		}
	}
	// Networks: List Networks — options Companion stores for this action's button
	network_list_networkconf: {
		options: {
			network_id: string
		}
	}
	// Networks: Delete Network — options Companion stores for this action's button
	network_delete_network: {
		options: {
			network_id: string
		}
	}
	// Networks: Update Network Settings — options Companion stores for this action's button
	network_set_networksettings_base: {
		options: {
			network_id: string
			payload: string
		}
	}
	// Networks: List Routing Rules — options Companion stores for this action's button
	network_list_routing: {
		options: {
			route_id: string
		}
	}
	// Networks: List Port Configurations — options Companion stores for this action's button
	network_list_portconf: {
		options: Record<string, never>
	}
	// Networks: List Port Forward Stats — options Companion stores for this action's button
	network_list_portforward_stats: {
		options: Record<string, never>
	}
	// Networks: List Port Forwarding Rules — options Companion stores for this action's button
	network_list_portforwarding: {
		options: Record<string, never>
	}
	// Networks: Create DNS Record — options Companion stores for this action's button
	network_create_dns_record: {
		options: {
			record_type: string
			value: string
			key: string
			ttl: number
			enabled: boolean
		}
	}
	// Networks: List DNS Records — options Companion stores for this action's button
	network_list_dns_records: {
		options: Record<string, never>
	}
	// Networks: Delete DNS Record — options Companion stores for this action's button
	network_delete_dns_record: {
		options: {
			record_id: string
		}
	}
	// Networks: Create Dynamic DNS — options Companion stores for this action's button
	network_create_dynamicdns: {
		options: {
			payload: string
		}
	}
	// Networks: List Dynamic DNS — options Companion stores for this action's button
	network_list_dynamicdns: {
		options: Record<string, never>
	}
	// Networks: Update Dynamic DNS — options Companion stores for this action's button
	network_set_dynamicdns: {
		options: {
			dynamicdns_id: string
			payload: string
		}
	}
	// Networks: Create WLAN — options Companion stores for this action's button
	network_create_wlan: {
		options: {
			name: string
			x_passphrase: string
			usergroup_id: string
			wlangroup_id: string
			enabled: boolean
			hide_ssid: boolean
			is_guest: boolean
			security: string
			wpa_mode: string
			wpa_enc: string
			vlan_enabled: boolean
			vlan_id: string
			uapsd_enabled: boolean
			schedule_enabled: boolean
			schedule: string
			ap_group_ids: string
			additional_payload: string
		}
	}
	// Networks: Delete WLAN — options Companion stores for this action's button
	network_delete_wlan: {
		options: {
			wlan_id: string
		}
	}
	// Networks: Disable WLAN — options Companion stores for this action's button
	network_disable_wlan: {
		options: {
			wlan_id: string
			disable: boolean
		}
	}
	// Networks: List WLAN Groups — options Companion stores for this action's button
	network_list_wlan_groups: {
		options: Record<string, never>
	}
	// Networks: List WLAN Configurations — options Companion stores for this action's button
	network_list_wlanconf: {
		options: Record<string, never>
	}
	// Networks: Set WLAN Settings — options Companion stores for this action's button
	network_set_wlansettings: {
		options: {
			wlan_id: string
			payload: string
		}
	}
	// Networks: Set WLAN Settings (Base) — options Companion stores for this action's button
	network_set_wlansettings_base: {
		options: {
			wlan_id: string
			payload: string
		}
	}
	// Networks: List Country Codes — options Companion stores for this action's button
	network_list_country_codes: {
		options: Record<string, never>
	}
	// Networks: List Current Channels — options Companion stores for this action's button
	network_list_current_channels: {
		options: Record<string, never>
	}
	// Networks: Start Spectrum Scan — options Companion stores for this action's button
	network_spectrum_scan: {
		options: {
			mac: string
		}
	}
	// Networks: Get Spectrum Scan Results — options Companion stores for this action's button
	network_spectrum_scan_state: {
		options: {
			mac: string
		}
	}
	// Networks: Move Device — options Companion stores for this action's button
	network_move_device: {
		options: {
			mac: string
			site_id: string
		}
	}
}

export function buildNetworkActions(self: ModuleInstance): CompanionActionDefinitions<NetworkActionsSchema> {
	return {
		// Create Network: Creates a new network configuration (IP subnet, VLAN, and routing settings) in the UniFi Controller.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().create_network(...)
		network_create_network: {
			name: 'Networks: Create Network',
			description:
				'Creates a new network configuration (IP subnet, VLAN, and routing settings) in the UniFi Controller.',
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
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: Create Network - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Parse the JSON the user typed into "Payload" before sending it
					const payloadPayload = JSON.parse(event.options.payload)

					// Run the command against the UniFi console
					const result = await unifi.getNetworkManagementAPI().create_network(payloadPayload, self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: Create Network: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: Create Network failed: ${message}`)
				}
			},
		},
		// List Networks: Retrieves network configurations from the UniFi Controller, optionally filtered by network ID.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().list_networkconf(...)
		network_list_networkconf: {
			name: 'Networks: List Networks',
			description: 'Retrieves network configurations from the UniFi Controller, optionally filtered by network ID.',
			options: [
				// unifi-api-ts parameter "network_id" (optional)
				{
					id: 'network_id',
					type: 'textinput',
					label: 'Network ID',
					default: '',
				},
			],
			callback: async (event) => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: List Networks - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi
						.getNetworkManagementAPI()
						.list_networkconf(event.options.network_id, self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: List Networks: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: List Networks failed: ${message}`)
				}
			},
		},
		// Delete Network: Permanently deletes a network configuration and all its associated settings from the UniFi Controller.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().delete_network(...)
		network_delete_network: {
			name: 'Networks: Delete Network',
			description:
				'Permanently deletes a network configuration and all its associated settings from the UniFi Controller.',
			options: [
				// unifi-api-ts parameter "network_id" (required)
				{
					id: 'network_id',
					type: 'textinput',
					label: 'Network ID',
					default: '',
				},
			],
			callback: async (event) => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: Delete Network - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi
						.getNetworkManagementAPI()
						.delete_network(event.options.network_id, self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: Delete Network: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: Delete Network failed: ${message}`)
				}
			},
		},
		// Update Network Settings: Updates network configuration settings such as DHCP and VLAN parameters for a specific network.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().set_networksettings_base(...)
		network_set_networksettings_base: {
			name: 'Networks: Update Network Settings',
			description: 'Updates network configuration settings such as DHCP and VLAN parameters for a specific network.',
			options: [
				// unifi-api-ts parameter "network_id" (required)
				{
					id: 'network_id',
					type: 'textinput',
					label: 'Network ID',
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
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: Update Network Settings - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Parse the JSON the user typed into "Payload" before sending it
					const payloadPayload = JSON.parse(event.options.payload)

					// Run the command against the UniFi console
					const result = await unifi
						.getNetworkManagementAPI()
						.set_networksettings_base(event.options.network_id, payloadPayload, self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: Update Network Settings: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: Update Network Settings failed: ${message}`)
				}
			},
		},
		// List Routing Rules: Retrieves routing rules configured in the UniFi Controller, optionally filtered by route ID.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().list_routing(...)
		network_list_routing: {
			name: 'Networks: List Routing Rules',
			description: 'Retrieves routing rules configured in the UniFi Controller, optionally filtered by route ID.',
			options: [
				// unifi-api-ts parameter "route_id" (optional)
				{
					id: 'route_id',
					type: 'textinput',
					label: 'Route ID',
					default: '',
				},
			],
			callback: async (event) => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: List Routing Rules - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi.getNetworkManagementAPI().list_routing(event.options.route_id, self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: List Routing Rules: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: List Routing Rules failed: ${message}`)
				}
			},
		},
		// List Port Configurations: Retrieves port configuration profiles (VLAN assignments, PoE settings, etc.) for switches from the UniFi Controller.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().list_portconf(...)
		network_list_portconf: {
			name: 'Networks: List Port Configurations',
			description:
				'Retrieves port configuration profiles (VLAN assignments, PoE settings, etc.) for switches from the UniFi Controller.',
			options: [],
			callback: async () => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: List Port Configurations - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi.getNetworkManagementAPI().list_portconf(self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: List Port Configurations: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: List Port Configurations failed: ${message}`)
				}
			},
		},
		// List Port Forward Stats: Retrieves traffic and connection statistics for configured port forwarding rules.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().list_portforward_stats(...)
		network_list_portforward_stats: {
			name: 'Networks: List Port Forward Stats',
			description: 'Retrieves traffic and connection statistics for configured port forwarding rules.',
			options: [],
			callback: async () => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: List Port Forward Stats - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi.getNetworkManagementAPI().list_portforward_stats(self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: List Port Forward Stats: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: List Port Forward Stats failed: ${message}`)
				}
			},
		},
		// List Port Forwarding Rules: Retrieves the port forwarding rules configured in the UniFi Controller.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().list_portforwarding(...)
		network_list_portforwarding: {
			name: 'Networks: List Port Forwarding Rules',
			description: 'Retrieves the port forwarding rules configured in the UniFi Controller.',
			options: [],
			callback: async () => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: List Port Forwarding Rules - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi.getNetworkManagementAPI().list_portforwarding(self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: List Port Forwarding Rules: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: List Port Forwarding Rules failed: ${message}`)
				}
			},
		},
		// Create DNS Record: Creates a new DNS record (A, AAAA, MX, TXT, SRV, or NS) in the UniFi Controller's DNS server.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().create_dns_record(...)
		network_create_dns_record: {
			name: 'Networks: Create DNS Record',
			description: "Creates a new DNS record (A, AAAA, MX, TXT, SRV, or NS) in the UniFi Controller's DNS server.",
			options: [
				// unifi-api-ts parameter "record_type" (required) — one of: A, AAAA, MX, TXT, SRV, NS
				{
					id: 'record_type',
					type: 'dropdown',
					label: 'Record Type',
					choices: [
						{ id: 'A', label: 'A' },
						{ id: 'AAAA', label: 'AAAA' },
						{ id: 'MX', label: 'MX' },
						{ id: 'TXT', label: 'TXT' },
						{ id: 'SRV', label: 'SRV' },
						{ id: 'NS', label: 'NS' },
					],
					default: 'A',
				},
				// unifi-api-ts parameter "value" (required)
				{
					id: 'value',
					type: 'textinput',
					label: 'Value',
					default: '',
				},
				// unifi-api-ts parameter "key" (required)
				{
					id: 'key',
					type: 'textinput',
					label: 'Key',
					default: '',
				},
				// unifi-api-ts parameter "ttl" (optional)
				{
					id: 'ttl',
					type: 'number',
					label: 'TTL',
					default: 0,
					min: 0,
					max: 999999999,
				},
				// unifi-api-ts parameter "enabled" (optional)
				{
					id: 'enabled',
					type: 'checkbox',
					label: 'Enabled',
					default: true,
				},
			],
			callback: async (event) => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: Create DNS Record - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Narrow the dropdown's plain string back to the exact literal type unifi-api-ts expects
					const record_typeValue = event.options.record_type as 'A' | 'AAAA' | 'MX' | 'TXT' | 'SRV' | 'NS'

					// Run the command against the UniFi console
					const result = await unifi
						.getNetworkManagementAPI()
						.create_dns_record(
							record_typeValue,
							event.options.value,
							event.options.key,
							event.options.ttl,
							event.options.enabled,
							self.config.site,
						)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: Create DNS Record: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: Create DNS Record failed: ${message}`)
				}
			},
		},
		// List DNS Records: Retrieves DNS records configured in the UniFi Controller's DNS server.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().list_dns_records(...)
		network_list_dns_records: {
			name: 'Networks: List DNS Records',
			description: "Retrieves DNS records configured in the UniFi Controller's DNS server.",
			options: [],
			callback: async () => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: List DNS Records - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi.getNetworkManagementAPI().list_dns_records(self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: List DNS Records: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: List DNS Records failed: ${message}`)
				}
			},
		},
		// Delete DNS Record: Deletes a DNS record from the UniFi Controller's DNS server.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().delete_dns_record(...)
		network_delete_dns_record: {
			name: 'Networks: Delete DNS Record',
			description: "Deletes a DNS record from the UniFi Controller's DNS server.",
			options: [
				// unifi-api-ts parameter "record_id" (required)
				{
					id: 'record_id',
					type: 'textinput',
					label: 'Record ID',
					default: '',
				},
			],
			callback: async (event) => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: Delete DNS Record - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi
						.getNetworkManagementAPI()
						.delete_dns_record(event.options.record_id, self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: Delete DNS Record: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: Delete DNS Record failed: ${message}`)
				}
			},
		},
		// Create Dynamic DNS: Creates a new dynamic DNS configuration that automatically updates DNS records when the IP address changes.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().create_dynamicdns(...)
		network_create_dynamicdns: {
			name: 'Networks: Create Dynamic DNS',
			description:
				'Creates a new dynamic DNS configuration that automatically updates DNS records when the IP address changes.',
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
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: Create Dynamic DNS - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Parse the JSON the user typed into "Payload" before sending it
					const payloadPayload = JSON.parse(event.options.payload)

					// Run the command against the UniFi console
					const result = await unifi.getNetworkManagementAPI().create_dynamicdns(payloadPayload, self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: Create Dynamic DNS: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: Create Dynamic DNS failed: ${message}`)
				}
			},
		},
		// List Dynamic DNS: Retrieves the dynamic DNS configurations from the UniFi Controller.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().list_dynamicdns(...)
		network_list_dynamicdns: {
			name: 'Networks: List Dynamic DNS',
			description: 'Retrieves the dynamic DNS configurations from the UniFi Controller.',
			options: [],
			callback: async () => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: List Dynamic DNS - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi.getNetworkManagementAPI().list_dynamicdns(self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: List Dynamic DNS: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: List Dynamic DNS failed: ${message}`)
				}
			},
		},
		// Update Dynamic DNS: Updates an existing dynamic DNS configuration in the UniFi Controller.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().set_dynamicdns(...)
		network_set_dynamicdns: {
			name: 'Networks: Update Dynamic DNS',
			description: 'Updates an existing dynamic DNS configuration in the UniFi Controller.',
			options: [
				// unifi-api-ts parameter "dynamicdns_id" (required)
				{
					id: 'dynamicdns_id',
					type: 'textinput',
					label: 'Dynamicdns ID',
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
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: Update Dynamic DNS - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Parse the JSON the user typed into "Payload" before sending it
					const payloadPayload = JSON.parse(event.options.payload)

					// Run the command against the UniFi console
					const result = await unifi
						.getNetworkManagementAPI()
						.set_dynamicdns(event.options.dynamicdns_id, payloadPayload, self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: Update Dynamic DNS: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: Update Dynamic DNS failed: ${message}`)
				}
			},
		},
		// Create WLAN: Creates a new wireless network (WLAN/SSID) with the specified security settings, user group, and advanced configuration options.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().create_wlan(...)
		network_create_wlan: {
			name: 'Networks: Create WLAN',
			description:
				'Creates a new wireless network (WLAN/SSID) with the specified security settings, user group, and advanced configuration options.',
			options: [
				// unifi-api-ts parameter "name" (required)
				{
					id: 'name',
					type: 'textinput',
					label: 'Name',
					default: '',
				},
				// unifi-api-ts parameter "x_passphrase" (required)
				{
					id: 'x_passphrase',
					type: 'textinput',
					label: 'X Passphrase',
					default: '',
				},
				// unifi-api-ts parameter "usergroup_id" (required)
				{
					id: 'usergroup_id',
					type: 'textinput',
					label: 'Usergroup ID',
					default: '',
				},
				// unifi-api-ts parameter "wlangroup_id" (required)
				{
					id: 'wlangroup_id',
					type: 'textinput',
					label: 'Wlangroup ID',
					default: '',
				},
				// unifi-api-ts parameter "enabled" (optional)
				{
					id: 'enabled',
					type: 'checkbox',
					label: 'Enabled',
					default: true,
				},
				// unifi-api-ts parameter "hide_ssid" (optional)
				{
					id: 'hide_ssid',
					type: 'checkbox',
					label: 'Hide SSID',
					default: false,
				},
				// unifi-api-ts parameter "is_guest" (optional)
				{
					id: 'is_guest',
					type: 'checkbox',
					label: 'Is Guest',
					default: false,
				},
				// unifi-api-ts parameter "security" (optional)
				{
					id: 'security',
					type: 'textinput',
					label: 'Security',
					default: 'open',
				},
				// unifi-api-ts parameter "wpa_mode" (optional)
				{
					id: 'wpa_mode',
					type: 'textinput',
					label: 'Wpa Mode',
					default: 'wpa2',
				},
				// unifi-api-ts parameter "wpa_enc" (optional)
				{
					id: 'wpa_enc',
					type: 'textinput',
					label: 'Wpa Enc',
					default: 'ccmp',
				},
				// unifi-api-ts parameter "vlan_enabled" (optional)
				{
					id: 'vlan_enabled',
					type: 'checkbox',
					label: 'VLAN Enabled',
					default: false,
				},
				// unifi-api-ts parameter "vlan_id" (optional)
				{
					id: 'vlan_id',
					type: 'textinput',
					label: 'VLAN ID',
					default: '',
				},
				// unifi-api-ts parameter "uapsd_enabled" (optional)
				{
					id: 'uapsd_enabled',
					type: 'checkbox',
					label: 'Uapsd Enabled',
					default: false,
				},
				// unifi-api-ts parameter "schedule_enabled" (optional)
				{
					id: 'schedule_enabled',
					type: 'checkbox',
					label: 'Schedule Enabled',
					default: false,
				},
				// unifi-api-ts parameter "schedule" (optional) — a raw JSON payload, typed here as text
				{
					id: 'schedule',
					type: 'textinput',
					label: 'Schedule',
					default: '[]',
					tooltip: 'JSON payload',
					multiline: true,
				},
				// unifi-api-ts parameter "ap_group_ids" (optional) — a string[], entered here as a comma-separated list
				{
					id: 'ap_group_ids',
					type: 'textinput',
					label: 'AP Group IDs',
					default: '',
					tooltip: 'Comma-separated list',
				},
				// unifi-api-ts parameter "additional_payload" (optional) — a raw JSON payload, typed here as text
				{
					id: 'additional_payload',
					type: 'textinput',
					label: 'Additional Payload',
					default: '{}',
					tooltip: 'JSON payload',
					multiline: true,
				},
			],
			callback: async (event) => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: Create WLAN - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Parse the JSON the user typed into "Schedule" before sending it
					const schedulePayload = JSON.parse(event.options.schedule)
					// Split "AP Group IDs" on commas into the array unifi-api-ts expects
					const ap_group_idsList = event.options.ap_group_ids
						.split(',')
						.map((v) => v.trim())
						.filter(Boolean)
					// Parse the JSON the user typed into "Additional Payload" before sending it
					const additional_payloadPayload = JSON.parse(event.options.additional_payload)

					// Run the command against the UniFi console
					const result = await unifi
						.getNetworkManagementAPI()
						.create_wlan(
							event.options.name,
							event.options.x_passphrase,
							event.options.usergroup_id,
							event.options.wlangroup_id,
							event.options.enabled,
							event.options.hide_ssid,
							event.options.is_guest,
							event.options.security,
							event.options.wpa_mode,
							event.options.wpa_enc,
							event.options.vlan_enabled,
							event.options.vlan_id,
							event.options.uapsd_enabled,
							event.options.schedule_enabled,
							schedulePayload,
							ap_group_idsList,
							additional_payloadPayload,
							self.config.site,
						)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: Create WLAN: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: Create WLAN failed: ${message}`)
				}
			},
		},
		// Delete WLAN: Permanently deletes a WLAN configuration, disconnecting all clients on that network.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().delete_wlan(...)
		network_delete_wlan: {
			name: 'Networks: Delete WLAN',
			description: 'Permanently deletes a WLAN configuration, disconnecting all clients on that network.',
			options: [
				// unifi-api-ts parameter "wlan_id" (required)
				{
					id: 'wlan_id',
					type: 'textinput',
					label: 'WLAN ID',
					default: '',
				},
			],
			callback: async (event) => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: Delete WLAN - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi.getNetworkManagementAPI().delete_wlan(event.options.wlan_id, self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: Delete WLAN: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: Delete WLAN failed: ${message}`)
				}
			},
		},
		// Disable WLAN: Temporarily disables or re-enables a WLAN without deleting its configuration.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().disable_wlan(...)
		network_disable_wlan: {
			name: 'Networks: Disable WLAN',
			description: 'Temporarily disables or re-enables a WLAN without deleting its configuration.',
			options: [
				// unifi-api-ts parameter "wlan_id" (required)
				{
					id: 'wlan_id',
					type: 'textinput',
					label: 'WLAN ID',
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
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: Disable WLAN - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi
						.getNetworkManagementAPI()
						.disable_wlan(event.options.wlan_id, event.options.disable, self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: Disable WLAN: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: Disable WLAN failed: ${message}`)
				}
			},
		},
		// List WLAN Groups: Retrieves the WLAN groups used to organize wireless networks across Access Points.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().list_wlan_groups(...)
		network_list_wlan_groups: {
			name: 'Networks: List WLAN Groups',
			description: 'Retrieves the WLAN groups used to organize wireless networks across Access Points.',
			options: [],
			callback: async () => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: List WLAN Groups - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi.getNetworkManagementAPI().list_wlan_groups(self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: List WLAN Groups: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: List WLAN Groups failed: ${message}`)
				}
			},
		},
		// List WLAN Configurations: Retrieves all WLAN (wireless network) configurations, including SSIDs, security settings, and user groups.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().list_wlanconf(...)
		network_list_wlanconf: {
			name: 'Networks: List WLAN Configurations',
			description:
				'Retrieves all WLAN (wireless network) configurations, including SSIDs, security settings, and user groups.',
			options: [],
			callback: async () => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: List WLAN Configurations - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi.getNetworkManagementAPI().list_wlanconf(self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: List WLAN Configurations: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: List WLAN Configurations failed: ${message}`)
				}
			},
		},
		// Set WLAN Settings: Updates WLAN configuration settings by delegating to the underlying set_wlansettings_base method.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().set_wlansettings(...)
		network_set_wlansettings: {
			name: 'Networks: Set WLAN Settings',
			description: 'Updates WLAN configuration settings by delegating to the underlying set_wlansettings_base method.',
			options: [
				// unifi-api-ts parameter "wlan_id" (required)
				{
					id: 'wlan_id',
					type: 'textinput',
					label: 'WLAN ID',
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
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: Set WLAN Settings - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Parse the JSON the user typed into "Payload" before sending it
					const payloadPayload = JSON.parse(event.options.payload)

					// Run the command against the UniFi console
					const result = await unifi
						.getNetworkManagementAPI()
						.set_wlansettings(event.options.wlan_id, payloadPayload, self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: Set WLAN Settings: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: Set WLAN Settings failed: ${message}`)
				}
			},
		},
		// Set WLAN Settings (Base): Directly updates WLAN configuration settings via the UniFi Controller's WLAN configuration API.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().set_wlansettings_base(...)
		network_set_wlansettings_base: {
			name: 'Networks: Set WLAN Settings (Base)',
			description: "Directly updates WLAN configuration settings via the UniFi Controller's WLAN configuration API.",
			options: [
				// unifi-api-ts parameter "wlan_id" (required)
				{
					id: 'wlan_id',
					type: 'textinput',
					label: 'WLAN ID',
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
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: Set WLAN Settings (Base) - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Parse the JSON the user typed into "Payload" before sending it
					const payloadPayload = JSON.parse(event.options.payload)

					// Run the command against the UniFi console
					const result = await unifi
						.getNetworkManagementAPI()
						.set_wlansettings_base(event.options.wlan_id, payloadPayload, self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: Set WLAN Settings (Base): ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: Set WLAN Settings (Base) failed: ${message}`)
				}
			},
		},
		// List Country Codes: Retrieves the supported country codes used for wireless regulatory compliance (allowed channels and power levels).
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().list_country_codes(...)
		network_list_country_codes: {
			name: 'Networks: List Country Codes',
			description:
				'Retrieves the supported country codes used for wireless regulatory compliance (allowed channels and power levels).',
			options: [],
			callback: async () => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: List Country Codes - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi.getNetworkManagementAPI().list_country_codes(self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: List Country Codes: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: List Country Codes failed: ${message}`)
				}
			},
		},
		// List Current Channels: Retrieves the wireless channels currently in use across all Access Points, for channel planning and interference analysis.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().list_current_channels(...)
		network_list_current_channels: {
			name: 'Networks: List Current Channels',
			description:
				'Retrieves the wireless channels currently in use across all Access Points, for channel planning and interference analysis.',
			options: [],
			callback: async () => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: List Current Channels - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi.getNetworkManagementAPI().list_current_channels(self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: List Current Channels: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: List Current Channels failed: ${message}`)
				}
			},
		},
		// Start Spectrum Scan: Initiates a spectrum scan on a specific Access Point to analyze wireless interference and channel utilization.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().spectrum_scan(...)
		network_spectrum_scan: {
			name: 'Networks: Start Spectrum Scan',
			description:
				'Initiates a spectrum scan on a specific Access Point to analyze wireless interference and channel utilization.',
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
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: Start Spectrum Scan - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi.getNetworkManagementAPI().spectrum_scan(event.options.mac, self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: Start Spectrum Scan: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: Start Spectrum Scan failed: ${message}`)
				}
			},
		},
		// Get Spectrum Scan Results: Retrieves the results of a spectrum scan performed on a specific Access Point.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().spectrum_scan_state(...)
		network_spectrum_scan_state: {
			name: 'Networks: Get Spectrum Scan Results',
			description: 'Retrieves the results of a spectrum scan performed on a specific Access Point.',
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
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: Get Spectrum Scan Results - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi.getNetworkManagementAPI().spectrum_scan_state(event.options.mac, self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: Get Spectrum Scan Results: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: Get Spectrum Scan Results failed: ${message}`)
				}
			},
		},
		// Move Device: Moves a UniFi device from its current site to another site.
		// Backed by unifi-api-ts: unifi.getNetworkManagementAPI().move_device(...)
		network_move_device: {
			name: 'Networks: Move Device',
			description: 'Moves a UniFi device from its current site to another site.',
			options: [
				// unifi-api-ts parameter "mac" (required)
				{
					id: 'mac',
					type: 'textinput',
					label: 'MAC',
					default: '',
				},
				// unifi-api-ts parameter "site_id" (required)
				{
					id: 'site_id',
					type: 'textinput',
					label: 'Site ID',
					default: '',
				},
			],
			callback: async (event) => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Networks: Move Device - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi
						.getNetworkManagementAPI()
						.move_device(event.options.mac, event.options.site_id, self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Networks: Move Device: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Networks: Move Device failed: ${message}`)
				}
			},
		},
	}
}
