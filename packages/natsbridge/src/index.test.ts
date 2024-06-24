import {
	NatsBridge,
	getCommandSubscriptionTopic,
	getDefaultNatsBridgeConfig,
	getQueueGroupName,
	getSubscriptionTopic,
	getTopicName,
	puristaVersion,
} from './index.js'

describe('exports', () => {
	it('has a version', () => {
		expect(puristaVersion).toBeDefined()
	})

	it('exports NatsBridge', () => {
		expect(NatsBridge).toBeDefined()
	})

	it('exports getCommandSubscriptionTopic', () => {
		expect(getCommandSubscriptionTopic).toBeDefined()
	})

	it('exports getDefaultNatsBridgeConfig', () => {
		expect(getDefaultNatsBridgeConfig).toBeDefined()
	})

	it('exports getQueueGroupName', () => {
		expect(getQueueGroupName).toBeDefined()
	})

	it('exports getSubscriptionTopic', () => {
		expect(getSubscriptionTopic).toBeDefined()
	})

	it('exports getTopicName', () => {
		expect(getTopicName).toBeDefined()
	})
})
