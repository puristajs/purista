import { getLoggerMock, safeBind } from '@purista/core'
import type { Context } from 'hono'
import type { SinonSandbox } from 'sinon'
import { createSandbox } from 'sinon'

import { configRoute } from './config.impl.js'

describe('config route', () => {
	let sandbox: SinonSandbox

	beforeEach(() => {
		sandbox = createSandbox()
	})

	afterEach(() => {
		sandbox.restore()
		sandbox.reset()
	})

	it('returns the config object', async () => {
		const json = sandbox.stub()
		const context = {
			json,
		} as any as Context

		const bridge = {
			logger: getLoggerMock().mock,
		} as any

		const fn = safeBind(configRoute, bridge)
		await fn(context)
		expect(
			json.calledWith({
				entities: [],
			}),
		).toBeTruthy()
	})
})
