import { stub } from 'sinon'

import { getLoggerMock } from '../../../testhelper'
import { EBMessage, EBMessageType, Subscription } from '../../types'
import { getNewSubscriptionStorageEntry } from '../getNewSubscriptionStorageEntry.impl'
import { isMessageMatchingSubscription } from '../isMessageMatchingSubscription.impl'

describe('subscription matching for sender', () => {
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
    }
  }

  it('matches on receiver service name', () => {
    const subscription: Subscription = {
      receiver: {
        serviceName: receiver.serviceName,
      },
      subscriber,
      settings: {
        durable: false,
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
      settings: {
        durable: false,
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
      settings: {
        durable: false,
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
      settings: {
        durable: false,
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
      settings: {
        durable: false,
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
      settings: {
        durable: false,
      },
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(getLoggerMock().mock, getTestMessage(), storageEntry)

    expect(result).toBeFalsy()
  })
})
