import * as index from './index'
import { puristaVersion } from './version'

describe('exports httpserver service', () => {
  it('has a version', () => {
    expect(puristaVersion).toBeDefined()
  })

  it('exports httpServerV1Service', () => {
    expect(index.httpServerV1Service).toBeDefined()
  })
})
