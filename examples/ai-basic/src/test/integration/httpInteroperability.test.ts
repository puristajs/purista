import { DefaultEventBridge, DefaultQueueBridge, initLogger, type Service } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { describe, expect, it, vi } from 'vitest'

import { resetExampleConversationStore } from '../../service/desk/v1/exampleConversationStore.js'
import { deskV1Service } from '../../service/desk/v1/index.js'
import { deterministicModelProvider } from '../deterministicModelProvider.js'

const waitForRegistration = async () => {
	await new Promise(resolve => setTimeout(resolve, 25))
}

describe('ai-basic http interoperability flows', () => {
	it('serves stream, MCP and A2A endpoints through hono app', async () => {
		const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
			const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
			if (url.startsWith('https://purista.dev/handbook')) {
				return {
					ok: true,
					status: 200,
					url: 'https://purista.dev/handbook/',
					text: async () =>
						'<html><head><title>PURISTA Handbook</title></head><body><main><h1>Building Agents</h1><p>Focus on builders, attached agents, planner execution, runtime context, tools, streaming, and skills.</p></main></body></html>',
				} satisfies Pick<Response, 'ok' | 'status' | 'url' | 'text'>
			}
			throw new Error(`Unexpected fetch URL in test: ${url}`)
		})
		vi.stubGlobal('fetch', fetchMock)

		const logger = initLogger('error')
		const eventBridge = new DefaultEventBridge({ logger })
		await eventBridge.start()
		const queueBridge = new DefaultQueueBridge()
		const conversationStore = resetExampleConversationStore()

		const deskService = await deskV1Service.getInstance(eventBridge, {
			logger,
			queueBridge,
			ai: {
				conversationStore,
				model: {
					'openai:gpt-4o-mini': deterministicModelProvider,
				},
			},
		})

		await deskService.start()
		await waitForRegistration()

		const httpService = await honoV1Service.getInstance(eventBridge, {
			logger,
			serviceConfig: {},
		})
		httpService.registerService(...[deskService].filter((service): service is Service => service !== undefined))
		await httpService.start()

		try {
			const chatResponse = await httpService.app.fetch(
				new Request('http://localhost/api/v1/agents/deskChatAgent', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({
						sessionId: 'history-1',
						prompt: 'Explain PURISTA service and agent boundaries to a new developer.',
					}),
				}),
			)
			expect(chatResponse.status).toBe(200)
			expect(chatResponse.headers.get('content-type')).toContain('text/event-stream')

			const chatStream = await chatResponse.text()
			expect(chatStream).toContain('"type":"text-delta"')
			expect(chatStream).toContain('"type":"finish"')

			const historyResponse = await httpService.app.fetch(
				new Request('http://localhost/api/v1/desk/history/load', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({
						sessionId: 'history-1',
						scenario: 'chat',
					}),
				}),
			)
			expect(historyResponse.status).toBe(200)
			const historyBody = (await historyResponse.json()) as {
				found: boolean
				messages: Array<{ role: string; content: string }>
			}
			expect(historyBody.found).toBe(true)
			expect(historyBody.messages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({ role: 'user' }),
					expect.objectContaining({ role: 'assistant' }),
				]),
			)

			const recentHistoryResponse = await httpService.app.fetch(
				new Request('http://localhost/api/v1/desk/history/recent', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ limit: 10 }),
				}),
			)
			expect(recentHistoryResponse.status).toBe(200)
			const recentHistoryBody = (await recentHistoryResponse.json()) as {
				items: Array<{ sessionId: string; scenario: string; firstMessage: string }>
			}
			expect(recentHistoryBody.items).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						sessionId: 'history-1',
						scenario: 'chat',
					}),
				]),
			)

			const researchResponse = await httpService.app.fetch(
				new Request('http://localhost/api/v1/agents/researchAgent', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({
						prompt: 'Fetch https://purista.dev/handbook and summarize the agent topics.',
					}),
				}),
			)
			expect(researchResponse.status).toBe(200)
			expect(researchResponse.headers.get('content-type')).toContain('text/event-stream')

			const researchStream = await researchResponse.text()
			expect(researchStream.indexOf('"type":"start"')).toBeGreaterThanOrEqual(0)
			expect(researchStream.indexOf('"type":"text-start"')).toBeGreaterThanOrEqual(0)
			expect(researchStream.indexOf('"type":"text-start"')).toBeLessThan(researchStream.indexOf('"type":"text-delta"'))
			expect(researchStream).toContain('"type":"tool-input-start"')
			expect(researchStream).toContain('https://purista.dev/handbook')
			expect(researchStream).toContain('"type":"tool-output-available"')
			expect(researchStream).toContain('"type":"text-delta"')
			expect(researchStream.match(/"type":"finish"/g)?.length ?? 0).toBe(1)
			expect(researchStream).toContain('"type":"finish"')

			const architectureResponse = await httpService.app.fetch(
				new Request('http://localhost/api/v1/agents/architectureReviewAgent', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({
						prompt: 'Review the architecture readiness of a queue-backed multi-agent platform.',
					}),
				}),
			)
			expect(architectureResponse.status).toBe(200)
			expect(architectureResponse.headers.get('content-type')).toContain('text/event-stream')

			const architectureStream = await architectureResponse.text()
			expect(architectureStream).toContain('"type":"data-')
			expect(architectureStream).toContain('"type":"finish"')

			const plannerResponse = await httpService.app.fetch(
				new Request('http://localhost/api/v1/agents/deliveryPlannerAgent', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({
						sessionId: 'history-planner-1',
						prompt: 'Plan how to evaluate a risky architecture change for a streaming developer platform.',
					}),
				}),
			)
			expect(plannerResponse.status).toBe(200)
			expect(plannerResponse.headers.get('content-type')).toContain('text/event-stream')

			const plannerStream = await plannerResponse.text()
			expect(plannerStream).toContain('"type":"data-purista-ai-plan"')
			expect(plannerStream).toContain('"type":"data-purista-ai-task"')
			expect(plannerStream).toContain('"type":"data-purista-ai-task-chunk"')
			expect(plannerStream).toContain('"type":"data-purista-ai-workflow-stage"')
			expect(plannerStream).toContain('"status":"completed"')
			expect(plannerStream).toContain('"type":"data-output"')
			expect(plannerStream).toContain('"type":"text-delta"')
			expect(plannerStream).toContain('# Evaluation outcome')
			expect(plannerStream).toContain('Recommended next actions')
			expect(plannerStream.match(/"type":"finish"/g)?.length ?? 0).toBe(1)
			expect(plannerStream).toContain('"type":"finish"')

			const plannerHistoryResponse = await httpService.app.fetch(
				new Request('http://localhost/api/v1/desk/history/load', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({
						sessionId: 'history-planner-1',
						scenario: 'planner',
					}),
				}),
			)
			expect(plannerHistoryResponse.status).toBe(200)
			const plannerHistoryBody = (await plannerHistoryResponse.json()) as {
				found: boolean
				messages: Array<{ role: string; content: string }>
			}
			expect(plannerHistoryBody.found).toBe(true)
			expect(plannerHistoryBody.messages).toEqual(
				expect.arrayContaining([expect.objectContaining({ role: 'assistant' })]),
			)

			const reflectionResponse = await httpService.app.fetch(
				new Request('http://localhost/api/v1/agents/reflectionAgent', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({
						prompt: 'Draft a rollout proposal for planner-driven orchestration.',
					}),
				}),
			)
			expect(reflectionResponse.status).toBe(200)
			expect(reflectionResponse.headers.get('content-type')).toContain('text/event-stream')

			const reflectionStream = await reflectionResponse.text()
			expect(reflectionStream).toContain('reflection')
			expect(reflectionStream).toContain('"type":"finish"')

			const mcpToolsResponse = await httpService.app.fetch(new Request('http://localhost/api/v1/desk/mcp/tools'))
			expect(mcpToolsResponse.status).toBe(200)
			const mcpTools = (await mcpToolsResponse.json()) as { tools: Array<{ name: string }> }
			expect(mcpTools.tools.map(tool => tool.name)).toEqual(
				expect.arrayContaining(['researchAgent', 'desk.1.calculate', 'desk.1.lookupFaq']),
			)

			const mcpCommandCallResponse = await httpService.app.fetch(
				new Request('http://localhost/api/v1/desk/mcp/call', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ name: 'desk.1.calculate', arguments: { expression: '6*7' } }),
				}),
			)
			expect(mcpCommandCallResponse.status).toBe(200)
		} finally {
			vi.unstubAllGlobals()
			await httpService.destroy()
			await deskService.destroy()
			await queueBridge.destroy()
			await eventBridge.destroy()
		}
	})
})
