import * as index from './index'
import { puristaVersion } from './version'

describe('exports redis-config-store', () => {
  it('has a version', () => {
    expect(puristaVersion).toBeDefined()
  })

  it('exports InfisicalSecretStore', () => {
    expect(index.InfisicalSecretStore).toBeDefined()
  })
})
