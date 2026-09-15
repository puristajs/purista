import { ServiceBuilder } from '@purista/core'
import { defineAgent, defineHarness } from '@purista/harness'

export const agent = defineAgent('packedPing', { description: 'Offline packed consumer', instructions: 'Reply pong.' })
export const harness = defineHarness({ name: 'packedConsumer' }).addAgent(agent)
export const service = new ServiceBuilder({
	serviceName: 'packedConsumer',
	serviceVersion: '1',
	serviceDescription: 'Packed consumer',
}).mountHarness(harness)
