import { createCommandContextMock, getCommandMessageMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'
import { durableResolutionIdentity } from '../../durableIdentity.js'
import { resolveSupportCaseWorkflow } from '../../harness/workflow/resolveSupportCase/resolveSupportCaseWorkflow.js'
import { runResolveSupportCaseCommandBuilder } from './runResolveSupportCaseCommandBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

describe('runResolveSupportCaseCommandBuilder', () => {
	it('authorizes the case and invokes the declared durable workflow address', async () => {
		const payload = { caseId: 'case-1', message: 'My card is missing.' }
		const policy = { canResolve: sandbox.stub().resolves(true) }
		const { context, stubs } = createCommandContextMock(runResolveSupportCaseCommandBuilder, {
			payload,
			parameter: {},
			resources: { supportCasePolicy: policy },
			sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			payload: { payload, parameter: {} },
		})
		const output = {
			caseId: 'case-1',
			classification: { category: 'card' as const, urgency: 'urgent' as const },
			plan: { summary: 'Verify the caller and secure the card.', nextAction: 'freeze_card' as const },
		}
		stubs.workflow.Support['1'][resolveSupportCaseWorkflow.contract.id].run.resolves({
			sessionId: 'support-session',
			outcome: { status: 'completed', runId: 'support-run-1', output },
		})

		await expect(
			runResolveSupportCaseCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).resolves.toEqual(output)
		expect(
			policy.canResolve.calledOnceWith({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				caseId: 'case-1',
			}),
		).toBe(true)
		const identity = durableResolutionIdentity('tenant-example', 'principal-alex', 'case-1')
		expect(
			stubs.workflow.Support['1'][resolveSupportCaseWorkflow.contract.id].run.calledOnceWith(payload, {
				sessionId: identity.sessionId,
				durable: { runId: identity.runId },
			}),
		).toBe(true)
	})

	it('keeps delimiter-like identity values distinct', () => {
		expect(durableResolutionIdentity('tenant:a', 'principal', 'case')).not.toEqual(
			durableResolutionIdentity('tenant', 'a:principal', 'case'),
		)
	})
})
