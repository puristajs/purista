import { stub } from 'sinon'

import { initLogger } from '../../initLogger.impl'
import { EBMessage, EBMessageType, Subscription } from '../../types'
import { getNewSubscriptionStorageEntry } from '../getNewSubscriptionStorageEntry.impl'
import { isMessageMatchingSubscription } from '../isMessageMatchingSubscription.impl'

describe('subscription matching for sender', () => {
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

  it('matches on receiver service name', () => {
    const subscription: Subscription = {
      receiver: {
        serviceName: receiver.serviceName,
      },
      callback,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('fails on different receiver service name', () => {
    const subscription: Subscription = {
      receiver: {
        serviceName: 'differentService',
      },
      callback,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeFalsy()
  })

  it('matches on receiver service version', () => {
    const subscription: Subscription = {
      receiver: {
        serviceVersion: receiver.serviceVersion,
      },
      callback,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('matches on receiver service version pattern *.?', () => {
    const subscription: Subscription = {
      receiver: {
        serviceVersion: '2.*.?',
      },
      callback,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('fails on different receiver service version', () => {
    const subscription: Subscription = {
      receiver: {
        serviceVersion: '9.9.9',
      },
      callback,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeFalsy()
  })

  it('matches on receiver service target', () => {
    const subscription: Subscription = {
      receiver: {
        serviceTarget: receiver.serviceTarget,
      },
      callback,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('matches on receiver service target wildcard *', () => {
    const subscription: Subscription = {
      receiver: {
        serviceTarget: 'receiver*',
      },
      callback,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('fails on different receiver service target', () => {
    const subscription: Subscription = {
      receiver: {
        serviceTarget: 'differentTarget',
      },
      callback,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeFalsy()
  })
})
