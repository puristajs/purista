import { getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { delayV1Service } from '../../delayV1Service.js'
import { fooBarCommandBuilder } from './fooBarCommandBuilder.js'
import type { DelayV1FooBarInputParameter, DelayV1FooBarInputPayload } from './types.js'

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

		const payload: DelayV1FooBarInputPayload = undefined

		const parameter: DelayV1FooBarInputParameter = {
			p: 'the_p',
		}

		const context = fooBarCommandBuilder.getCommandContextMock(payload, parameter, sandbox)

		const result = await fooBar(context.mock, payload, parameter)

		expect(result).toStrictEqual({
			foo: 'bar',
			parameter: { p: 'the_p' },
		})
	})
})
