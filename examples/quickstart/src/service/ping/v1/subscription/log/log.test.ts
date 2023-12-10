import {
  getCommandSuccessMessageMock,
  getEventBridgeMock,
  getLoggerMock,
  getSubscriptionContextMock,
} from '@purista/core'
import { createSandbox } from 'sinon'

import { pingV1Service } from '../../pingV1Service.js'
import { logSubscriptionBuilder } from './logSubscriptionBuilder.js'
import type { PingV1LogInputPayload } from './types.js'

describe('service Ping version 1 - subscription log', () => {
  let sandbox = createSandbox()
  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('does not throw', async () => {
    // create a service instance to be bind to the subscription function
    const service = pingV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
      logger: getLoggerMock(sandbox).mock,
    })

    // get the subscription function and bind to service instance to work properly
    const log = logSubscriptionBuilder.getSubscriptionFunction().bind(service)

    // define the test input payload
    const payload: PingV1LogInputPayload = {
      pong: 'test',
    }

    // define the test input parameter
    const parameter = undefined

    // create a mock message with the expected input for the subscription function
    const message = getCommandSuccessMessageMock(payload)

    // create a subscription context for the subscription function
    const context = getSubscriptionContextMock(message, sandbox)

    // execute the subscription function
    const result = await log(context.mock, payload, parameter)

    expect(result).toBeUndefined()
  })
})
