import assert from 'node:assert/strict'
import { ServiceBuilder } from '@purista/core'
import { defineAgent, defineHarness } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { test } from 'vitest'

test('packed Harness executes an agent and Core mounts its definition', async () => {
	const provider = new FakeModelProvider({ strict: true })
	provider.enqueueText({
		content: 'pong',
		usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
		finishReason: 'stop',
	})
	const agent = defineAgent('packedPing', { description: 'Offline packed consumer', instructions: 'Reply pong.' })
	const harness = defineHarness({ name: 'packedConsumer' }).addAgent(agent)
	const service = new ServiceBuilder({
		serviceName: 'packedConsumer',
		serviceVersion: '1',
		serviceDescription: 'Packed consumer',
	})
	assert.ok(service.mountHarness(harness))
	const runtime = await harness.getInstance({ model: { provider, model: 'fake' } })
	try {
		const session = await runtime.getSession('packed-consumer')
		const outcome = await session.agents.packedPing.run('ping')
		assert.equal(outcome.status, 'completed')
		assert.equal(outcome.output, 'pong')
		provider.assertExhausted()
	} finally {
		await runtime.close()
	}
})
