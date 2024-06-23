import { stub } from 'sinon'

import type { EBMessage, Subscription } from '../../core/index.js'
import { EBMessageType } from '../../core/index.js'
import { getLoggerMock } from '../../mocks/index.js'
import { getNewSubscriptionStorageEntry } from '../getNewSubscriptionStorageEntry.impl.js'
import { isMessageMatchingSubscription } from '../isMessageMatchingSubscription.impl.js'

describe('subscription matching for sender', () => {
	const sender = {
		serviceName: 'SenderService',
		serviceVersion: '1',
		serviceTarget: 'senderServiceTarget',
		instanceId: 'instanceId',
	}

	const receiver = {
		serviceName: 'ReceiverService',
		serviceVersion: '2',
		serviceTarget: 'receiverServiceTarget',
		instanceId: 'instanceId',
	}

	const subscriber = {
		serviceName: 'SubscriberService',
		serviceVersion: '3',
		serviceTarget: 'subscriberServiceTarget',
		instanceId: 'instanceId',
	}

	const callback = stub().resolves()

	const eventName = 'testEventName'

	const getTestMessage = (): EBMessage => {
		return {
			sender,
			receiver,
			payload: {},
			messageType: EBMessageType.CommandSuccessResponse,
			id: 'messageTestId',
			traceId: 'messageTraceId',
			timestamp: Date.now(),
			correlationId: 'messageCorrelationId',
			principalId: 'messagePrincipalId',
			tenantId: 'messageTenantId',
			eventName,
			contentType: 'application/json',
			contentEncoding: 'utf-8',
		}
	}

	it('matches on receiver service name', () => {
		const subscription: Subscription = {
			receiver: {
				serviceName: receiver.serviceName,
			},
			subscriber,
			eventBridgeConfig: {
				durable: false,
				autoacknowledge: true,
				shared: true,
			},
		}

		const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

		const result = isMessageMatchingSubscription(getLoggerMock().mock, getTestMessage(), storageEntry)

		expect(result).toBeTruthy()
	})

	it('fails on different receiver service name', () => {
		const subscription: Subscription = {
			receiver: {
				serviceName: 'differentService',
			},
			subscriber,
			eventBridgeConfig: {
				durable: false,
				autoacknowledge: true,
				shared: true,
			},
		}

		const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

		const result = isMessageMatchingSubscription(getLoggerMock().mock, getTestMessage(), storageEntry)

		expect(result).toBeFalsy()
	})

	it('matches on receiver service version', () => {
		const subscription: Subscription = {
			receiver: {
				serviceVersion: receiver.serviceVersion,
			},
			subscriber,
			eventBridgeConfig: {
				durable: false,
				autoacknowledge: true,
				shared: true,
			},
		}

		const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

		const result = isMessageMatchingSubscription(getLoggerMock().mock, getTestMessage(), storageEntry)

		expect(result).toBeTruthy()
	})

	it('fails on different receiver service version', () => {
		const subscription: Subscription = {
			receiver: {
				serviceVersion: '9',
			},
			subscriber,
			eventBridgeConfig: {
				durable: false,
				autoacknowledge: true,
				shared: true,
			},
		}

		const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

		const result = isMessageMatchingSubscription(getLoggerMock().mock, getTestMessage(), storageEntry)

		expect(result).toBeFalsy()
	})

	it('matches on receiver service target', () => {
		const subscription: Subscription = {
			receiver: {
				serviceTarget: receiver.serviceTarget,
			},
			subscriber,
			eventBridgeConfig: {
				durable: false,
				autoacknowledge: true,
				shared: true,
			},
		}

		const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

		const result = isMessageMatchingSubscription(getLoggerMock().mock, getTestMessage(), storageEntry)

		expect(result).toBeTruthy()
	})

	it('fails on different receiver service target', () => {
		const subscription: Subscription = {
			receiver: {
				serviceTarget: 'differentTarget',
			},
			subscriber,
			eventBridgeConfig: {
				durable: false,
				autoacknowledge: true,
				shared: true,
			},
		}

		const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

		const result = isMessageMatchingSubscription(getLoggerMock().mock, getTestMessage(), storageEntry)

		expect(result).toBeFalsy()
	})
})
