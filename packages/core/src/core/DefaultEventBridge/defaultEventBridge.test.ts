import { assert, match, spy, stub } from 'sinon'

import { getDefaultEventBridgeConfig } from '../config'
import { Command, EBMessageType, InfoMessage, Logger, Subscription } from '../types'
import { DefaultEventBridge } from './DefaultEventBridge.impl'

describe('DefaultEventBridge', () => {
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

  const otherSubscriber = {
    serviceName: 'OtherSubscriberService',
    serviceVersion: '4.4.4',
    serviceTarget: 'otherSubscriberServiceTarget',
  }

  const eventName = 'testEventName'

  it('creates a DefaultEventBridge', () => {
    const config = getDefaultEventBridgeConfig()

    const trace = stub()
    const error = stub()
    const warn = stub()
    const info = stub()
    const debug = stub()

    const logger = {
      getChildLogger: () => {
        return {
          info,
          debug,
          trace,
          error,
          warn,
        } as unknown as Logger
      },
    } as Logger

    const eventBridge = new DefaultEventBridge(logger, config)

    expect(eventBridge.defaultTtl).toBe(config.defaultTtl)
  })

  it('routes messages to subscriptions', async () => {
    const config = getDefaultEventBridgeConfig()

    const trace = stub()
    const error = stub()
    const warn = stub()
    const info = stub()
    const debug = stub()

    const logger = {
      getChildLogger: () => {
        return {
          info,
          debug,
          trace,
          error,
          warn,
        } as unknown as Logger
      },
    } as Logger

    const eventBridge = new DefaultEventBridge(logger, config)

    const callback = stub().resolves()

    const subscription: Subscription = {
      sender,
      callback,
      subscriber,
    }

    const otherCall = stub().resolves()
    const otherSubscription: Subscription = {
      sender: {
        serviceName: 'SomeService',
      },
      callback: otherCall,
      subscriber: otherSubscriber,
    }

    eventBridge.subscribe(subscription)
    eventBridge.subscribe(otherSubscription)

    const message: Command = {
      id: 'messageTestId',
      instanceId: 'myInstance',
      messageType: EBMessageType.Command,
      traceId: 'messageTraceId',
      timestamp: Date.now(),
      correlationId: 'messageCorrelationId',
      principalId: 'messagePrincipalId',
      eventName,
      sender,
      receiver,
      payload: {
        parameter: { parameter: 1 },
        payload: { payload: 'content' },
      },
    }

    await expect(eventBridge.emit(message)).resolves.toBeUndefined()

    expect(callback.called).toBeTruthy()
    expect(callback.callCount).toBe(1)
    assert.calledWith(callback, match.string, message)

    expect(otherCall.callCount).toBe(0)

    expect(trace.called).toBeTruthy()

    const unsubscribe = spy(eventBridge, 'unsubscribe')

    await eventBridge.unsubscribeService(subscriber)

    expect(unsubscribe.callCount).toBe(1)

    callback.resetHistory()
    trace.resetHistory()

    await expect(eventBridge.emit(message)).resolves.toBeUndefined()

    expect(callback.called).toBeFalsy()

    expect(error.called).toBeFalsy()
    expect(warn.called).toBeFalsy()
  })

  it('does not throw and logs error', async () => {
    const config = getDefaultEventBridgeConfig()

    const trace = stub()
    const error = stub()
    const warn = stub()
    const info = stub()
    const debug = stub()

    const logger = {
      getChildLogger: () => {
        return {
          info,
          debug,
          trace,
          error,
          warn,
        } as unknown as Logger
      },
    } as Logger

    const eventBridge = new DefaultEventBridge(logger, config)

    const throwedError = new Error('Some Error')
    const callback = stub().rejects(throwedError)

    const subscription: Subscription = {
      sender,
      callback,
      subscriber,
    }

    eventBridge.subscribe(subscription)

    const message: Command = {
      id: 'messageTestId',
      instanceId: 'myInstance',
      messageType: EBMessageType.Command,
      traceId: 'messageTraceId',
      timestamp: Date.now(),
      correlationId: 'messageCorrelationId',
      principalId: 'messagePrincipalId',
      eventName,
      sender,
      receiver,
      payload: {
        parameter: { parameter: 1 },
        payload: { payload: 'content' },
      },
    }

    await expect(eventBridge.emit(message)).resolves.toBeUndefined()

    expect(callback.called).toBeTruthy()
    expect(callback.callCount).toBe(1)
    assert.calledWith(callback, match.string, message)

    expect(error.called).toBeTruthy()
    assert.calledWith(error, match.string, throwedError, match.object)
  })

  it('traces info messages', async () => {
    const config = getDefaultEventBridgeConfig()

    const trace = stub()
    const error = stub()
    const warn = stub()
    const info = stub()
    const debug = stub()

    const logger = {
      getChildLogger: () => {
        return {
          info,
          debug,
          trace,
          error,
          warn,
        } as unknown as Logger
      },
    } as Logger

    const eventBridge = new DefaultEventBridge(logger, config)

    const callback = stub().resolves()

    const subscription: Subscription = {
      sender,
      callback,
      subscriber,
    }

    eventBridge.subscribe(subscription)

    const message: InfoMessage = {
      id: 'messageTestId',
      instanceId: 'myInstance',
      messageType: EBMessageType.InfoServiceFunctionAdded,
      traceId: 'messageTraceId',
      timestamp: Date.now(),
      correlationId: 'messageCorrelationId',
      principalId: 'messagePrincipalId',
      eventName,
      sender,
      data: {
        some: 'data',
      },
    }

    await expect(eventBridge.emit(message)).resolves.toBeUndefined()

    expect(callback.called).toBeTruthy()
    expect(callback.callCount).toBe(1)
    assert.calledWith(callback, match.string, message)

    expect(trace.called).toBeTruthy()
  })
})
