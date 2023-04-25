import { getCommandContextMock, getEventBridgeMock, getLoggerMock } from '@purista/core'
import { createSandbox } from 'sinon'

import { userV1Service } from '../../userV1Service'
import { computeDataCommandBuilder } from './computeDataCommandBuilder'
import { UserV1ComputeDataInputParameter, UserV1ComputeDataInputPayload } from './types'

describe('service User version 1 - command computeData', () => {
  let sandbox = createSandbox()
  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('does not throw', async () => {
    const service = userV1Service.getInstance(getEventBridgeMock(sandbox).mock, { logger: getLoggerMock(sandbox).mock })

    const computeData = computeDataCommandBuilder.getCommandFunction().bind(service)

    const payload: UserV1ComputeDataInputPayload = 'example value'

    const parameter: UserV1ComputeDataInputParameter = {}

    const context = getCommandContextMock(payload, parameter, sandbox)

    const result = await computeData(context.mock, payload, parameter)

    expect(result).toStrictEqual({ invoked: 'example value' })
  })
})
