import { NatsBridge } from '@purista/natsbridge'
import { RedisQueueBridge } from '@purista/redis-queue-bridge'

/**
 * Creates the two distributed PURISTA bridges used by the banking profile.
 * Domain state remains an application concern; PostgreSQL is supplied by
 * Compose for the next persistence checkpoint and is never treated as a queue.
 */
export const createDistributedBankingDependencies = (environment: NodeJS.ProcessEnv = process.env) => ({
	eventBridge: new NatsBridge({
		servers: environment.BANKING_NATS_URL ?? 'nats://127.0.0.1:4222',
		topicPrefix: 'example-bank',
		durableSubscriptionMode: 'strict',
	}),
	queueBridge: new RedisQueueBridge({
		config: { url: environment.BANKING_REDIS_URL ?? 'redis://127.0.0.1:6379' },
		keyPrefix: 'example-bank:queue:',
	}),
})
