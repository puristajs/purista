import { assert, match, spy, stub } from 'sinon'

import { getLoggerMock } from '../../testhelper'
import { getDefaultEventBridgeConfig } from '../config'
import { Command, EBMessageType, InfoMessage, Subscription } from '../types'
import { DefaultEventBridge } from './DefaultEventBridge.impl'

describe.skip('DefaultEventBridge', () => {
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

  const otherSubscriber = {
    serviceName: 'OtherSubscriberService',
    serviceVersion: '4',
    serviceTarget: 'otherSubscriberServiceTarget',
  }

  const eventName = 'testEventName'

  it('creates a DefaultEventBridge', () => {
    const config = getDefaultEventBridgeConfig()

    const logger = getLoggerMock()

    const eventBridge = new DefaultEventBridge(logger.mock, config)

    expect(eventBridge.defaultCommandTimeout).toBe(config.defaultCommandTimeout)
  })

  it('routes messages to subscriptions', async () => {
    const config = getDefaultEventBridgeConfig()

    const logger = getLoggerMock()

    const eventBridge = new DefaultEventBridge(logger.mock, config)
    await eventBridge.start()

    const callback = stub().resolves()

    const subscription: Subscription = {
      sender,
      subscriber,
      settings: {
        durable: false,
      },
    }

    const otherCall = stub().resolves()
    const otherSubscription: Subscription = {
      sender: {
        serviceName: 'SomeService',
      },
      subscriber: otherSubscriber,
      settings: {
        durable: false,
      },
    }

    eventBridge.registerSubscription(subscription, callback)
    eventBridge.registerSubscription(otherSubscription, otherCall)

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

    expect(logger.stubs.trace.called).toBeTruthy()

    const unsubscribe = spy(eventBridge, 'unregisterSubscription')

    await eventBridge.unregisterSubscription(subscriber)

    expect(unsubscribe.callCount).toBe(1)

    callback.resetHistory()
    logger.stubs.trace.resetHistory()

    await expect(eventBridge.emit(message)).resolves.toBeUndefined()

    expect(callback.called).toBeFalsy()

    expect(logger.stubs.error.called).toBeFalsy()
    expect(logger.stubs.warn.called).toBeFalsy()
  })

  it('does not throw and logs error', async () => {
    const config = getDefaultEventBridgeConfig()

    const logger = getLoggerMock()

    const eventBridge = new DefaultEventBridge(logger.mock, config)
    await eventBridge.start()

    const throwedError = new Error('Some Error')
    const callback = stub().rejects(throwedError)

    const subscription: Subscription = {
      sender,
      subscriber,
      settings: {
        durable: false,
      },
    }

    eventBridge.registerSubscription(subscription, callback)

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

    expect(logger.stubs.error.called).toBeTruthy()
    assert.calledWith(logger.stubs.error, match.string, throwedError, match.object)
  })

  it('traces info messages', async () => {
    const config = getDefaultEventBridgeConfig()

    const logger = getLoggerMock()

    const eventBridge = new DefaultEventBridge(logger.mock, config)
    await eventBridge.start()

    const callback = stub().resolves()

    const subscription: Subscription = {
      sender,
      subscriber,
      settings: {
        durable: false,
      },
    }

    eventBridge.registerSubscription(subscription, callback)

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
      payload: {
        some: 'data',
      },
    }

    await expect(eventBridge.emit(message)).resolves.toBeUndefined()

    expect(callback.called).toBeTruthy()
    expect(callback.callCount).toBe(1)
    assert.calledWith(callback, match.string, message)

    expect(logger.stubs.trace.called).toBeTruthy()
  })
})
