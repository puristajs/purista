import { tool } from 'ai'
import {
	renderSkillDocuments,
	renderSkillReferences,
	type SkillDocument,
	type SkillReferenceDocument,
} from '../skills/fileSystem.js'
import type { ExternalBinding, ExternalBindingSet } from './externalRuntime.js'

export type AiSdkTool = ReturnType<typeof tool<any, any>> & {
	externalRuntime?: ExternalBinding['externalRuntime']
}

export type AiSdkToolSet = Record<string, AiSdkTool>

export type AiSdkRequestInput = {
	prompt: string | string[]
	bindings?: ExternalBindingSet | ExternalBinding[]
	skills?: Array<Pick<SkillDocument, 'name' | 'content'>>
	references?: Array<Pick<SkillReferenceDocument, 'skillName' | 'relativePath' | 'content'>>
	instructions?: string | string[]
	metadata?: Record<string, unknown>
	aiSdk?: Record<string, unknown>
	skillLabel?: string
	referenceLabel?: string
}

export type AiSdkRequest = {
	prompt: string
	metadata?: Record<string, unknown>
}

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

const normalizePromptParts = (input: string | string[] | undefined): string[] =>
	(Array.isArray(input) ? input : input ? [input] : []).map(entry => entry.trim()).filter(Boolean)

export const createAiSdkRequest = (input: AiSdkRequestInput): AiSdkRequest => {
	const existingAiSdk =
		input.metadata?.aiSdk && typeof input.metadata.aiSdk === 'object'
			? (input.metadata.aiSdk as Record<string, unknown>)
			: {}
	const prompt = [
		...normalizePromptParts(input.instructions),
		renderSkillDocuments(input.skillLabel ?? 'Relevant skills', input.skills ?? []),
		renderSkillReferences(input.referenceLabel ?? 'Relevant references', input.references ?? []),
		...normalizePromptParts(input.prompt),
	]
		.filter(Boolean)
		.join('\n\n')

	const aiSdkMetadata = {
		...existingAiSdk,
		...(input.aiSdk ?? {}),
		...(input.bindings ? { tools: toAiSdkTools(input.bindings) } : {}),
	}

	return {
		prompt,
		metadata: {
			...(input.metadata ?? {}),
			...(Object.keys(aiSdkMetadata).length > 0 ? { aiSdk: aiSdkMetadata } : {}),
		},
	}
}
