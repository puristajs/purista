import { stub } from 'sinon'

import { initLogger } from '../../initLogger.impl'
import { EBMessage, EBMessageType, Subscription } from '../../types'
import { getNewSubscriptionStorageEntry } from '../getNewSubscriptionStorageEntry.impl'
import { isMessageMatchingSubscription } from '../isMessageMatchingSubscription.impl'

describe('subscription matching for even name', () => {
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

  it('matches on event name', () => {
    const subscription: Subscription = {
      eventName,
      callback,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('matches on event name wildcard *', () => {
    const subscription: Subscription = {
      eventName: 'test*',
      callback,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('fails on different event name', () => {
    const subscription: Subscription = {
      eventName: 'otherEventName',
      callback,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeFalsy()
  })
})
