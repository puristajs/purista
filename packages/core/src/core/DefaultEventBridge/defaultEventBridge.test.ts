import { assert, spy, stub } from 'sinon'

import { getCustomMessageMessageMock, getLoggerMock } from '../../testhelper'
import { getDefaultEventBridgeConfig } from '../config'
import { createInfoMessage } from '../helper'
import { EBMessageType, Subscription } from '../types'
import { DefaultEventBridge } from './DefaultEventBridge.impl'

describe('DefaultEventBridge', () => {
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

    const eventBridge = new DefaultEventBridge(config, { logger: logger.mock })

    expect(eventBridge.defaultCommandTimeout).toBe(config.defaultCommandTimeout)
  })

  it('routes custom messages to subscriptions', async () => {
    const config = getDefaultEventBridgeConfig()

    const logger = getLoggerMock()

    const eventBridge = new DefaultEventBridge(config, { logger: logger.mock })
    await eventBridge.start()

    const callback = stub().resolves()

    const subscription: Subscription = {
      sender,
      subscriber,
      eventBridgeConfig: {
        durable: false,
      },
    }

    const otherCall = stub().resolves()
    const otherSubscription: Subscription = {
      sender: {
        serviceName: 'SomeService',
      },
      subscriber: otherSubscriber,
      eventBridgeConfig: {
        durable: false,
      },
    }

    eventBridge.registerSubscription(subscription, callback)
    eventBridge.registerSubscription(otherSubscription, otherCall)

    const message = getCustomMessageMessageMock(
      eventName,
      {
        parameter: { parameter: 1 },
        payload: { payload: 'content' },
      },
      {
        sender,
        receiver,
      },
    )

    const emittedMessage = await eventBridge.emitMessage(message)
    await new Promise((resolve) => process.nextTick(resolve))

    expect(callback.called).toBeTruthy()
    expect(callback.callCount).toBe(1)
    assert.calledWith(callback, emittedMessage)

    expect(otherCall.callCount).toBe(0)

    const unsubscribe = spy(eventBridge, 'unregisterSubscription')

    await eventBridge.unregisterSubscription(subscriber)

    expect(unsubscribe.callCount).toBe(1)

    callback.resetHistory()
    logger.stubs.trace.resetHistory()

    await eventBridge.emitMessage(message)
    await new Promise((resolve) => process.nextTick(resolve))

    expect(callback.called).toBeFalsy()

    expect(logger.stubs.warn.getCall(0).args[1]).toEqual(
      'InvalidMessage: received a message which is not consumed by any service command or subscription',
    )
    expect(logger.stubs.error.called).toBeFalsy()
  })

  it('returns error if command is not found', async () => {
    expect(true).toBeTruthy()
  })

  it('returns command success message', async () => {
    expect(true).toBeTruthy()
  })

  it('returns command error message', async () => {
    expect(true).toBeTruthy()
  })

  it('traces info messages', async () => {
    const config = getDefaultEventBridgeConfig()

    const logger = getLoggerMock()

    const eventBridge = new DefaultEventBridge(config, { logger: logger.mock })
    await eventBridge.start()

    const callback = stub().resolves()

    const subscription: Subscription = {
      sender,
      subscriber,
      eventBridgeConfig: {
        durable: false,
      },
    }

    eventBridge.registerSubscription(subscription, callback)

    const message = createInfoMessage(EBMessageType.InfoServiceFunctionAdded, sender, {
      payload: { some: 'data' },
    })

    const emittedMessage = await eventBridge.emitMessage(message)
    await new Promise((resolve) => process.nextTick(resolve))

    expect(callback.callCount).toBe(1)
    assert.calledWith(callback, emittedMessage)

    expect(logger.stubs.trace.called).toBeTruthy()
  })
})
