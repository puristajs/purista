import { createCommandContextMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { delayV1Service } from '../../delayV1Service.js'
import { fooBarCommandBuilder } from './fooBarCommandBuilder.js'

describe('service Delay version 1 - command fooBar', () => {
	let sandbox = createSandbox()
	beforeEach(() => {
		sandbox = createSandbox()
	})

	afterEach(() => {
		sandbox.restore()
	})

	test('does not throw', async () => {
		const service = await delayV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
			logger: getLoggerMock(sandbox).mock,
		})

		const fooBar = safeBind(fooBarCommandBuilder.getCommandFunction(), service)

		const payload: Parameters<typeof fooBar>[1] = {}

		const parameter: Parameters<typeof fooBar>[2] = {
			p: 'the_p',
		}

		const context = createCommandContextMock(fooBarCommandBuilder, { payload, parameter, sandbox })

		const result = await fooBar(context.mock, payload, parameter)

		expect(result).toStrictEqual({
			foo: 'bar',
			parameter: { p: 'the_p' },
		})
	})
})
