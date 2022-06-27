import { stub } from 'sinon'

import { EventBridge, Logger, ServiceInfoType } from '../types'
import { Service } from './Service.impl'

describe('Service', () => {
  const getEventBridgeMock = (): EventBridge => {
    const emit = stub()
    const subscribe = stub()
    const unsubscribe = stub()
    const unsubscribeService = stub()

    return {
      defaultTtl: 1000,
      emit,
      subscribe,
      unsubscribe,
      unsubscribeService,
    }
  }

  const getLoggerMock = (): Logger => {
    const info = stub()
    const error = stub()
    const warn = stub()
    const debug = stub()
    const trace = stub()

    const logger: Logger = {
      info,
      error,
      warn,
      debug,
      trace,
      getChildLogger: () => logger,
    } as unknown as Logger

    return logger
  }

  const serviceInfo: ServiceInfoType = {
    serviceName: 'TestService',
    serviceVersion: '1.0.0',
    serviceDescription: 'A service for unit tests',
  }

  it('creates a new instance', async () => {
    const logger = getLoggerMock()
    const eventbridge = getEventBridgeMock()

    const service = new Service(logger, serviceInfo, eventbridge, [], [])

    await expect(service.start()).resolves.toBeUndefined()

    await expect(service.destroy()).resolves.toBeUndefined()
  })
})
