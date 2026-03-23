import { createCommandContextMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { pingV1Service } from '../../pingV1Service.js'
import { fooCommandBuilder } from './fooCommandBuilder.js'

describe('service Ping version 1 - command foo', () => {
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

		const foo = safeBind(fooCommandBuilder.getCommandFunction(), service)

		const payload: Parameters<typeof foo>[1] = undefined

		const parameter: Parameters<typeof foo>[2] = {}

		const context = createCommandContextMock(fooCommandBuilder, { payload, parameter, sandbox })

		const result = await foo(context.mock, payload, parameter)

		expect(result).toStrictEqual({ foo: 'foo' })
	})
})
