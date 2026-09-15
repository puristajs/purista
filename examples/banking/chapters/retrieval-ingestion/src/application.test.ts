import { initDefaultStateStore, initLogger } from '@purista/core'
import { sqliteHarnessStorage } from '@purista/harness'
import { FakeModelProvider, textReply } from '@purista/harness/testing'
import type { HarnessUIApprovalDescriptor } from '@purista/harness-ai-sdk-ui/v1'
import {
	parseJsonEventStream,
	readUIMessageStream,
	type UIMessage,
	type UIMessageChunk,
	uiMessageChunkSchema,
} from 'ai'
import { describe, expect, it, vi } from 'vitest'
import { createKnowledgeApplication } from './createKnowledgeApplication.js'

const usage = { inputTokens: 4, outputTokens: 3, totalTokens: 7 }

async function fixture(provider = new FakeModelProvider({ strict: true })) {
	const logger = initLogger('fatal')
	const storage = sqliteHarnessStorage({ file: ':memory:' })
	const repository = {
		name: 'mockKnowledgeRepository',
		replaceRevision: vi.fn(),
		search: vi.fn(async () => [
			{
				documentId: 'transfer-guide',
				chunkIndex: 0,
				content: 'International transfers can remain pending for up to two business days.',
				score: 0.97,
			},
		]),
		destroy: vi.fn().mockResolvedValue(undefined),
	}
	const application = await createKnowledgeApplication(logger, {
		stateStore: initDefaultStateStore({ logger }),
		repository,
		models: {
			answering: { provider, model: 'fake-knowledge' },
			embedding: { provider, model: 'fake-embedding' },
		},
		embeddingDimensions: 4,
		storage,
	})
	return { application, repository, provider, storage }
}

async function destroy(
	application: Awaited<ReturnType<typeof createKnowledgeApplication>>,
	storage: ReturnType<typeof sqliteHarnessStorage>,
) {
	await new Promise<void>((resolve) => setImmediate(resolve))
	await application.http.prepareDestroy().destroy()
	await application.http.destroy()
	await application.knowledge.destroy()
	await application.identity.destroy()
	await application.repository.destroy()
	await application.stateStore.destroy()
	await application.eventBridge.destroy()
	await storage.close()
}

async function login(application: Awaited<ReturnType<typeof createKnowledgeApplication>>) {
	const response = await application.http.app.request('/api/v1/session/login', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ username: 'alex@example.test', password: 'demo-password' }),
	})
	expect(response.status).toBe(200)
	const session = (await response.json()) as { sessionToken: string; displayName: string }
	expect(session).toMatchObject({ displayName: 'Alex Example' })
	return session.sessionToken
}

async function readUiMessageStreamResponse(response: Response, initialMessage?: UIMessage) {
	if (!response.body) throw new Error('Expected an SSE response body')
	const chunks: UIMessageChunk[] = []
	for await (const parsed of parseJsonEventStream({ stream: response.body, schema: uiMessageChunkSchema })) {
		if (!parsed.success) throw parsed.error
		chunks.push(parsed.value as UIMessageChunk)
	}

	let message: UIMessage | undefined
	const stream = new ReadableStream<UIMessageChunk>({
		start(controller) {
			for (const chunk of chunks) controller.enqueue(chunk)
			controller.close()
		},
	})
	for await (const next of readUIMessageStream({
		message: initialMessage,
		stream,
		terminateOnError: true,
		onError: (error) => {
			throw error
		},
	})) {
		message = next
	}
	return { chunks, message }
}

type ApprovalRequestChunk = Extract<UIMessageChunk, { type: 'tool-approval-request' }> & {
	readonly approvalDescriptor: HarnessUIApprovalDescriptor
}

