import type ModuleInstance from '../main.js'
import type { CompanionActionDefinitions } from '@companion-module/base'

// Auto-generated from unifi-api-ts's SiteManagementAPI class: every public method it exposes becomes one
// Companion action below, named "Sites: <action>". Do not hand-edit call sites here without also
// checking unifi-api-ts's SiteManagementAPI.d.ts, since the argument order must match it exactly.

// The shape of each action's options, so Companion's editor UI and the callback below stay in sync.
export type SiteActionsSchema = {
	// Sites: Create Site — options Companion stores for this action's button
	site_create_site: {
		options: {
			description: string
		}
	}
	// Sites: Delete Site — options Companion stores for this action's button
	site_delete_site: {
		options: {
			site_id: string
		}
	}
	// Sites: List Sites — options Companion stores for this action's button
	site_list_sites: {
		options: Record<string, never>
	}
	// Sites: Set Site Name — options Companion stores for this action's button
	site_set_site_name: {
		options: {
			site_name: string
		}
	}
	// Sites: Set Site Connectivity — options Companion stores for this action's button
	site_set_site_connectivity: {
		options: {
			connectivity_id: string
			payload: string
		}
	}
	// Sites: Set Site Country — options Companion stores for this action's button
	site_set_site_country: {
		options: {
			country_id: string
			payload: string
		}
	}
	// Sites: Set Site Guest Access — options Companion stores for this action's button
	site_set_site_guest_access: {
		options: {
			guest_access_id: string
			payload: string
		}
	}
	// Sites: Set Site Locale — options Companion stores for this action's button
	site_set_site_locale: {
		options: {
			locale_id: string
			payload: string
		}
	}
	// Sites: Set Site Management — options Companion stores for this action's button
	site_set_site_mgmt: {
		options: {
			mgmt_id: string
			payload: string
		}
	}
	// Sites: Set Site NTP — options Companion stores for this action's button
	site_set_site_ntp: {
		options: {
			ntp_id: string
			payload: string
		}
	}
	// Sites: Set Site SNMP — options Companion stores for this action's button
	site_set_site_snmp: {
		options: {
			snmp_id: string
			payload: string
		}
	}
	// Sites: List Site Settings — options Companion stores for this action's button
	site_list_settings: {
		options: Record<string, never>
	}
	// Sites: List Self Info — options Companion stores for this action's button
	site_list_self: {
		options: Record<string, never>
	}
	// Sites: Set Super Identity Settings — options Companion stores for this action's button
	site_set_super_identity_settings_base: {
		options: {
			payload: string
		}
	}
	// Sites: Set Super Management Settings — options Companion stores for this action's button
	site_set_super_mgmt_settings_base: {
		options: {
			payload: string
		}
	}
	// Sites: Set Super SMTP Settings — options Companion stores for this action's button
	site_set_super_smtp_settings_base: {
		options: {
			payload: string
		}
	}
	// Sites: Set Site LEDs — options Companion stores for this action's button
	site_site_leds: {
		options: {
			enable: boolean
		}
	}
	// Sites: 5-Minute Site Stats — options Companion stores for this action's button
	site_stat_5minutes_site: {
		options: {
			start: number
			end: number
			attribs: string
		}
	}
	// Sites: Daily Site Stats — options Companion stores for this action's button
	site_stat_daily_site: {
		options: {
			start: number
			end: number
			attribs: string
		}
	}
	// Sites: Hourly Site Stats — options Companion stores for this action's button
	site_stat_hourly_site: {
		options: {
			start: number
			end: number
			attribs: string
		}
	}
	// Sites: Monthly Site Stats — options Companion stores for this action's button
	site_stat_monthly_site: {
		options: {
			start: number
			end: number
			attribs: string
		}
	}
	// Sites: Stat All Sites — options Companion stores for this action's button
	site_stat_sites: {
		options: Record<string, never>
	}
	// Sites: Download Backup — options Companion stores for this action's button
	site_download_backup: {
		options: {
			filepath: string
		}
	}
	// Sites: Generate Backup — options Companion stores for this action's button
	site_generate_backup: {
		options: Record<string, never>
	}
	// Sites: Generate Site Backup — options Companion stores for this action's button
	site_generate_backup_site: {
		options: Record<string, never>
	}
	// Sites: List Backups — options Companion stores for this action's button
	site_list_backups: {
		options: Record<string, never>
	}
	// Sites: Update OS Console — options Companion stores for this action's button
	site_update_os_console: {
		options: Record<string, never>
	}
	// Sites: Get OS Console Update Info — options Companion stores for this action's button
	site_get_update_os_console: {
		options: Record<string, never>
	}
}

