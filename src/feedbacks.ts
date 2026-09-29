import { combineRgb, type CompanionFeedbackDefinitions, type CompanionInputFieldDropdown } from '@companion-module/base'
import type ModuleInstance from './main.js'
import {
	allOutlets,
	deviceLabel,
	isOnline,
	macKey,
	outletLabel,
	poePorts,
	portLabel,
	type DevicePort,
	type OutletTableEntry,
} from './devices.js'

export type FeedbacksSchema = {
	port_state: {
		type: 'boolean'
		options: {
			device_mac: string
			condition: string
			min_speed: number
			// One port picker per device, listing that device's ports; see perDevicePickers().
			[perDevicePort: `port_of_${string}`]: number
		}
	}
	outlet_state: {
		type: 'boolean'
		options: {
			device_mac: string
			condition: string
			min_watts: number
			[perDeviceOutlet: `outlet_of_${string}`]: number
		}
	}
	// Value feedbacks: return a number instead of on/off, for use as a button's local variable (e.g. shown in
	// its text as $(local:draw)). Companion only evaluates them for buttons that use them, so nothing is kept
	// live per port/outlet the way module variables would be.
	port_poe_power: {
		type: 'value'
		options: {
			device_mac: string
			[perDevicePort: `port_of_${string}`]: number
		}
	}
	outlet_power: {
		type: 'value'
		options: {
			device_mac: string
			[perDeviceOutlet: `outlet_of_${string}`]: number
		}
	}
}

// Every feedback in this file; ModuleInstance.pollDevices re-checks them all after each status refresh.
export const LIVE_FEEDBACK_IDS = ['port_state', 'outlet_state', 'port_poe_power', 'outlet_power'] as const

// Each condition is checked against the device's last report in the live inventory, which
// ModuleInstance.pollDevices refreshes on the connection's Status Refresh Interval. A device the console
// doesn't currently see as online only has stale data, so every live condition (link, PoE draw, speed,
// STP, relay, power) reads false for it; conditions that are just configuration (port/PoE enabled or
// disabled) still read from its last known config.
const PORT_CONDITIONS: Record<
	string,
	{ label: string; check: (port: DevicePort, online: boolean, minSpeed: number) => boolean }
> = {
	link_up: { label: 'Link is up', check: (p, online) => online && p.up === true },
	link_down: { label: 'Link is down', check: (p, online) => !online || p.up !== true },
	enabled: { label: 'Port is enabled', check: (p) => p.enable !== false },
	disabled: { label: 'Port is disabled', check: (p) => p.enable === false },
	poe_on: { label: 'PoE is turned on', check: (p) => p.port_poe === true && p.poe_mode !== 'off' },
	poe_off: { label: 'PoE is turned off', check: (p) => p.port_poe === true && p.poe_mode === 'off' },
	poe_powering: {
		label: 'PoE is powering a device',
		check: (p, online) => online && p.port_poe === true && Number(p.poe_power ?? 0) > 0,
	},
	speed_at_least: {
		label: 'Link speed is at least… (set below)',
		check: (p, online, minSpeed) => online && p.up === true && Number(p.speed ?? 0) >= minSpeed,
	},
	full_duplex: {
		label: 'Link is full duplex',
		check: (p, online) => online && p.up === true && p.full_duplex === true,
	},
	stp_blocking: {
		label: 'Spanning tree is blocking the port',
		check: (p, online) => online && p.stp_state === 'blocking',
	},
	is_uplink: { label: 'Port is the uplink', check: (p) => p.is_uplink === true },
}

const OUTLET_CONDITIONS: Record<
	string,
	{ label: string; check: (outlet: OutletTableEntry, online: boolean, minWatts: number) => boolean }
> = {
	on: { label: 'Outlet is on', check: (o, online) => online && o.has_relay !== false && o.relay_state === true },
	off: { label: 'Outlet is off', check: (o, online) => online && o.has_relay !== false && o.relay_state === false },
	drawing: {
		label: 'Power draw is above… (set below)',
		check: (o, online, minWatts) => online && Number(o.outlet_power ?? 0) > minWatts,
	},
}

// Watts to one decimal place, or null when there's nothing live to report (device offline or not found), so a
// button shows blank rather than a stale or made-up 0.
function watts(value: number | string | undefined, online: boolean): number | null {
	if (!online || value === undefined || value === '') return null
	const n = Number(value)
	return Number.isFinite(n) ? Math.round(n * 10) / 10 : null
}

