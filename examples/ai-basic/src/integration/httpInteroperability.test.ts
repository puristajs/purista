import type { ModelProvider, ProviderJsonRequest, ProviderJsonResponse, ProviderRequest } from '@purista/ai'
import { DefaultEventBridge, DefaultQueueBridge, initLogger, type Service } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { describe, expect, it } from 'vitest'

import { supportAgent } from '../agents/supportAgent/v1/supportAgent.js'
import { triageAgent } from '../agents/triageAgent/v1/triageAgent.js'
import { supportV1Service } from '../service/support/v1/index.js'

class DeterministicProvider implements ModelProvider {
	readonly name = 'deterministic-test-provider'
	readonly capabilities = { text: true, stream: true, json: true }

	async generate(request: ProviderRequest) {
		return {
			output: `HTTP:${request.prompt}`,
			tokens: {
				prompt: request.prompt.length,
				completion: 10,
			},
			costUsd: 0,
		}
	}

	stream(request: ProviderRequest) {
		return {
			async final() {
				return {
					output: `HTTP:${request.prompt}`,
					tokens: {
						prompt: request.prompt.length,
						completion: 10,
					},
				}
			},
			async *[Symbol.asyncIterator]() {
				yield {
					type: 'text-delta' as const,
					textDelta: `HTTP:${request.prompt}`,
				}
			},
		}
	}

	async generateJson<T = unknown>(_request: ProviderJsonRequest): Promise<ProviderJsonResponse<T>> {
		return {
			data: {
				urgency: 'low',
				explanation: 'deterministic explanation',
				nextSteps: 'deterministic next steps',
			} as T,
			text: '{"urgency":"low"}',
			tokens: {
				prompt: 1,
				completion: 1,
			},
		}
	}
}

const waitForRegistration = async () => {
	await new Promise(resolve => setTimeout(resolve, 25))
}

describe('ai-basic http interoperability flows', () => {
	it('serves stream, MCP and A2A endpoints through hono app', async () => {
		const logger = initLogger('error')
		const eventBridge = new DefaultEventBridge({ logger })
		await eventBridge.start()
		const queueBridge = new DefaultQueueBridge()

		const provider = new DeterministicProvider()
		const supportService = await supportV1Service.getInstance(eventBridge, { logger, queueBridge })
		const triageAgentInstance = await triageAgent.getInstance(eventBridge, {
			logger,
			models: { 'openai:gpt-4o-mini': provider },
			poolConfig: { maxConcurrencyPerInstance: 1 },
		})
		const supportAgentInstance = await supportAgent.getInstance(eventBridge, {
			logger,
			models: { 'openai:gpt-4o-mini': provider },
			queueBridge,
			poolConfig: { maxConcurrencyPerInstance: 2, poolId: 'support' },
		})

		await supportService.start()
		await triageAgentInstance.start()
		await supportAgentInstance.start()
		await waitForRegistration()

		const triageService = (triageAgentInstance as unknown as { service?: Service }).service
		const supportAgentService = (supportAgentInstance as unknown as { service?: Service }).service
		const httpService = await honoV1Service.getInstance(eventBridge, {
			logger,
			serviceConfig: {
				services: [supportService, supportAgentService, triageService].filter(
					(service): service is Service => service !== undefined,
				),
			},
		})
		await httpService.start()

		try {
			const streamResponse = await httpService.app.fetch(
				new Request('http://localhost/api/v1/support/ask/stream', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ prompt: 'hello' }),
				}),
			)
			expect(streamResponse.status).toBe(200)
			const streamText = await streamResponse.text()
			expect(streamText).toContain('event: chunk')
			expect(streamText).toContain('"kind":"message"')
			expect(streamText).toContain('"final":true')

			const mcpToolsResponse = await httpService.app.fetch(new Request('http://localhost/api/v1/support/mcp/tools'))
			expect(mcpToolsResponse.status).toBe(200)
			const mcpTools = (await mcpToolsResponse.json()) as { tools: Array<{ name: string }> }
			expect(mcpTools.tools.map(tool => tool.name)).toEqual(
				expect.arrayContaining(['supportAgent', 'triageAgent', 'support.1.lookupFaq']),
			)

			const mcpCallResponse = await httpService.app.fetch(
				new Request('http://localhost/api/v1/support/mcp/call', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ name: 'supportAgent', arguments: { prompt: 'hello' } }),
				}),
			)
			expect(mcpCallResponse.status).toBe(200)
			const mcpCall = (await mcpCallResponse.json()) as { content: unknown[] }
			expect(Array.isArray(mcpCall.content)).toBe(true)

			const mcpCommandCallResponse = await httpService.app.fetch(
				new Request('http://localhost/api/v1/support/mcp/call', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ name: 'support.1.calculate', arguments: { expression: '6*7' } }),
				}),
			)
			expect(mcpCommandCallResponse.status).toBe(200)
			const mcpCommandCall = (await mcpCommandCallResponse.json()) as {
				content: Array<{ type: string; json?: { result?: number } }>
			}
			expect(mcpCommandCall.content[0]?.type).toBe('json')
			expect(mcpCommandCall.content[0]?.json?.result).toBe(42)

			const a2aCallResponse = await httpService.app.fetch(
				new Request('http://localhost/api/v1/support/a2a/call', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ prompt: 'hello' }),
				}),
			)
			expect(a2aCallResponse.status).toBe(200)
			const a2aCall = (await a2aCallResponse.json()) as { messages: Array<{ frameType: string }> }
			expect(a2aCall.messages.length).toBeGreaterThan(0)
		} finally {
			await httpService.destroy()
			await supportAgentInstance.stop()
			await triageAgentInstance.stop()
			await supportService.destroy()
			await queueBridge.destroy()
			await eventBridge.destroy()
		}
	})
})
