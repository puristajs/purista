import { stub } from 'sinon'

import type { InfoMessage, Subscription } from '../../core'
import { EBMessageType } from '../../core'
import { getLoggerMock } from '../../mocks'
import { getNewSubscriptionStorageEntry } from '../getNewSubscriptionStorageEntry.impl'
import { isMessageMatchingSubscription } from '../isMessageMatchingSubscription.impl'

describe('subscription matching for info message', () => {
  const sender = {
    serviceName: 'SenderService',
    serviceVersion: '1',
    serviceTarget: 'senderServiceTarget',
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

  const callback = stub().resolves()

  const eventName = 'testEventName'

  const getTestMessage = (): InfoMessage => {
    return {
      sender,
      instanceId: 'instanceId',
      messageType: EBMessageType.InfoServiceInit,
      id: 'messageTestId',
      traceId: 'messageTraceId',
      timestamp: Date.now(),
      correlationId: 'messageCorrelationId',
      principalId: 'messagePrincipalId',
      tenantId: 'messageTenantId',
      eventName,
      payload: {},
      contentType: 'application/json',
      contentEncoding: 'utf-8',
    }
  }

  it('matches on sender service name', () => {
    const subscription: Subscription = {
      sender: {
        serviceName: sender.serviceName,
      },
      subscriber,
      eventBridgeConfig: {
        durable: false,
      },
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(getLoggerMock().mock, getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('fails on different sender service name', () => {
    const subscription: Subscription = {
      sender: {
        serviceName: 'differentService',
      },
      subscriber,
      eventBridgeConfig: {
        durable: false,
      },
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(getLoggerMock().mock, getTestMessage(), storageEntry)

    expect(result).toBeFalsy()
  })

  it('matches on sender service version', () => {
    const subscription: Subscription = {
      sender: {
        serviceVersion: sender.serviceVersion,
      },
      subscriber,
      eventBridgeConfig: {
        durable: false,
      },
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(getLoggerMock().mock, getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('fails on different sender service version', () => {
    const subscription: Subscription = {
      sender: {
        serviceVersion: '9',
      },
      subscriber,
      eventBridgeConfig: {
        durable: false,
      },
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(getLoggerMock().mock, getTestMessage(), storageEntry)

    expect(result).toBeFalsy()
  })

  it('matches on sender service target', () => {
    const subscription: Subscription = {
      sender: {
        serviceTarget: sender.serviceTarget,
      },
      subscriber,
      eventBridgeConfig: {
        durable: false,
      },
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(getLoggerMock().mock, getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('fails on different sender service target', () => {
    const subscription: Subscription = {
      sender: {
        serviceTarget: 'differentTarget',
      },
      subscriber,
      eventBridgeConfig: {
        durable: false,
      },
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(getLoggerMock().mock, getTestMessage(), storageEntry)

    expect(result).toBeFalsy()
  })

  it('matches on message type', () => {
    const subscription: Subscription = {
      messageType: EBMessageType.InfoServiceInit,
      subscriber,
      eventBridgeConfig: {
        durable: false,
      },
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(getLoggerMock().mock, getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('fails on different message type', () => {
    const subscription: Subscription = {
      messageType: EBMessageType.InfoServiceDrain,
      subscriber,
      eventBridgeConfig: {
        durable: false,
      },
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(getLoggerMock().mock, getTestMessage(), storageEntry)

    expect(result).toBeFalsy()
  })

  it('fails if receiver is set in subscription', () => {
    const subscription: Subscription = {
      sender: {
        serviceName: sender.serviceName,
      },
      subscriber,
      receiver,
      eventBridgeConfig: {
        durable: false,
      },
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(getLoggerMock().mock, getTestMessage(), storageEntry)

    expect(result).toBeFalsy()
  })
})
