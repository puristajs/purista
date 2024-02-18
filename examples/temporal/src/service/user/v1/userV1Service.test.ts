import { userV1Service as service } from './userV1Service.js'

describe('service user version 1', () => {
  it('has valid commands', () => {
    expect(service.validateCommandDefinitions()).toBeUndefined()
  })

  it('has valid subscriptions', () => {
    expect(service.validateSubscriptionDefinitions()).toBeUndefined()
  })
})
