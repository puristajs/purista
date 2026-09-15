import { createCommandContextMock, getCommandMessageMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'
import { freezeCardCommandBuilder } from './freezeCardCommandBuilder.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

describe('freezeCardCommandBuilder', () => {
	it('passes the approved identity to the idempotent executor', async () => {
		const policy = { canFreeze: sandbox.stub().resolves(true) }
		const executor = { freeze: sandbox.stub().resolves({ status: 'frozen', cardId: 'card-1' }) }
		const payload = { cardId: 'card-1' }
		const parameter = { approvalId: 'support-review-run:approved-1' }
		const { context } = createCommandContextMock(freezeCardCommandBuilder, {
			payload,
			parameter,
			resources: { cardFreezePolicy: policy, cardFreezeExecutor: executor },
			sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-reviewer',
			payload: { payload, parameter },
		})

		await expect(
			freezeCardCommandBuilder.getCommandFunction().call({} as never, context, payload, parameter),
		).resolves.toEqual({
			status: 'frozen',
			cardId: 'card-1',
		})
		expect(
			policy.canFreeze.calledOnceWith({
				tenantId: 'tenant-example',
				principalId: 'principal-reviewer',
				cardId: 'card-1',
				approvalId: 'support-review-run:approved-1',
			}),
		).toBe(true)
		expect(executor.freeze.calledOnce).toBe(true)
		expect(executor.freeze.calledWithMatch({ idempotencyKey: 'support-review-run:approved-1' })).toBe(true)
	})

	it('rejects an unapproved direct call before the effect', async () => {
		const policy = { canFreeze: sandbox.stub().resolves(false) }
		const executor = { freeze: sandbox.stub() }
		const payload = { cardId: 'card-1' }
		const parameter = { approvalId: 'forged' }
		const { context } = createCommandContextMock(freezeCardCommandBuilder, {
			payload,
			parameter,
			resources: { cardFreezePolicy: policy, cardFreezeExecutor: executor },
			sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-reviewer',
			payload: { payload, parameter },
		})

		await expect(
			freezeCardCommandBuilder.getCommandFunction().call({} as never, context, payload, parameter),
		).rejects.toMatchObject({ errorCode: 403 })
		expect(executor.freeze.notCalled).toBe(true)
	})
})
