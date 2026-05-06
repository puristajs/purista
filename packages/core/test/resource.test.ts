import { createSandbox } from 'sinon'
import { z } from 'zod'
import {
	getCommandSuccessMessageMock,
	getEventBridgeMock,
	getLoggerMock,
	ServiceBuilder,
	type ServiceInfoType,
	safeBind,
} from '../src/index.js'
import { createCommandContextMock, createSubscriptionContextMock } from '../src/testing/index.js'

describe('service resource test', () => {
	let sandbox = createSandbox()
	beforeEach(() => {
		sandbox = createSandbox()
	})

	afterEach(() => {
		sandbox.restore()
	})

	const serviceOneInfo = {
		serviceName: 'ServiceOne',
		serviceVersion: '1',
		serviceDescription: 'service one description',
	} as const satisfies ServiceInfoType

	const serviceOneSchema = z.object({
		optionOne: z.string(),
	})

	class ExampleResource {
		methodA() {
			return 'works'
		}
	}

	const serviceBuilder = new ServiceBuilder(serviceOneInfo)
		.setConfigSchema(serviceOneSchema)
		.defineResource<'exampleA', ExampleResource>()

	const commandBuilder = serviceBuilder
		.getCommandBuilder('exampleCommand', 'This is an example command using a resource')
		.setCommandFunction(async function (ctx) {
			const _conf = this.config.optionOne
			return ctx.resources.exampleA.methodA()
		})

	const subscriptionBuilder = serviceBuilder
		.getSubscriptionBuilder('exampleSubscription', 'This is an example command using a resource')
		.setSubscriptionFunction(async function (ctx) {
			const _conf = this.config.optionOne
			return ctx.resources.exampleA.methodA()
		})

	it('can provide resources to a command', async () => {
		const service = await serviceBuilder.getInstance(getEventBridgeMock(sandbox).mock, {
			logger: getLoggerMock(sandbox).mock,
			serviceConfig: { optionOne: 'hello' },
			resources: { exampleA: new ExampleResource() },
		})

		const command = safeBind(commandBuilder.getCommandFunction(), service)
		const payload = {}
		const parameter = {}

		const context = createCommandContextMock(commandBuilder, {
			payload,
			parameter,
			resources: {
				exampleA: { methodA: sandbox.stub().returns('mock return') },
			},
			sandbox,
		})

		const result = await command(context.context, payload, parameter)

		expect(result).toBe('mock return')
	})

	it('can provide resources to a subscription', async () => {
		const service = await serviceBuilder.getInstance(getEventBridgeMock(sandbox).mock, {
			logger: getLoggerMock(sandbox).mock,
			serviceConfig: { optionOne: 'hello' },
			resources: { exampleA: new ExampleResource() },
		})

		const subscription = safeBind(subscriptionBuilder.getSubscriptionFunction(), service)
		const payload = {}
		const parameter = {}
		const message = getCommandSuccessMessageMock(payload)

		const context = createSubscriptionContextMock(subscriptionBuilder, {
			message,
			resources: { ...service.resources },
			sandbox,
		})

		const result = await subscription(context.context, payload, parameter)

		expect(result).toBe('works')
	})
})
