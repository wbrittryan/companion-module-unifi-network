import type ModuleInstance from '../main.js'
import type { CompanionActionDefinitions } from '@companion-module/base'

// Auto-generated from unifi-api-ts's UserManagementAPI class: every public method it exposes becomes one
// Companion action below, named "Users: <action>". Do not hand-edit call sites here without also
// checking unifi-api-ts's UserManagementAPI.d.ts, since the argument order must match it exactly.

// The shape of each action's options, so Companion's editor UI and the callback below stay in sync.
export type UserActionsSchema = {
	// Users: Create User — options Companion stores for this action's button
	user_create_user: {
		options: {
			mac: string
			user_group_id: string
			name: string
			note: string
			is_guest: boolean
			is_wired: boolean
		}
	}
	// Users: Set User Group — options Companion stores for this action's button
	user_set_usergroup: {
		options: {
			client_id: string
			group_id: string
		}
	}
	// Users: Create User Group — options Companion stores for this action's button
	user_create_usergroup: {
		options: {
			group_name: string
			group_dn: number
			group_up: number
		}
	}
	// Users: List User Groups — options Companion stores for this action's button
	user_list_usergroups: {
		options: Record<string, never>
	}
	// Users: Delete User Group — options Companion stores for this action's button
	user_delete_usergroup: {
		options: {
			group_id: string
		}
	}
	// Users: List Admins — options Companion stores for this action's button
	user_list_admins: {
		options: Record<string, never>
	}
	// Users: List All Admins — options Companion stores for this action's button
	user_list_all_admins: {
		options: Record<string, never>
	}
	// Users: Invite Admin — options Companion stores for this action's button
	user_invite_admin: {
		options: {
			name: string
			email: string
			enable_sso: boolean
			readonly: boolean
			device_adopt: boolean
			device_restart: boolean
		}
	}
	// Users: Assign Existing Admin — options Companion stores for this action's button
	user_assign_existing_admin: {
		options: {
			admin_id: string
			readonly: boolean
			device_adopt: boolean
			device_restart: boolean
		}
	}
	// Users: Update Admin — options Companion stores for this action's button
	user_update_admin: {
		options: {
			admin_id: string
			name: string
			email: string
			password: string
			readonly: boolean
			device_adopt: boolean
			device_restart: boolean
			is_super: boolean
		}
	}
	// Users: Revoke Admin — options Companion stores for this action's button
	user_revoke_admin: {
		options: {
			admin_id: string
		}
	}
	// Users: Grant Super Admin — options Companion stores for this action's button
	user_grant_super_admin: {
		options: {
			admin_id: string
		}
	}
	// Users: Delete Admin — options Companion stores for this action's button
	user_delete_admin: {
		options: {
			admin_id: string
		}
	}
	// Users: Edit User Group — options Companion stores for this action's button
	user_edit_usergroup: {
		options: {
			group_id: string
			site_id: string
			group_name: string
			group_dn: number
			group_up: number
		}
	}
}

