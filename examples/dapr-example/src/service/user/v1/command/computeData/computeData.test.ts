import { createCommandContextMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { userV1Service } from '../../userV1Service.js'
import { computeDataCommandBuilder } from './computeDataCommandBuilder.js'

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

		const payload: Parameters<typeof computeData>[1] = 'example value'

		const parameter: Parameters<typeof computeData>[2] = {}

		const context = createCommandContextMock(computeDataCommandBuilder, { payload, parameter, sandbox })

		const result = await computeData(context.mock, payload, parameter)

		expect(result).toStrictEqual({ invoked: 'example value' })
	})
})
