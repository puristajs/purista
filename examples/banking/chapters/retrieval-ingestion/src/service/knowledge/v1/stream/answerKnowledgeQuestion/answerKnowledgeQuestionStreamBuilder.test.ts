import { createHash } from 'node:crypto'
import { createStreamContextMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'
import { answerKnowledgeQuestionStreamBuilder } from './answerKnowledgeQuestionStreamBuilder.js'

const sandbox = createSandbox()
const usage = { inputTokens: 2, outputTokens: 2, totalTokens: 4 }

function trustedSessionId(transportId: string) {
	return createHash('sha256')
		.update(JSON.stringify(['mocked-tenant-id', 'mocked-principal-id', 'customer-help', transportId]))
		.digest('base64url')
}

afterEach(() => sandbox.restore())

function completedEvents(runId: string, sessionId: string) {
	const outcome = { status: 'completed' as const, runId, output: 'Grounded answer [guide-1#0].' }
	return {
		runId,
		sessionId,
		result: Promise.resolve(outcome),
		terminal: Promise.resolve(outcome),
		cancel: sandbox.stub().resolves(),
		async *[Symbol.asyncIterator]() {
			yield { type: 'run.started' as const, eventId: 'event-1', sequence: 1, runId, at: new Date(0).toISOString() }
			yield {
				type: 'output.text.delta' as const,
				eventId: 'event-2',
				sequence: 2,
				runId,
				id: 'answer-1',
				delta: 'Grounded answer [guide-1#0].',
			}
			yield {
				type: 'model.completed' as const,
				eventId: 'event-3',
				sequence: 3,
				runId,
				modelAlias: 'model',
				streamId: 'answer-1',
				operation: 'textStream' as const,
				usage,
			}
			yield {
				type: 'run.finished' as const,
				eventId: 'event-4',
				sequence: 4,
				runId,
				at: new Date(1).toISOString(),
				outcome,
			}
		},
	}
}

function approvalPayload(approved: boolean) {
	const descriptor = {
		protocol: 'purista-harness/tool-approval',
		version: 1,
		rootRunId: 'run-approval',
		agentRunId: 'run-approval',
		sessionId: trustedSessionId('session-approval'),
		interruptId: 'interrupt-1',
		revision: 'revision-1',
		eventId: 'event-approval',
		approvalIds: ['approval-1'],
	}
	return {
		id: 'session-approval',
		trigger: 'submit-message',
		messageId: 'assistant-1',
		collectionId: 'customer-help',
		messages: [
			{ id: 'user-1', role: 'user', parts: [{ type: 'text', text: 'How long are transfers pending?' }] },
			{
				id: 'assistant-1',
				role: 'assistant',
				parts: [
					{
						type: 'dynamic-tool',
						toolName: 'searchKnowledge',
						toolCallId: 'search-1',
						state: 'approval-responded',
						input: { collectionId: 'customer-help', query: 'transfer delay' },
						approval: { id: 'approval-1', approved, descriptor, reason: 'Reviewed.' },
					},
				],
			},
		],
	}
}

describe('answerKnowledgeQuestionStreamBuilder', () => {
	it('keeps the AI SDK UI Message Stream v1 endpoint protected', async () => {
		const definition = await answerKnowledgeQuestionStreamBuilder.getDefinition()
		expect(definition.streamName).toBe('streamAnswerKnowledgeQuestion')
		expect(definition.metadata.expose.http?.openApi?.isSecure).toBe(true)
		expect(definition.metadata.expose.http?.stream).toMatchObject({
			mode: 'stream',
			protocol: 'ai-sdk-ui-message-stream-v1',
		})
		expect(definition.aggregateChunks).toBe(false)
	})

	it('parses the latest user message and writes data-only v1 records', async () => {
		const payload = {
			id: 'session-1',
			trigger: 'submit-message',
			collectionId: 'customer-help',
			messages: [
				{ id: 'user-old', role: 'user', parts: [{ type: 'text', text: 'Old question' }] },
				{ id: 'assistant-old', role: 'assistant', parts: [{ type: 'text', text: 'Old answer' }] },
				{
					id: 'user-1',
					role: 'user',
					parts: [
						{ type: 'text', text: 'How long' },
						{ type: 'text', text: 'are transfers pending?' },
					],
				},
			],
		}
		const harness = createStreamContextMock(answerKnowledgeQuestionStreamBuilder, { payload, parameter: {}, sandbox })
		const events = completedEvents('run-1', trustedSessionId('session-1'))
		harness.stubs.agent.Knowledge['1'].answerKnowledgeQuestion.stream.resolves(events as never)

		await answerKnowledgeQuestionStreamBuilder
			.getStreamFunction()
			.call({} as never, harness.context, payload, {}, harness.writer)

		expect(
			harness.stubs.agent.Knowledge['1'].answerKnowledgeQuestion.stream.calledWith(
				{ collectionId: 'customer-help', question: 'How long\nare transfers pending?' },
				{ sessionId: trustedSessionId('session-1') },
			),
		).toBe(true)
		expect(harness.chunks.at(0)).toMatchObject({ event: 'data', data: { type: 'start', messageId: 'run-1' } })
		expect(harness.chunks).toContainEqual({
			event: 'data',
			data: { type: 'text-delta', id: 'answer-1', delta: 'Grounded answer [guide-1#0].' },
		})
		expect(harness.chunks.filter((record) => record.data === '[DONE]')).toHaveLength(1)
		expect(harness.chunks.at(-1)).toEqual({ event: 'data', data: '[DONE]' })
		expect(harness.stubs.writer.close.calledOnce).toBe(true)
	})

	it.each([
		['accepts', true],
		['rejects', false],
	] as const)('%s an approval by resuming the same Harness root', async (_label, approved) => {
		const payload = approvalPayload(approved)
		const harness = createStreamContextMock(answerKnowledgeQuestionStreamBuilder, { payload, parameter: {}, sandbox })
		const events = completedEvents('run-approval', trustedSessionId('session-approval'))
		const target = harness.stubs.agent.Knowledge['1'].answerKnowledgeQuestion
		target.resume.continuation.stream.resolves(events as never)

		await answerKnowledgeQuestionStreamBuilder
			.getStreamFunction()
			.call({} as never, harness.context, payload, {}, harness.writer)

		expect(target.resume.firstCall.args[0]).toMatchObject({
			type: 'tool-approval',
			runId: 'run-approval',
			interruptId: 'interrupt-1',
			revision: 'revision-1',
			decisions: [{ approvalId: 'approval-1', approved }],
		})
		const options = target.resume.continuation.stream.firstCall.args[0]
		expect(options).toMatchObject({ sessionId: trustedSessionId('session-approval') })
		expect(options).not.toHaveProperty('idempotencyKey')
		expect(harness.chunks.at(0)).toMatchObject({ event: 'data', data: { type: 'start', messageId: 'assistant-1' } })
		expect(harness.chunks.at(-1)).toEqual({ event: 'data', data: '[DONE]' })
	})

	it('forwards cancellation and waits for it before settling', async () => {
		const payload = {
			id: 'session-cancel',
			trigger: 'submit-message',
			collectionId: 'customer-help',
			messages: [{ id: 'user-cancel', role: 'user', parts: [{ type: 'text', text: 'Wait' }] }],
		}
		const harness = createStreamContextMock(answerKnowledgeQuestionStreamBuilder, { payload, parameter: {}, sandbox })
		let stopEvents: () => void = () => undefined
		let finishCancellation: () => void = () => undefined
		const cancellationGate = new Promise<void>((resolve) => {
			finishCancellation = resolve
		})
		const reasons: Array<string | undefined> = []
		const events = {
			runId: 'run-cancel',
			sessionId: trustedSessionId('session-cancel'),
			result: new Promise<never>(() => undefined),
			terminal: new Promise<never>(() => undefined),
			cancel: async (reason?: string) => {
				reasons.push(reason)
				stopEvents()
				await cancellationGate
			},
			async *[Symbol.asyncIterator]() {
				yield {
					type: 'run.started' as const,
					eventId: 'event-cancel',
					sequence: 1,
					runId: 'run-cancel',
					at: new Date(0).toISOString(),
				}
				await new Promise<void>((resolve) => {
					stopEvents = resolve
				})
			},
		}
		harness.stubs.agent.Knowledge['1'].answerKnowledgeQuestion.stream.resolves(events as never)
		const execution = answerKnowledgeQuestionStreamBuilder
			.getStreamFunction()
			.call({} as never, harness.context, payload, {}, harness.writer)
		let settled = false
		void execution.then(
			() => {
				settled = true
			},
			() => {
				settled = true
			},
		)
		await new Promise<void>((resolve) => setImmediate(resolve))

		harness.cancel('client closed')
		await new Promise<void>((resolve) => setImmediate(resolve))
		expect(reasons.at(0)).toBe('client closed')
		expect(settled).toBe(false)

		finishCancellation()
		await expect(execution).resolves.toBeUndefined()
		expect(settled).toBe(true)
	})
})
