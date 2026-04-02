import { emitWarning } from 'node:process'

import type { StartedNatsContainer } from '@testcontainers/nats'
import { NatsContainer } from '@testcontainers/nats'
import { afterAll } from 'vitest'

import { describeQueueBridgeContract } from '../../core/test/helpers/queueBridgeContractSuite.js'
import { NatsQueueBridge } from '../src/NatsQueueBridge.impl.js'

const NATS_IMAGE = 'nats:2.10-alpine'

let container: StartedNatsContainer | undefined
let dockerAvailable = true
let connectionOptions: { servers: string[] } | undefined

describeQueueBridgeContract('@purista/nats-queue-bridge contract', {
	beforeAll: async () => {
		try {
			container = await new NatsContainer(NATS_IMAGE).withJetStream().withStartupTimeout(30000).start()
			connectionOptions = container.getConnectionOptions()
		} catch (err) {
			dockerAvailable = false
			emitWarning(
				`Skipping nats queue bridge contract tests because Docker is unavailable: ${err instanceof Error ? err.message : String(err)}`,
				'NatsQueueBridge',
			)
		}
	},
	afterAll: async () => {
		await container?.stop()
	},
	shouldSkip: () => !dockerAvailable,
	createBridge: () =>
		new NatsQueueBridge({
			connectionOptions,
			subjectPrefix: `contract.queue.${Date.now()}`,
		}),
})

afterAll(async () => {
	await container?.stop()
})
