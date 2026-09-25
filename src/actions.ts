import { InstanceStatus, type DropdownChoice } from '@companion-module/base'
import type ModuleInstance from './main.js'
import { buildUtilityActions, DEVICE_TYPE_LABELS, type UtilityActionsSchema } from './actions/utility.js'

// Live dropdown choices built from the cached device inventory (self.devices, refreshed every 60s — see
// ModuleInstance.refreshInventory in main.ts), same pattern as the Utility action's device picker. Every
// action below rebuilds its choices fresh each time UpdateActions() runs, so a refresh keeps them in sync.
// idField picks whether each choice's value is the device's MAC or its internal _id, since different
// unifi-api-ts endpoints key on one or the other (fire-and-forget commands use MAC, REST config endpoints
// like led_override use _id) — filterType narrows to one UniFiDevice.type when an action only ever
// applies to one kind of device (e.g. Power Cycle Switch Port only makes sense on a switch).
function deviceChoices(self: ModuleInstance, idField: 'mac' | '_id', filterType?: string): DropdownChoice[] {
	return self.devices
		.filter((d) => !filterType || d.type === filterType)
		.map((d) => ({
			id: d[idField],
			label: `${d.name ?? d.model} (${DEVICE_TYPE_LABELS[d.type] ?? d.type}) — ${d.mac}`,
		}))
}

// Same, for the live client inventory (self.clients).
function clientChoices(self: ModuleInstance): DropdownChoice[] {
	return self.clients.map((c) => ({
		id: c.mac,
		label: `${c.name ?? c.hostname ?? c.mac} — ${c.mac}`,
	}))
}

// The Network application is the only UniFi application unifi-api-ts talks to — it has no support for
// Protect, Access, Talk, etc, so those can't be added here without a different API client.
//
// Deliberately a short, curated list of live/operational actions (device restarts, port power-cycling,
// LED toggles, a diagnostic scan, alarm/DPI resets) — not a full unifi-api-ts surface. Left out on
// purpose: one-time setup/provisioning actions (adoption, renaming, explicit guest auth/block),
// super-high-level operations (migration, firmware/OS updates, firewall edits, SNMP, identity), any
// high-detail settings creation (DDNS, VLAN/WLAN/network config), and user/admin management entirely.
//
// Grouped below by UniFi Network sub-system, matching each action's "<Category>: <action>" name prefix.
export type ActionsSchema = {
	test_connection: {
		options: Record<string, never>
	}

	// ─── Clients ─── (unifi-api-ts: ClientManagementAPI)
	client_reconnect_sta: {
		options: {
			mac: string
		}
	}

	// ─── Devices ─── (unifi-api-ts: DeviceManagementAPI)
	device_disable_ap: {
		options: {
			ap_id: string
			disable: boolean
		}
	}
	device_led_override: {
		options: {
			device_id: string
			override_mode: string
		}
	}
	device_locate_ap: {
		options: {
			mac: string
			enable: boolean
		}
	}
	device_power_cycle_switch_port: {
		options: {
			mac: string
			port_idx: number
		}
	}
	//device_reboot_cloudkey: {
	//	options: Record<string, never>
	//}
	device_restart_device: {
		options: {
			macs: string[]
			reboot_type: string
		}
	}

	// ─── Sites ─── (unifi-api-ts: SiteManagementAPI)
	site_site_leds: {
		options: {
			enable: boolean
		}
	}

	// ─── Statistics ─── (unifi-api-ts: StatisticsAPI)
	stats_archive_alarm: {
		options: {
			alarm_id: string
		}
	}
} & UtilityActionsSchema

