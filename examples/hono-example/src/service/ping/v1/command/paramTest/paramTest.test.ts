import { createCommandContextMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { pingV1Service } from '../../pingV1Service.js'
import { paramTestCommandBuilder } from './paramTestCommandBuilder.js'

describe('service Ping version 1 - command paramTest', () => {
	let sandbox = createSandbox()
	beforeEach(() => {
		sandbox = createSandbox()
	})

	afterEach(() => {
		sandbox.restore()
	})

	test('does not throw', async () => {
		const service = await pingV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
			logger: getLoggerMock(sandbox).mock,
		})

		const paramTest = safeBind(paramTestCommandBuilder.getCommandFunction(), service)

		const payload: Parameters<typeof paramTest>[1] = undefined

		const parameter: Parameters<typeof paramTest>[2] = {
			requiredQuery: 'required',
			requiredParam: 'required_id',
		}

		const context = createCommandContextMock(paramTestCommandBuilder, { payload, parameter, sandbox })

		const result = await paramTest(context.mock, payload, parameter)

		expect(result).toStrictEqual({ parameter: { requiredParam: 'required_id', requiredQuery: 'required' } })
	})
})
