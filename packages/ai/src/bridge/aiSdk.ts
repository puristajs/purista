import { tool } from 'ai'

import type { ExternalBinding, ExternalBindingSet } from './externalRuntime.js'

export type AiSdkTool = ReturnType<typeof tool<any, any>> & {
	externalRuntime?: ExternalBinding['externalRuntime']
}

export type AiSdkToolSet = Record<string, AiSdkTool>

const toBindingArray = (input: ExternalBindingSet | ExternalBinding[]) =>
	Array.isArray(input) ? input : Object.values(input)

export const toAiSdkTool = (binding: ExternalBinding): AiSdkTool =>
	Object.assign(
		tool({
			description: binding.description,
			inputSchema: binding.inputSchema as any,
			execute: async (payload: unknown) => await binding.execute(payload),
		} as any),
		{
			externalRuntime: binding.externalRuntime,
		},
	)

export const toAiSdkTools = (bindings: ExternalBindingSet | ExternalBinding[]): AiSdkToolSet => {
	const result: AiSdkToolSet = {}
	for (const binding of toBindingArray(bindings)) {
		if (binding.name in result) {
			throw new Error(`Duplicate AI SDK tool name "${binding.name}"`)
		}
		result[binding.name] = toAiSdkTool(binding)
	}
	return result
}
