import type { Logger } from '@purista/core/adapter'
import { initLogger } from '@purista/core/adapter'

import type { IncomingMessageFunction } from '../types/IncomingMessageFunction.js'
import { isMatchingTopic } from './isMatchingTopic.impl.js'

/**
 * Local MQTT topic router keyed by subscription identifiers and topic filters.
 *
 * MQTT 5 subscription identifiers are used for fast dispatch when available;
 * otherwise the router falls back to wildcard topic matching.
 */
export class TopicRouter {
	/** Registered MQTT route entries keyed by subscription identifier. */
	routes = new Map<number, { topic: string; fn: IncomingMessageFunction }>()
	/** Logger used for route diagnostics. */
	logger: Logger

	/** Monotonic subscription identifier counter. */
	counter = 1

	/** Creates a router with an optional parent logger. */
	constructor(logger?: Logger) {
		const log = logger ?? initLogger()
		this.logger = log.getChildLogger({ name: 'TopicRouter' })
	}

	/** Adds a topic route and returns its MQTT subscription identifier. */
	add(topic: string, fn: IncomingMessageFunction) {
		this.counter++
		this.routes.set(this.counter, { topic, fn })

		this.logger.debug({ topic, count: this.counter }, 'topic added')
		return this.counter
	}

	/** Removes a route by subscription identifier. */
	remove(topic: string | number) {
		if (typeof topic === 'number') {
			this.routes.delete(topic)
		}
	}

	/** Returns handlers matching a concrete MQTT topic or subscription identifier. */
	match(topic: string, id?: number): IncomingMessageFunction[] {
		const handler: IncomingMessageFunction[] = []

		if (id) {
			const entry = this.routes.get(id)
			if (entry) {
				handler.push(entry.fn)
			}
			return handler
		}

		for (const [_, entry] of this.routes) {
			if (isMatchingTopic(topic, entry.topic)) {
				handler.push(entry.fn)
			}
		}

		return handler
	}
}
