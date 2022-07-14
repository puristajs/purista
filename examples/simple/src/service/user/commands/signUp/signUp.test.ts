import { Command } from '@purista/core'
import { getLoggerMock, LoggerStubs } from '@purista/testhelper'

import functionDefinition from './index'

const fn = functionDefinition.getFunction()
if (!fn) {
  throw new Error('function not defined')
}

test('returns a new user id', async () => {
  const logger = getLoggerMock()

  const payload = {
    email: 'mail@example.com',
    password: 'the_password',
    test: '',
  }

  const params = {}

  const initialPayload = JSON.stringify(payload)
  const message = {
    command: {
      payload: initialPayload,
    },
  } as Command<string, string>

  const result = await fn(logger, payload, params, message)

  expect(result.uuid).toBeDefined()

  const loggerStubs = logger as unknown as LoggerStubs

  expect(loggerStubs.debug.calledWith(initialPayload)).toBeTruthy()
})
