import type { CompanionActionDefinitions, CompanionInputFieldDropdown, DropdownChoice } from '@companion-module/base'
import type { UniFiDevice } from 'unifi-api-ts'
import type ModuleInstance from '../main.js'

// Utility — unifi-api-ts: UniFiClient.customApiRequest (UtilityAPI)
export type UtilityActionsSchema = {
	utility_send_device_command: {
		options: {
			target_type: string
			client_mac: string
			// Fallback command list (every client command), shown when the Client field holds a MAC that isn't
			// in the live inventory or whose guest status the console doesn't report. The _guest/_regular lists
			// are the filtered ones shown for known clients; see CLIENT_COMMAND_GROUPS.
			client_command: string
			client_command_guest: string
			client_command_regular: string
			device_mac: string
			// Same idea for devices: device_command is the full fallback list, and the device_command_<group>
			// fields are the filtered lists shown for known devices; see DEVICE_COMMAND_GROUPS.
			device_command: string
			device_command_basic: string
			device_command_poe: string
			device_command_outlet: string
			device_command_poe_outlet: string
			// Free-number fallbacks for a device that isn't in the live inventory. Known devices get a
			// dropdown of their real ports/outlets instead, one field per device (port_of_<mac>/outlet_of_<mac>).
			port_idx: number
			outlet_idx: number
			minutes: number
			reboot_type: string
			outlet_on: boolean
			[perDevicePort: `port_of_${string}`]: number
			[perDeviceOutlet: `outlet_of_${string}`]: number
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

// UniFi's raw device-state payload for anything in the SmartPower family (UPS, UPS Pro, PDU Pro,
// Smart Plug, Smart Strip, ...) includes an outlet_table that unifi-api-ts doesn't model in its UniFiDevice
// type. has_relay is false for metering-only outlets, which report power draw but can't be switched.
interface OutletTableEntry {
	index: number
	name?: string
	relay_state?: boolean
	has_relay?: boolean
}

type DeviceWithOutlets = UniFiDevice & { outlet_table?: OutletTableEntry[] }

// Every command, with the label used when it's offered. The filtered lists below just pick from these.
const CLIENT_COMMAND_CHOICES: Record<string, string> = {
	'block-sta': 'Block Client',
	'unblock-sta': 'Unblock Client',
	'kick-sta': 'Reconnect Client (kick and rejoin)',
	'forget-sta': 'Forget Client (remove from known clients)',
	'authorize-guest': 'Authorize Guest (needs Guest Minutes below)',
	'unauthorize-guest': 'Unauthorize Guest',
}

const DEVICE_COMMAND_CHOICES: Record<string, string> = {
	restart: 'Restart Device',
	'power-cycle': 'Power Cycle PoE Port (needs Switch Port below)',
	'force-provision': 'Force Provision Device',
	'set-locate': 'Locate Device (start blinking LED)',
	'unset-locate': 'Locate Device (stop blinking LED)',
	'set-outlet': 'Set Outlet Power (needs Outlet/Outlet On below)',
}

// Companion can't filter one dropdown's choices by another field's value, so instead there's one command
// dropdown per kind of target, and each is only visible while a target of that kind is selected (see the
// isVisibleExpressions built in buildUtilityActions). The group names are baked into saved buttons as field
// ids, so they must never be renamed.
//
// Clients: guest commands only apply to clients the console marks as guests (is_guest). A client whose
// record doesn't say either way gets the full fallback list rather than losing the guest commands.
const REGULAR_CLIENT_COMMANDS = ['block-sta', 'unblock-sta', 'kick-sta', 'forget-sta']
const CLIENT_COMMAND_GROUPS = {
	guest: [...REGULAR_CLIENT_COMMANDS, 'authorize-guest', 'unauthorize-guest'],
	regular: REGULAR_CLIENT_COMMANDS,
} as const

// Devices: capabilities come from what the device actually reports, not its type code:
// - poe: its port_table has at least one PoE-capable port. That covers PoE switches, but also gateways with
//   PoE ports (UDR, UDM SE, ...) and in-wall APs with a PoE passthrough port, and leaves out non-PoE
//   switches, where "power cycle" has nothing to cycle.
// - outlet: it reports at least one switchable outlet. UniFi's SmartPower family doesn't share one type code
//   (the UPS/UPS Pro report "usp", but the PDU Pro reports "usw", same as an ordinary switch), so this is
//   the only reliable test.
const BASIC_DEVICE_COMMANDS = ['restart', 'force-provision', 'set-locate', 'unset-locate']
const DEVICE_COMMAND_GROUPS = {
	basic: BASIC_DEVICE_COMMANDS,
	poe: [...BASIC_DEVICE_COMMANDS, 'power-cycle'],
	outlet: [...BASIC_DEVICE_COMMANDS, 'set-outlet'],
	poe_outlet: [...BASIC_DEVICE_COMMANDS, 'power-cycle', 'set-outlet'],
} as const

type ClientCommandGroup = keyof typeof CLIENT_COMMAND_GROUPS
type DeviceCommandGroup = keyof typeof DEVICE_COMMAND_GROUPS

const CLIENT_GROUP_NAMES = Object.keys(CLIENT_COMMAND_GROUPS) as ClientCommandGroup[]
const DEVICE_GROUP_NAMES = Object.keys(DEVICE_COMMAND_GROUPS) as DeviceCommandGroup[]

function groupOffers(commands: readonly string[], command: string): boolean {
	return commands.includes(command)
}

function poePorts(device: UniFiDevice): NonNullable<UniFiDevice['port_table']> {
	return device.port_table?.filter((port) => port.port_poe === true) ?? []
}

function switchableOutlets(device: UniFiDevice): OutletTableEntry[] {
	return (device as DeviceWithOutlets).outlet_table?.filter((outlet) => outlet.has_relay !== false) ?? []
}

function deviceGroup(device: UniFiDevice): DeviceCommandGroup {
	const poe = poePorts(device).length > 0
	const outlet = switchableOutlets(device).length > 0
	if (poe && outlet) return 'poe_outlet'
	if (poe) return 'poe'
	if (outlet) return 'outlet'
	return 'basic'
}

function clientGroup(client: { is_guest?: boolean }): ClientCommandGroup | undefined {
	if (client.is_guest === true) return 'guest'
	if (client.is_guest === false) return 'regular'
	return undefined
}

// Per-device field ids (port_of_<mac>, outlet_of_<mac>) use the MAC as plain hex, since field ids end up in
// Companion expressions and saved button configs.
function macKey(mac: string): string {
	return mac.toLowerCase().replace(/[^0-9a-f]/g, '')
}

function choicesFrom(labels: Record<string, string>, commands: readonly string[]): DropdownChoice[] {
	return commands.map((id) => ({ id, label: labels[id] }))
}

// isVisibleExpression helpers. Checking "is this field one of these MACs" as a single string search keeps
// the expression short even with hundreds of clients, where a chain of == comparisons would run to tens of
// kilobytes. Companion's `+` doesn't join strings (it gives NaN), hence concat().
function fieldIsOneOf(field: string, values: string[]): string {
	if (values.length === 0) return '1 == 0'
	return `includes("|${values.join('|')}|", concat(concat("|", $(options:${field})), "|"))`
}

function fieldIsNoneOf(field: string, values: string[]): string {
	if (values.length === 0) return '1 == 1'
	return `!(${fieldIsOneOf(field, values)})`
}

export function buildUtilityActions(self: ModuleInstance): CompanionActionDefinitions<UtilityActionsSchema> {
	// Everything below that depends on which client/device is selected compares against the live inventory,
	// so it's rebuilt along with the actions every time the inventory refreshes (ModuleInstance.refreshInventory).
	// Matching is exact, same as the callback's lookups, so the fields the user sees are the ones the callback reads.
	const IS_CLIENT = '$(options:target_type) == "client"'
	const IS_DEVICE = '$(options:target_type) == "device"'

	const clientMacsByGroup: Record<ClientCommandGroup, string[]> = { guest: [], regular: [] }
	for (const client of self.clients) {
		const group = clientGroup(client)
		if (group) clientMacsByGroup[group].push(client.mac)
	}
	const clientIsUnknown = fieldIsNoneOf('client_mac', [...clientMacsByGroup.guest, ...clientMacsByGroup.regular])

	const deviceMacsByGroup: Record<DeviceCommandGroup, string[]> = { basic: [], poe: [], outlet: [], poe_outlet: [] }
	for (const device of self.devices) {
		deviceMacsByGroup[deviceGroup(device)].push(device.mac)
	}
	const deviceIsUnknown = fieldIsNoneOf(
		'device_mac',
		self.devices.map((d) => d.mac),
	)

	// True when the device command list currently on screen has `command` selected, whichever list that is.
	// `groups` narrows which filtered lists count (e.g. Reboot Type only matters for PoE devices).
	const deviceCommandIs = (
		command: string,
		groups = DEVICE_GROUP_NAMES.filter((g) => groupOffers(DEVICE_COMMAND_GROUPS[g], command)),
	): string => {
		const clauses = groups.map(
			(group) =>
				`(${fieldIsOneOf('device_mac', deviceMacsByGroup[group])} && $(options:device_command_${group}) == "${command}")`,
		)
		clauses.push(`(${deviceIsUnknown} && $(options:device_command) == "${command}")`)
		return `${IS_DEVICE} && (${clauses.join(' || ')})`
	}

	const clientCommandFields = CLIENT_GROUP_NAMES.map(
		(group): CompanionInputFieldDropdown<`client_command_${ClientCommandGroup}`> => ({
			id: `client_command_${group}`,
			type: 'dropdown',
			label: 'Client Command',
			tooltip:
				group === 'guest'
					? 'What to do to the guest selected above.'
					: "What to do to the client selected above. Guest commands aren't listed because the console doesn't mark this client as a guest.",
			choices: choicesFrom(CLIENT_COMMAND_CHOICES, CLIENT_COMMAND_GROUPS[group]),
			default: 'kick-sta',
			disableAutoExpression: true,
			isVisibleExpression: `${IS_CLIENT} && ${fieldIsOneOf('client_mac', clientMacsByGroup[group])}`,
		}),
	)

	const deviceCommandFields = DEVICE_GROUP_NAMES.map(
		(group): CompanionInputFieldDropdown<`device_command_${DeviceCommandGroup}`> => ({
			id: `device_command_${group}`,
			type: 'dropdown',
			label: 'Device Command',
			tooltip: 'What to do to the device selected above. Only commands this device supports are listed.',
			choices: choicesFrom(DEVICE_COMMAND_CHOICES, DEVICE_COMMAND_GROUPS[group]),
			default: 'restart',
			disableAutoExpression: true,
			isVisibleExpression: `${IS_DEVICE} && ${fieldIsOneOf('device_mac', deviceMacsByGroup[group])}`,
		}),
	)

	// One port picker per PoE-capable device, listing only its PoE ports, shown while that device is selected
	// with "Power Cycle PoE Port" chosen.
	const portFields = self.devices.flatMap((device): CompanionInputFieldDropdown<`port_of_${string}`>[] => {
		const ports = poePorts(device)
		if (ports.length === 0) return []
		return [
			{
				id: `port_of_${macKey(device.mac)}`,
				type: 'dropdown',
				label: 'Switch Port',
				tooltip: `Which PoE port on ${device.name ?? device.mac} to power cycle. Only ports that can supply PoE are listed.`,
				choices: ports.map((port) => {
					const label = `Port ${port.port_idx}`
					return { id: port.port_idx, label: port.name && port.name !== label ? `${label} — ${port.name}` : label }
				}),
				default: ports[0].port_idx,
				isVisibleExpression: `${IS_DEVICE} && $(options:device_mac) == "${device.mac}" && $(options:device_command_${deviceGroup(device)}) == "power-cycle"`,
			},
		]
	})

	// Same for outlets: one picker per SmartPower device, listing only outlets that can actually be switched.
	const outletFields = self.devices.flatMap((device): CompanionInputFieldDropdown<`outlet_of_${string}`>[] => {
		const outlets = switchableOutlets(device)
		if (outlets.length === 0) return []
		return [
			{
				id: `outlet_of_${macKey(device.mac)}`,
				type: 'dropdown',
				label: 'Outlet',
				tooltip: `Which outlet on ${device.name ?? device.mac} to switch. Metering-only outlets can't be switched, so they aren't listed.`,
				choices: outlets.map((outlet) => {
					const label = `Outlet ${outlet.index}`
					return { id: outlet.index, label: outlet.name && outlet.name !== label ? `${label} — ${outlet.name}` : label }
				}),
				default: outlets[0].index,
				isVisibleExpression: `${IS_DEVICE} && $(options:device_mac) == "${device.mac}" && $(options:device_command_${deviceGroup(device)}) == "set-outlet"`,
			},
		]
	})

	return {
		// Send Device Command: pick a client or device from a live-updating list pulled from the console
		// (self.devices/self.clients, refreshed every 60s by ModuleInstance.refreshInventory), then what
		// to do to it — this action builds the correct UniFi API request internally, so no MAC/path/
		// payload typing is required. Backed by unifi-api-ts: unifi.customApiRequest(...), with the exact
		// endpoint/payload shape per command verified against unifi-api-ts's own source (see COMMAND_SPEC).
		utility_send_device_command: {
			name: 'Utility: Send Device Command',
			description:
				"Runs a command against a client device (phone, laptop, etc) or a UniFi infrastructure device (AP, switch, gateway) — pick which kind below, then pick the specific one from the list and what to do to it. The list is pulled live from the console and refreshes automatically; if something you're looking for isn't in it yet, you can still type its MAC address directly. Only commands the selected client or device supports are offered, and some commands need one extra field, which only appears once that command is selected.",
			options: [
				{
					id: 'target_type',
					type: 'dropdown',
					label: 'Target Type',
					tooltip:
						'Whether to target UniFi infrastructure (Gateway, Switch, AP, etc) or a client device (phone, laptop, etc).',
					choices: [
						{ id: 'device', label: 'Infrastructure Device (AP, switch, gateway)' },
						{ id: 'client', label: 'Client Device (phone, laptop, etc)' },
					],
					default: 'device',
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
						label: `${c.name ?? c.hostname ?? c.mac}${c.is_guest ? ' (Guest)' : ''} — ${c.mac}`,
					})),
					default: '',
					allowCustom: true,
					// The command lists below show and hide based on this field, and Companion only lets
					// visibility expressions read fields that can't themselves be expressions.
					disableAutoExpression: true,
					isVisibleExpression: IS_CLIENT,
				},
				...clientCommandFields,
				{
					id: 'client_command',
					type: 'dropdown',
					label: 'Client Command',
					tooltip:
						"What to do to the client above. The console doesn't say whether this client is a guest, so every command is offered; the guest commands only work on clients connected to a guest network.",
					choices: choicesFrom(CLIENT_COMMAND_CHOICES, Object.keys(CLIENT_COMMAND_CHOICES)),
					default: 'kick-sta',
					disableAutoExpression: true,
					isVisibleExpression: `${IS_CLIENT} && ${clientIsUnknown}`,
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
					disableAutoExpression: true,
					isVisibleExpression: IS_DEVICE,
				},
				...deviceCommandFields,
				{
					id: 'device_command',
					type: 'dropdown',
					label: 'Device Command',
					tooltip:
						'What to do to the device above. This device isn\'t in the live list, so every command is offered: "Power Cycle PoE Port" only works on a device with PoE ports, and "Set Outlet Power" only works on a UniFi SmartPower device (UPS, UPS Pro, PDU Pro, Smart Plug, Smart Strip, etc).',
					choices: choicesFrom(DEVICE_COMMAND_CHOICES, Object.keys(DEVICE_COMMAND_CHOICES)),
					default: 'restart',
					disableAutoExpression: true,
					isVisibleExpression: `${IS_DEVICE} && ${deviceIsUnknown}`,
				},
				...portFields,
				{
					id: 'port_idx',
					type: 'number',
					label: 'Switch Port',
					tooltip: 'The port number as labeled on the device or shown in the UniFi app, e.g. 8.',
					default: 1,
					min: 1,
					max: 999999999,
					isVisibleExpression: `${IS_DEVICE} && ${deviceIsUnknown} && $(options:device_command) == "power-cycle"`,
				},
				{
					id: 'reboot_type',
					type: 'dropdown',
					label: 'Reboot Type',
					tooltip:
						"'soft' restarts just this device. 'hard' also power-cycles every PoE port on it, so everything it powers (APs, cameras, phones, ...) goes down and restarts too.",
					choices: [
						{ id: 'soft', label: 'soft (restart this device only)' },
						{ id: 'hard', label: 'hard (also power-cycle every PoE port on it)' },
					],
					default: 'soft',
					// Only devices with PoE ports have anything for 'hard' to add, so hide the choice for the rest.
					isVisibleExpression: deviceCommandIs('restart', ['poe', 'poe_outlet']),
				},
				{
					id: 'minutes',
					type: 'number',
					label: 'Guest Minutes',
					tooltip: 'How long the guest should have access, in minutes, e.g. 60 for one hour.',
					default: 60,
					min: 1,
					max: 999999999,
					isVisibleExpression: `${IS_CLIENT} && ((${fieldIsOneOf('client_mac', clientMacsByGroup.guest)} && $(options:client_command_guest) == "authorize-guest") || (${clientIsUnknown} && $(options:client_command) == "authorize-guest"))`,
				},
				...outletFields,
				{
					id: 'outlet_idx',
					type: 'number',
					label: 'Outlet Number',
					tooltip:
						"Which outlet on the device to control. Numbering isn't confirmed for every SmartPower model — start with 1, then check the physical outlet (or the UniFi app) to see which one actually switched, and adjust if it wasn't the one you expected. Not every outlet on every model can be switched independently — some are metering-only.",
					default: 1,
					min: 0,
					max: 999999999,
					isVisibleExpression: `${IS_DEVICE} && ${deviceIsUnknown} && $(options:device_command) == "set-outlet"`,
				},
				{
					id: 'outlet_on',
					type: 'checkbox',
					label: 'Outlet On',
					tooltip: 'Set to true to power the outlet on, or false to power it off.',
					default: true,
					isVisibleExpression: deviceCommandIs('set-outlet'),
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
					const selected = targetType === 'client' ? event.options.client_mac : event.options.device_mac
					const mac = selected.trim().toLowerCase()
					if (!mac) {
						throw new Error(`${targetType === 'client' ? 'Client' : 'Device'} is required`)
					}

					// Each value below is read from whichever field the user was actually shown: the filtered one
					// for this client/device if it's in the inventory (exact match, same as the visibility
					// expressions above), otherwise the fallback. The `??` covers buttons saved before a
					// filtered field existed, until they're next edited.
					let command: string
					let portIdx = event.options.port_idx
					let outletIdx = event.options.outlet_idx
					let rebootType = event.options.reboot_type

					if (targetType === 'client') {
						const listed = self.clients.find((c) => c.mac === selected)
						const group = listed && clientGroup(listed)
						command = group
							? (event.options[`client_command_${group}`] ?? event.options.client_command)
							: event.options.client_command

						const client = listed ?? self.clients.find((c) => c.mac.toLowerCase() === mac)
						if (client?.is_guest === false && command === 'authorize-guest') {
							throw new Error(
								`"${client.name ?? client.hostname ?? mac}" isn't a guest — Authorize Guest only works on clients connected to a guest network`,
							)
						}
					} else {
						const listed = self.devices.find((d) => d.mac === selected)
						if (listed) {
							const key = macKey(listed.mac)
							command = event.options[`device_command_${deviceGroup(listed)}`] ?? event.options.device_command
							portIdx = event.options[`port_of_${key}`] ?? portIdx
							outletIdx = event.options[`outlet_of_${key}`] ?? outletIdx
							// Reboot Type is hidden for devices without PoE ports; don't let a leftover 'hard'
							// from an earlier device selection through.
							if (poePorts(listed).length === 0) rebootType = 'soft'
						} else {
							command = event.options.device_command
						}

						// The fallback list offers everything, so check the command still fits this device if we
						// can find it at all (e.g. a MAC typed in a different case). This is a friendly pre-flight
						// check only, using the up-to-60s-stale inventory cache; "set-outlet" re-verifies against a
						// fresh fetch below before actually writing anything.
						const device = listed ?? self.devices.find((d) => d.mac.toLowerCase() === mac)
						if (device && command === 'power-cycle' && poePorts(device).length === 0) {
							throw new Error(
								`"${device.name ?? mac}" doesn't report any PoE ports — Power Cycle PoE Port only works on a device that powers other devices over PoE`,
							)
						}
						if (device && command === 'set-outlet' && switchableOutlets(device).length === 0) {
							throw new Error(
								`"${device.name ?? mac}" doesn't report any switchable outlets — Set Outlet Power only works on UniFi SmartPower devices (UPS, UPS Pro, PDU Pro, Smart Plug, Smart Strip, etc)`,
							)
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
						const deviceWithOutlets = freshDevice as DeviceWithOutlets | undefined
						if (!deviceWithOutlets) {
							throw new Error(`No device found with MAC ${mac}`)
						}
						const currentOutlets = deviceWithOutlets.outlet_table ?? []
						const target = currentOutlets.find((o) => o.index === outletIdx)
						if (!target || target.has_relay === false) {
							const available = switchableOutlets(deviceWithOutlets).map((o) => o.index)
							throw new Error(
								available.length === 0
									? `"${deviceWithOutlets.name ?? mac}" doesn't report any switchable outlets — Set Outlet Power only works on UniFi SmartPower devices (UPS, UPS Pro, PDU Pro, Smart Plug, Smart Strip, etc)`
									: `Outlet ${outletIdx} on "${deviceWithOutlets.name ?? mac}" ${target ? "is metering-only and can't be switched" : "doesn't exist"} — switchable outlets are ${available.join(', ')}`,
							)
						}

						const outletOn = event.options.outlet_on
						const overrides = currentOutlets.map((o) => ({
							index: o.index,
							relay_state: o.index === outletIdx ? outletOn : (o.relay_state ?? true),
						}))

						const path = `/api/s/${self.config.site}/rest/device/${deviceWithOutlets._id}`
						result = await sendRequest(path, 'PUT', { outlet_overrides: overrides })
					} else {
						const spec = COMMAND_SPEC[command]
						const payload: Record<string, unknown> = { cmd: command }
						payload[spec.macField] = spec.macField === 'macs' ? [mac] : mac
						if (command === 'authorize-guest') payload.minutes = event.options.minutes
						if (command === 'restart') payload.reboot_type = rebootType
						if (command === 'power-cycle') payload.port_idx = portIdx

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
