import * as index from './index'
import { puristaVersion } from './version'

describe('exports InfisicalSecretStore', () => {
  it('has a version', () => {
    expect(puristaVersion).toBeDefined()
  })

  it('exports InfisicalSecretStore', () => {
    expect(index.InfisicalSecretStore).toBeDefined()
  })
})
