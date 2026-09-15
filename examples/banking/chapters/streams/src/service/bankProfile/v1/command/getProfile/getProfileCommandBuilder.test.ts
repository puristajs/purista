import { createCommandContextMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'
import { expect, test } from 'vitest'
import { bankProfileV1ServiceBuilder } from '../../bankProfileV1ServiceBuilder.js'
import { getProfileCommandBuilder } from './getProfileCommandBuilder.js'

test('returns the bank profile through the command contract', async () => {
	const sandbox = createSandbox()
	const service = await bankProfileV1ServiceBuilder.getInstance(getEventBridgeMock(sandbox).mock, {
		logger: getLoggerMock(sandbox).mock,
	})
	try {
		const { context } = createCommandContextMock(getProfileCommandBuilder, {
			payload: undefined, parameter: {}, sandbox,
		})
		const command = safeBind(getProfileCommandBuilder.getCommandFunction(), service)
		expect(await command(context, undefined, {})).toEqual({ name: 'Example Bank', currency: 'EUR' })
	} finally {
		await service.destroy()
		sandbox.restore()
	}
})
