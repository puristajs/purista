import { getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { emailV1Service } from '../../emailV1Service.js'
import { sendVerificationEmailCommandBuilder } from './sendVerificationEmailCommandBuilder.js'
import type { EmailV1SendVerificationEmailInputParameter, EmailV1SendVerificationEmailInputPayload } from './types.js'

describe('service Email version 1 - command sendVerificationEmail', () => {
  let sandbox = createSandbox()
  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('does not throw', async () => {
    const service = await emailV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
      logger: getLoggerMock(sandbox).mock,
    })

    const sendVerificationEmail = safeBind(sendVerificationEmailCommandBuilder.getCommandFunction(), service)

    const payload: EmailV1SendVerificationEmailInputPayload = undefined

    const parameter: EmailV1SendVerificationEmailInputParameter = {}

    const context = sendVerificationEmailCommandBuilder.getCommandContextMock(payload, parameter, sandbox)

    const result = await sendVerificationEmail(context.mock, payload, parameter)

    expect(result).toBeUndefined()
  })
})
