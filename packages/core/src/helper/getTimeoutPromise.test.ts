import type { SinonFakeTimers, SinonSandbox } from 'sinon'
import { createSandbox } from 'sinon'

import { StatusCode, UnhandledError } from '../core'
import { getTimeoutPromise } from './getTimeoutPromise.impl'

describe('getTimeoutPromise', () => {
  let sandbox: SinonSandbox
  let clock: SinonFakeTimers

  beforeEach(() => {
    sandbox = createSandbox()
    clock = sandbox.useFakeTimers()
  })

  afterEach(() => {
    sandbox.restore()
  })

  test('should resolve with the result of the promise if it resolves within the TTL', async () => {
    const promise = Promise.resolve('foo')
    const result = await getTimeoutPromise(promise, 5000)

    expect(result).toEqual('foo')
  })

  test('should reject with a UnhandledError if the promise takes too long to resolve', async () => {
    const promise = new Promise((resolve) => setTimeout(() => resolve('foo'), 10000))
    const timeout = 50

    const promiseSpy = jest.fn()
    const errorSpy = jest.fn()

    const result = getTimeoutPromise(promise, timeout).then(promiseSpy).catch(errorSpy)

    clock.tick(timeout + 1)
    await result

    expect(errorSpy).toHaveBeenCalledWith(new UnhandledError(StatusCode.GatewayTimeout, 'invocation timed out'))
    expect(promiseSpy).not.toHaveBeenCalled()
  })
})