export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		test_connection: {
			name: 'Test Connection',
			options: [],
			callback: async () => {
				if (!self.unifi) {
					self.log('warn', 'Test Connection: not connected, attempting to reconnect')
					await self.connectToUnifi()
					return
				}

				try {
					const [sysinfo] = await self.unifi.statSysinfo()
					self.log(
						'info',
						`Test Connection: reached UniFi console "${sysinfo?.name ?? sysinfo?.hostname ?? self.config.host}" (version ${sysinfo?.version ?? 'unknown'})`,
					)
					self.updateStatus(InstanceStatus.Ok)
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Test Connection failed: ${message}`)
					self.updateStatus(InstanceStatus.ConnectionFailure, message)
				}
			},
		},

		// ────────────────────────────────────────────────────────────────────────────
		// Clients — unifi-api-ts: ClientManagementAPI
		// ────────────────────────────────────────────────────────────────────────────

		// Reconnect Client: Kicks a connected client device and forces it to reconnect to the network.
		// Backed by unifi-api-ts: unifi.getClientManagementAPI().reconnect_sta(...)
		client_reconnect_sta: {
			name: 'Clients: Reconnect Client',
			description:
				"Use this to force a currently connected device to drop and immediately reconnect to Wi-Fi, useful when a device seems 'stuck' or is having connectivity trouble mid-event. This only affects the device's current session; it does not block or unblock it.",
			options: [
				// unifi-api-ts parameter "mac" (required)
				{
					id: 'mac',
					type: 'dropdown',
					label: 'Client',
					tooltip:
						"Pick a client from the list (pulled live from the console) — or type a MAC address directly, e.g. aa:bb:cc:dd:ee:ff, if it isn't in the list yet.",
					choices: clientChoices(self),
					default: '',
					allowCustom: true,
				},
			],
			callback: async (event) => {
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Clients: Reconnect Client - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					const result = await unifi.getClientManagementAPI().reconnect_sta(self.config.site, event.options.mac)
					self.log('debug', `Clients: Reconnect Client: ${JSON.stringify(result)}`)
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Clients: Reconnect Client failed: ${message}`)
				}
			},
		},

		// ────────────────────────────────────────────────────────────────────────────
		// Devices — unifi-api-ts: DeviceManagementAPI
		// ────────────────────────────────────────────────────────────────────────────

		// Disable Access Point: Disables or enables an Access Point device; when disabled the AP stops broadcasting wireless networks.
		// Backed by unifi-api-ts: unifi.getDeviceManagementAPI().disable_ap(...)
		device_disable_ap: {
			name: 'Devices: Disable Access Point',
			description:
				"Use this to turn a Wi-Fi access point's radios off or back on without removing it from the controller. When disabled, that AP stops broadcasting Wi-Fi and anyone connected to it gets dropped; run it again with disable turned off to bring it back. Handy for quickly killing a problem AP during a service without deleting it.",
			options: [
				// unifi-api-ts parameter "ap_id" (required) — this endpoint keys on the device's internal _id, not its MAC
				{
					id: 'ap_id',
					type: 'dropdown',
					label: 'Access Point',
					tooltip:
						"Pick an access point from the list (pulled live from the console) — or type its internal device ID directly, if it isn't in the list yet.",
					choices: deviceChoices(self, '_id', 'uap'),
					default: '',
					allowCustom: true,
				},
				// unifi-api-ts parameter "disable" (required)
				{
					id: 'disable',
					type: 'checkbox',
					label: 'Disable',
					tooltip: "Set to true to turn the AP's Wi-Fi off, or false to turn it back on.",
					default: false,
				},
			],
			callback: async (event) => {
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Devices: Disable Access Point - not connected')
					return
				}

				try {
					const result = await unifi.getDeviceManagementAPI().disable_ap(event.options.ap_id, event.options.disable)
					self.log('debug', `Devices: Disable Access Point: ${JSON.stringify(result)}`)
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Devices: Disable Access Point failed: ${message}`)
				}
			},
		},
		// Override LED: Sets the LED override mode (on, off, or default) for a device.
		// Backed by unifi-api-ts: unifi.getDeviceManagementAPI().led_override(...)
		device_led_override: {
			name: 'Devices: Override LED',
			description:
				"Use this to force a device's status LED to stay off, stay on, or return to the controller's normal/default behavior. Handy for darkening a device's LED in a sanctuary or stage area where a blinking or glowing light is distracting, or restoring it to normal afterward.",
			options: [
				// unifi-api-ts parameter "device_id" (required) — this endpoint keys on the device's internal _id, not its MAC
				{
					id: 'device_id',
					type: 'dropdown',
					label: 'Device',
					tooltip:
						"Pick a device from the list (pulled live from the console) — or type its internal device ID directly, if it isn't in the list yet.",
					choices: deviceChoices(self, '_id'),
					default: '',
					allowCustom: true,
				},
				// unifi-api-ts parameter "override_mode" (required) — one of: off, on, default
				{
					id: 'override_mode',
					type: 'dropdown',
					label: 'Override Mode',
					tooltip:
						"Type exactly 'off' to force the LED off, 'on' to force it on, or 'default' to let the controller control it normally.",
					choices: [
						{ id: 'off', label: 'off' },
						{ id: 'on', label: 'on' },
						{ id: 'default', label: 'default' },
					],
					default: 'off',
				},
			],
			callback: async (event) => {
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Devices: Override LED - not connected')
					return
				}

				try {
					// Narrow the dropdown's plain string back to the exact literal type unifi-api-ts expects
					const overrideModeValue = event.options.override_mode as 'off' | 'on' | 'default'

					const result = await unifi.getDeviceManagementAPI().led_override(event.options.device_id, overrideModeValue)
					self.log('debug', `Devices: Override LED: ${JSON.stringify(result)}`)
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Devices: Override LED failed: ${message}`)
				}
			},
		},
		// Locate Access Point: Enables or disables the locate LED feature on an Access Point to help physically locate the device.
		// Backed by unifi-api-ts: unifi.getDeviceManagementAPI().locate_ap(...)
		device_locate_ap: {
			name: 'Devices: Locate Access Point',
			description:
				"Use this to make an access point's LED blink so you can physically find it in a rack, ceiling, or storage room — press it again with enable turned off to stop the blinking. This has no effect on Wi-Fi service; it's purely a 'find the box' helper.",
			options: [
				// unifi-api-ts parameter "mac" (required)
				{
					id: 'mac',
					type: 'dropdown',
					label: 'Access Point',
					tooltip:
						"Pick the access point to locate from the list (pulled live from the console) — or type its MAC address directly, e.g. aa:bb:cc:dd:ee:ff, if it isn't in the list yet.",
					choices: deviceChoices(self, 'mac', 'uap'),
					default: '',
					allowCustom: true,
				},
				// unifi-api-ts parameter "enable" (required)
				{
					id: 'enable',
					type: 'checkbox',
					label: 'Enable',
					tooltip: 'Set to true to start the LED blinking, or false to stop it.',
					default: false,
				},
			],
			callback: async (event) => {
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Devices: Locate Access Point - not connected')
					return
				}

				try {
					const result = await unifi.getDeviceManagementAPI().locate_ap(event.options.mac, event.options.enable)
					self.log('debug', `Devices: Locate Access Point: ${JSON.stringify(result)}`)
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Devices: Locate Access Point failed: ${message}`)
				}
			},
		},
		// Power Cycle Switch Port: Power cycles a specific port on a UniFi switch, turning it off and back on to reset connected devices.
		// Backed by unifi-api-ts: unifi.getDeviceManagementAPI().power_cycle_switch_port(...)
		device_power_cycle_switch_port: {
			name: 'Devices: Power Cycle Switch Port',
			description:
				'Use this to turn a single switch port off and back on, which power-cycles (reboots) whatever is plugged into it — like a PoE camera, AP, or other gear — without touching the rest of the switch. Great for remotely resetting a frozen device without walking over to unplug it. Anything on that port briefly loses power and network connection.',
			options: [
				// unifi-api-ts parameter "mac" (required)
				{
					id: 'mac',
					type: 'dropdown',
					label: 'Switch',
					tooltip:
						"Pick the switch from the list (pulled live from the console) — or type its MAC address directly, e.g. aa:bb:cc:dd:ee:ff, if it isn't in the list yet. This is the switch itself, not the connected device plugged into it.",
					choices: deviceChoices(self, 'mac', 'usw'),
					default: '',
					allowCustom: true,
				},
				// unifi-api-ts parameter "port_idx" (required)
				{
					id: 'port_idx',
					type: 'number',
					label: 'Port Idx',
					tooltip: 'The port number as labeled on the switch or shown in the UniFi app, e.g. 8.',
					default: 0,
					min: 0,
					max: 999999999,
				},
			],
			callback: async (event) => {
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Devices: Power Cycle Switch Port - not connected')
					return
				}

				try {
					const result = await unifi
						.getDeviceManagementAPI()
						.power_cycle_switch_port(event.options.mac, event.options.port_idx)
					self.log('debug', `Devices: Power Cycle Switch Port: ${JSON.stringify(result)}`)
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Devices: Power Cycle Switch Port failed: ${message}`)
				}
			},
		},
		// Reboot Cloud Key: Reboots the UniFi Cloud Key device, temporarily interrupting controller services.
		// Backed by unifi-api-ts: unifi.getDeviceManagementAPI().reboot_cloudkey(...)
		/*device_reboot_cloudkey: {
			name: 'Devices: Reboot Cloud Key',
			description:
				"Use this to reboot the UniFi Cloud Key (the controller hardware itself), not an individual AP or switch. This briefly takes the whole controller offline, so you'll lose access to the UniFi app and dashboards for a minute or two, though already-configured devices keep passing network traffic. Use only when the controller itself is misbehaving, not for routine device issues.",
			options: [],
			callback: async () => {
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Devices: Reboot Cloud Key - not connected')
					return
				}

				try {
					const result = await unifi.getDeviceManagementAPI().reboot_cloudkey()
					self.log('debug', `Devices: Reboot Cloud Key: ${JSON.stringify(result)}`)
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Devices: Reboot Cloud Key failed: ${message}`)
				}
			},
		},
		*/
		// Restart Device: Restarts one or more UniFi devices, either soft (just the device) or hard (also power-cycles its PoE ports).
		// Backed by unifi-api-ts: unifi.getDeviceManagementAPI().restart_device(...)
		device_restart_device: {
			name: 'Devices: Restart Device',
			description:
				"Use this to reboot one or more devices — the safest way to fix a device that's acting up. A 'soft' restart reboots just the device. A 'hard' restart only applies to devices with PoE ports (PoE switches, some gateways) and also power-cycles every PoE port on them, so everything they power (APs, cameras, phones) restarts too. Anyone connected through that device (Wi-Fi clients on an AP, wired gear on a switch) briefly loses connection while it restarts, usually well under a minute.",
			options: [
				// unifi-api-ts parameter "macs" (required) — a string | string[]
				{
					id: 'macs',
					type: 'multidropdown',
					label: 'Devices',
					tooltip:
						"Pick one or more devices from the list (pulled live from the console) to restart at once. Multi-select fields can't accept free-text entry, so a device needs to be known to the console — usually within 60 seconds of coming online — before it shows up here.",
					choices: deviceChoices(self, 'mac'),
					default: [],
				},
				// unifi-api-ts parameter "reboot_type" (optional) — one of: soft, hard
				{
					id: 'reboot_type',
					type: 'dropdown',
					label: 'Reboot Type',
					tooltip:
						"'soft' (default) restarts just the device. 'hard' also power-cycles every PoE port on a PoE switch or gateway, so everything it powers goes down and restarts too.",
					choices: [
						{ id: 'soft', label: 'soft' },
						{ id: 'hard', label: 'hard' },
					],
					default: 'soft',
				},
			],
			callback: async (event) => {
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Devices: Restart Device - not connected')
					return
				}

				try {
					// Narrow the dropdown's plain string back to the exact literal type unifi-api-ts expects
					const rebootTypeValue = event.options.reboot_type as 'soft' | 'hard'

					const result = await unifi.getDeviceManagementAPI().restart_device(event.options.macs, rebootTypeValue)
					self.log('debug', `Devices: Restart Device: ${JSON.stringify(result)}`)
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Devices: Restart Device failed: ${message}`)
				}
			},
		},

		// ────────────────────────────────────────────────────────────────────────────
		// Sites — unifi-api-ts: SiteManagementAPI
		// ────────────────────────────────────────────────────────────────────────────

		// Set Site LEDs: Enables or disables the LEDs on all devices in the site.
		// Backed by unifi-api-ts: unifi.getSiteManagementAPI().site_leds(...)
		site_site_leds: {
			name: 'Sites: Set Site LEDs',
			description:
				"Use this to turn the status LEDs on all of the site's UniFi devices on or off, for example to dim distracting lights during a service or dark stage environment, or to turn them back on so you can visually spot devices by their blinking lights. This is a safe, instantly-reversible cosmetic setting with no effect on network performance — set up two buttons, one for on and one for off, using different values.",
			options: [
				// unifi-api-ts parameter "enable" (required)
				{
					id: 'enable',
					type: 'checkbox',
					label: 'Enable',
					tooltip: 'Set to true to turn all site device LEDs on, or false to turn them off.',
					default: false,
				},
			],
			callback: async (event) => {
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Sites: Set Site LEDs - not connected')
					return
				}

				try {
					const result = await unifi.getSiteManagementAPI().site_leds(event.options.enable)
					self.log('debug', `Sites: Set Site LEDs: ${JSON.stringify(result)}`)
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Sites: Set Site LEDs failed: ${message}`)
				}
			},
		},

		// ────────────────────────────────────────────────────────────────────────────
		// Statistics — unifi-api-ts: StatisticsAPI
		// ────────────────────────────────────────────────────────────────────────────

		// Archive Alarm: Archives (dismisses) a specific alarm by ID, or all current alarms if no ID is provided.
		// Backed by unifi-api-ts: unifi.getStatisticsAPI().archive_alarm(...)
		stats_archive_alarm: {
			name: 'Statistics: Archive Alarm',
			description:
				"Use this to dismiss (archive) alarms in the controller so they no longer show as active. Leave the field blank to clear all current alarms at once, or enter one alarm's ID to clear just that one; use this after you've already reviewed the alarm and don't need it flagged anymore.",
			options: [
				// unifi-api-ts parameter "alarm_id" (optional) — stays free text: unlike devices/clients, the
				// module doesn't keep a live cache of alarms to build a picker from, and alarm IDs aren't
				// something you'd typically know ahead of time anyway (this is normally left blank).
				{
					id: 'alarm_id',
					type: 'textinput',
					label: 'Alarm ID',
					tooltip:
						'The ID of one specific alarm to dismiss, e.g. 507f1f77bcf86cd799439011. Leave blank to dismiss (archive) all current alarms at once.',
					default: '',
				},
			],
			callback: async (event) => {
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Statistics: Archive Alarm - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					const result = await unifi.getStatisticsAPI().archive_alarm(event.options.alarm_id, self.config.site)
					self.log('debug', `Statistics: Archive Alarm: ${JSON.stringify(result)}`)
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Statistics: Archive Alarm failed: ${message}`)
				}
			},
		},
		// See src/actions/utility.ts for the raw-command escape hatch.
		...buildUtilityActions(self),
	})
}
