import { createCommandContextMock, getCommandMessageMock } from '@purista/core'
import type { ToolApprovalInterrupt } from '@purista/harness'
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
			decide: sandbox.stub(),
			getByAgentRunId: sandbox.stub(),
			recordApproval: sandbox.stub(),
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
		stubs.workflow.Support['1'].reviewSupportAction.run.callsFake(async (_input, options) => {
			const runId = options?.durable?.runId ?? 'review-run'
			return {
				sessionId: options?.sessionId ?? 'review-session',
				outcome: {
					status: 'interrupted' as const,
					runId,
					interrupt: {
						type: 'tool-approval',
						id: 'approval-1',
						revision: 'review-r1',
						requests: [
							{
								approvalId: 'approval-id-1',
								runId,
								agentRunId: 'agent-run',
								agentId: 'reviewSupportApprovalAgent',
								invocationId: 'invocation-1',
								step: 1,
								toolId: 'freezeReviewedCard',
								callId: 'freeze-call',
								input: {},
								demands: [],
							},
						],
					} satisfies ToolApprovalInterrupt,
				},
			}
		})

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
