import type { CompanionActionDefinitions } from '@companion-module/base'
import type ModuleInstance from '../main.js'

// Utility — unifi-api-ts: UniFiClient.customApiRequest (UtilityAPI)
export type UtilityActionsSchema = {
	utility_send_device_command: {
		options: {
			target_type: string
			client_mac: string
			client_command: string
			device_mac: string
			device_command: string
			port_idx: number
			minutes: number
			reboot_type: string
			outlet_idx: number
			outlet_on: boolean
		}
	}
}

// Friendlier labels for unifi-api-ts's UniFiDevice.type codes, used in the device picker below.
// "usp" (UPS/UPS Pro) isn't in unifi-api-ts's own typed union — that library predates the product —
// but the live console reports it as "usp", confirmed against community integrations that already
// support the UPS-2U-Pro (see the tooltip on the outlet fields below for details/caveats).
export const DEVICE_TYPE_LABELS: Record<string, string> = {
	uap: 'Access Point',
	usw: 'Switch',
	ugw: 'Gateway',
	usg: 'Gateway',
	udm: 'Dream Machine',
	uxg: 'UXG Gateway',
	usp: 'UPS',
}

// Verified against unifi-api-ts's ClientManagementAPI/DeviceManagementAPI source: which endpoint each
// command goes to, and whether it takes a single "mac" or a "macs" array.
const COMMAND_SPEC: Record<string, { endpoint: string; macField: 'mac' | 'macs' }> = {
	'block-sta': { endpoint: 'cmd/stamgr', macField: 'mac' },
	'unblock-sta': { endpoint: 'cmd/stamgr', macField: 'mac' },
	'kick-sta': { endpoint: 'cmd/stamgr', macField: 'mac' },
	'forget-sta': { endpoint: 'cmd/stamgr', macField: 'macs' },
	'authorize-guest': { endpoint: 'cmd/stamgr', macField: 'mac' },
	'unauthorize-guest': { endpoint: 'cmd/stamgr', macField: 'mac' },
	adopt: { endpoint: 'cmd/devmgr', macField: 'macs' },
	restart: { endpoint: 'cmd/devmgr', macField: 'macs' },
	'power-cycle': { endpoint: 'cmd/devmgr', macField: 'mac' },
	'force-provision': { endpoint: 'cmd/devmgr', macField: 'macs' },
	'delete-device': { endpoint: 'cmd/sitemgr', macField: 'mac' },
	'set-locate': { endpoint: 'cmd/devmgr', macField: 'mac' },
	'unset-locate': { endpoint: 'cmd/devmgr', macField: 'mac' },
}

// Device commands that only make sense for a specific UniFiDevice.type — checked against the cached
// inventory at run time, since Companion can't filter one field's choices by another field's value.
// "set-outlet" is NOT here: UniFi's SmartPower family doesn't share one type code — the UPS/UPS Pro
// report "usp", but UniFi's own PHP client (github.com/Art-of-WiFi/UniFi-API-client, the project
// unifi-api-ts is ported from) confirms the PDU Pro reports "usw", the *same* code as an ordinary
// switch, and its outlet detection is by model string ("USPPDUP", "UP1" for USP-Plug, likely more for
// USP-Strip that we haven't confirmed). A type/model allowlist would be both wrong (blocks real PDUs)
// and incomplete (misses future SmartPower form factors) — so "set-outlet" is instead gated by
// whether the device actually reports outlets at all, checked directly against real data below.
const DEVICE_COMMAND_REQUIRES_TYPE: Record<string, string> = {
	'power-cycle': 'usw',
}

// UniFi's raw device-state payload for anything in the SmartPower family (UPS, UPS Pro, PDU Pro,
// Smart Plug, Smart Strip, ...) includes an outlet_table (index/relay_state/etc per outlet) that
// unifi-api-ts doesn't model in its UniFiDevice type. This is the minimal shape used both to detect
// outlet capability and to read current outlet state before writing an override (see "set-outlet" below).
interface OutletTableEntry {
	index: number
	relay_state?: boolean
}

