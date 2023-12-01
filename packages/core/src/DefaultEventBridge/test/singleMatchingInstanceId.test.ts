import { stub } from 'sinon'

import type { EBMessage, Subscription } from '../../core'
import { EBMessageType } from '../../core'
import { getLoggerMock } from '../../mocks'
import { getNewSubscriptionStorageEntry } from '../getNewSubscriptionStorageEntry.impl'
import { isMessageMatchingSubscription } from '../isMessageMatchingSubscription.impl'

describe('subscription matching for instanceId', () => {
  const sender = {
    serviceName: 'SenderService',
    serviceVersion: '1',
    serviceTarget: 'senderServiceTarget',
    instanceId: 'SenderServiceInstance',
  }

  const receiver = {
    serviceName: 'ReceiverService',
    serviceVersion: '2',
    serviceTarget: 'receiverServiceTarget',
    instanceId: 'ReceiverServiceInstance',
  }

  const subscriber = {
    serviceName: 'SubscriberService',
    serviceVersion: '3',
    serviceTarget: 'subscriberServiceTarget',
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

  it('matches on sender instanceId', () => {
    const subscription: Subscription = {
      sender: {
        instanceId: 'SenderServiceInstance',
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

  it('fails on different sender instanceId', () => {
    const subscription: Subscription = {
      sender: {
        ...sender,
        instanceId: 'otherInstanceId',
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

  it('matches on receiver instanceId', () => {
    const subscription: Subscription = {
      receiver: {
        instanceId: 'ReceiverServiceInstance',
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

  it('fails on different receiver instanceId', () => {
    const subscription: Subscription = {
      receiver: {
        ...receiver,
        instanceId: 'otherInstanceId',
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
