import { createSandbox } from 'sinon'

import { CommandDefinitionBuilder } from '../CommandDefinitionBuilder/index.js'
import type { ServiceInfoType } from '../core/index.js'
import { Service } from '../core/index.js'
import { getEventBridgeMock, getLoggerMock } from '../mocks/index.js'
import { ScheduleDefinitionBuilder } from '../ScheduleDefinitionBuilder/index.js'
import { SubscriptionDefinitionBuilder } from '../SubscriptionDefinitionBuilder/index.js'
import { ServiceBuilder } from './ServiceBuilder.impl.js'

describe('ServiceBuilder', () => {
	const serviceInfo: ServiceInfoType = {
		serviceName: 'test-service',
		serviceVersion: '1',
		serviceDescription: 'the description of the service',
	}

	const sandbox = createSandbox()

	afterEach(() => {
		sandbox.reset()
	})

	it('returns a CommandBuilder', () => {
		const service = new ServiceBuilder(serviceInfo)
		expect(service.getCommandBuilder('command-name', 'command description')).toBeInstanceOf(CommandDefinitionBuilder)
	})

	it('returns a SubscriptionBuilder', () => {
		const service = new ServiceBuilder(serviceInfo)
		expect(service.getSubscriptionBuilder('command-name', 'command description')).toBeInstanceOf(
			SubscriptionDefinitionBuilder,
		)
	})

	it('returns a ScheduleBuilder', () => {
		const service = new ServiceBuilder(serviceInfo)
		expect(service.getScheduleBuilder('schedule-name', 'schedule description')).toBeInstanceOf(
			ScheduleDefinitionBuilder,
		)
	})

	it('can use a custom service class', async () => {
		class CustomClass extends Service {
			customFunction() {
				return 'custom'
			}
		}

		const service = new ServiceBuilder(serviceInfo).setCustomClass(CustomClass)

		const eventBridge = getEventBridgeMock(sandbox)
		const logger = getLoggerMock(sandbox)

		const serviceInstance = await service.getInstance(eventBridge.mock, { logger: logger.mock })

		expect(serviceInstance.customFunction()).toBe('custom')
		expect(serviceInstance).toBeInstanceOf(CustomClass)
	})

	it('can add resources', async () => {
		class ExampleClass {
			method() {
				return 'hello'
			}
		}

		const service = new ServiceBuilder(serviceInfo).defineResource<'x', ExampleClass>()

		const eventBridge = getEventBridgeMock(sandbox)
		const logger = getLoggerMock(sandbox)
		const _serviceInstance = await service.getInstance(eventBridge.mock, {
			logger: logger.mock,
			resources: { x: new ExampleClass() },
		})
	})

	it('throws when definitions are not resolved', () => {
		const service = new ServiceBuilder(serviceInfo)

		expect(() => {
			service.getCommandDefinitions()
		}).toThrow('Definitions not resolve. Please call resolveDefinitions() before using getCommandDefinitions')

		expect(() => {
			service.getSubscriptionDefinitions()
		}).toThrow('Definitions not resolve. Please call resolveDefinitions() before using getCommandDefinitions')
	})

	it('returns definitions after resolving', async () => {
		const service = new ServiceBuilder(serviceInfo)

		await service.resolveDefinitions()

		expect(service.getCommandDefinitions()).toEqual([])
		expect(service.getSubscriptionDefinitions()).toEqual([])
		expect(service.getScheduleDefinitions()).toEqual([])
		expect(service.getEventToQueueBindings()).toEqual([])
	})

	it('stores event-to-queue binding definitions', async () => {
		const service = new ServiceBuilder(serviceInfo).bindEventToQueue(
			'billing.monthlyCycleDue',
			'billing.monthlyClosing',
			{
				idempotencyKey: event => `billing-cycle:${event.cycleId}`,
			},
		)

		await service.resolveDefinitions()

		expect(service.getEventToQueueBindings()).toEqual([
			expect.objectContaining({
				eventName: 'billing.monthlyCycleDue',
				queueName: 'billing.monthlyClosing',
				idempotencyMode: 'advisory',
			}),
		])
	})
})
