import { stub } from 'sinon'

import { initLogger } from '../../initLogger.impl'
import { EBMessageType, InfoMessage, Subscription } from '../../types'
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
      eventName,
      payload: {},
    }
  }

  it('matches on sender service name', () => {
    const subscription: Subscription = {
      sender: {
        serviceName: sender.serviceName,
      },
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('fails on different sender service name', () => {
    const subscription: Subscription = {
      sender: {
        serviceName: 'differentService',
      },
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeFalsy()
  })

  it('matches on sender service version', () => {
    const subscription: Subscription = {
      sender: {
        serviceVersion: sender.serviceVersion,
      },
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('fails on different sender service version', () => {
    const subscription: Subscription = {
      sender: {
        serviceVersion: '9',
      },
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeFalsy()
  })

  it('matches on sender service target', () => {
    const subscription: Subscription = {
      sender: {
        serviceTarget: sender.serviceTarget,
      },
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('fails on different sender service target', () => {
    const subscription: Subscription = {
      sender: {
        serviceTarget: 'differentTarget',
      },
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeFalsy()
  })

  it('matches on message type', () => {
    const subscription: Subscription = {
      messageType: EBMessageType.InfoServiceInit,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('fails on different message type', () => {
    const subscription: Subscription = {
      messageType: EBMessageType.InfoServiceDrain,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeFalsy()
  })

  it('fails if receiver is set in subscription', () => {
    const subscription: Subscription = {
      sender: {
        serviceName: sender.serviceName,
      },
      subscriber,
      receiver,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription, callback)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeFalsy()
  })
})