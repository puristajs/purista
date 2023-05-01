import * as index from './index'
import { puristaVersion } from './version'

describe('exports k8s-sdk', () => {
  it('has a version', () => {
    expect(puristaVersion).toBeDefined()
  })

  it('exports getHttpServer', () => {
    expect(index.getHttpServer).toBeDefined()
  })
})
