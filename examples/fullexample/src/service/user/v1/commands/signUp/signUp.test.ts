import { getEventBridgeMock, getFunctionContextMock, getLoggerMock } from '@purista/core'

import { UserService } from '../../UserService'
import { userSignUpBuilder } from './index'

const f = userSignUpBuilder.getFunction()

const service = UserService.getInstance(getLoggerMock().mock, getEventBridgeMock().mock)
const fn = f.bind(service)

test('returns a new user id', async () => {
  const payload = {
    email: 'mail@example.com',
    password: 'the_password',
    test: '',
  }

  const parameter = {}

  const initialPayload = JSON.stringify(payload)

  const context = getFunctionContextMock(initialPayload, parameter)

  context.stubs.invoke.resolves('mocked response data')

  const result = await fn(context.mock, payload, parameter)

  expect(result.uuid).toBeDefined()

  // expect(context.stubs.logger.debug.calledWith(initialPayload)).toBeTruthy()
})
