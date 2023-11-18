import * as index from './index'
import { puristaVersion } from './version'

describe('exports GoogleSecretStore', () => {
  it('has a version', () => {
    expect(puristaVersion).toBeDefined()
  })

  it('exports GoogleSecretStore', () => {
    expect(index.GoogleSecretStore).toBeDefined()
  })
})
