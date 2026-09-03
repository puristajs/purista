import { inMemoryHarnessStorage } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import { supportHarness } from './supportHarness.js'

const usage = { inputTokens: 10, outputTokens: 5, totalTokens: 15 }

describe('support conversation history', () => {
	it('reuses one session history and keeps another session isolated', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: { answer: 'A transfer can remain pending for two business days.' },
			usage,
			finishReason: 'stop',
		})
		provider.enqueueObject({
			object: { answer: 'The same transfer is still within that window.' },
			usage,
			finishReason: 'stop',
		})
		provider.enqueueObject({
			object: { answer: 'Please tell me which transfer you mean.' },
			usage,
			finishReason: 'stop',
		})
		const runtime = await supportHarness.getInstance({
			models: { primary: { provider, model: 'fake-support' } },
			storage: inMemoryHarnessStorage(),
		})

		try {
			const first = await runtime.getSession('support:tenant-example:principal-alex:case-1', {
				identity: { tenantId: 'tenant-example', principalId: 'principal-alex' },
			})
			await first.agents.answer_support_question.run({
				conversationId: 'case-1',
				question: 'How long can it stay pending?',
			})
			await first.agents.answer_support_question.run({
				conversationId: 'case-1',
				question: 'What about the same transfer?',
			})

			const secondRequest = provider.requests[1]
			expect('messages' in secondRequest ? secondRequest.messages : []).toEqual(
				expect.arrayContaining([
					expect.objectContaining({ role: 'assistant', content: expect.stringContaining('two business days') }),
				]),
			)
			expect(await first.history.list()).toHaveLength(4)

			const isolated = await runtime.getSession('support:tenant-example:principal-alex:case-2', {
				identity: { tenantId: 'tenant-example', principalId: 'principal-alex' },
			})
			await isolated.agents.answer_support_question.run({
				conversationId: 'case-2',
				question: 'What about the same transfer?',
			})
			const isolatedRequest = provider.requests[2]
			expect('messages' in isolatedRequest ? isolatedRequest.messages : []).not.toEqual(
				expect.arrayContaining([
					expect.objectContaining({ role: 'assistant', content: expect.stringContaining('two business days') }),
				]),
			)
			provider.assertExhausted()
		} finally {
			await runtime.shutdown()
		}
	})

	it('clears transcript content without deleting the reusable session id', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({ object: { answer: 'I can help.' }, usage, finishReason: 'stop' })
		const runtime = await supportHarness.getInstance({
			models: { primary: { provider, model: 'fake-support' } },
			storage: inMemoryHarnessStorage(),
		})

		try {
			const session = await runtime.getSession('support:tenant-example:principal-alex:case-3', {
				identity: { tenantId: 'tenant-example', principalId: 'principal-alex' },
			})
			await session.agents.answer_support_question.run({ conversationId: 'case-3', question: 'Can you help?' })
			expect(await session.history.list()).not.toHaveLength(0)
			await session.clearHistory()
			expect(await session.history.list()).toEqual([])
		} finally {
			await runtime.shutdown()
		}
	})

	it('retains only the newest eight complete conversation turns', async () => {
		const provider = new FakeModelProvider({ strict: true })
		for (let index = 1; index <= 9; index += 1) {
			provider.enqueueObject({
				object: { answer: `Answer ${index}` },
				usage,
				finishReason: 'stop',
			})
		}
		const runtime = await supportHarness.getInstance({
			models: { primary: { provider, model: 'fake-support' } },
			storage: inMemoryHarnessStorage(),
		})

		try {
			const session = await runtime.getSession('support:tenant-example:principal-alex:case-retention', {
				identity: { tenantId: 'tenant-example', principalId: 'principal-alex' },
			})
			for (let index = 1; index <= 9; index += 1) {
				await session.agents.answer_support_question.run({
					conversationId: 'case-retention',
					question: `Question ${index}`,
				})
			}

			const history = await session.history.list()
			expect(history).toHaveLength(16)
			expect(history[0]).toMatchObject({ role: 'user', content: expect.stringContaining('Question 2') })
			expect(history.at(-1)).toMatchObject({ role: 'assistant', content: expect.stringContaining('Answer 9') })
			provider.assertExhausted()
		} finally {
			await runtime.shutdown()
		}
	})
})
