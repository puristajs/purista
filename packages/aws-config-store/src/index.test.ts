import * as index from './index'
import { puristaVersion } from './version'

describe('exports AWSConfigStore', () => {
  it('has a version', () => {
    expect(puristaVersion).toBeDefined()
  })

  it('exports AWSSecretStore', () => {
    expect(index.AWSConfigStore).toBeDefined()
  })
})
