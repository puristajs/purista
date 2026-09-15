import type { Logger } from '@purista/core'
import { NatsQueueBridge } from '@purista/nats-queue-bridge'
import { NatsStateStore } from '@purista/nats-state-store'
import { NatsBridge } from '@purista/natsbridge'

export async function createNatsEventBridge(logger: Logger, servers: string) {
	const eventBridge = new NatsBridge({
		logger,
		servers,
		durableSubscriptionMode: 'strict',
		timeout: 1_000,
		maxReconnectAttempts: 0,
	})
	await eventBridge.start()
	return eventBridge
}

export function createNatsQueueBridge(servers: string) {
	return new NatsQueueBridge({
		connectionOptions: { servers, timeout: 1_000, maxReconnectAttempts: 0 },
		subjectPrefix: 'example-bank.queue',
		defaultMaxAttempts: 3,
	})
}

export function createNatsStateStore(logger: Logger, servers: string, bucket: string) {
	return new NatsStateStore({
		logger,
		servers,
		keyValueStoreName: bucket,
		timeout: 1_000,
		maxReconnectAttempts: 0,
	})
}
