import { httpServerV1Service as service } from './httpServerV1Service'

describe('service httpServer version 1', () => {
  it('has valid commands', () => {
    service.validateCommandDefinitions()
  })

  it('has valid subscriptions', () => {
    service.validateSubscriptionDefinitions()
  })
})
