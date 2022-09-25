import { getEventBridgeMock, getFunctionContextMock, getLoggerMock } from '@purista/core'

import { UserServiceBuilder } from '../../UserServiceBuilder'
import { userSignUpBuilder } from './index'

const f = userSignUpBuilder.getFunction()

const service = UserServiceBuilder.getInstance(getLoggerMock().mock, getEventBridgeMock().mock)
const fn = f.bind(service)

test('returns a new user id', async () => {
  const payload = {
    email: 'mail@example.com',
    password: 'the_password',
    test: '',
  }

  const params = {}

  const context = getFunctionContextMock(payload, params)

  context.stubs.invoke.resolves('mocked response data')

  const result = await fn(context.mock, payload, params)

  expect(result.uuid).toBeDefined()

  // expect(context.stubs.logger.debug.calledWith(payload)).toBeTruthy()
})
