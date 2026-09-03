import { createCommandContextMock, getCommandMessageMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'
import { requestCardFreezeCommandBuilder } from './requestCardFreezeCommandBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

describe('requestCardFreezeCommandBuilder', () => {
	it('maps the workflow interrupt to a typed waiting result', async () => {
		const payload = { requestId: 'review-1', cardId: 'card-1', reason: 'Card is missing' }
		const reviews = {
			create: sandbox.stub().callsFake(async (input) => ({ ...input, revision: 1, status: 'pending' })),
			get: sandbox.stub(),
			getByWaitId: sandbox.stub(),
			decide: sandbox.stub(),
		}
		const policy = { canRequest: sandbox.stub().resolves(true), canReview: sandbox.stub() }
		const { context, stubs } = createCommandContextMock(requestCardFreezeCommandBuilder, {
			payload,
			parameter: {},
			resources: { supportReviewStore: reviews, supportReviewPolicy: policy },
			sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			payload: { payload, parameter: {} },
		})
		;(stubs.workflow as any).Support['1'].review_support_action.run.callsFake(
			async (_input: unknown, options: { durable: { runId: string } }) => ({
				status: 'interrupted',
				runId: options.durable.runId,
				interrupt: {
					type: 'external-wait',
					id: 'wait-1',
					deadline: '2026-09-03T12:00:00.000Z',
				},
			}),
		)

		await expect(
			requestCardFreezeCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).resolves.toMatchObject({ status: 'waiting', requestId: 'review-1' })
		expect(
			policy.canRequest.calledOnceWith({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				cardId: 'card-1',
			}),
		).toBe(true)
		expect(reviews.create.calledOnce).toBe(true)
	})
})
