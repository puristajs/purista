import { createSandbox } from 'sinon'
import { z } from 'zod'
import {
	ServiceBuilder,
	type ServiceInfoType,
	getCommandSuccessMessageMock,
	getEventBridgeMock,
	getLoggerMock,
	safeBind,
} from '../src/index.js'

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
		.defineResource('exampleA', ExampleResource)

	const commandBuilder = serviceBuilder.getCommandBuilder(
		'exampleCommand',
		'This is an example command using a resource',
	)
	commandBuilder.setCommandFunction(async function (ctx) {
		const _conf = this.config.optionOne
		return ctx.resource.exampleA.methodA()
	})

	const subscriptionBuilder = serviceBuilder.getSubscriptionBuilder(
		'exampleSubscription',
		'This is an example command using a resource',
	)
	subscriptionBuilder.setSubscriptionFunction(async function (ctx) {
		const _conf = this.config.optionOne
		return ctx.resource.exampleA.methodA()
	})

	it('can provide resources to a command', async () => {
		const service = await serviceBuilder.getInstance(getEventBridgeMock(sandbox).mock, {
			logger: getLoggerMock(sandbox).mock,
			resources: { exampleA: new ExampleResource() },
		})

		const command = safeBind(commandBuilder.getCommandFunction(), service)
		const payload = {}
		const parameter = {}
		const message = getCommandSuccessMessageMock(payload)

		const context = commandBuilder.getCommandContextMock(message, sandbox)
		//context.stubs.resource.exampleA.methodA = sandbox.stub().returns('mock return')

		const result = await command(context.mock, payload, parameter)

		expect(result).toBe('mock return')
	})

	it('can provide resources to a command with mock', async () => {
		const service = await serviceBuilder.getInstance(getEventBridgeMock(sandbox).mock, {
			logger: getLoggerMock(sandbox).mock,
			resources: { exampleA: new ExampleResource() },
		})

		const command = safeBind(commandBuilder.getCommandFunction(), service)
		const payload = {}
		const parameter = {}
		const message = getCommandSuccessMessageMock(payload)

		const context = commandBuilder.getCommandContextMock(message, sandbox)
		context.stubs.resource.exampleA.methodA = sandbox.stub().returns('mock return')

		const result = await command(context.mock, payload, parameter)

		expect(result).toBe('mock return')
	})

	it('can provide resources to a subscription', async () => {
		const service = await serviceBuilder.getInstance(getEventBridgeMock(sandbox).mock, {
			logger: getLoggerMock(sandbox).mock,
			resources: { exampleA: new ExampleResource() },
		})

		const subscription = safeBind(subscriptionBuilder.getSubscriptionFunction(), service)
		const payload = {}
		const parameter = {}
		const message = getCommandSuccessMessageMock(payload)

		const context = subscriptionBuilder.getSubscriptionContextMock(message, sandbox)
		context.stubs.resource.exampleA.methodA = sandbox.stub().returns('mock return')

		const result = await subscription(context.mock, payload, parameter)

		expect(result).toBe('mock return')
	})
})
