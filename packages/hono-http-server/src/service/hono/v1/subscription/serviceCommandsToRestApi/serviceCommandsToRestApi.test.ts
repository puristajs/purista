import {
	createSubscriptionContextMock,
	getCommandSuccessMessageMock,
	getEventBridgeMock,
	getLoggerMock,
	safeBind,
} from '@purista/core/adapter'
import { createSandbox } from 'sinon'

import { honoV1Service } from '../../honoV1Service.js'
import { serviceCommandsToRestApiSubscriptionBuilder } from './serviceCommandsToRestApiSubscriptionBuilder.js'
import type { HonoV1ServiceCommandsToRestApiInputPayload } from './types.js'

describe('service Hono version 1 - subscription serviceCommandsToRestApi', () => {
	let sandbox = createSandbox()
	beforeEach(() => {
		sandbox = createSandbox()
	})

	afterEach(() => {
		sandbox.restore()
	})

	test('does not throw', async () => {
		// create a service instance to be bind to the subscription function
		const service = await honoV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
			logger: getLoggerMock(sandbox).mock,
			serviceConfig: {},
		})

		// get the subscription function and bind to service instance to work properly
		const serviceCommandsToRestApi = safeBind(
			serviceCommandsToRestApiSubscriptionBuilder.getSubscriptionFunction(),
			service,
		)

		// define the test input payload
		const payload: HonoV1ServiceCommandsToRestApiInputPayload = {}

		// define the test input parameter
		const parameter: Readonly<unknown> = {}

		// create a mock message with the expected input for the subscription function
		const message = getCommandSuccessMessageMock(payload)

		// create a subscription context for the subscription function
		const context = createSubscriptionContextMock(serviceCommandsToRestApiSubscriptionBuilder, { message, sandbox })

		// execute the subscription function
		const result = await serviceCommandsToRestApi(context.context, payload, parameter)

		expect(result).toBeUndefined()
	})
})
