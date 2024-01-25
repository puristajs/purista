import { honoV1Service as service } from './honoV1Service.js'

describe('service hono version 1', () => {
  it('has valid commands', () => {
    service.validateCommandDefinitions()
  })

  it('has valid subscriptions', () => {
    service.validateSubscriptionDefinitions()
  })
})