const ACTIVE_STYLE = { bgcolor: combineRgb(0, 153, 51), color: combineRgb(255, 255, 255) }

// One picker per device, listing that device's ports or outlets, visible only while that device is selected.
// Same pattern as the Utility action's port/outlet pickers: Companion can't filter one dropdown by another.
function perDevicePickers<TPrefix extends 'port_of_' | 'outlet_of_', TItem>(
	self: ModuleInstance,
	prefix: TPrefix,
	label: string,
	itemsOf: (device: ModuleInstance['devices'][number]) => TItem[],
	toChoice: (item: TItem) => { id: number; label: string },
): CompanionInputFieldDropdown<`${TPrefix}${string}`>[] {
	return self.devices.flatMap((device) => {
		const items = itemsOf(device)
		if (items.length === 0) return []
		// Consoles don't always report ports in order (SFP ports can come first), so sort by number.
		const choices = items.map(toChoice).sort((a, b) => a.id - b.id)
		return [
			{
				id: `${prefix}${macKey(device.mac)}` as const,
				type: 'dropdown' as const,
				label,
				choices,
				default: choices[0].id,
				isVisibleExpression: `$(options:device_mac) == "${device.mac}"`,
			},
		]
	})
}

// The Device picker shared by every feedback. The port/outlet pickers after it show and hide based on this
// field, and Companion only lets visibility expressions read fields that can't themselves be expressions.
function devicePicker(devices: ModuleInstance['devices'], tooltip: string): CompanionInputFieldDropdown<'device_mac'> {
	return {
		id: 'device_mac',
		type: 'dropdown',
		label: 'Device',
		tooltip,
		choices: devices.map((d) => ({ id: d.mac, label: deviceLabel(d) })),
		default: devices[0]?.mac ?? '',
		disableAutoExpression: true,
	}
}

function outletChoice(outlet: OutletTableEntry): { id: number; label: string } {
	return { id: outlet.index, label: `${outletLabel(outlet)}${outlet.has_relay === false ? ' (metering only)' : ''}` }
}

// Look up the device and port/outlet a feedback points at, from its Device field and that device's picker.
function findPort(
	self: ModuleInstance,
	options: { device_mac: string; [key: `port_of_${string}`]: number },
): { port: DevicePort; online: boolean } | undefined {
	const device = self.devices.find((d) => d.mac === options.device_mac)
	if (!device) return undefined
	const portIdx = Number(options[`port_of_${macKey(device.mac)}`])
	const port = device.port_table?.find((p) => p.port_idx === portIdx)
	return port && { port, online: isOnline(device) }
}

function findOutlet(
	self: ModuleInstance,
	options: { device_mac: string; [key: `outlet_of_${string}`]: number },
): { outlet: OutletTableEntry; online: boolean } | undefined {
	const device = self.devices.find((d) => d.mac === options.device_mac)
	if (!device) return undefined
	const outletIdx = Number(options[`outlet_of_${macKey(device.mac)}`])
	const outlet = allOutlets(device).find((o) => o.index === outletIdx)
	return outlet && { outlet, online: isOnline(device) }
}

