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

  it('matches on sender service name', () => {
    const subscription: Subscription = {
      sender: {
        serviceName: sender.serviceName,
      },
      callback,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('matches on sender service name wildcard * ', () => {
    const subscription: Subscription = {
      sender: {
        serviceName: 'Sender*',
      },
      callback,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('fails on different sender service name', () => {
    const subscription: Subscription = {
      sender: {
        serviceName: 'differentService',
      },
      callback,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeFalsy()
  })

  it('matches on sender service version', () => {
    const subscription: Subscription = {
      sender: {
        serviceVersion: sender.serviceVersion,
      },
      callback,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('matches on sender service version wildcard *', () => {
    const subscription: Subscription = {
      sender: {
        serviceVersion: '1.*.*',
      },
      callback,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('matches on sender service version pattern *.?', () => {
    const subscription: Subscription = {
      sender: {
        serviceVersion: '1.*.?',
      },
      callback,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('fails on different sender service version', () => {
    const subscription: Subscription = {
      sender: {
        serviceVersion: '9.9.9',
      },
      callback,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeFalsy()
  })

  it('matches on sender service target', () => {
    const subscription: Subscription = {
      sender: {
        serviceTarget: sender.serviceTarget,
      },
      callback,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('matches on sender service target wildcard *', () => {
    const subscription: Subscription = {
      sender: {
        serviceTarget: 'sender*',
      },
      callback,
      subscriber,
    }

    const storageEntry = getNewSubscriptionStorageEntry(subscription)

    const result = isMessageMatchingSubscription(initLogger('info'), getTestMessage(), storageEntry)

    expect(result).toBeTruthy()
  })

  it('fails on different sender service target', () => {
    const subscription: Subscription = {
      sender: {
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
