import { accountV1Service as service } from './accountV1Service.js'

describe('service account version 1', () => {
  it('has valid commands', () => {
    expect(service.validateCommandDefinitions()).toBeUndefined()
  })

  it('has valid subscriptions', () => {
    expect(service.validateSubscriptionDefinitions()).toBeUndefined()
  })
})