export function buildUserActions(self: ModuleInstance): CompanionActionDefinitions<UserActionsSchema> {
	return {
		// Create User: Creates a new user entry for a client device with a specified MAC address and assigns it to a user group for bandwidth control and access policies.
		// Backed by unifi-api-ts: unifi.getUserManagementAPI().create_user(...)
		user_create_user: {
			name: 'Users: Create User',
			description:
				'Creates a new user entry for a client device with a specified MAC address and assigns it to a user group for bandwidth control and access policies.',
			options: [
				// unifi-api-ts parameter "mac" (required)
				{
					id: 'mac',
					type: 'textinput',
					label: 'MAC',
					default: '',
				},
				// unifi-api-ts parameter "user_group_id" (required)
				{
					id: 'user_group_id',
					type: 'textinput',
					label: 'User Group ID',
					default: '',
				},
				// unifi-api-ts parameter "name" (optional)
				{
					id: 'name',
					type: 'textinput',
					label: 'Name',
					default: '',
				},
				// unifi-api-ts parameter "note" (optional)
				{
					id: 'note',
					type: 'textinput',
					label: 'Note',
					default: '',
				},
				// unifi-api-ts parameter "is_guest" (optional)
				{
					id: 'is_guest',
					type: 'checkbox',
					label: 'Is Guest',
					default: false,
				},
				// unifi-api-ts parameter "is_wired" (optional)
				{
					id: 'is_wired',
					type: 'checkbox',
					label: 'Is Wired',
					default: false,
				},
			],
			callback: async (event) => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Users: Create User - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi
						.getUserManagementAPI()
						.create_user(
							self.config.site,
							event.options.mac,
							event.options.user_group_id,
							event.options.name,
							event.options.note,
							event.options.is_guest,
							event.options.is_wired,
						)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Users: Create User: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Users: Create User failed: ${message}`)
				}
			},
		},
		// Set User Group: Assigns a client device to a specific user group, controlling bandwidth limits and access policies for that device.
		// Backed by unifi-api-ts: unifi.getUserManagementAPI().set_usergroup(...)
		user_set_usergroup: {
			name: 'Users: Set User Group',
			description:
				'Assigns a client device to a specific user group, controlling bandwidth limits and access policies for that device.',
			options: [
				// unifi-api-ts parameter "client_id" (required)
				{
					id: 'client_id',
					type: 'textinput',
					label: 'Client ID',
					default: '',
				},
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
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Users: Set User Group - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi
						.getUserManagementAPI()
						.set_usergroup(self.config.site, event.options.client_id, event.options.group_id)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Users: Set User Group: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Users: Set User Group failed: ${message}`)
				}
			},
		},
		// Create User Group: Creates a new user group with specified download/upload bandwidth limits.
		// Backed by unifi-api-ts: unifi.getUserManagementAPI().create_usergroup(...)
		user_create_usergroup: {
			name: 'Users: Create User Group',
			description: 'Creates a new user group with specified download/upload bandwidth limits.',
			options: [
				// unifi-api-ts parameter "group_name" (required)
				{
					id: 'group_name',
					type: 'textinput',
					label: 'Group Name',
					default: '',
				},
				// unifi-api-ts parameter "group_dn" (optional)
				{
					id: 'group_dn',
					type: 'number',
					label: 'Group Dn',
					default: -1,
					min: 0,
					max: 999999999,
				},
				// unifi-api-ts parameter "group_up" (optional)
				{
					id: 'group_up',
					type: 'number',
					label: 'Group Up',
					default: -1,
					min: 0,
					max: 999999999,
				},
			],
			callback: async (event) => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Users: Create User Group - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi
						.getUserManagementAPI()
						.create_usergroup(
							self.config.site,
							event.options.group_name,
							event.options.group_dn,
							event.options.group_up,
						)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Users: Create User Group: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Users: Create User Group failed: ${message}`)
				}
			},
		},
		// List User Groups: Retrieves all user groups configured in the site, which define bandwidth limits and access policies for client devices.
		// Backed by unifi-api-ts: unifi.getUserManagementAPI().list_usergroups(...)
		user_list_usergroups: {
			name: 'Users: List User Groups',
			description:
				'Retrieves all user groups configured in the site, which define bandwidth limits and access policies for client devices.',
			options: [],
			callback: async () => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Users: List User Groups - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi.getUserManagementAPI().list_usergroups(self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Users: List User Groups: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Users: List User Groups failed: ${message}`)
				}
			},
		},
		// Delete User Group: Removes a user group from the site; users assigned to the deleted group are moved to the default user group.
		// Backed by unifi-api-ts: unifi.getUserManagementAPI().delete_usergroup(...)
		user_delete_usergroup: {
			name: 'Users: Delete User Group',
			description:
				'Removes a user group from the site; users assigned to the deleted group are moved to the default user group.',
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
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Users: Delete User Group - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi.getUserManagementAPI().delete_usergroup(self.config.site, event.options.group_id)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Users: Delete User Group: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Users: Delete User Group failed: ${message}`)
				}
			},
		},
		// List Admins: Retrieves a list of administrators who have access to the current site, including their roles and permissions.
		// Backed by unifi-api-ts: unifi.getUserManagementAPI().list_admins(...)
		user_list_admins: {
			name: 'Users: List Admins',
			description:
				'Retrieves a list of administrators who have access to the current site, including their roles and permissions.',
			options: [],
			callback: async () => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Users: List Admins - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi.getUserManagementAPI().list_admins(self.config.site)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Users: List Admins: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Users: List Admins failed: ${message}`)
				}
			},
		},
		// List All Admins: Retrieves a comprehensive list of all administrators across every site in the UniFi Controller.
		// Backed by unifi-api-ts: unifi.getUserManagementAPI().list_all_admins(...)
		user_list_all_admins: {
			name: 'Users: List All Admins',
			description: 'Retrieves a comprehensive list of all administrators across every site in the UniFi Controller.',
			options: [],
			callback: async () => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Users: List All Admins - not connected')
					return
				}

				try {
					// Run the command against the UniFi console
					const result = await unifi.getUserManagementAPI().list_all_admins()
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Users: List All Admins: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Users: List All Admins failed: ${message}`)
				}
			},
		},
		// Invite Admin: Invites a new administrator to the site with specified permissions; the invitee receives an email invitation to access the UniFi Controller.
		// Backed by unifi-api-ts: unifi.getUserManagementAPI().invite_admin(...)
		user_invite_admin: {
			name: 'Users: Invite Admin',
			description:
				'Invites a new administrator to the site with specified permissions; the invitee receives an email invitation to access the UniFi Controller.',
			options: [
				// unifi-api-ts parameter "name" (required)
				{
					id: 'name',
					type: 'textinput',
					label: 'Name',
					default: '',
				},
				// unifi-api-ts parameter "email" (required)
				{
					id: 'email',
					type: 'textinput',
					label: 'Email',
					default: '',
				},
				// unifi-api-ts parameter "enable_sso" (optional)
				{
					id: 'enable_sso',
					type: 'checkbox',
					label: 'Enable Sso',
					default: true,
				},
				// unifi-api-ts parameter "readonly" (optional)
				{
					id: 'readonly',
					type: 'checkbox',
					label: 'Readonly',
					default: false,
				},
				// unifi-api-ts parameter "device_adopt" (optional)
				{
					id: 'device_adopt',
					type: 'checkbox',
					label: 'Device Adopt',
					default: false,
				},
				// unifi-api-ts parameter "device_restart" (optional)
				{
					id: 'device_restart',
					type: 'checkbox',
					label: 'Device Restart',
					default: false,
				},
			],
			callback: async (event) => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Users: Invite Admin - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi
						.getUserManagementAPI()
						.invite_admin(
							self.config.site,
							event.options.name,
							event.options.email,
							event.options.enable_sso,
							event.options.readonly,
							event.options.device_adopt,
							event.options.device_restart,
						)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Users: Invite Admin: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Users: Invite Admin failed: ${message}`)
				}
			},
		},
		// Assign Existing Admin: Grants an existing administrator access to a specific site with configurable permissions and roles.
		// Backed by unifi-api-ts: unifi.getUserManagementAPI().assign_existing_admin(...)
		user_assign_existing_admin: {
			name: 'Users: Assign Existing Admin',
			description:
				'Grants an existing administrator access to a specific site with configurable permissions and roles.',
			options: [
				// unifi-api-ts parameter "admin_id" (required)
				{
					id: 'admin_id',
					type: 'textinput',
					label: 'Admin ID',
					default: '',
				},
				// unifi-api-ts parameter "readonly" (optional)
				{
					id: 'readonly',
					type: 'checkbox',
					label: 'Readonly',
					default: false,
				},
				// unifi-api-ts parameter "device_adopt" (optional)
				{
					id: 'device_adopt',
					type: 'checkbox',
					label: 'Device Adopt',
					default: false,
				},
				// unifi-api-ts parameter "device_restart" (optional)
				{
					id: 'device_restart',
					type: 'checkbox',
					label: 'Device Restart',
					default: false,
				},
			],
			callback: async (event) => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Users: Assign Existing Admin - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi
						.getUserManagementAPI()
						.assign_existing_admin(
							self.config.site,
							event.options.admin_id,
							event.options.readonly,
							event.options.device_adopt,
							event.options.device_restart,
						)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Users: Assign Existing Admin: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Users: Assign Existing Admin failed: ${message}`)
				}
			},
		},
		// Update Admin: Updates an existing administrator's name, email, password, and permission settings.
		// Backed by unifi-api-ts: unifi.getUserManagementAPI().update_admin(...)
		user_update_admin: {
			name: 'Users: Update Admin',
			description: "Updates an existing administrator's name, email, password, and permission settings.",
			options: [
				// unifi-api-ts parameter "admin_id" (required)
				{
					id: 'admin_id',
					type: 'textinput',
					label: 'Admin ID',
					default: '',
				},
				// unifi-api-ts parameter "name" (required)
				{
					id: 'name',
					type: 'textinput',
					label: 'Name',
					default: '',
				},
				// unifi-api-ts parameter "email" (required)
				{
					id: 'email',
					type: 'textinput',
					label: 'Email',
					default: '',
				},
				// unifi-api-ts parameter "password" (optional)
				{
					id: 'password',
					type: 'textinput',
					label: 'Password',
					default: '',
				},
				// unifi-api-ts parameter "readonly" (optional)
				{
					id: 'readonly',
					type: 'checkbox',
					label: 'Readonly',
					default: false,
				},
				// unifi-api-ts parameter "device_adopt" (optional)
				{
					id: 'device_adopt',
					type: 'checkbox',
					label: 'Device Adopt',
					default: false,
				},
				// unifi-api-ts parameter "device_restart" (optional)
				{
					id: 'device_restart',
					type: 'checkbox',
					label: 'Device Restart',
					default: false,
				},
				// unifi-api-ts parameter "is_super" (optional)
				{
					id: 'is_super',
					type: 'checkbox',
					label: 'Is Super',
					default: false,
				},
			],
			callback: async (event) => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Users: Update Admin - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi
						.getUserManagementAPI()
						.update_admin(
							self.config.site,
							event.options.admin_id,
							event.options.name,
							event.options.email,
							event.options.password,
							event.options.readonly,
							event.options.device_adopt,
							event.options.device_restart,
							event.options.is_super,
						)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Users: Update Admin: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Users: Update Admin failed: ${message}`)
				}
			},
		},
		// Revoke Admin: Removes administrator access from a user for the current site.
		// Backed by unifi-api-ts: unifi.getUserManagementAPI().revoke_admin(...)
		user_revoke_admin: {
			name: 'Users: Revoke Admin',
			description: 'Removes administrator access from a user for the current site.',
			options: [
				// unifi-api-ts parameter "admin_id" (required)
				{
					id: 'admin_id',
					type: 'textinput',
					label: 'Admin ID',
					default: '',
				},
			],
			callback: async (event) => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Users: Revoke Admin - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi.getUserManagementAPI().revoke_admin(self.config.site, event.options.admin_id)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Users: Revoke Admin: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Users: Revoke Admin failed: ${message}`)
				}
			},
		},
		// Grant Super Admin: Grants super administrator privileges to an existing administrator, giving them elevated permissions across the entire UniFi Controller.
		// Backed by unifi-api-ts: unifi.getUserManagementAPI().grant_super_admin(...)
		user_grant_super_admin: {
			name: 'Users: Grant Super Admin',
			description:
				'Grants super administrator privileges to an existing administrator, giving them elevated permissions across the entire UniFi Controller.',
			options: [
				// unifi-api-ts parameter "admin_id" (required)
				{
					id: 'admin_id',
					type: 'textinput',
					label: 'Admin ID',
					default: '',
				},
			],
			callback: async (event) => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Users: Grant Super Admin - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi.getUserManagementAPI().grant_super_admin(self.config.site, event.options.admin_id)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Users: Grant Super Admin: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Users: Grant Super Admin failed: ${message}`)
				}
			},
		},
		// Delete Admin: Removes an administrator from the site by revoking their super admin privileges (equivalent to revoke_admin but using the delete-admin command).
		// Backed by unifi-api-ts: unifi.getUserManagementAPI().delete_admin(...)
		user_delete_admin: {
			name: 'Users: Delete Admin',
			description:
				'Removes an administrator from the site by revoking their super admin privileges (equivalent to revoke_admin but using the delete-admin command).',
			options: [
				// unifi-api-ts parameter "admin_id" (required)
				{
					id: 'admin_id',
					type: 'textinput',
					label: 'Admin ID',
					default: '',
				},
			],
			callback: async (event) => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Users: Delete Admin - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi.getUserManagementAPI().delete_admin(self.config.site, event.options.admin_id)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Users: Delete Admin: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Users: Delete Admin failed: ${message}`)
				}
			},
		},
		// Edit User Group: Updates an existing user group's name and download/upload bandwidth limits.
		// Backed by unifi-api-ts: unifi.getUserManagementAPI().edit_usergroup(...)
		user_edit_usergroup: {
			name: 'Users: Edit User Group',
			description: "Updates an existing user group's name and download/upload bandwidth limits.",
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
				// unifi-api-ts parameter "group_dn" (optional)
				{
					id: 'group_dn',
					type: 'number',
					label: 'Group Dn',
					default: -1,
					min: 0,
					max: 999999999,
				},
				// unifi-api-ts parameter "group_up" (optional)
				{
					id: 'group_up',
					type: 'number',
					label: 'Group Up',
					default: -1,
					min: 0,
					max: 999999999,
				},
			],
			callback: async (event) => {
				// Every action bails out early if the module isn't currently connected to the console
				const unifi = self.unifi
				if (!unifi) {
					self.log('warn', 'Users: Edit User Group - not connected')
					return
				}

				try {
					// "site" is taken from the connection's configured Site (see the module's Settings tab), not a button field
					// Run the command against the UniFi console
					const result = await unifi
						.getUserManagementAPI()
						.edit_usergroup(
							self.config.site,
							event.options.group_id,
							event.options.site_id,
							event.options.group_name,
							event.options.group_dn,
							event.options.group_up,
						)
					// Log the raw result at debug level so it shows up in Companion's log if you need to troubleshoot
					self.log('debug', `Users: Edit User Group: ${JSON.stringify(result)}`)
				} catch (error) {
					// The UniFi console rejected the command (bad input, not found, permissions, etc.) — log it, don't crash the module
					const message = error instanceof Error ? error.message : String(error)
					self.log('error', `Users: Edit User Group failed: ${message}`)
				}
			},
		},
	}
}
