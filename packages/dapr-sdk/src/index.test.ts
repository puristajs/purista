import {
  DaprClient,
  DaprConfigStore,
  DaprEventBridge,
  DaprSecretStore,
  DaprStateStore,
  puristaVersion,
} from './index.js'

describe('Export', () => {
  it('has a version', () => {
    expect(puristaVersion).toBeDefined()
  })
  it('exports the DaprClient', () => {
    expect(DaprClient).toBeDefined()
  })
  it('exports the DaprConfigStore', () => {
    expect(DaprConfigStore).toBeDefined()
  })

  it('exports the DaprEventBridge', () => {
    expect(DaprEventBridge).toBeDefined()
  })

  it('exports the DaprSecretStore', () => {
    expect(DaprSecretStore).toBeDefined()
  })

  it('exports the DaprStateStore', () => {
    expect(DaprStateStore).toBeDefined()
  })
})
