import { emailV1Service as service } from './emailV1Service.js'

describe('service email version 1', () => {
  it('has valid commands', () => {
    expect(service.validateCommandDefinitions()).toBeUndefined()
  })

  it('has valid subscriptions', () => {
    expect(service.validateSubscriptionDefinitions()).toBeUndefined()
  })
})
