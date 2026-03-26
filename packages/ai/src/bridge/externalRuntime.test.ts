import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { createAiSdkRequest, toAiSdkTool, toAiSdkToolName, toAiSdkTools } from './aiSdk.js'
import {
	createAgentBinding,
	createBindingsMetadata,
	createCommandBinding,
	createExposeHelpers,
	createExternalBindings,
	getExternalRuntimeMetadata,
} from './externalRuntime.js'

describe('external runtime bindings', () => {
	it('creates command bindings with neutral metadata', async () => {
		const execute = vi.fn(async payload => ({ ok: true, payload }))
		const binding = createCommandBinding({
			command: {
				serviceName: 'support',
				serviceVersion: '1',
				commandName: 'lookupFaq',
				payloadSchema: z.object({ question: z.string() }),
			},
			execute,
		})

		expect(binding.description).toContain('support.1.lookupFaq')
		expect(binding.externalRuntime).toMatchObject({
			kind: 'command',
			descriptor: {
				serviceName: 'support',
				serviceVersion: '1',
				commandName: 'lookupFaq',
				bindingName: 'support.1.lookupFaq',
			},
		})

		await binding.execute({ question: 'What is PURISTA?' })
		expect(execute).toHaveBeenCalledWith({ question: 'What is PURISTA?' })
	})

	it('supports explicit binding names and descriptions', () => {
		const binding = createCommandBinding({
			command: {
				serviceName: 'support',
				serviceVersion: '1',
				commandName: 'lookupFaq',
			},
			name: 'faq.lookup',
			description: 'Lookup FAQ entries',
			execute: async () => 'ok',
		})

		expect(binding.name).toBe('faq.lookup')
		expect(binding.description).toBe('Lookup FAQ entries')
		expect(binding.inputSchema).toBeUndefined()
	})

	it('creates a deduplicated binding set', () => {
		const bindings = createExternalBindings({
			commands: [
				{
					command: {
						serviceName: 'support',
						serviceVersion: '1',
						commandName: 'lookupFaq',
					},
					execute: async () => 'ok',
				},
			],
		})

		expect(Object.keys(bindings)).toEqual(['support.1.lookupFaq'])
	})

	it('rejects duplicate binding names across commands and agents', () => {
		expect(() =>
			createExternalBindings({
				commands: [
					{
						command: {
							serviceName: 'support',
							serviceVersion: '1',
							commandName: 'lookupFaq',
							toolName: 'shared.binding',
						},
						execute: async () => 'ok',
					},
				],
				agents: [
					{
						agent: {
							agentName: 'architectureAgent',
							agentVersion: '1',
							toolName: 'shared.binding',
						},
						execute: async () => 'ok',
					},
				],
			}),
		).toThrow('Duplicate external binding name "shared.binding"')
	})

	it('bridges allowed commands and agents from handler context', async () => {
		const lookupFaq = vi.fn(async payload => ({
			answer: String((payload as { question: string }).question).toUpperCase(),
		}))
		const invoke = vi.fn(async () => [
			{
				frame: {
					kind: 'message',
					role: 'assistant',
					content: 'ARCHITECTURE OK',
					final: true,
				},
			},
		])
		const emitToolEvent = vi.fn()

		const expose = createExposeHelpers({
			app: {
				manifest: {
					agentName: 'supportAgent',
					agentVersion: '1',
					eventBridge: 'default',
					allowedTools: [
						{
							serviceName: 'support',
							serviceVersion: '1',
							commandName: 'lookupFaq',
							payloadSchema: z.object({ question: z.string() }),
						},
					],
					allowedAgents: [
						{
							agentName: 'architectureAgent',
							agentVersion: '1',
							payloadSchema: z.object({ prompt: z.string() }),
						},
					],
				},
			},
			invoke: {
				tools: {
					list: () => [],
					invoke: {
						support: {
							'1': {
								lookupFaq,
							},
						},
					},
				},
				agents: {
					invoke,
					runText: vi.fn(),
					runObject: vi.fn(),
					forward: vi.fn(),
				},
			},
			io: {
				protocol: {
					emitToolEvent,
				},
			},
		})

		const bindings = expose.tools({
			commands: [{ serviceName: 'support', serviceVersion: '1', commandName: 'lookupFaq' }],
			agents: [{ agentName: 'architectureAgent', agentVersion: '1', resultMode: 'text' }],
		})

		await bindings['support.1.lookupFaq'].execute({ question: 'hello' })
		await bindings['architectureAgent.1.run'].execute({ prompt: 'draft' })

		expect(lookupFaq).toHaveBeenCalledWith({ question: 'hello' }, undefined)
		expect(invoke).toHaveBeenCalledWith({
			agentName: 'architectureAgent',
			agentVersion: '1',
			payload: { prompt: 'draft' },
			emitInvocationToolEvents: false,
			parameter: undefined,
		})
		expect(emitToolEvent).toHaveBeenCalled()
		expect(expose.metadata()).toMatchObject({
			commands: [{ serviceName: 'support', serviceVersion: '1', commandName: 'lookupFaq' }],
			agents: [{ agentName: 'architectureAgent', agentVersion: '1' }],
		})
	})

	it('rejects undeclared commands and agents from the runtime bridge', async () => {
		const expose = createExposeHelpers({
			app: {
				manifest: {
					agentName: 'supportAgent',
					agentVersion: '1',
					eventBridge: 'default',
					allowedTools: [],
					allowedAgents: [],
				},
			},
			invoke: {
				tools: { list: () => [], invoke: {} },
				agents: {
					invoke: vi.fn(),
					runText: vi.fn(),
					runObject: vi.fn(),
					forward: vi.fn(),
				},
			},
			io: { protocol: { emitToolEvent: vi.fn() } },
		})

		expect(() =>
			expose.tool({
				serviceName: 'support',
				serviceVersion: '1',
				commandName: 'lookupFaq',
			}),
		).toThrow(/canInvoke/)
		expect(() =>
			expose.agent({
				agentName: 'architectureAgent',
				agentVersion: '1',
			}),
		).toThrow(/canInvokeAgent/)
	})

	it('keeps agent result mode on the neutral binding and adapts it to AI SDK tools', async () => {
		const binding = createAgentBinding({
			agent: {
				agentName: 'reportAgent',
				agentVersion: '1',
				payloadSchema: z.object({ id: z.string() }),
			},
			resultMode: 'object',
			execute: async payload => ({ id: (payload as { id: string }).id }),
		})

		const aiSdkTool = toAiSdkTool(binding)
		const toolSet = toAiSdkTools([binding])

		expect(binding.resultMode).toBe('object')
		expect(aiSdkTool.externalRuntime?.descriptor.bindingName).toBe('reportAgent.1.run')
		expect(toolSet.reportAgent_1_run).toBeDefined()
		expect(await aiSdkTool.execute?.({ id: '42' }, {} as never)).toEqual({ id: '42' })
	})

	it('supports protocol and object result modes from bridged agents', async () => {
		const emitToolEvent = vi.fn()
		const expose = createExposeHelpers({
			app: {
				manifest: {
					agentName: 'supportAgent',
					agentVersion: '1',
					eventBridge: 'default',
					allowedTools: [],
					allowedAgents: [
						{
							agentName: 'reportAgent',
							agentVersion: '1',
							payloadSchema: z.object({ id: z.string() }),
						},
					],
				},
			},
			invoke: {
				tools: { list: () => [], invoke: {} },
				agents: {
					invoke: vi
						.fn()
						.mockResolvedValueOnce([
							{
								frame: {
									kind: 'message',
									role: 'assistant',
									content: '{"id":"42"}',
									final: true,
								},
							},
						])
						.mockResolvedValueOnce([
							{
								frame: {
									kind: 'message',
									role: 'assistant',
									content: 'protocol reply',
									final: true,
								},
							},
						]),
					runText: vi.fn(),
					runObject: vi.fn(),
					forward: vi.fn(),
				},
			},
			io: { protocol: { emitToolEvent } },
		})

		const objectBinding = expose.agent(
			{
				agentName: 'reportAgent',
				agentVersion: '1',
			},
			{ resultMode: 'object', name: 'report.object' },
		)
		const protocolBinding = expose.agent(
			{
				agentName: 'reportAgent',
				agentVersion: '1',
			},
			{ resultMode: 'protocol', name: 'report.protocol' },
		)

		await expect(objectBinding.execute({ id: '42' })).resolves.toEqual({ id: '42' })
		await expect(protocolBinding.execute({ id: '42' })).resolves.toEqual([
			{
				frame: {
					kind: 'message',
					role: 'assistant',
					content: 'protocol reply',
					final: true,
				},
			},
		])
		expect(emitToolEvent).toHaveBeenCalledWith(
			expect.objectContaining({ toolName: 'report.object', status: 'success', output: { id: '42' } }),
		)
		expect(emitToolEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				toolName: 'report.protocol',
				status: 'success',
				output: expect.any(Array),
			}),
		)
	})

	it('extracts text results when the delegated agent only streams partial assistant frames', async () => {
		const expose = createExposeHelpers({
			app: {
				manifest: {
					agentName: 'supportAgent',
					agentVersion: '1',
					eventBridge: 'default',
					allowedTools: [],
					allowedAgents: [{ agentName: 'reportAgent', agentVersion: '1' }],
				},
			},
			invoke: {
				tools: { list: () => [], invoke: {} },
				agents: {
					invoke: vi
						.fn()
						.mockResolvedValue([
							{ frame: { kind: 'message', role: 'assistant', content: 'Hello ' } },
							{ frame: { kind: 'message', role: 'assistant', content: 'World' } },
						]),
					runText: vi.fn(),
					runObject: vi.fn(),
					forward: vi.fn(),
				},
			},
			io: { protocol: { emitToolEvent: vi.fn() } },
		})

		const binding = expose.agent({ agentName: 'reportAgent', agentVersion: '1' })

		await expect(binding.execute({})).resolves.toBe('Hello World')
	})

	it('returns an empty text result when delegated agent frames contain no assistant messages', async () => {
		const expose = createExposeHelpers({
			app: {
				manifest: {
					agentName: 'supportAgent',
					agentVersion: '1',
					eventBridge: 'default',
					allowedTools: [],
					allowedAgents: [{ agentName: 'reportAgent', agentVersion: '1' }],
				},
			},
			invoke: {
				tools: { list: () => [], invoke: {} },
				agents: {
					invoke: vi.fn().mockResolvedValue([{ frame: { kind: 'reasoning', content: 'thinking' } }]),
					runText: vi.fn(),
					runObject: vi.fn(),
					forward: vi.fn(),
				},
			},
			io: { protocol: { emitToolEvent: vi.fn() } },
		})

		const binding = expose.agent({ agentName: 'reportAgent', agentVersion: '1' })

		await expect(binding.execute({})).resolves.toBe('')
	})

	it('exposes metadata helpers for manifests and definitions', () => {
		const metadata = createBindingsMetadata({
			allowedTools: [{ serviceName: 'support', serviceVersion: '1', commandName: 'lookupFaq' }],
			allowedAgents: [{ agentName: 'architectureAgent', agentVersion: '1' }],
		})

		expect(metadata).toEqual({
			commands: [{ serviceName: 'support', serviceVersion: '1', commandName: 'lookupFaq' }],
			agents: [{ agentName: 'architectureAgent', agentVersion: '1' }],
		})
		expect(
			getExternalRuntimeMetadata({
				getExternalRuntimeMetadata: () => metadata,
			}),
		).toBe(metadata)
	})

	it('rejects duplicate AI SDK tool names after adapter conversion', () => {
		const first = createCommandBinding({
			command: {
				serviceName: 'support',
				serviceVersion: '1',
				commandName: 'lookupFaq',
				toolName: 'shared',
			},
			execute: async () => 'ok',
		})
		const second = createCommandBinding({
			command: {
				serviceName: 'support',
				serviceVersion: '1',
				commandName: 'lookupBilling',
				toolName: 'shared',
			},
			execute: async () => 'ok',
		})

		expect(() => toAiSdkTools([first, second])).toThrow('Duplicate AI SDK tool name "shared"')
	})

	it('sanitizes dotted binding names into provider-safe AI SDK tool names', () => {
		expect(toAiSdkToolName('support.1.lookupFaq')).toBe('support_1_lookupFaq')
		expect(toAiSdkToolName('architectureAgent.1.run')).toBe('architectureAgent_1_run')
	})

	it('rejects duplicate AI SDK tool names after sanitization', () => {
		const first = createCommandBinding({
			command: {
				serviceName: 'support',
				serviceVersion: '1',
				commandName: 'lookupFaq',
			},
			name: 'support.1.lookupFaq',
			execute: async () => 'ok',
		})
		const second = createCommandBinding({
			command: {
				serviceName: 'support',
				serviceVersion: '1',
				commandName: 'lookupFaqV2',
			},
			name: 'support_1_lookupFaq',
			execute: async () => 'ok',
		})

		expect(() => toAiSdkTools([first, second])).toThrow('Duplicate AI SDK tool name "support_1_lookupFaq"')
	})

	it('builds AI SDK requests with rendered skills and explicit tool bindings', () => {
		const bindings = createExternalBindings({
			commands: [
				{
					command: {
						serviceName: 'support',
						serviceVersion: '1',
						commandName: 'lookupFaq',
					},
					execute: async () => 'ok',
				},
			],
		})

		const request = createAiSdkRequest({
			instructions: 'Use the provided tools before answering.',
			skills: [{ name: 'spec-elicitation', content: 'Ask for missing requirements first.' }],
			prompt: 'Customer prompt: design a support workflow',
			bindings,
			aiSdk: {
				toolChoice: 'required',
			},
		})

		expect(request.prompt).toContain('Relevant skills')
		expect(request.prompt).toContain('spec-elicitation')
		expect(request.prompt).toContain('Customer prompt: design a support workflow')
		expect((request.metadata?.aiSdk as { tools?: Record<string, unknown>; toolChoice?: string }).toolChoice).toBe(
			'required',
		)
		expect(Object.keys((request.metadata?.aiSdk as { tools: Record<string, unknown> }).tools)).toEqual([
			'support_1_lookupFaq',
		])
	})

	it('merges existing AI SDK metadata with rendered binding metadata', () => {
		const request = createAiSdkRequest({
			prompt: 'Customer prompt',
			metadata: {
				aiSdk: {
					toolChoice: 'required',
					parallelToolCalls: false,
				},
			},
		})

		expect((request.metadata?.aiSdk as { toolChoice?: string; parallelToolCalls?: boolean }).toolChoice).toBe(
			'required',
		)
		expect((request.metadata?.aiSdk as { toolChoice?: string; parallelToolCalls?: boolean }).parallelToolCalls).toBe(
			false,
		)
	})

	it('builds AI SDK multimodal requests with text, images, and files', () => {
		const request = createAiSdkRequest({
			prompt: 'Please analyze these references',
			input: [
				{
					type: 'text',
					text: 'Focus on the user-visible error state.',
				},
				{
					type: 'image',
					image: new URL('https://example.com/mockup.png'),
					mediaType: 'image/png',
					detail: 'high',
				},
			],
			attachments: [
				{
					attachmentId: 'pdf-1',
					mediaType: 'application/pdf',
					filename: 'brief.pdf',
					source: {
						kind: 'url',
						url: 'https://example.com/brief.pdf',
					},
				},
			],
		})

		expect(request.prompt).toBeUndefined()
		expect(request.messages).toEqual([
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: 'Please analyze these references',
					},
					{
						type: 'text',
						text: 'Focus on the user-visible error state.',
					},
					{
						type: 'image',
						image: new URL('https://example.com/mockup.png'),
						mediaType: 'image/png',
						providerOptions: {
							openai: {
								imageDetail: 'high',
							},
						},
					},
					{
						type: 'file',
						data: new URL('https://example.com/brief.pdf'),
						mediaType: 'application/pdf',
						filename: 'brief.pdf',
					},
				],
			},
		])
	})
})