function approvalResponseMessage(
	message: UIMessage,
	approved: boolean,
	descriptor: ApprovalRequestChunk['approvalDescriptor'],
): UIMessage {
	return {
		...message,
		parts: message.parts.map((part) => {
			if (part.type !== 'dynamic-tool' || part.approval === undefined) return part
			return {
				...part,
				state: 'approval-responded',
				approval: {
					...part.approval,
					descriptor,
					approved,
					reason: approved ? 'Approved in the tutorial test.' : 'Rejected in the tutorial test.',
				},
			}
		}),
	} as UIMessage
}

async function postKnowledgeChat(
	application: Awaited<ReturnType<typeof createKnowledgeApplication>>,
	token: string,
	body: unknown,
) {
	return application.http.app.request('/api/v1/knowledge/chat', {
		method: 'POST',
		headers: {
			authorization: `Bearer ${token}`,
			'content-type': 'application/json',
			'x-tenant-id': 'attacker-tenant',
			'x-principal-id': 'attacker-principal',
		},
		body: JSON.stringify(body),
	})
}

describe('knowledge HTTP application', () => {
	it('keeps login public and blocks the protected stream before retrieval', async () => {
		const { application, repository, provider, storage } = await fixture()
		try {
			await login(application)

			const denied = await application.http.app.request('/api/v1/knowledge/chat', {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					'x-tenant-id': 'tenant-example',
					'x-principal-id': 'principal-alex',
				},
				body: JSON.stringify({
					id: 'chat-1',
					trigger: 'submit-message',
					collectionId: 'customer-help',
					messages: [
						{ id: 'user-1', role: 'user', parts: [{ type: 'text', text: 'How long are transfers pending?' }] },
					],
				}),
			})
			expect(denied.status).toBe(401)
			expect(repository.search).not.toHaveBeenCalled()
			provider.assertExhausted()
		} finally {
			await destroy(application, storage)
		}
	})

	it('returns an approval as HTTP 200, resumes the same agent, and scopes retrieval with the authenticated tenant', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueText(
			textReply('', {
				toolCalls: [
					{
						id: 'search-1',
						name: 'searchKnowledge',
						arguments: { collectionId: 'customer-help', query: 'international transfer pending time', limit: 4 },
					},
				],
				usage,
				finishReason: 'tool_calls',
			}),
		)
		provider.enqueueEmbedding({ embeddings: [{ index: 0, vector: [0.1, 0.2, 0.3, 0.4] }], usage })
		provider.enqueueText(
			textReply('International transfers can remain pending for up to two business days [transfer-guide#0].', {
				toolCalls: [],
				usage,
				finishReason: 'stop',
			}),
		)
		const { application, repository, storage } = await fixture(provider)
		try {
			const token = await login(application)
			const headers = {
				authorization: `Bearer ${token}`,
				'content-type': 'application/json',
				'x-tenant-id': 'attacker-tenant',
				'x-principal-id': 'attacker-principal',
			}
			const input = {
				collectionId: 'customer-help',
				question: 'How long can an international transfer remain pending?',
				conversationId: 'transfer-question',
			}
			const interruptedResponse = await application.http.app.request('/api/v1/knowledge/answer', {
				method: 'POST',
				headers,
				body: JSON.stringify(input),
			})
			expect(interruptedResponse.status).toBe(200)
			const interrupted = (await interruptedResponse.json()) as {
				sessionId: string
				outcome: {
					status: 'interrupted'
					runId: string
					interrupt: { id: string; revision: string; requests: Array<{ approvalId: string }> }
				}
			}
			expect(interrupted.outcome.status).toBe('interrupted')
			expect(repository.search).not.toHaveBeenCalled()

			const request = interrupted.outcome.interrupt.requests[0]
			if (!request) throw new Error('Expected one tool approval request')
			const completedResponse = await application.http.app.request('/api/v1/knowledge/answer', {
				method: 'POST',
				headers,
				body: JSON.stringify({
					...input,
					resume: {
						type: 'tool-approval',
						runId: interrupted.outcome.runId,
						interruptId: interrupted.outcome.interrupt.id,
						revision: interrupted.outcome.interrupt.revision,
						eventId: 'tutorial-approval-1',
						decisions: [{ approvalId: request.approvalId, approved: true }],
					},
				}),
			})
			expect(completedResponse.status).toBe(200)
			const completed = (await completedResponse.json()) as {
				sessionId: string
				outcome: { status: string; runId: string; output: string }
			}
			expect(completed).toMatchObject({
				sessionId: interrupted.sessionId,
				outcome: {
					status: 'completed',
					runId: interrupted.outcome.runId,
					output: expect.stringContaining('[transfer-guide#0]'),
				},
			})
			expect(repository.search).toHaveBeenCalledWith(
				expect.objectContaining({
					tenantId: 'tenant-example',
					collectionId: 'customer-help',
					queryEmbedding: [0.1, 0.2, 0.3, 0.4],
				}),
			)
			provider.assertExhausted()
		} finally {
			await destroy(application, storage)
		}
	})

	it('resumes a rejected approval without querying the repository', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueText(
			textReply('', {
				toolCalls: [
					{
						id: 'search-rejected',
						name: 'searchKnowledge',
						arguments: { collectionId: 'customer-help', query: 'internal transfer policy', limit: 4 },
					},
				],
				usage,
				finishReason: 'tool_calls',
			}),
		)
		provider.enqueueText(
			textReply('I cannot retrieve evidence because the search was not approved.', {
				toolCalls: [],
				usage,
				finishReason: 'stop',
			}),
		)
		const { application, repository, storage } = await fixture(provider)
		try {
			const token = await login(application)
			const headers = { authorization: `Bearer ${token}`, 'content-type': 'application/json' }
			const input = {
				collectionId: 'customer-help',
				question: 'What is the internal transfer policy?',
				conversationId: 'rejected-search',
			}
			const interruptedResponse = await application.http.app.request('/api/v1/knowledge/answer', {
				method: 'POST',
				headers,
				body: JSON.stringify(input),
			})
			expect(interruptedResponse.status).toBe(200)
			const interrupted = (await interruptedResponse.json()) as {
				sessionId: string
				outcome: {
					status: 'interrupted'
					runId: string
					interrupt: { id: string; revision: string; requests: Array<{ approvalId: string }> }
				}
			}
			const request = interrupted.outcome.interrupt.requests[0]
			if (!request) throw new Error('Expected one tool approval request')

			const completedResponse = await application.http.app.request('/api/v1/knowledge/answer', {
				method: 'POST',
				headers,
				body: JSON.stringify({
					...input,
					resume: {
						type: 'tool-approval',
						runId: interrupted.outcome.runId,
						interruptId: interrupted.outcome.interrupt.id,
						revision: interrupted.outcome.interrupt.revision,
						eventId: 'tutorial-rejection-1',
						decisions: [{ approvalId: request.approvalId, approved: false, reason: 'Do not search.' }],
					},
				}),
			})
			expect(completedResponse.status).toBe(200)
			expect(await completedResponse.json()).toMatchObject({
				sessionId: interrupted.sessionId,
				outcome: {
					status: 'completed',
					runId: interrupted.outcome.runId,
					output: expect.stringContaining('not approved'),
				},
			})
			expect(repository.search).not.toHaveBeenCalled()
			provider.assertExhausted()
		} finally {
			await destroy(application, storage)
		}
	})

	it.each([
		['accepts', true, 'International transfers can remain pending for up to two business days [transfer-guide#0].'],
		['rejects', false, 'I cannot retrieve evidence because the search was not approved.'],
	] as const)(
		'serves an authenticated AI SDK UI v1 stream and %s a tool approval over HTTP',
		async (_label, approved, expectedOutput) => {
			const provider = new FakeModelProvider({ strict: true })
			provider.enqueueTextStream([
				{
					kind: 'tool_call',
					call: {
						id: 'search-http-1',
						name: 'searchKnowledge',
						arguments: { collectionId: 'customer-help', query: 'international transfer pending time', limit: 4 },
					},
				},
				{ kind: 'finish', usage, finishReason: 'tool_calls' },
			])
			if (approved) {
				provider.enqueueEmbedding({ embeddings: [{ index: 0, vector: [0.1, 0.2, 0.3, 0.4] }], usage })
			}
			provider.enqueueTextStream([
				{ kind: 'delta', text: expectedOutput },
				{ kind: 'finish', usage, finishReason: 'stop' },
			])
			const { application, repository, storage } = await fixture(provider)
			try {
				const token = await login(application)
				const sessionId = `http-${approved ? 'accept' : 'reject'}`
				const initialResponse = await postKnowledgeChat(application, token, {
					id: sessionId,
					trigger: 'submit-message',
					collectionId: 'customer-help',
					messages: [
						{
							id: 'user-http-1',
							role: 'user',
							parts: [{ type: 'text', text: 'How long can an international transfer remain pending?' }],
						},
					],
				})
				expect(initialResponse.status).toBe(200)
				expect(initialResponse.headers.get('content-type')).toContain('text/event-stream')
				expect(initialResponse.headers.get('x-vercel-ai-ui-message-stream')).toBe('v1')
				const initial = await readUiMessageStreamResponse(initialResponse)
				expect(initial.chunks).toContainEqual(
					expect.objectContaining({ type: 'tool-input-available', toolName: 'searchKnowledge' }),
				)
				expect(initial.chunks).toContainEqual(expect.objectContaining({ type: 'tool-approval-request' }))
				expect(initial.chunks).toContainEqual(
					expect.objectContaining({ type: 'data-status', data: expect.objectContaining({ phase: 'interrupted' }) }),
				)
				expect(initial.chunks.at(-1)).toEqual(expect.objectContaining({ type: 'finish', finishReason: 'tool-calls' }))
				expect(initial.message?.parts).toContainEqual(
					expect.objectContaining({ type: 'dynamic-tool', state: 'approval-requested', toolName: 'searchKnowledge' }),
				)

				if (!initial.message) throw new Error('Expected an assistant approval message')
				const approvalChunk = initial.chunks.find(
					(chunk): chunk is ApprovalRequestChunk => chunk.type === 'tool-approval-request',
				)
				if (!approvalChunk) throw new Error('Expected an approval request chunk')
				const resumedResponse = await postKnowledgeChat(application, token, {
					id: sessionId,
					trigger: 'submit-message',
					messageId: initial.message.id,
					collectionId: 'customer-help',
					messages: [
						{
							id: 'user-http-1',
							role: 'user',
							parts: [{ type: 'text', text: 'How long can an international transfer remain pending?' }],
						},
						approvalResponseMessage(initial.message, approved, approvalChunk.approvalDescriptor),
					],
				})
				expect(resumedResponse.status).toBe(200)
				const resumed = await readUiMessageStreamResponse(resumedResponse, initial.message)
				expect(resumed.chunks).toContainEqual(
					expect.objectContaining({ type: 'data-status', data: expect.objectContaining({ phase: 'completed' }) }),
				)
				expect(resumed.message?.parts).toContainEqual(expect.objectContaining({ type: 'text', text: expectedOutput }))
				expect(
					resumed.message?.parts.some((part) => part.type === 'text' && part.text.includes('[transfer-guide#0]')),
				).toBe(approved)
				expect(repository.search).toHaveBeenCalledTimes(approved ? 1 : 0)
				if (approved) {
					expect(repository.search).toHaveBeenCalledWith(
						expect.objectContaining({
							tenantId: 'tenant-example',
							collectionId: 'customer-help',
							queryEmbedding: [0.1, 0.2, 0.3, 0.4],
						}),
					)
				}
				provider.assertExhausted()
			} finally {
				await destroy(application, storage)
			}
		},
	)
})
