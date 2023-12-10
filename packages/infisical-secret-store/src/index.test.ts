import { InfisicalSecretStore, puristaVersion } from './index.js'

describe('exports InfisicalSecretStore', () => {
  it('has a version', () => {
    expect(puristaVersion).toBeDefined()
  })

  it('exports InfisicalSecretStore', () => {
    expect(InfisicalSecretStore).toBeDefined()
  })
})
