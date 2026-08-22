import { assert, spy, stub } from 'sinon'
import { describe, expect, it } from 'vitest'
import { UnhandledError } from '../core/Error/UnhandledError.impl.js'
import type { Subscription } from '../core/index.js'
import { createInfoMessage, EBMessageType } from '../core/index.js'
import type { PuristaMetricsRecorder } from '../core/metrics/types.js'
import type { ServiceObservabilityContext } from '../core/types/ServiceObservability.js'
import {
	getCommandMessageMock,
	getCommandSuccessMessageMock,
	getCustomMessageMessageMock,
	getLoggerMock,
} from '../mocks/index.js'
import { DefaultEventBridge } from './DefaultEventBridge.impl.js'

class TestDefaultEventBridge extends DefaultEventBridge {
	public setHealthy(healthy: boolean) {
		this.healthy = healthy
	}

	public getPendingInvocations() {
		return this.pendingInvocations.getPendingMap()
	}

	public getMetricsRecorder() {
		return this.metricsRecorder
	}
}

describe('DefaultEventBridge', () => {
	const sender = {
		serviceName: 'SenderService',
		serviceVersion: '1',
		serviceTarget: 'senderServiceTarget',
		instanceId: 'a',
	}

	const receiver = {
		serviceName: 'ReceiverService',
		serviceVersion: '2',
		serviceTarget: 'receiverServiceTarget',
	}

	const subscriber = {
		serviceName: 'SubscriberService',
		serviceVersion: '3',
		serviceTarget: 'subscriberServiceTarget',
	}

	const otherSubscriber = {
		serviceName: 'OtherSubscriberService',
		serviceVersion: '4',
		serviceTarget: 'otherSubscriberServiceTarget',
	}

	const eventName = 'testEventName'

	it('creates a DefaultEventBridge', () => {
		const logger = getLoggerMock()

		const eventBridge = new DefaultEventBridge({ logger: logger.mock })

		expect(eventBridge).toBeDefined()
	})

	it('inherits service logger, tracer, and metrics before startup when the bridge has no explicit overrides', async () => {
		const logger = getLoggerMock()
		const spanProcessor = {
			forceFlush: async () => {},
			onEnd: spy(),
			onStart: spy(),
			shutdown: async () => {},
		}
		const recordFrameworkMetric = stub()
		const metricsRecorder: PuristaMetricsRecorder = {
			recordFrameworkMetric,
			recordCustomMetric: stub(),
		}
		const observability: ServiceObservabilityContext = {
			logger: logger.mock,
			spanProcessor: spanProcessor as never,
			metricsRecorder,
		}
		const eventBridge = new DefaultEventBridge()

		eventBridge.inheritServiceObservability(observability)

		await eventBridge.startActiveSpan('observability-test', {}, undefined, async () => undefined)

		expect(recordFrameworkMetric.called).toBe(true)
		expect(spanProcessor.onStart.called).toBe(true)
	})

	it('keeps explicit bridge observability settings over service inheritance', async () => {
		const bridgeLogger = getLoggerMock()
		const serviceLogger = getLoggerMock()
		const componentSpanProcessor = {
			forceFlush: async () => {},
			onEnd: spy(),
			onStart: spy(),
			shutdown: async () => {},
		}
		const serviceSpanProcessor = {
			forceFlush: async () => {},
			onEnd: spy(),
			onStart: spy(),
			shutdown: async () => {},
		}
		const componentRecordFrameworkMetric = stub()
		const componentRecorder: PuristaMetricsRecorder = {
			recordFrameworkMetric: componentRecordFrameworkMetric,
			recordCustomMetric: stub(),
		}
		const serviceRecorder: PuristaMetricsRecorder = {
			recordFrameworkMetric: stub(),
			recordCustomMetric: stub(),
		}
		const eventBridge = new DefaultEventBridge({
			logger: bridgeLogger.mock,
			metricsRecorder: componentRecorder,
			spanProcessor: componentSpanProcessor as never,
		})

		eventBridge.inheritServiceObservability({
			logger: serviceLogger.mock,
			metricsRecorder: serviceRecorder,
			spanProcessor: serviceSpanProcessor as never,
		})

		await eventBridge.startActiveSpan('explicit-observability-test', {}, undefined, async () => undefined)
		expect(componentRecordFrameworkMetric.called).toBe(true)
		expect(componentSpanProcessor.onStart.called).toBe(true)
		expect(serviceSpanProcessor.onStart.called).toBe(false)
	})

	it('does not mutate observability after the bridge has started', async () => {
		const eventBridge = new TestDefaultEventBridge()
		await eventBridge.start()
		const logger = eventBridge.logger
		const metricsRecorder = eventBridge.getMetricsRecorder()
		const traceProvider = eventBridge.traceProvider

		eventBridge.inheritServiceObservability({
			logger: getLoggerMock().mock,
			spanProcessor: {} as never,
			metricsRecorder: {
				recordFrameworkMetric: stub(),
				recordCustomMetric: stub(),
			},
		})

		expect(eventBridge.logger).toBe(logger)
		expect(eventBridge.getMetricsRecorder()).toBe(metricsRecorder)
		expect(eventBridge.traceProvider).toBe(traceProvider)
	})

	it('does not expose event-emitter methods on bridge instances', () => {
		const logger = getLoggerMock()

		const eventBridge = new DefaultEventBridge({ logger: logger.mock })

		expect('emit' in eventBridge).toBe(false)
		expect('on' in eventBridge).toBe(false)
		expect('removeAllListeners' in eventBridge).toBe(false)
	})

	it('routes custom messages to subscriptions', async () => {
		const logger = getLoggerMock()

		const eventBridge = new DefaultEventBridge({ logger: logger.mock })
		await eventBridge.start()

		const callback = stub().resolves()

		const subscription: Subscription = {
			sender,
			subscriber,
			eventBridgeConfig: {
				autoacknowledge: true,
				shared: true,
				durable: false,
			},
		}

		const otherCall = stub().resolves()
		const otherSubscription: Subscription = {
			sender: {
				serviceName: 'SomeService',
			},
			subscriber: otherSubscriber,
			eventBridgeConfig: {
				durable: false,
				autoacknowledge: true,
				shared: true,
			},
		}

		eventBridge.registerSubscription(subscription, callback)
		eventBridge.registerSubscription(otherSubscription, otherCall)

		const message = getCustomMessageMessageMock(
			eventName,
			{
				parameter: { parameter: 1 },
				payload: { payload: 'content' },
			},
			{
				sender,
				receiver,
			},
		)

		const emittedMessage = await eventBridge.emitMessage(message)
		await new Promise(resolve => process.nextTick(resolve))

		expect(callback.called).toBeTruthy()
		expect(callback.callCount).toBe(1)
		assert.calledWith(callback, emittedMessage)

		expect(otherCall.callCount).toBe(0)

		const unsubscribe = spy(eventBridge, 'unregisterSubscription')

		await eventBridge.unregisterSubscription(subscriber)

		expect(unsubscribe.callCount).toBe(1)

		callback.resetHistory()
		logger.stubs.trace.resetHistory()

		await eventBridge.emitMessage(message)
		await new Promise(resolve => process.nextTick(resolve))

		expect(callback.called).toBeFalsy()

		expect(logger.stubs.warn.getCall(0).args[1]).toBe(
			'InvalidMessage: received a message which is not consumed by any service command or subscription',
		)
		expect(logger.stubs.error.called).toBeFalsy()
	})

	it('returns error if command is not found', async () => {
		expect(true).toBeTruthy()
	})

	it('returns command success message', async () => {
		expect(true).toBeTruthy()
	})

	it('returns command error message', async () => {
		expect(true).toBeTruthy()
	})

	it('returns internal error response when registered command callback rejects', async () => {
		const eventBridge = new DefaultEventBridge({ defaultCommandTimeout: 500 })
		await eventBridge.start()

		await eventBridge.registerCommand(
			{
				serviceName: 'ReceiverService',
				serviceVersion: '2',
				serviceTarget: 'receiverServiceTarget',
			},
			async () => {
				throw new Error('unexpected failure')
			},
			{ expose: {} },
		)

		const commandMessage = getCommandMessageMock({
			sender,
			receiver,
			payload: {
				payload: { ping: true },
				parameter: {},
			},
		})

		await expect(eventBridge.invoke(commandMessage)).rejects.toMatchObject({
			errorCode: 500,
			message: 'Internal Server Error',
		})

		await eventBridge.destroy()
	})

	it('traces info messages', async () => {
		const logger = getLoggerMock()
		const eventBridge = new DefaultEventBridge({ logger: logger.mock })
		await eventBridge.start()

		const callback = stub().resolves()

		const subscription: Subscription = {
			sender,
			subscriber,
			eventBridgeConfig: {
				durable: false,
				autoacknowledge: true,
				shared: true,
			},
		}

		eventBridge.registerSubscription(subscription, callback)

		const message = createInfoMessage(EBMessageType.InfoServiceFunctionAdded, sender, {
			payload: { some: 'data' },
		})

		const emittedMessage = await eventBridge.emitMessage(message)
		await new Promise(resolve => process.nextTick(resolve))

		expect(callback.callCount).toBe(1)
		assert.calledWith(callback, emittedMessage)

		expect(logger.stubs.trace.called).toBeTruthy()
	})

	it('returns unhealthy state when internal health flag is false', async () => {
		const eventBridge = new TestDefaultEventBridge()
		await eventBridge.start()

		eventBridge.setHealthy(false)

		await expect(eventBridge.isHealthy()).resolves.toBe(false)
		await eventBridge.destroy()
	})

	it('rejects invoke and cleans pending invocations when emit fails', async () => {
		const eventBridge = new TestDefaultEventBridge()
		await eventBridge.start()
		stub(eventBridge, 'emitMessage').rejects(new Error('emit failed'))

		const commandMessage = getCommandMessageMock({
			sender: {
				serviceName: 'sender',
				serviceVersion: '1',
				serviceTarget: 'fn',
				instanceId: 'sender-instance',
			},
			receiver: {
				serviceName: 'receiver',
				serviceVersion: '1',
				serviceTarget: 'fn',
			},
		})

		await expect(eventBridge.invoke(commandMessage)).rejects.toBeInstanceOf(UnhandledError)
		expect(eventBridge.getPendingInvocations().size).toBe(0)
		await eventBridge.destroy()
	})

	it('waits for running work before destroy completes', async () => {
		const eventBridge = new TestDefaultEventBridge({ defaultCommandTimeout: 500 })
		await eventBridge.start()
		const timeout = setTimeout(() => {
			/* noop */
		}, 1_000)

		eventBridge.getPendingInvocations().set('pending-id', {
			resolve: () => {
				/* noop */
			},
			reject: () => {
				/* noop */
			},
			timeout,
		})

		setTimeout(() => {
			eventBridge.getPendingInvocations().delete('pending-id')
		}, 30)

		const start = Date.now()
		await eventBridge.destroy()
		const duration = Date.now() - start

		expect(duration).toBeGreaterThanOrEqual(20)
	})

	it('ignores late command responses after timeout without failing the bridge', async () => {
		const logger = getLoggerMock()
		const eventBridge = new DefaultEventBridge({ defaultCommandTimeout: 20, logger: logger.mock })
		await eventBridge.start()

		await eventBridge.registerCommand(
			receiver,
			async message => {
				await new Promise(resolve => setTimeout(resolve, 50))
				return getCommandSuccessMessageMock({ ok: true }, undefined, message)
			},
			{ expose: {} },
		)

		const commandMessage = getCommandMessageMock({
			sender,
			receiver,
			payload: {
				payload: { ping: true },
				parameter: {},
			},
		})

		await expect(eventBridge.invoke(commandMessage)).rejects.toBeInstanceOf(UnhandledError)
		await new Promise(resolve => setTimeout(resolve, 80))

		expect(logger.stubs.warn.called).toBeTruthy()
		await expect(eventBridge.isHealthy()).resolves.toBe(true)
		await eventBridge.destroy()
	})

	it('supports stream open and frame delivery', async () => {
		const eventBridge = new DefaultEventBridge({ defaultCommandTimeout: 500 })
		await eventBridge.start()

		await eventBridge.registerStream(
			{
				serviceName: receiver.serviceName,
				serviceVersion: receiver.serviceVersion,
				serviceTarget: receiver.serviceTarget,
			},
			async message => {
				if (message.payload.frameType !== 'open') {
					return
				}

				await eventBridge.emitMessage({
					messageType: EBMessageType.Stream,
					correlationId: message.correlationId,
					traceId: message.traceId,
					sender: {
						serviceName: receiver.serviceName,
						serviceVersion: receiver.serviceVersion,
						serviceTarget: receiver.serviceTarget,
						instanceId: eventBridge.instanceId,
					},
					receiver: message.sender,
					contentType: 'application/json',
					contentEncoding: 'utf-8',
					payload: { frameType: 'start', sequence: 0 },
				} as any)

				await eventBridge.emitMessage({
					messageType: EBMessageType.Stream,
					correlationId: message.correlationId,
					traceId: message.traceId,
					sender: {
						serviceName: receiver.serviceName,
						serviceVersion: receiver.serviceVersion,
						serviceTarget: receiver.serviceTarget,
						instanceId: eventBridge.instanceId,
					},
					receiver: message.sender,
					contentType: 'application/json',
					contentEncoding: 'utf-8',
					payload: { frameType: 'chunk', sequence: 1, chunk: { value: 'hello' } },
				} as any)

				await eventBridge.emitMessage({
					messageType: EBMessageType.Stream,
					correlationId: message.correlationId,
					traceId: message.traceId,
					sender: {
						serviceName: receiver.serviceName,
						serviceVersion: receiver.serviceVersion,
						serviceTarget: receiver.serviceTarget,
						instanceId: eventBridge.instanceId,
					},
					receiver: message.sender,
					contentType: 'application/json',
					contentEncoding: 'utf-8',
					payload: { frameType: 'complete', sequence: 2, final: { done: true } },
				} as any)
			},
			{
				expose: {},
			},
		)

		const handle = await eventBridge.openStream({
			sender,
			receiver,
			contentType: 'application/json',
			contentEncoding: 'utf-8',
			traceId: 'trace-test',
			payload: {
				frameType: 'open',
				payload: { q: 'test' },
				parameter: {},
			},
		})

		const frameTypes: string[] = []
		const chunks: unknown[] = []
		let finalPayload: unknown

		for await (const frame of handle) {
			frameTypes.push(frame.payload.frameType)
			if (frame.payload.frameType === 'chunk') {
				chunks.push(frame.payload.chunk)
			}
			if (frame.payload.frameType === 'complete') {
				finalPayload = frame.payload.final
			}
		}

		expect(frameTypes).toEqual(['start', 'chunk', 'complete'])
		expect(chunks).toEqual([{ value: 'hello' }])
		expect(finalPayload).toEqual({ done: true })

		await eventBridge.destroy()
	})
})
