import { getLoggerMock } from '@purista/core'
import { Context } from 'hono'
import { createSandbox, SinonSandbox } from 'sinon'

import { configRoute } from './config.impl'

describe('config route', () => {
  let sandbox: SinonSandbox

  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
    sandbox.reset()
  })

  it('returns the config object', async () => {
    const json = sandbox.stub()
    const context = {
      json,
    } as any as Context

    const bridge = {
      logger: getLoggerMock().mock,
    } as any

    const fn = configRoute.bind(bridge)
    await fn(context)
    expect(
      json.calledWith({
        entities: [],
      }),
    ).toBeTruthy()
  })
})
