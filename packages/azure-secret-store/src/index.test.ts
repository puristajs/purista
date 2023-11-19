import * as index from './index'
import { puristaVersion } from './version'

describe('exports AzureSecretStore', () => {
  it('has a version', () => {
    expect(puristaVersion).toBeDefined()
  })

  it('exports AzureSecretStore', () => {
    expect(index.AzureSecretStore).toBeDefined()
  })
})
