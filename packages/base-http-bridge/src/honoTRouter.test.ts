import type { SinonSandbox } from 'sinon'
import { createSandbox } from 'sinon'

import { HonoTRouter } from './HonoTRouter.js'

describe('HonoTRouter', () => {
  let router: HonoTRouter<unknown>
  let sandbox: SinonSandbox

  beforeEach(() => {
    router = new HonoTRouter()
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('adds routes to the router', () => {
    const method = 'GET'
    const path = '/test'
    const handler = sandbox.stub()

    router.add(method, path, handler)

    expect(router.router.find(method, path).handlers).toEqual([handler])
  })

  it('matches routes in the router', () => {
    const method = 'GET'
    const path = '/test'
    const handler = sandbox.stub()

    router.add(method, path, handler)

    const result = router.match(method, path)

    expect(result?.[0][0]).toStrictEqual([handler, {}])
  })

  it('returns null when no route is found', () => {
    const method = 'GET'
    const path = '/unknown'

    const result = router.match(method, path)

    expect(result).toStrictEqual([[]])
  })
})
