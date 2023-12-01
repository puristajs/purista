import { stub } from 'sinon'

import type { Command, EBMessage, Subscription } from '../../core'
import { EBMessageType } from '../../core'
import { getLoggerMock } from '../../mocks'
import { getNewSubscriptionStorageEntry } from '../getNewSubscriptionStorageEntry.impl'
import { isMessageMatchingSubscription } from '../isMessageMatchingSubscription.impl'

describe('subscription matching for message type', () => {
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

  it('matches on message type', () => {
    const subscription: Subscription = {
      messageType: EBMessageType.Command,
      subscriber,
      eventBridgeConfig: {
        durable: false,
        autoacknowledge: true,
        shared: true,
      },
    }

    const message: Command = {
      id: 'messageTestId',
      traceId: 'messageTraceId',
      timestamp: Date.now(),
      correlationId: 'messageCorrelationId',
      principalId: 'messagePrincipalId',
      tenantId: 'messageTenantId',
      eventName,
      sender,
      receiver,
      payload: { parameter: {}, payload: {} },
      messageType: EBMessageType.Command,
      contentType: 'application/json',
      contentEncoding: 'utf-8',
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(getLoggerMock().mock, message, storageEntry)

    expect(result).toBeTruthy()
  })

  it('fails on different message type', () => {
    const subscription: Subscription = {
      messageType: EBMessageType.InfoServiceDrain,
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

  it('fails on unknown message type', () => {
    const subscription: Subscription = {
      sender,
      subscriber,
      eventBridgeConfig: {
        durable: false,
        autoacknowledge: true,
        shared: true,
      },
    }

    const message = getTestMessage()
    message.messageType = 'unknown' as EBMessageType

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(getLoggerMock().mock, message, storageEntry)

    expect(result).toBeFalsy()
  })
})
