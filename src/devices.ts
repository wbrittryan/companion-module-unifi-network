import type { UniFiDevice } from 'unifi-api-ts'

// Helpers for reading the live device inventory (ModuleInstance.devices), shared by the actions and feedbacks.

// Friendlier labels for unifi-api-ts's UniFiDevice.type codes, used in device pickers.
// "usp" (UPS/UPS Pro) isn't in unifi-api-ts's own typed union — that library predates the product —
// but the live console reports it as "usp", confirmed against community integrations that already
// support the UPS-2U-Pro.
export const DEVICE_TYPE_LABELS: Record<string, string> = {
	uap: 'Access Point',
	usw: 'Switch',
	ugw: 'Gateway',
	usg: 'Gateway',
	udm: 'Dream Machine',
	uxg: 'UXG Gateway',
	usp: 'UPS',
}

// UniFi's raw device-state payload for anything in the SmartPower family (UPS, UPS Pro, PDU Pro,
// Smart Plug, Smart Strip, ...) includes an outlet_table that unifi-api-ts doesn't model in its UniFiDevice
// type (as of Sep '26). has_relay is false for metering-only outlets, which report power draw but can't be switched, and
// outlet_power is the current draw in watts (reported as a string on some firmware, hence Number() on read).
export interface OutletTableEntry {
	index: number
	name?: string
	relay_state?: boolean
	has_relay?: boolean
	outlet_power?: number | string
}

export type DeviceWithOutlets = UniFiDevice & { outlet_table?: OutletTableEntry[] }

export type DevicePort = NonNullable<UniFiDevice['port_table']>[number]

// UniFiDevice.state: 1 is "connected". Anything else (disconnected, adopting, upgrading, ...) means the
// port/outlet data the console still holds for it is its last report, not live.
export function isOnline(device: UniFiDevice): boolean {
	return device.state === 1
}

export function deviceLabel(device: UniFiDevice): string {
	return `${device.name ?? device.model} (${DEVICE_TYPE_LABELS[device.type] ?? device.type}) — ${device.mac}`
}

export function allOutlets(device: UniFiDevice): OutletTableEntry[] {
	return (device as DeviceWithOutlets).outlet_table ?? []
}

export function switchableOutlets(device: UniFiDevice): OutletTableEntry[] {
	return allOutlets(device).filter((outlet) => outlet.has_relay !== false)
}

export function poePorts(device: UniFiDevice): DevicePort[] {
	return device.port_table?.filter((port) => port.port_poe === true) ?? []
}

export function portLabel(port: DevicePort): string {
	const label = `Port ${port.port_idx}`
	return port.name && port.name !== label ? `${label} — ${port.name}` : label
}

export function outletLabel(outlet: OutletTableEntry): string {
	const label = `Outlet ${outlet.index}`
	return outlet.name && outlet.name !== label ? `${label} — ${outlet.name}` : label
}

// Per-device field ids (port_of_<mac>, outlet_of_<mac>) use the MAC as plain hex, since field ids end up in
// Companion expressions and saved button configs.
export function macKey(mac: string): string {
	return mac.toLowerCase().replace(/[^0-9a-f]/g, '')
}

// Everything about the inventory that action/feedback *definitions* are built from (names, ports, outlets,
// guest flags), and nothing that just changes state (link up, PoE draw, relay on/off). Comparing this
// between polls lets the module skip rebuilding definitions when only live state moved.
export function definitionsSignature(
	devices: UniFiDevice[],
	clients: { mac: string; name?: string; hostname?: string; is_guest?: boolean }[],
): string {
	return JSON.stringify([
		devices.map((d) => [
			d.mac,
			d.name,
			d.model,
			d.type,
			d.port_table?.map((p) => [p.port_idx, p.name, p.port_poe]),
			allOutlets(d).map((o) => [o.index, o.name, o.has_relay]),
		]),
		clients.map((c) => [c.mac, c.name, c.hostname, c.is_guest]),
	])
}
