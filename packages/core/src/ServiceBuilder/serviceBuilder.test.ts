import { createSandbox } from 'sinon'
import { vi } from 'vitest'
import { z } from 'zod'

import { CommandDefinitionBuilder } from '../CommandDefinitionBuilder/index.js'
import type { QueueJobContext, ServiceInfoType } from '../core/index.js'
import { Service } from '../core/index.js'
import type { PuristaMetricContext } from '../core/types/PuristaMetrics.js'
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

	it('creates a service-local state retention view without mutating a shared store', async () => {
		const stateStore = {
			name: 'shared-state-store',
			capabilities: { retention: { atomicExpiry: true } },
			getState: vi.fn(),
			removeState: vi.fn(),
			setState: vi.fn().mockResolvedValue(undefined),
			destroy: vi.fn(),
		}
		const service = new ServiceBuilder(serviceInfo)
		const eventBridge = getEventBridgeMock(sandbox)
		const logger = getLoggerMock(sandbox)

		const instance = await service.getInstance(eventBridge.mock, {
			logger: logger.mock,
			stateStore,
			stateRetention: { default: { mode: 'expire', ttlMs: 60_000 } },
		})
		await instance.getContextFunctions(logger.mock).states.setState('short-lived', 'value')

		expect(stateStore.setState).toHaveBeenCalledWith('short-lived', 'value', {
			retention: { mode: 'expire', ttlMs: 60_000 },
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

	it('cascades service metrics to command, subscription, stream, and queue context types', () => {
		const orderMetricAttributesSchema = z.object({ channel: z.enum(['web', 'api']) })
		const service = new ServiceBuilder(serviceInfo).defineMetric('app.orders.created', {
			kind: 'counter',
			unit: '{order}',
			description: 'Created orders',
			attributes: orderMetricAttributesSchema,
		})

		service.getCommandBuilder('createOrder', 'Create order').setCommandFunction(async function (context) {
			context.metrics['app.orders.created'].add(1, { channel: 'web' })
			expectTypeOf(context.metrics).toEqualTypeOf<
				PuristaMetricContext<{
					'app.orders.created': {
						kind: 'counter'
						unit: '{order}'
						description: 'Created orders'
						attributes: typeof orderMetricAttributesSchema
					}
				}>
			>()
			// @ts-expect-error unknown metrics are not exposed
			context.metrics['app.unknown'].add(1)
			// @ts-expect-error counters do not expose histogram record
			context.metrics['app.orders.created'].record(1)
			// @ts-expect-error attributes must match the declaration schema
			context.metrics['app.orders.created'].add(1, { unknown: 'value' })
			return undefined
		})

		service
			.getSubscriptionBuilder('orderSubscription', 'React to order')
			.setSubscriptionFunction(async function (context) {
				context.metrics['app.orders.created'].add(1, { channel: 'api' })
				return undefined
			})

		service
			.getStreamBuilder('orderStream', 'Stream order')
			.setStreamFunction(async function (context, _payload, _parameter, writer) {
				context.metrics['app.orders.created'].add(1, { channel: 'web' })
				await writer.close()
			})

		type Metrics = {
			'app.orders.created': {
				kind: 'counter'
				unit: '{order}'
				description: 'Created orders'
				attributes: typeof orderMetricAttributesSchema
			}
		}
		type Empty = Record<string, never>
		type QueueContext = QueueJobContext<unknown, unknown, Empty, Empty, Empty, Empty, Empty, Metrics>
		expectTypeOf<QueueContext['metrics']>().toEqualTypeOf<PuristaMetricContext<Metrics>>()
		// @ts-expect-error queue contexts reject undeclared metrics
		expectTypeOf<QueueContext['metrics']['app.unknown']>()
	})
})
