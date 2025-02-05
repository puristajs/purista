import { getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { userV1Service } from '../../userV1Service.js'
import { computeDataCommandBuilder } from './computeDataCommandBuilder.js'
import type { UserV1ComputeDataInputParameter, UserV1ComputeDataInputPayload } from './types.js'

describe('service User version 1 - command computeData', () => {
	let sandbox = createSandbox()
	beforeEach(() => {
		sandbox = createSandbox()
	})

	afterEach(() => {
		sandbox.restore()
	})

	test('does not throw', async () => {
		const service = await userV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
			logger: getLoggerMock(sandbox).mock,
		})

		const computeData = safeBind(computeDataCommandBuilder.getCommandFunction(), service)

		const payload: UserV1ComputeDataInputPayload = 'example value'

		const parameter: UserV1ComputeDataInputParameter = {}

		const context = computeDataCommandBuilder.getCommandContextMock({ payload, parameter, sandbox })

		const result = await computeData(context.mock, payload, parameter)

		expect(result).toStrictEqual({ invoked: 'example value' })
	})
})