export function buildSiteActions(self: ModuleInstance): CompanionActionDefinitions<SiteActionsSchema> {
	return {
		// Create Site: Creates a new site in the UniFi Controller with the specified description.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().create_site(...)
		site_create_site: {
			name: 'Sites: Create Site',
			description: 'Creates a new site in the UniFi Controller with the specified description.',
			options: [
				// unifi-api-ts parameter "description" (required)
				{
					id: 'description',
					type: 'textinput',
					label: 'Description',
					default: '',
				},
			],
			callback: async (event) => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Sites: Create Site - not connected')
					return
				}

				try {
					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().create_site(event.options.description)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Create Site: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Create Site failed: ${message}`)
				}
			},
		},
		// Delete Site: Permanently removes a site and all its associated data from the UniFi Controller.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().delete_site(...)
		site_delete_site: {
			name: 'Sites: Delete Site',
			description: 'Permanently removes a site and all its associated data from the UniFi Controller.',
			options: [
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
					self.log('warn', 'Sites: Delete Site - not connected')
					return
				}

				try {
					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().delete_site(event.options.site_id)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Delete Site: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Delete Site failed: ${message}`)
				}
			},
		},
		// List Sites: Retrieves a list of all sites that the current user has access to.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().list_sites(...)
		site_list_sites: {
			name: 'Sites: List Sites',
			description: 'Retrieves a list of all sites that the current user has access to.',
			options: [],
			callback: async () => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Sites: List Sites - not connected')
					return
				}

				try {
					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().list_sites()
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: List Sites: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: List Sites failed: ${message}`)
				}
			},
		},
		// Set Site Name: Updates the display name/description of the current site.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().set_site_name(...)
		site_set_site_name: {
			name: 'Sites: Set Site Name',
			description: 'Updates the display name/description of the current site.',
			options: [
				// unifi-api-ts parameter "site_name" (required)
				{
					id: 'site_name',
					type: 'textinput',
					label: 'Site Name',
					default: '',
				},
			],
			callback: async (event) => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Sites: Set Site Name - not connected')
					return
				}

				try {
					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().set_site_name(event.options.site_name)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Set Site Name: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Set Site Name failed: ${message}`)
				}
			},
		},
		// Set Site Connectivity: Updates connectivity-related settings for the site such as uplink monitoring and internet connectivity checks.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().set_site_connectivity(...)
		site_set_site_connectivity: {
			name: 'Sites: Set Site Connectivity',
			description:
				'Updates connectivity-related settings for the site such as uplink monitoring and internet connectivity checks.',
			options: [
				// unifi-api-ts parameter "connectivity_id" (required)
				{
					id: 'connectivity_id',
					type: 'textinput',
					label: 'Connectivity ID',
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
					self.log('warn', 'Sites: Set Site Connectivity - not connected')
					return
				}

				try {
					// Parse the JSON the user typed into "Payload" before sending it
					const payloadPayload = JSON.parse(event.options.payload)

					// Run the command against the UniFi console
					const result = await unifi
						.getSiteManagementAPI()
						.set_site_connectivity(event.options.connectivity_id, payloadPayload)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Set Site Connectivity: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Set Site Connectivity failed: ${message}`)
				}
			},
		},
		// Set Site Country: Updates country-specific settings for the site including regulatory domain and channel/power restrictions.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().set_site_country(...)
		site_set_site_country: {
			name: 'Sites: Set Site Country',
			description:
				'Updates country-specific settings for the site including regulatory domain and channel/power restrictions.',
			options: [
				// unifi-api-ts parameter "country_id" (required)
				{
					id: 'country_id',
					type: 'textinput',
					label: 'Country ID',
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
					self.log('warn', 'Sites: Set Site Country - not connected')
					return
				}

				try {
					// Parse the JSON the user typed into "Payload" before sending it
					const payloadPayload = JSON.parse(event.options.payload)

					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().set_site_country(event.options.country_id, payloadPayload)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Set Site Country: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Set Site Country failed: ${message}`)
				}
			},
		},
		// Set Site Guest Access: Updates guest network access settings including portal configuration, authentication methods, and bandwidth limits.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().set_site_guest_access(...)
		site_set_site_guest_access: {
			name: 'Sites: Set Site Guest Access',
			description:
				'Updates guest network access settings including portal configuration, authentication methods, and bandwidth limits.',
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
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Sites: Set Site Guest Access - not connected')
					return
				}

				try {
					// Parse the JSON the user typed into "Payload" before sending it
					const payloadPayload = JSON.parse(event.options.payload)

					// Run the command against the UniFi console
					const result = await unifi
						.getSiteManagementAPI()
						.set_site_guest_access(event.options.guest_access_id, payloadPayload)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Set Site Guest Access: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Set Site Guest Access failed: ${message}`)
				}
			},
		},
		// Set Site Locale: Updates locale-specific settings for the site including language, timezone, and regional preferences.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().set_site_locale(...)
		site_set_site_locale: {
			name: 'Sites: Set Site Locale',
			description:
				'Updates locale-specific settings for the site including language, timezone, and regional preferences.',
			options: [
				// unifi-api-ts parameter "locale_id" (required)
				{
					id: 'locale_id',
					type: 'textinput',
					label: 'Locale ID',
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
					self.log('warn', 'Sites: Set Site Locale - not connected')
					return
				}

				try {
					// Parse the JSON the user typed into "Payload" before sending it
					const payloadPayload = JSON.parse(event.options.payload)

					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().set_site_locale(event.options.locale_id, payloadPayload)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Set Site Locale: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Set Site Locale failed: ${message}`)
				}
			},
		},
		// Set Site Management: Updates general management settings for the site including LED control, SSH access, and SNMP settings.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().set_site_mgmt(...)
		site_set_site_mgmt: {
			name: 'Sites: Set Site Management',
			description:
				'Updates general management settings for the site including LED control, SSH access, and SNMP settings.',
			options: [
				// unifi-api-ts parameter "mgmt_id" (required)
				{
					id: 'mgmt_id',
					type: 'textinput',
					label: 'Mgmt ID',
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
					self.log('warn', 'Sites: Set Site Management - not connected')
					return
				}

				try {
					// Parse the JSON the user typed into "Payload" before sending it
					const payloadPayload = JSON.parse(event.options.payload)

					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().set_site_mgmt(event.options.mgmt_id, payloadPayload)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Set Site Management: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Set Site Management failed: ${message}`)
				}
			},
		},
		// Set Site NTP: Updates Network Time Protocol (NTP) settings for the site including NTP servers and time synchronization preferences.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().set_site_ntp(...)
		site_set_site_ntp: {
			name: 'Sites: Set Site NTP',
			description:
				'Updates Network Time Protocol (NTP) settings for the site including NTP servers and time synchronization preferences.',
			options: [
				// unifi-api-ts parameter "ntp_id" (required)
				{
					id: 'ntp_id',
					type: 'textinput',
					label: 'Ntp ID',
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
					self.log('warn', 'Sites: Set Site NTP - not connected')
					return
				}

				try {
					// Parse the JSON the user typed into "Payload" before sending it
					const payloadPayload = JSON.parse(event.options.payload)

					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().set_site_ntp(event.options.ntp_id, payloadPayload)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Set Site NTP: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Set Site NTP failed: ${message}`)
				}
			},
		},
		// Set Site SNMP: Updates SNMP settings for the site including community strings, access controls, and monitoring configuration.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().set_site_snmp(...)
		site_set_site_snmp: {
			name: 'Sites: Set Site SNMP',
			description:
				'Updates SNMP settings for the site including community strings, access controls, and monitoring configuration.',
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
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Sites: Set Site SNMP - not connected')
					return
				}

				try {
					// Parse the JSON the user typed into "Payload" before sending it
					const payloadPayload = JSON.parse(event.options.payload)

					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().set_site_snmp(event.options.snmp_id, payloadPayload)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Set Site SNMP: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Set Site SNMP failed: ${message}`)
				}
			},
		},
		// List Site Settings: Retrieves all configuration settings for the current site.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().list_settings(...)
		site_list_settings: {
			name: 'Sites: List Site Settings',
			description: 'Retrieves all configuration settings for the current site.',
			options: [],
			callback: async () => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Sites: List Site Settings - not connected')
					return
				}

				try {
					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().list_settings()
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: List Site Settings: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: List Site Settings failed: ${message}`)
				}
			},
		},
		// List Self Info: Retrieves information about the current user/admin session including permissions, roles, and access levels.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().list_self(...)
		site_list_self: {
			name: 'Sites: List Self Info',
			description:
				'Retrieves information about the current user/admin session including permissions, roles, and access levels.',
			options: [],
			callback: async () => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Sites: List Self Info - not connected')
					return
				}

				try {
					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().list_self()
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: List Self Info: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: List Self Info failed: ${message}`)
				}
			},
		},
		// Set Super Identity Settings: Updates controller-wide super administrator identity settings including authentication methods and identity providers.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().set_super_identity_settings_base(...)
		site_set_super_identity_settings_base: {
			name: 'Sites: Set Super Identity Settings',
			description:
				'Updates controller-wide super administrator identity settings including authentication methods and identity providers.',
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
					self.log('warn', 'Sites: Set Super Identity Settings - not connected')
					return
				}

				try {
					// Parse the JSON the user typed into "Payload" before sending it
					const payloadPayload = JSON.parse(event.options.payload)

					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().set_super_identity_settings_base(payloadPayload)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Set Super Identity Settings: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Set Super Identity Settings failed: ${message}`)
				}
			},
		},
		// Set Super Management Settings: Updates controller-wide super administrator management settings including system-wide preferences and access controls.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().set_super_mgmt_settings_base(...)
		site_set_super_mgmt_settings_base: {
			name: 'Sites: Set Super Management Settings',
			description:
				'Updates controller-wide super administrator management settings including system-wide preferences and access controls.',
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
					self.log('warn', 'Sites: Set Super Management Settings - not connected')
					return
				}

				try {
					// Parse the JSON the user typed into "Payload" before sending it
					const payloadPayload = JSON.parse(event.options.payload)

					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().set_super_mgmt_settings_base(payloadPayload)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Set Super Management Settings: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Set Super Management Settings failed: ${message}`)
				}
			},
		},
		// Set Super SMTP Settings: Updates controller-wide super administrator SMTP settings including email server configuration and notification preferences.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().set_super_smtp_settings_base(...)
		site_set_super_smtp_settings_base: {
			name: 'Sites: Set Super SMTP Settings',
			description:
				'Updates controller-wide super administrator SMTP settings including email server configuration and notification preferences.',
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
					self.log('warn', 'Sites: Set Super SMTP Settings - not connected')
					return
				}

				try {
					// Parse the JSON the user typed into "Payload" before sending it
					const payloadPayload = JSON.parse(event.options.payload)

					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().set_super_smtp_settings_base(payloadPayload)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Set Super SMTP Settings: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Set Super SMTP Settings failed: ${message}`)
				}
			},
		},
		// Set Site LEDs: Enables or disables the LEDs on all devices in the site.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().site_leds(...)
		site_site_leds: {
			name: 'Sites: Set Site LEDs',
			description: 'Enables or disables the LEDs on all devices in the site.',
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
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Sites: Set Site LEDs - not connected')
					return
				}

				try {
					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().site_leds(event.options.enable)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Set Site LEDs: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Set Site LEDs failed: ${message}`)
				}
			},
		},
		// 5-Minute Site Stats: Retrieves 5-minute interval statistics for the site including bandwidth usage and client counts over time.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().stat_5minutes_site(...)
		site_stat_5minutes_site: {
			name: 'Sites: 5-Minute Site Stats',
			description:
				'Retrieves 5-minute interval statistics for the site including bandwidth usage and client counts over time.',
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
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Sites: 5-Minute Site Stats - not connected')
					return
				}

				try {
					// Split "Attribs" on commas into the array unifi-api-ts expects
					const attribsList = event.options.attribs
						.split(',')
						.map((v) => v.trim())
						.filter(Boolean)

					// Run the command against the UniFi console
					const result = await unifi
						.getSiteManagementAPI()
						.stat_5minutes_site(event.options.start, event.options.end, attribsList)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: 5-Minute Site Stats: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: 5-Minute Site Stats failed: ${message}`)
				}
			},
		},
		// Daily Site Stats: Retrieves daily aggregated statistics for the site including bandwidth usage and client counts over time.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().stat_daily_site(...)
		site_stat_daily_site: {
			name: 'Sites: Daily Site Stats',
			description:
				'Retrieves daily aggregated statistics for the site including bandwidth usage and client counts over time.',
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
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Sites: Daily Site Stats - not connected')
					return
				}

				try {
					// Split "Attribs" on commas into the array unifi-api-ts expects
					const attribsList = event.options.attribs
						.split(',')
						.map((v) => v.trim())
						.filter(Boolean)

					// Run the command against the UniFi console
					const result = await unifi
						.getSiteManagementAPI()
						.stat_daily_site(event.options.start, event.options.end, attribsList)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Daily Site Stats: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Daily Site Stats failed: ${message}`)
				}
			},
		},
		// Hourly Site Stats: Retrieves hourly aggregated statistics for the site including bandwidth usage and client counts over time.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().stat_hourly_site(...)
		site_stat_hourly_site: {
			name: 'Sites: Hourly Site Stats',
			description:
				'Retrieves hourly aggregated statistics for the site including bandwidth usage and client counts over time.',
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
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Sites: Hourly Site Stats - not connected')
					return
				}

				try {
					// Split "Attribs" on commas into the array unifi-api-ts expects
					const attribsList = event.options.attribs
						.split(',')
						.map((v) => v.trim())
						.filter(Boolean)

					// Run the command against the UniFi console
					const result = await unifi
						.getSiteManagementAPI()
						.stat_hourly_site(event.options.start, event.options.end, attribsList)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Hourly Site Stats: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Hourly Site Stats failed: ${message}`)
				}
			},
		},
		// Monthly Site Stats: Retrieves monthly aggregated statistics for the site including bandwidth usage and client counts over time.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().stat_monthly_site(...)
		site_stat_monthly_site: {
			name: 'Sites: Monthly Site Stats',
			description:
				'Retrieves monthly aggregated statistics for the site including bandwidth usage and client counts over time.',
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
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Sites: Monthly Site Stats - not connected')
					return
				}

				try {
					// Split "Attribs" on commas into the array unifi-api-ts expects
					const attribsList = event.options.attribs
						.split(',')
						.map((v) => v.trim())
						.filter(Boolean)

					// Run the command against the UniFi console
					const result = await unifi
						.getSiteManagementAPI()
						.stat_monthly_site(event.options.start, event.options.end, attribsList)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Monthly Site Stats: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Monthly Site Stats failed: ${message}`)
				}
			},
		},
		// Stat All Sites: Retrieves statistics and information for all accessible sites.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().stat_sites(...)
		site_stat_sites: {
			name: 'Sites: Stat All Sites',
			description: 'Retrieves statistics and information for all accessible sites.',
			options: [],
			callback: async () => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Sites: Stat All Sites - not connected')
					return
				}

				try {
					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().stat_sites()
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Stat All Sites: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Stat All Sites failed: ${message}`)
				}
			},
		},
		// Download Backup: Downloads a backup file's raw data (ArrayBuffer) from the specified filepath.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().download_backup(...)
		site_download_backup: {
			name: 'Sites: Download Backup',
			description: "Downloads a backup file's raw data (ArrayBuffer) from the specified filepath.",
			options: [
				// unifi-api-ts parameter "filepath" (required)
				{
					id: 'filepath',
					type: 'textinput',
					label: 'Filepath',
					default: '',
				},
			],
			callback: async (event) => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Sites: Download Backup - not connected')
					return
				}

				try {
					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().download_backup(event.options.filepath)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Download Backup: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Download Backup failed: ${message}`)
				}
			},
		},
		// Generate Backup: Initiates asynchronous creation of a new backup for the current site.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().generate_backup(...)
		site_generate_backup: {
			name: 'Sites: Generate Backup',
			description: 'Initiates asynchronous creation of a new backup for the current site.',
			options: [],
			callback: async () => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Sites: Generate Backup - not connected')
					return
				}

				try {
					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().generate_backup()
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Generate Backup: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Generate Backup failed: ${message}`)
				}
			},
		},
		// Generate Site Backup: Initiates asynchronous creation of a new backup specifically for the current site (functionally identical to generate_backup).
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().generate_backup_site(...)
		site_generate_backup_site: {
			name: 'Sites: Generate Site Backup',
			description:
				'Initiates asynchronous creation of a new backup specifically for the current site (functionally identical to generate_backup).',
			options: [],
			callback: async () => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Sites: Generate Site Backup - not connected')
					return
				}

				try {
					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().generate_backup_site()
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Generate Site Backup: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Generate Site Backup failed: ${message}`)
				}
			},
		},
		// List Backups: Retrieves a list of all available backup files for the current site.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().list_backups(...)
		site_list_backups: {
			name: 'Sites: List Backups',
			description: 'Retrieves a list of all available backup files for the current site.',
			options: [],
			callback: async () => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Sites: List Backups - not connected')
					return
				}

				try {
					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().list_backups()
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: List Backups: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: List Backups failed: ${message}`)
				}
			},
		},
		// Update OS Console: Initiates an update of the UniFi OS console/controller software.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().update_os_console(...)
		site_update_os_console: {
			name: 'Sites: Update OS Console',
			description: 'Initiates an update of the UniFi OS console/controller software.',
			options: [],
			callback: async () => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Sites: Update OS Console - not connected')
					return
				}

				try {
					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().update_os_console()
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Update OS Console: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Update OS Console failed: ${message}`)
				}
			},
		},
		// Get OS Console Update Info: Retrieves information about available UniFi OS console/controller updates including version and release notes.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().get_update_os_console(...)
		site_get_update_os_console: {
			name: 'Sites: Get OS Console Update Info',
			description:
				'Retrieves information about available UniFi OS console/controller updates including version and release notes.',
			options: [],
			callback: async () => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Sites: Get OS Console Update Info - not connected')
					return
				}

				try {
					// Run the command against the UniFi console
					const result = await unifi.getSiteManagementAPI().get_update_os_console()
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Sites: Get OS Console Update Info: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Get OS Console Update Info failed: ${message}`)
				}
			},
		},
	}
}
