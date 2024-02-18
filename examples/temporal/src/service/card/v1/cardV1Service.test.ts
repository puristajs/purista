import { cardV1Service as service } from './cardV1Service.js'

describe('service card version 1', () => {
  it('has valid commands', () => {
    expect(service.validateCommandDefinitions()).toBeUndefined()
  })

  it('has valid subscriptions', () => {
    expect(service.validateSubscriptionDefinitions()).toBeUndefined()
  })
})
