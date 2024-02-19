import { getCommandContextMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { pingV1Service } from '../../pingV1Service.js'
import { paramTestCommandBuilder } from './paramTestCommandBuilder.js'
import type { PingV1ParamTestInputParameter, PingV1ParamTestInputPayload } from './types.js'

describe('service Ping version 1 - command paramTest', () => {
  let sandbox = createSandbox()
  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('does not throw', async () => {
    const service = pingV1Service.getInstance(getEventBridgeMock(sandbox).mock, { logger: getLoggerMock(sandbox).mock })

    const paramTest = safeBind(paramTestCommandBuilder.getCommandFunction(), service)

    const payload: PingV1ParamTestInputPayload = undefined

    const parameter: PingV1ParamTestInputParameter = {
      requiredQuery: 'required',
      requiredParam: 'required_id',
    }

    const context = getCommandContextMock(payload, parameter, sandbox)

    const result = await paramTest(context.mock, payload, parameter)

    expect(result).toStrictEqual({ parameter: { requiredParam: 'required_id', requiredQuery: 'required' } })
  })
})
