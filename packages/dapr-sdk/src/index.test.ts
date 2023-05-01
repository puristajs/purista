import * as index from './index'

describe('Export', () => {
  it('exports the DaprClient', () => {
    expect(index.DaprClient).toBeDefined()
  })
  it('exports the DaprConfigStore', () => {
    expect(index.DaprConfigStore).toBeDefined()
  })

  it('exports the DaprEventBridge', () => {
    expect(index.DaprEventBridge).toBeDefined()
  })

  it('exports the DaprSecretStore', () => {
    expect(index.DaprSecretStore).toBeDefined()
  })

  it('exports the DaprStateStore', () => {
    expect(index.DaprStateStore).toBeDefined()
  })
})
