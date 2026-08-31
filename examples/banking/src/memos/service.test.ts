import { createCommandContextMock, createQueueWorkerContextMock } from '@purista/core'
import { describe, expect, it } from 'vitest'

import { DecisionMemoStore } from './repository.js'
import { createDecisionMemoWorker, getDecisionMemo, requestDecisionMemo } from './service.js'

const request = {
	topic: 'fee-notice' as const,
	sourceSet: 'fee-policy-training' as const,
	requestKey: 'memo-fee-notice-1',
}

describe('banking decision memo checkpoint', () => {
	it('queues an authorized request with a stable idempotency key', async () => {
		const memoStore = new DecisionMemoStore()
		const mock = createCommandContextMock(requestDecisionMemo, {
			payload: request,
			parameter: {},
			resources: { memoStore },
		})
		mock.stubs.enqueue.resolves({ jobId: 'memo-job-1', queueName: 'banking.createDecisionMemo' })
		const context = {
			...mock.context,
			message: { ...mock.context.message, principalId: 'dana', tenantId: 'tenant-north' },
		}

		await expect(
			requestDecisionMemo.getCommandFunction().call({} as never, context as never, request, {}),
		).resolves.toEqual({
			jobId: 'memo-job-1',
			queueName: 'banking.createDecisionMemo',
		})
	})

	it('stores a source-backed memo ready for human review and makes duplicate delivery harmless', async () => {
		const memoStore = new DecisionMemoStore()
		const worker = createQueueWorkerContextMock(createDecisionMemoWorker, {
			queueName: 'banking.createDecisionMemo',
			payload: request,
			parameter: { initiatorPrincipalId: 'dana' },
			resources: { memoStore },
		})
		const definition = await createDecisionMemoWorker.getDefinition()

		await definition.handler(worker.context, worker.message)
		await definition.handler(worker.context, worker.message)

		expect(memoStore.get(request.requestKey)).toMatchObject({
			status: 'ready-for-human-review',
			claims: [{ sourceIds: ['fee-policy-v1'] }],
			issues: [],
		})
	})

	it('keeps an unsupported training claim unresolved after the fixed revision budget', async () => {
		const memoStore = new DecisionMemoStore()
		const worker = createQueueWorkerContextMock(createDecisionMemoWorker, {
			queueName: 'banking.createDecisionMemo',
			payload: { ...request, topic: 'unsupported-training-claim', requestKey: 'memo-unsupported-1' },
			parameter: { initiatorPrincipalId: 'dana' },
			resources: { memoStore },
		})
		const definition = await createDecisionMemoWorker.getDefinition()

		await definition.handler(worker.context, worker.message)

		expect(memoStore.get('memo-unsupported-1')).toMatchObject({
			status: 'unresolved',
			revisionsUsed: 2,
			issues: [{ code: 'unsupported-claim' }],
		})
	})

	it('keeps completed artifacts behind the same staff authorization', async () => {
		const memoStore = new DecisionMemoStore()
		const mock = createCommandContextMock(getDecisionMemo, {
			payload: undefined,
			parameter: { requestKey: request.requestKey },
			resources: { memoStore },
		})
		const context = {
			...mock.context,
			message: { ...mock.context.message, principalId: 'alice', tenantId: 'tenant-north' },
		}

		await expect(
			getDecisionMemo.getBeforeGuardHook('memoAuthor').call({} as never, context as never, undefined, request),
		).rejects.toMatchObject({
			errorCode: 403,
		})
	})
})
