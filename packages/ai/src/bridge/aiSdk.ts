import type { ModelMessage } from 'ai'
import { tool } from 'ai'
import {
	type AgentAttachment,
	type AgentFileInputPart,
	type AgentImageInputPart,
	type AgentInputPart,
	attachmentsToInputParts,
} from '../input/types.js'
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
	input?: AgentInputPart[]
	attachments?: AgentAttachment[]
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
	prompt?: string
	messages?: ModelMessage[]
	metadata?: Record<string, unknown>
}

const toBindingArray = (input: ExternalBindingSet | ExternalBinding[]) =>
	Array.isArray(input) ? input : Object.values(input)

export const toAiSdkToolName = (bindingName: string) => {
	const sanitized = bindingName.replace(/[^a-zA-Z0-9_-]/g, '_')
	return sanitized.length > 0 ? sanitized : 'tool'
}

export const toAiSdkTool = (binding: ExternalBinding): AiSdkTool => {
	const toolInput = {
		description: binding.description,
		inputSchema: binding.inputSchema,
		execute: async (payload: unknown) => await binding.execute(payload),
	}

	return Object.assign(tool(toolInput as unknown as Parameters<typeof tool>[0]), {
		externalRuntime: binding.externalRuntime,
	})
}

export const toAiSdkTools = (bindings: ExternalBindingSet | ExternalBinding[]): AiSdkToolSet => {
	const result: AiSdkToolSet = {}
	for (const binding of toBindingArray(bindings)) {
		const toolName = toAiSdkToolName(binding.name)
		if (toolName in result) {
			throw new Error(`Duplicate AI SDK tool name "${toolName}"`)
		}
		result[toolName] = toAiSdkTool(binding)
	}
	return result
}

const normalizePromptParts = (input: string | string[] | undefined): string[] =>
	(Array.isArray(input) ? input : input ? [input] : []).map(entry => entry.trim()).filter(Boolean)

const isNonTextInputPart = (part: AgentInputPart) => part.type !== 'text'

const toAiSdkBinaryContent = (part: AgentImageInputPart | AgentFileInputPart) =>
	part.type === 'image' ? part.image : part.data

const toAiSdkContentPart = (part: AgentInputPart) => {
	switch (part.type) {
		case 'text':
			return {
				type: 'text' as const,
				text: part.text,
			}
		case 'image':
			return {
				type: 'image' as const,
				image: toAiSdkBinaryContent(part),
				...(part.mediaType ? { mediaType: part.mediaType } : {}),
				...(part.detail
					? {
							providerOptions: {
								openai: {
									imageDetail: part.detail,
								},
							},
						}
					: {}),
			}
		case 'file':
			return {
				type: 'file' as const,
				data: toAiSdkBinaryContent(part),
				mediaType: part.mediaType,
				...(part.filename ? { filename: part.filename } : {}),
			}
	}
}

export const createAiSdkRequest = (input: AiSdkRequestInput): AiSdkRequest => {
	const existingAiSdk =
		input.metadata?.aiSdk && typeof input.metadata.aiSdk === 'object'
			? (input.metadata.aiSdk as Record<string, unknown>)
			: {}

	const promptParts = [
		...normalizePromptParts(input.instructions),
		renderSkillDocuments(input.skillLabel ?? 'Relevant skills', input.skills ?? []),
		renderSkillReferences(input.referenceLabel ?? 'Relevant references', input.references ?? []),
		...normalizePromptParts(input.prompt),
	].filter(Boolean)

	const normalizedInputParts = [...(input.input ?? []), ...attachmentsToInputParts(input.attachments)]
	const aiSdkMetadata = {
		...existingAiSdk,
		...(input.aiSdk ?? {}),
		...(input.bindings ? { tools: toAiSdkTools(input.bindings) } : {}),
	}

	if (normalizedInputParts.some(isNonTextInputPart)) {
		const textPrefix = promptParts.join('\n\n').trim()
		const content = [
			...(textPrefix.length > 0
				? [
						{
							type: 'text' as const,
							text: textPrefix,
						},
					]
				: []),
			...normalizedInputParts.map(toAiSdkContentPart),
		]

		return {
			messages: [
				{
					role: 'user',
					content,
				},
			],
			metadata: {
				...(input.metadata ?? {}),
				...(Object.keys(aiSdkMetadata).length > 0 ? { aiSdk: aiSdkMetadata } : {}),
			},
		}
	}

	const prompt = [
		...promptParts,
		...normalizedInputParts
			.filter((part): part is Extract<AgentInputPart, { type: 'text' }> => part.type === 'text')
			.map(part => part.text.trim())
			.filter(Boolean),
	].join('\n\n')

	return {
		prompt,
		metadata: {
			...(input.metadata ?? {}),
			...(Object.keys(aiSdkMetadata).length > 0 ? { aiSdk: aiSdkMetadata } : {}),
		},
	}
}
