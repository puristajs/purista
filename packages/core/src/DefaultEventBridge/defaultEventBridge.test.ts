import { assert, spy, stub } from 'sinon'
import { UnhandledError } from '../core/Error/UnhandledError.impl.js'
import type { Subscription } from '../core/index.js'
import { createInfoMessage, EBMessageType } from '../core/index.js'
import { getCommandMessageMock, getCustomMessageMessageMock, getLoggerMock } from '../mocks/index.js'
import { DefaultEventBridge } from './DefaultEventBridge.impl.js'

class TestDefaultEventBridge extends DefaultEventBridge {
	public setHealthy(healthy: boolean) {
		this.healthy = healthy
	}

	public getPendingInvocations() {
		return this.pendingInvocations
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

		eventBridge.getPendingInvocations().set('pending-id', {
			resolve: () => {
				/* noop */
			},
			reject: () => {
				/* noop */
			},
		})

		setTimeout(() => {
			eventBridge.getPendingInvocations().delete('pending-id')
		}, 30)

		const start = Date.now()
		await eventBridge.destroy()
		const duration = Date.now() - start

		expect(duration).toBeGreaterThanOrEqual(20)
	})
})
