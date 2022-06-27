import assert from 'assert'

import { StatusCode } from '../types'
import { UnhandledError } from '../UnhandledError.impl'
import { getTimeoutPromise } from './getTimeoutPromise.impl'

it('returns a Promise which throws time out error', async () => {
  const traceId = 'testTraceId'
  const timeOutPromise = getTimeoutPromise(50, traceId)

  try {
    await timeOutPromise
    assert.fail('should throw')
  } catch (error) {
    expect(error).toBeInstanceOf(UnhandledError)
    const result = error as UnhandledError
    expect(result.traceId).toBe(traceId)
    expect(result.errorCode).toBe(StatusCode.GatewayTimeout)
  }
})
