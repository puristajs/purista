import { AWSConfigStore, puristaVersion } from './index.js'

describe('exports AWSConfigStore', () => {
  it('has a version', () => {
    expect(puristaVersion).toBeDefined()
  })

  it('exports AWSSecretStore', () => {
    expect(AWSConfigStore).toBeDefined()
  })
})
