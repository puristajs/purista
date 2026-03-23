import { createSandbox } from 'sinon'
import { z } from 'zod'
import { safeBind } from '../helper/safeBind.impl.js'
import { getEventBridgeMock } from '../mocks/getEventBridge.mock.js'
import { getLoggerMock } from '../mocks/getLogger.mock.js'
import { ServiceBuilder } from '../ServiceBuilder/ServiceBuilder.impl.js'
import { createCommandContextMock } from './createCommandContextMock.js'
import { createCommandTestHarness } from './createCommandTestHarness.js'

describe('command testing helpers', () => {
	it('creates a typed command context mock for handler-level tests', async () => {
		const sandbox = createSandbox()

		try {
			const serviceBuilder = new ServiceBuilder({
				serviceName: 'TestService',
				serviceVersion: '1',
				serviceDescription: 'test service',
			}).defineResource<'repo', { name: string }>()

			const commandBuilder = serviceBuilder
				.getCommandBuilder('echo', 'echo input')
				.addPayloadSchema(z.object({ value: z.string() }))
				.addParameterSchema(z.object({}))
				.addOutputSchema(z.object({ echoed: z.string() }))
				.canEmit('echoed', z.object({ value: z.string() }))
				.setCommandFunction(async function (context, payload) {
					await context.emit('echoed', { value: payload.value })

					return {
						echoed: `${context.resources.repo.name}:${payload.value}`,
					}
				})

			const service = await serviceBuilder
				.addCommandDefinition(commandBuilder.getDefinition())
				.getInstance(getEventBridgeMock(sandbox).mock, {
					logger: getLoggerMock(sandbox).mock,
					resources: {
						repo: { name: 'workspace' },
					},
				})

			const handler = safeBind(commandBuilder.getCommandFunction(), service)
			const { context, stubs } = createCommandContextMock(commandBuilder, {
				payload: { value: 'hello' },
				parameter: {},
				sandbox,
				resources: {
					repo: { name: 'workspace' },
				},
			})

			const result = await handler(context, { value: 'hello' }, {})

			expect(result).toStrictEqual({ echoed: 'workspace:hello' })
			expect(stubs.emit.echoed.calledOnce).toBe(true)
		} finally {
			sandbox.restore()
		}
	})

	it('executes one command through the runtime harness', async () => {
		const serviceBuilder = new ServiceBuilder({
			serviceName: 'HarnessService',
			serviceVersion: '1',
			serviceDescription: 'runtime command harness',
		})

		const commandBuilder = serviceBuilder
			.getCommandBuilder('greet', 'greet a user')
			.addPayloadSchema(z.object({ name: z.string() }))
			.addParameterSchema(z.object({}))
			.addOutputSchema(z.object({ greeting: z.string() }))
			.setCommandFunction(async function (_context, payload) {
				return { greeting: `Hello ${payload.name}` }
			})

		serviceBuilder.addCommandDefinition(commandBuilder.getDefinition())

		const harness = await createCommandTestHarness(serviceBuilder, commandBuilder)

		try {
			const result = await harness.run({
				payload: { name: 'Ada' },
				parameter: {},
			})

			expect(result.result).toStrictEqual({ greeting: 'Hello Ada' })
		} finally {
			await harness.destroy()
		}
	})
})
