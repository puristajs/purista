import * as index from './index'

describe('exports', () => {
  it('exports NatsBridge', () => {
    expect(index.NatsBridge).toBeDefined()
  })

  it('exports getCommandSubscriptionTopic', () => {
    expect(index.getCommandSubscriptionTopic).toBeDefined()
  })

  it('exports getDefaultNatsBridgeConfig', () => {
    expect(index.getDefaultNatsBridgeConfig).toBeDefined()
  })

  it('exports getQueueGroupName', () => {
    expect(index.getQueueGroupName).toBeDefined()
  })

  it('exports getSubscriptionTopic', () => {
    expect(index.getSubscriptionTopic).toBeDefined()
  })

  it('exports getTopicName', () => {
    expect(index.getTopicName).toBeDefined()
  })
})