export function UpdateFeedbacks(self: ModuleInstance): void {
	const portDevices = self.devices.filter((d) => (d.port_table?.length ?? 0) > 0)
	const poeDevices = self.devices.filter((d) => poePorts(d).length > 0)
	const outletDevices = self.devices.filter((d) => allOutlets(d).length > 0)

	const feedbacks: CompanionFeedbackDefinitions<FeedbacksSchema> = {
		port_state: {
			type: 'boolean',
			name: 'Port: Status',
			description:
				"Lights up while a network port on a UniFi device (switch, gateway, access point) is in the state you pick: link up or down, enabled, PoE on or powering something, and more. Uses the device's latest report to the console, refreshed on the connection's Status Refresh Interval.",
			defaultStyle: ACTIVE_STYLE,
			showInvert: true,
			options: [
				devicePicker(portDevices, 'Any UniFi device with network ports, pulled live from the console.'),
				...perDevicePickers(
					self,
					'port_of_',
					'Port',
					(d) => d.port_table ?? [],
					(p) => ({ id: p.port_idx, label: portLabel(p) }),
				),
				{
					id: 'condition',
					type: 'dropdown',
					label: 'When',
					tooltip:
						'PoE conditions are only ever true on ports that can supply PoE. Live conditions (link, speed, PoE draw, spanning tree) read false while the device is offline.',
					choices: Object.entries(PORT_CONDITIONS).map(([id, c]) => ({ id, label: c.label })),
					default: 'link_up',
					disableAutoExpression: true,
				},
				{
					id: 'min_speed',
					type: 'dropdown',
					label: 'Minimum Speed',
					choices: [
						{ id: 10, label: '10 Mbps' },
						{ id: 100, label: '100 Mbps' },
						{ id: 1000, label: '1 Gbps' },
						{ id: 2500, label: '2.5 Gbps' },
						{ id: 5000, label: '5 Gbps' },
						{ id: 10000, label: '10 Gbps' },
						{ id: 25000, label: '25 Gbps' },
					],
					default: 1000,
					isVisibleExpression: '$(options:condition) == "speed_at_least"',
				},
			],
			callback: (feedback) => {
				const found = findPort(self, feedback.options)
				const condition = PORT_CONDITIONS[feedback.options.condition]
				if (!found || !condition) return false
				return condition.check(found.port, found.online, Number(feedback.options.min_speed))
			},
		},

		outlet_state: {
			type: 'boolean',
			name: 'Outlet: Status',
			description:
				"Lights up while an outlet on a UniFi SmartPower device (UPS, UPS Pro, PDU Pro, Smart Plug, Smart Strip, etc) is on, off, or drawing more than a set amount of power. Metering-only outlets can't be on or off, but can still report power draw. Uses the device's latest report to the console, refreshed on the connection's Status Refresh Interval.",
			defaultStyle: ACTIVE_STYLE,
			showInvert: true,
			options: [
				devicePicker(outletDevices, 'Any UniFi SmartPower device, pulled live from the console.'),
				...perDevicePickers(self, 'outlet_of_', 'Outlet', allOutlets, outletChoice),
				{
					id: 'condition',
					type: 'dropdown',
					label: 'When',
					tooltip: 'Every condition reads false while the device is offline.',
					choices: Object.entries(OUTLET_CONDITIONS).map(([id, c]) => ({ id, label: c.label })),
					default: 'on',
					disableAutoExpression: true,
				},
				{
					id: 'min_watts',
					type: 'number',
					label: 'Watts',
					tooltip: 'Lights up while the outlet draws more than this many watts.',
					default: 5,
					min: 0,
					max: 100000,
					isVisibleExpression: '$(options:condition) == "drawing"',
				},
			],
			callback: (feedback) => {
				const found = findOutlet(self, feedback.options)
				const condition = OUTLET_CONDITIONS[feedback.options.condition]
				if (!found || !condition) return false
				return condition.check(found.outlet, found.online, Number(feedback.options.min_watts))
			},
		},

		port_poe_power: {
			type: 'value',
			name: 'Port: PoE Power Draw (watts)',
			description:
				"The power, in watts, a PoE port is currently supplying, for use as a button's local variable (e.g. show it in the button text as $(local:draw)). Blank while the device is offline.",
			options: [
				devicePicker(poeDevices, 'Any UniFi device with PoE ports, pulled live from the console.'),
				...perDevicePickers(self, 'port_of_', 'Port', poePorts, (p) => ({ id: p.port_idx, label: portLabel(p) })),
			],
			callback: (feedback) => {
				const found = findPort(self, feedback.options)
				return found ? watts(found.port.poe_power, found.online) : null
			},
		},

		outlet_power: {
			type: 'value',
			name: 'Outlet: Power Draw (watts)',
			description:
				"The power, in watts, an outlet on a UniFi SmartPower device is currently drawing, for use as a button's local variable (e.g. show it in the button text as $(local:draw)). Works on metering-only outlets too. Blank while the device is offline.",
			options: [
				devicePicker(outletDevices, 'Any UniFi SmartPower device, pulled live from the console.'),
				...perDevicePickers(self, 'outlet_of_', 'Outlet', allOutlets, outletChoice),
			],
			callback: (feedback) => {
				const found = findOutlet(self, feedback.options)
				return found ? watts(found.outlet.outlet_power, found.online) : null
			},
		},
	}

	self.setFeedbackDefinitions(feedbacks)
}
