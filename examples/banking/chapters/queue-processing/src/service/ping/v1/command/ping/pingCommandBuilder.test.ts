import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { createCommandContextMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { pingV1Service } from '../../pingV1Service.js'
import { pingCommandBuilder } from './pingCommandBuilder.js'
import type { PingV1PingInputParameter, PingV1PingInputPayload } from './types.js'

describe('service Ping version 1 - command ping',() => {
	let sandbox = createSandbox()
	beforeEach(() =>{
		sandbox = createSandbox()
	})

	afterEach(() =>{
		sandbox.restore()
	})

	test('does not throw', async () => {
		const service = await pingV1Service.getInstance(getEventBridgeMock(sandbox).mock,{
			logger: getLoggerMock(sandbox).mock,
		})

		const ping = safeBind(pingCommandBuilder.getCommandFunction(), service)

		const payload: PingV1PingInputPayload = undefined

		const parameter: PingV1PingInputParameter = {}

		const { context } = createCommandContextMock(pingCommandBuilder, {
	payload,
	parameter,
	sandbox,
	resources: { ...service.resources },
		})

		const result = await ping(context, payload as Parameters<typeof ping>[1], parameter as Parameters<typeof ping>[2])

		expect(result).toBeUndefined()
	})
}
)