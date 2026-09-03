import { createStreamContextMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'
import { answerKnowledgeQuestionStreamBuilder } from './answerKnowledgeQuestionStreamBuilder.js'

const sandbox = createSandbox()

afterEach(() => sandbox.restore())

async function* executionEvents() {
	yield { type: 'run.started' as const, runId: 'run-1', at: '2026-09-03T10:00:00.000Z' }
	yield { type: 'output.text.delta' as const, runId: 'run-1', id: 'text-1', delta: 'Grounded answer.' }
	yield {
		type: 'run.finished' as const,
		runId: 'run-1',
		at: '2026-09-03T10:00:01.000Z',
		outcome: { status: 'completed' as const, runId: 'run-1', output: 'Grounded answer.' },
	}
}

describe('answerKnowledgeQuestionStreamBuilder', () => {
	it('adapts the address-first Harness stream to AI SDK UI Message Stream v1 events', async () => {
		const payload = {
			id: 'conversation-1',
			collectionId: 'customer-help',
			messages: [{ role: 'user' as const, parts: [{ type: 'text', text: 'What is the transfer delay?' }] }],
		}
		const test = createStreamContextMock(answerKnowledgeQuestionStreamBuilder, {
			payload,
			parameter: {},
			sandbox,
		})
		const remote = Object.assign(executionEvents(), { cancel: sandbox.stub().resolves() })
		;(test.stubs.workflow as any).Knowledge['1'].answer_knowledge_question.stream.resolves(remote)

		await answerKnowledgeQuestionStreamBuilder
			.getStreamFunction()
			.call({} as never, test.context, payload, {}, test.writer)

		expect(
			(test.stubs.workflow as any).Knowledge['1'].answer_knowledge_question.stream.calledOnceWith(
				{ collectionId: 'customer-help', question: 'What is the transfer delay?' },
				{ sessionId: 'knowledge-chat:conversation-1' },
			),
		).toBe(true)
		expect(test.chunks.at(0)).toMatchObject({ event: 'data', data: { type: 'start', messageId: 'run-1' } })
		expect(test.chunks).toContainEqual(
			expect.objectContaining({
				event: 'data',
				data: expect.objectContaining({ type: 'text-delta', delta: 'Grounded answer.' }),
			}),
		)
		expect(test.chunks.at(-1)).toEqual({ event: 'data', data: '[DONE]' })
		expect(test.finalValue).toEqual({ status: 'completed' })
	})
})
