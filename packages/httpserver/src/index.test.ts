import { httpServerV1Service, puristaVersion } from './index.js'

describe('exports httpserver service', () => {
  it('has a version', () => {
    expect(puristaVersion).toBeDefined()
  })

  it('exports httpServerV1Service', () => {
    expect(httpServerV1Service).toBeDefined()
  })
})
