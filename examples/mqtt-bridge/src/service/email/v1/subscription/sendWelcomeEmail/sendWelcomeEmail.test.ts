import { getCommandSuccessMessageMock, getEventBridgeMock, getLoggerMock } from '@purista/core'
import { createSandbox } from 'sinon'

import type { User } from '../../../../../types/index.js'
import { emailV1Service } from '../../emailV1Service.js'
import { sendWelcomeEmailSubscriptionBuilder } from './sendWelcomeEmailSubscriptionBuilder.js'
import type { EmailV1SendWelcomeEmailInputPayload } from './types.js'

describe('service Email version 1 - subscription sendWelcomeEmail', () => {
  let sandbox = createSandbox()
  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('sends an email', async () => {
    // create a service instance to be bind to the subscription function
    const service = emailV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
      logger: getLoggerMock(sandbox).mock,
    })

    // get the subscription function and bind to service instance to work properly
    const sendWelcomeEmail = sendWelcomeEmailSubscriptionBuilder.getSubscriptionFunction().bind(service)

    const userMock: User = {
      email: 'email@example.com',
      name: 'test user',
      password: 'password',
      userId: 'a5fef052-911c-472c-ac25-e2da327f0af5',
    }

    // define the test input payload
    const payload: EmailV1SendWelcomeEmailInputPayload = { userId: userMock.userId }

    // define the test input parameter
    const parameter = undefined

    // create a mock message with the expected input for the subscription function
    const message = getCommandSuccessMessageMock(payload)

    // create a subscription context for the subscription function
    const context = sendWelcomeEmailSubscriptionBuilder.getSubscriptionContextMock(message, sandbox)

    context.stubs.service.User['1'].getUserById.resolves(userMock)
    context.stubs.getConfig.resolves({ emailProviderUrl: 'https://example.com' })
    context.stubs.getSecret.resolves({ emailProviderAuthToken: 'secret_token' })

    // execute the subscription function
    const result = await sendWelcomeEmail(context.mock, payload, parameter)

    expect(
      context.stubs.logger.debug.calledWith('Using email provider https://example.com with token secret_token'),
    ).toBeTruthy()
    expect(context.stubs.logger.info.calledWith('Welcome email to user sent to ' + userMock.email)).toBeTruthy()
    expect(result).toStrictEqual({ userId: userMock.userId })
  })
})
