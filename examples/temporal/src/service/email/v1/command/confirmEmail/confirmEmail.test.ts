import { getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { emailV1Service } from '../../emailV1Service.js'
import { confirmEmailCommandBuilder } from './confirmEmailCommandBuilder.js'
import type { EmailV1ConfirmEmailInputParameter, EmailV1ConfirmEmailInputPayload } from './types.js'

describe('service Email version 1 - command confirmEmail', () => {
  let sandbox = createSandbox()
  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('does not throw', async () => {
    const service = emailV1Service.getInstance(getEventBridgeMock(sandbox).mock, {
      logger: getLoggerMock(sandbox).mock,
    })

    const confirmEmail = safeBind(confirmEmailCommandBuilder.getCommandFunction(), service)

    const payload: EmailV1ConfirmEmailInputPayload = undefined

    const parameter: EmailV1ConfirmEmailInputParameter = {}

    const context = confirmEmailCommandBuilder.getCommandContextMock(payload, parameter, sandbox)

    const result = await confirmEmail(context.mock, payload, parameter)

    expect(result).toBeUndefined()
  })
})
