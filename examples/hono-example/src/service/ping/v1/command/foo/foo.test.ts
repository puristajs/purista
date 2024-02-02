import { getCommandContextMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'
import { createSandbox } from 'sinon'

import { pingV1Service } from '../../pingV1Service'
import { fooCommandBuilder } from './fooCommandBuilder'
import type { PingV1FooInputParameter, PingV1FooInputPayload } from './types'

describe('service Ping version 1 - command foo', () => {
  let sandbox = createSandbox()
  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('does not throw', async () => {
    const service = pingV1Service.getInstance(getEventBridgeMock(sandbox).mock, { logger: getLoggerMock(sandbox).mock })

    const foo = safeBind(fooCommandBuilder.getCommandFunction(), service)

    const payload: PingV1FooInputPayload = undefined

    const parameter: PingV1FooInputParameter = {}

    const context = getCommandContextMock(payload, parameter, sandbox)

    const result = await foo(context.mock, payload, parameter)

    expect(result).toStrictEqual({ foo: 'foo' })
  })
})