export function buildUtilityActions(self: ModuleInstance): CompanionActionDefinitions<UtilityActionsSchema> {
	return {
		// Send Device Command: pick a client or device from a live-updating list pulled from the console
		// (self.devices/self.clients, refreshed every 60s by ModuleInstance.refreshInventory), then what
		// to do to it — this action builds the correct UniFi API request internally, so no MAC/path/
		// payload typing is required. Backed by unifi-api-ts: unifi.customApiRequest(...), with the exact
		// endpoint/payload shape per command verified against unifi-api-ts's own source (see COMMAND_SPEC).
		utility_send_device_command: {
			name: 'Utility: Send Device Command',
			description:
				"Runs a command against a client device (phone, laptop, etc) or a UniFi infrastructure device (AP, switch, gateway) — pick which kind below, then pick the specific one from the list and what to do to it. The list is pulled live from the console and refreshes automatically; if something you're looking for isn't in it yet, you can still type its MAC address directly. Some commands need one extra field, which only appears once that command is selected.",
			options: [
				{
					id: 'target_type',
					type: 'dropdown',
					label: 'Target Type',
					tooltip:
						'Whether to target a client device (phone, laptop, etc) or a piece of UniFi infrastructure (AP, switch, gateway).',
					choices: [
						{ id: 'client', label: 'Client Device (phone, laptop, etc)' },
						{ id: 'device', label: 'Infrastructure Device (AP, switch, gateway)' },
					],
					default: 'client',
					disableAutoExpression: true,
				},
				{
					id: 'client_mac',
					type: 'dropdown',
					label: 'Client',
					tooltip:
						"Pick a client from the list (pulled live from the console) — or type a MAC address directly, e.g. aa:bb:cc:dd:ee:ff, if it isn't in the list yet.",
					choices: self.clients.map((c) => ({
						id: c.mac,
						label: `${c.name ?? c.hostname ?? c.mac} — ${c.mac}`,
					})),
					default: '',
					allowCustom: true,
					isVisibleExpression: '$(options:target_type) == "client"',
				},
				{
					id: 'client_command',
					type: 'dropdown',
					label: 'Client Command',
					tooltip: 'What to do to the client selected above.',
					choices: [
						{ id: 'block-sta', label: 'Block Client' },
						{ id: 'unblock-sta', label: 'Unblock Client' },
						{ id: 'kick-sta', label: 'Reconnect Client (kick and rejoin)' },
						{ id: 'forget-sta', label: 'Forget Client (remove from known clients)' },
						{ id: 'authorize-guest', label: 'Authorize Guest (needs Guest Minutes below)' },
						{ id: 'unauthorize-guest', label: 'Unauthorize Guest' },
					],
					default: 'kick-sta',
					disableAutoExpression: true,
					isVisibleExpression: '$(options:target_type) == "client"',
				},
				{
					id: 'device_mac',
					type: 'dropdown',
					label: 'Device',
					tooltip:
						"Pick a device from the list (pulled live from the console) — or type a MAC address directly, e.g. aa:bb:cc:dd:ee:ff, if it isn't in the list yet.",
					choices: self.devices.map((d) => ({
						id: d.mac,
						label: `${d.name ?? d.model} (${DEVICE_TYPE_LABELS[d.type] ?? d.type}) — ${d.mac}`,
					})),
					default: '',
					allowCustom: true,
					isVisibleExpression: '$(options:target_type) == "device"',
				},
				{
					id: 'device_command',
					type: 'dropdown',
					label: 'Device Command',
					tooltip:
						'What to do to the device selected above. "Power Cycle Switch Port" only works on switches, and "Set Outlet Power" only works on a UniFi SmartPower device (UPS, UPS Pro, PDU Pro, Smart Plug, Smart Strip, etc) — picking either for a device that doesn\'t support it is rejected before anything is sent.',
					choices: [
						{ id: 'restart', label: 'Restart Device (needs Reboot Type below)' },
						{ id: 'power-cycle', label: 'Power Cycle Switch Port (needs Switch Port below; switches only)' },
						{ id: 'force-provision', label: 'Force Provision Device' },
						{ id: 'set-locate', label: 'Locate Device (start blinking LED)' },
						{ id: 'unset-locate', label: 'Locate Device (stop blinking LED)' },
						{
							id: 'set-outlet',
							label: 'Set Outlet Power (needs Outlet Number/Outlet On below; SmartPower devices only)',
						},
					],
					default: 'restart',
					disableAutoExpression: true,
					isVisibleExpression: '$(options:target_type) == "device"',
				},
				{
					id: 'port_idx',
					type: 'number',
					label: 'Switch Port',
					tooltip: 'The port number as labeled on the switch or shown in the UniFi app, e.g. 8.',
					default: 1,
					min: 1,
					max: 999999999,
					isVisibleExpression: '$(options:device_command) == "power-cycle"',
				},
				{
					id: 'reboot_type',
					type: 'dropdown',
					label: 'Reboot Type',
					tooltip:
						"'soft' is a normal graceful reboot; 'hard' forces a rougher reboot for a device that's unresponsive.",
					choices: [
						{ id: 'soft', label: 'soft (normal reboot)' },
						{ id: 'hard', label: 'hard (force, for unresponsive devices)' },
					],
					default: 'soft',
					isVisibleExpression: '$(options:device_command) == "restart"',
				},
				{
					id: 'minutes',
					type: 'number',
					label: 'Guest Minutes',
					tooltip: 'How long the guest should have access, in minutes, e.g. 60 for one hour.',
					default: 60,
					min: 1,
					max: 999999999,
					isVisibleExpression: '$(options:client_command) == "authorize-guest"',
				},
				{
					id: 'outlet_idx',
					type: 'number',
					label: 'Outlet Number',
					tooltip:
						"Which outlet on the device to control. Numbering isn't confirmed for every SmartPower model — start with 1, then check the physical outlet (or the UniFi app) to see which one actually switched, and adjust if it wasn't the one you expected. Not every outlet on every model can be switched independently — some are metering-only.",
					default: 1,
					min: 0,
					max: 999999999,
					isVisibleExpression: '$(options:device_command) == "set-outlet"',
				},
				{
					id: 'outlet_on',
					type: 'checkbox',
					label: 'Outlet On',
					tooltip: 'Set to true to power the outlet on, or false to power it off.',
					default: true,
					isVisibleExpression: '$(options:device_command) == "set-outlet"',
				},
			],
			callback: async (event) => {
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Utility: Send Device Command - not connected')
					return
				}

				try {
					const targetType = event.options.target_type
					const mac = (targetType === 'client' ? event.options.client_mac : event.options.device_mac)
						.trim()
						.toLowerCase()
					if (!mac) {
						throw new Error(`${targetType === 'client' ? 'Client' : 'Device'} is required`)
					}
					const command = targetType === 'client' ? event.options.client_command : event.options.device_command

					if (targetType === 'device') {
						const requiredType = DEVICE_COMMAND_REQUIRES_TYPE[command]
						const device = self.devices.find((d) => d.mac.toLowerCase() === mac)
						if (requiredType && device && device.type !== requiredType) {
							throw new Error(
								`"${device.name ?? mac}" is a ${DEVICE_TYPE_LABELS[device.type] ?? device.type}, not a ${DEVICE_TYPE_LABELS[requiredType] ?? requiredType} — this command doesn't apply to it`,
							)
						}
						// "set-outlet" has no single type/model to check against (see the comment on
						// DEVICE_COMMAND_REQUIRES_TYPE above) — gate it on whether the cached snapshot of this
						// device actually reports outlets. This is a friendly pre-flight check only, using the
						// up-to-60s-stale inventory cache; the callback re-verifies against a fresh fetch below
						// before actually writing anything.
						if (command === 'set-outlet' && device) {
							const cachedOutlets = (device as typeof device & { outlet_table?: OutletTableEntry[] }).outlet_table
							if (!cachedOutlets || cachedOutlets.length === 0) {
								throw new Error(
									`"${device.name ?? mac}" doesn't report any controllable outlets — Set Outlet Power only works on UniFi SmartPower devices (UPS, UPS Pro, PDU Pro, Smart Plug, Smart Strip, etc)`,
								)
							}
						}
					}

					// UniFi OS consoles (UDM/UDR/Cloud Gateway) serve the Network app behind a "/proxy/network"
					// prefix. unifi-api-ts's own custom_api_request retries with that prefix automatically
					// when the plain path fails, but this module calls the flattened client method instead,
					// which skips that fallback — so this helper redoes it for every request below.
					const sendRequest = async (path: string, method: 'POST' | 'PUT', payload: unknown): Promise<unknown> => {
						try {
							return await unifi.customApiRequest(path, method, payload)
						} catch (firstError) {
							if (path.includes('/api/s/') && !path.includes('/proxy/network')) {
								return await unifi.customApiRequest(path.replace('/api/s/', '/proxy/network/api/s/'), method, payload)
							}
							throw firstError
						}
					}

					let result: unknown
					if (command === 'set-outlet') {
						// Outlet control is a device *config* change (like led_override/port_overrides), not a
						// fire-and-forget "cmd" — it goes through a REST PUT of the device's config, keyed by
						// its internal _id (not MAC), and must include every other outlet's current state or
						// the controller may clear their overrides. So: fetch a fresh snapshot of this device
						// right before writing, rather than trusting the up-to-60s-stale inventory cache.
						const [freshDevice] = await unifi.listDevices(mac)
						const deviceWithOutlets = freshDevice as
							((typeof self.devices)[number] & { outlet_table?: OutletTableEntry[] }) | undefined
						if (!deviceWithOutlets) {
							throw new Error(`No device found with MAC ${mac}`)
						}
						if (!deviceWithOutlets.outlet_table || deviceWithOutlets.outlet_table.length === 0) {
							throw new Error(
								`"${deviceWithOutlets.name ?? mac}" doesn't report any controllable outlets — Set Outlet Power only works on UniFi SmartPower devices (UPS, UPS Pro, PDU Pro, Smart Plug, Smart Strip, etc)`,
							)
						}

						const outletIdx = event.options.outlet_idx
						const outletOn = event.options.outlet_on
						const currentOutlets = deviceWithOutlets.outlet_table ?? []
						const overrides = currentOutlets.map((o) => ({
							index: o.index,
							relay_state: o.index === outletIdx ? outletOn : (o.relay_state ?? true),
						}))
						if (!overrides.some((o) => o.index === outletIdx)) {
							overrides.push({ index: outletIdx, relay_state: outletOn })
						}

						const path = `/api/s/${self.config.site}/rest/device/${deviceWithOutlets._id}`
						result = await sendRequest(path, 'PUT', { outlet_overrides: overrides })
					} else {
						const spec = COMMAND_SPEC[command]
						const payload: Record<string, unknown> = { cmd: command }
						payload[spec.macField] = spec.macField === 'macs' ? [mac] : mac
						if (command === 'authorize-guest') payload.minutes = event.options.minutes
						if (command === 'restart') payload.reboot_type = event.options.reboot_type
						if (command === 'power-cycle') payload.port_idx = event.options.port_idx

						const path = `/api/s/${self.config.site}/${spec.endpoint}`
						result = await sendRequest(path, 'POST', payload)
					}

					self.log('debug', `Utility: Send Device Command: ${JSON.stringify(result)}`)
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Utility: Send Device Command failed: ${message}`)
				}
			},
		},
	}
}
