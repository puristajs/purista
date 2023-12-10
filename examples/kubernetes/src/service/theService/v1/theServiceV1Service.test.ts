import { theServiceV1Service as service } from './theServiceV1Service.js'

describe('service theService version 1', () => {
  it('has valid commands', () => {
    service.validateCommandDefinitions()
  })

  it('has valid subscriptions', () => {
    service.validateSubscriptionDefinitions()
  })
})
