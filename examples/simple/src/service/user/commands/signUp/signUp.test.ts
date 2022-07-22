import { getFunctionContextMock } from '@purista/core'

import functionDefinition from './index'

const fn = functionDefinition.getFunction()
if (!fn) {
  throw new Error('function not defined')
}

test('returns a new user id', async () => {
  const payload = {
    email: 'mail@example.com',
    password: 'the_password',
    test: '',
  }

  const params = {}

  const initialPayload = JSON.stringify(payload)

  const context = getFunctionContextMock(initialPayload, params)

  const result = await fn(context.mock, payload, params)

  expect(result.uuid).toBeDefined()

  expect(context.stubs.logger.debug.calledWith(initialPayload)).toBeTruthy()
})
