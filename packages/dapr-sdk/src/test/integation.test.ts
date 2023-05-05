import { getLoggerMock } from '@purista/core'
import { serve } from '@purista/hono-node-server'
import { createSandbox } from 'sinon'

import { DaprEventBridge } from '../DaprEventBridge'

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
