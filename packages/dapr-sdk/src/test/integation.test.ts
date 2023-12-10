import { serve } from '@hono/node-server'
import { getLoggerMock } from '@purista/core'
import { createSandbox } from 'sinon'

import { DaprEventBridge } from '../DaprEventBridge/index.js'

describe('DaprEventbridge', () => {
  let bridge: DaprEventBridge
  const sandbox = createSandbox()
  const logger = getLoggerMock(sandbox)

  beforeAll(async () => {
    bridge = new DaprEventBridge({
      logger: logger.mock,
      serve,
    })
  })

  afterAll(async () => {
    await bridge.destroy()
  })

  afterEach(() => {
    sandbox.reset()
  })

  it('works', async () => {
    await bridge.start()
  })
})
