import { createCommandContextMock, getCommandMessageMock } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'
import { getTransactionSummaryCommandBuilder } from './getTransactionSummaryCommandBuilder.js'

const sandbox = createSandbox()

afterEach(() => sandbox.restore())

const payload = { accountId: 'account-operating', transactionId: 'tx-100' }
const stored = {
	...payload,
	tenantId: 'tenant-example',
	status: 'pending' as const,
	amount: 42,
	currency: 'EUR',
}

describe('getTransactionSummary command', () => {
	it('checks account access and reads the injected transaction resource', async () => {
		const accountReadPolicy = { canRead: sandbox.stub().resolves(true) }
		const transactionSummaryReader = { getById: sandbox.stub().resolves(stored) }
		const { context } = createCommandContextMock(getTransactionSummaryCommandBuilder, {
			payload,
			parameter: {},
			resources: { accountReadPolicy, transactionSummaryReader },
			sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-alex',
			payload: { payload, parameter: {} },
		})

		await expect(
			getTransactionSummaryCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).resolves.toEqual(stored)
		expect(
			accountReadPolicy.canRead.calledOnceWith({
				tenantId: 'tenant-example',
				principalId: 'principal-alex',
				accountId: 'account-operating',
			}),
		).toBe(true)
		expect(transactionSummaryReader.getById.calledOnceWith('tx-100')).toBe(true)
	})

	it('does not read the resource when the account policy denies access', async () => {
		const accountReadPolicy = { canRead: sandbox.stub().resolves(false) }
		const transactionSummaryReader = { getById: sandbox.stub() }
		const { context } = createCommandContextMock(getTransactionSummaryCommandBuilder, {
			payload,
			parameter: {},
			resources: { accountReadPolicy, transactionSummaryReader },
			sandbox,
		})
		context.message = getCommandMessageMock({
			tenantId: 'tenant-example',
			principalId: 'principal-other',
			payload: { payload, parameter: {} },
		})

		await expect(
			getTransactionSummaryCommandBuilder.getCommandFunction().call({} as never, context, payload, {}),
		).rejects.toMatchObject({ errorCode: 403 })
		expect(transactionSummaryReader.getById.called).toBe(false)
	})
})
