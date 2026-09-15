import { createCommandContextMock, getCommandMessageMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'
import { classifySupportMessageAgent } from '../../harness/agent/classifySupportMessage/classifySupportMessageAgent.js'
import { supportClassificationSessionId } from '../../requireSupportClassification.js'
import { runClassifySupportMessageCommandBuilder } from './runClassifySupportMessageCommandBuilder.js'

const sandbox = createSandbox()

afterEach(() => sandbox.restore())

describe('runClassifySupportMessageCommandBuilder', () => {
	it('invokes the mounted agent through its declared address', async () => {
		const payload = {
			messageId: 'MSG-123',
			text: 'I cannot sign in and payroll closes in one hour.',
		}
		const supportClassificationPolicy = { canClassify: sandbox.stub().resolves(true) }
		const { context, stubs } = createCommandContextMock(runClassifySupportMessageCommandBuilder, {
			payload,
			parameter: {},
			resources: { supportClassificationPolicy },
			sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			payload: { payload, parameter: {} },
		})
		const expected = {
			category: 'account_access' as const,
			urgency: 'urgent' as const,
			reason: 'The customer is locked out before payroll closes.',
		}
		stubs.agent.Support['1'][classifySupportMessageAgent.contract.id].run.resolves({
			sessionId: 'support-session',
			outcome: {
				status: 'completed',
				runId: 'run-1',
				output: expected,
			},
		})

		await expect(
			runClassifySupportMessageCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).resolves.toEqual(expected)
		expect(
			stubs.agent.Support['1'][classifySupportMessageAgent.contract.id].run.calledOnceWith(payload, {
				sessionId: supportClassificationSessionId(context.message, payload.messageId),
			}),
		).toBe(true)
		expect(
			supportClassificationPolicy.canClassify.calledOnceWith({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				messageId: 'MSG-123',
			}),
		).toBe(true)
	})

	it('propagates a mounted agent failure', async () => {
		const payload = { messageId: 'MSG-124', text: 'Please check my card.' }
		const { context, stubs } = createCommandContextMock(runClassifySupportMessageCommandBuilder, {
			payload,
			parameter: {},
			resources: { supportClassificationPolicy: { canClassify: sandbox.stub().resolves(true) } },
			sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			payload: { payload, parameter: {} },
		})
		stubs.agent.Support['1'][classifySupportMessageAgent.contract.id].run.rejects(
			new Error('The model provider is unavailable.'),
		)

		await expect(
			runClassifySupportMessageCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).rejects.toThrow('The model provider is unavailable.')
	})
})
