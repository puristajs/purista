import { stub } from 'sinon'

import { initLogger } from '../../initLogger.impl'
import { Command, EBMessage, EBMessageType, Subscription } from '../../types'
import { getNewSubscriptionStorageEntry } from '../getNewSubscriptionStorageEntry.impl'
import { isMessageMatchingSubscription } from '../isMessageMatchingSubscription.impl'

describe('subscription matching for message type', () => {
  const sender = {
    serviceName: 'SenderService',
    serviceVersion: '1.1.1',
    serviceTarget: 'senderServiceTarget',
  }

  const receiver = {
    serviceName: 'ReceiverService',
    serviceVersion: '2.2.2',
    serviceTarget: 'receiverServiceTarget',
  }

  const subscriber = {
    serviceName: 'SubscriberService',
    serviceVersion: '3.3.3',
    serviceTarget: 'subscriberServiceTarget',
  }

  const callback = stub().resolves()

  const eventName = 'testEventName'

  const getTestMessage = (): EBMessage => {
    return {
      sender,
      receiver,
      response: {},
      messageType: EBMessageType.CommandSuccessResponse,
      id: 'messageTestId',
      traceId: 'messageTraceId',
      timestamp: Date.now(),
      correlationId: 'messageCorrelationId',
      principalId: 'messagePrincipalId',
      eventName,
    }
  }

  it('matches on message type', () => {
    const subscription: Subscription = {
      messageTypes: [EBMessageType.InfoServiceInit, EBMessageType.Command],
      callback,
      subscriber,
    }

    const message: Command = {
      id: 'messageTestId',
      traceId: 'messageTraceId',
      timestamp: Date.now(),
      correlationId: 'messageCorrelationId',
      principalId: 'messagePrincipalId',
      eventName,
      sender,
      receiver,
      command: { parameter: {}, payload: {} },
      messageType: EBMessageType.Command,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), message, storageEntry)

    expect(result).toBeTruthy()
  })

  it('fails on different message type', () => {
    const subscription: Subscription = {
      messageTypes: [EBMessageType.InfoServiceDrain, EBMessageType.CommandErrorResponse],
      callback,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeFalsy()
  })

  it('fails on unknown message type', () => {
    const subscription: Subscription = {
      sender,
      callback,
      subscriber,
    }

    const message = getTestMessage()
    message.messageType = 'unknown' as EBMessageType

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), message, storageEntry)

    expect(result).toBeFalsy()
  })
})
