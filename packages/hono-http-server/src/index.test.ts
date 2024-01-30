import { honoV1Service, puristaVersion } from './index.js'

describe('exports httpserver service', () => {
  it('has a version', () => {
    expect(puristaVersion).toBeDefined()
  })

  it('exports honoV1Service', () => {
    expect(honoV1Service).toBeDefined()
  })
})
