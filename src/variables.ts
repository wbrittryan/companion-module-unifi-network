import type ModuleInstance from './main.js'

export type VariablesSchema = {
	variable1: string
}

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	self.setVariableDefinitions({
		variable1: { name: 'My first variable' },
	})
}
