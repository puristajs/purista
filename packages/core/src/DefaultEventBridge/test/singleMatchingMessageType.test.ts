import { stub } from 'sinon'

import { Command, EBMessage, EBMessageType, Subscription } from '../../core'
import { getLoggerMock } from '../../mocks'
import { getNewSubscriptionStorageEntry } from '../getNewSubscriptionStorageEntry.impl'
import { isMessageMatchingSubscription } from '../isMessageMatchingSubscription.impl'

describe('subscription matching for message type', () => {
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

  const getTestMessage = (): EBMessage => {
    return {
      instanceId: 'instanceId',
      sender,
      receiver,
      payload: {},
      messageType: EBMessageType.CommandSuccessResponse,
      id: 'messageTestId',
      traceId: 'messageTraceId',
      timestamp: Date.now(),
      correlationId: 'messageCorrelationId',
      principalId: 'messagePrincipalId',
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
      },
    }

    const message: Command = {
      instanceId: 'instanceId',
      id: 'messageTestId',
      traceId: 'messageTraceId',
      timestamp: Date.now(),
      correlationId: 'messageCorrelationId',
      principalId: 'messagePrincipalId',
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
      },
    }

    const message = getTestMessage()
    message.messageType = 'unknown' as EBMessageType

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(getLoggerMock().mock, message, storageEntry)

    expect(result).toBeFalsy()
  })
})
