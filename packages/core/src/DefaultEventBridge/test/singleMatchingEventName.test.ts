import { stub } from 'sinon'

import { EBMessage, EBMessageType, Subscription } from '../../core'
import { getLoggerMock } from '../../mocks'
import { getNewSubscriptionStorageEntry } from '../getNewSubscriptionStorageEntry.impl'
import { isMessageMatchingSubscription } from '../isMessageMatchingSubscription.impl'

describe('subscription matching for even name', () => {
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

  it('matches on event name', () => {
    const subscription: Subscription = {
      eventName,
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

  it('fails on different event name', () => {
    const subscription: Subscription = {
      eventName: 'otherEventName',
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
