import { getDefaultHttpEventBridgeConfig, HttpEventBridge } from '@purista/base-http-bridge'
import type { CustomMessage, EBMessage, EventBridge, EventBridgeConfig, Subscription } from '@purista/core/adapter'
import { initLogger, StatusCode, safeBind, UnhandledError } from '@purista/core/adapter'

import { DaprClient } from '../DaprClient/DaprClient.impl.js'
import type { DaprPubSubType } from '../types/pubsub/DaprPubSub.type.js'
import { puristaVersion } from '../version.js'
import { getDefaultConfig } from './getDefaultConfig.impl.js'
import { configRoute } from './routes/config.impl.js'
import type { DaprEventBridgeConfig } from './types/DaprEventBridgeConfig.js'

/**
 * Event bridge that connects PURISTA services to the local Dapr sidecar.
 *
 * It hosts the HTTP endpoints Dapr calls for command invocation and Pub/Sub
 * subscription delivery, publishes events through the Dapr Pub/Sub API, and
 * invokes commands in other services through Dapr service invocation.
 *
 * Names for services, commands, subscriptions and events are converted to kebab-case.
 * If the event bridge is configured to expose REST endpoints defined in command builder, the endpoints are generated as defined in the command builder.
 *
 * The event bridge uses Hono under the hood. You need to provide a `serve` function.
 * Depending on your runtime (Node, Bun, Deno) an adapter might be needed.
 * The Dapr sidecar must be running and reachable through `DAPR_HOST` and
 * `DAPR_HTTP_PORT` or the matching `clientConfig` values.
 *
 * @see [Hono website](https://hono.dev)
 *
 * @group Event bridge
 *
 * @example
 * ```typescript
 * import { DaprConfigStore, DaprEventBridge, DaprSecretStore, DaprStateStore } from '@purista/dapr-sdk'
 *
 * const eventBridge = new DaprEventBridge({
 *    serve,
 *  })
 *
 * // start the services first ...
 *
 * await eventBridge.start()
 *```
 *
 */
export class DaprEventBridge extends HttpEventBridge<DaprEventBridgeConfig> implements EventBridge {
	private pubSubSubscriptions: DaprPubSubType[] = []

	/**
	 * Creates a Dapr-backed event bridge.
	 *
	 * @param config - Bridge config, including Hono `serve` adapter and optional Dapr client settings.
	 */
	constructor(config: EventBridgeConfig<DaprEventBridgeConfig>) {
		const conf = {
			...getDefaultHttpEventBridgeConfig(),
			...getDefaultConfig(),
			...config,
		}

		const logger = conf.logger ?? initLogger(config.logLevel, { name: conf.name || 'DaprEventBridge' })

		const clientConfig = conf.clientConfig

		let baseUrl = `${clientConfig.daprHost}:${clientConfig.daprPort}`
		if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
			baseUrl = `http://${baseUrl}`
		}

		const defaultHeaders: Record<string, string> = {
			'content-type': 'application/json; charset=utf-8',
		}

		if (clientConfig.daprApiToken) {
			defaultHeaders['dapr-api-token'] = clientConfig.daprApiToken
			defaultHeaders['user-agent'] = `purista-dapr-client/v${puristaVersion} http/1`
		}

		const client = new DaprClient({
			logger,
			baseUrl,
			defaultHeaders,
			...conf,
		})

		super(conf, client)
	}

	/**
	 * Registers Dapr discovery routes and starts the HTTP event bridge.
	 *
	 * `/dapr/subscribe` is used by Dapr to discover Pub/Sub subscriptions and
	 * `/dapr/config` returns actor configuration, currently empty because actors
	 * are not used by this bridge.
	 */
	async start() {
		this.app.get('/dapr/subscribe', async c => {
			return c.json(this.pubSubSubscriptions)
		})

		/* actors currently not supported/used
    this.app.delete('/actors/:actorTypeName/:actorId')
    this.app.put('/actors/:actorTypeName/:actorId/method/:methodName')
    this.app.put('/actors/:actorTypeName/:actorId/method/timer/:timerName')
    this.app.put('/actors/:actorTypeName/:actorId/method/remind/:reminderName')
    */

		this.app.get('/dapr/config', safeBind(configRoute, this))

		await super.start()
	}

	/**
	 * Registers a PURISTA subscription and exposes it to Dapr Pub/Sub discovery.
	 *
	 * Only event-name subscriptions are supported because Dapr routes by topic.
	 *
	 * @returns Internal HTTP route path invoked by Dapr for this subscription.
	 */
	async registerSubscription(
		subscription: Subscription,
		cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp'> | undefined>,
	): Promise<string> {
		if (!subscription.eventName) {
			const err = new UnhandledError(StatusCode.InternalServerError, 'only subscriptions by event name are supported')
			throw err
		}
		const path = await super.registerSubscription(subscription, cb)
		this.pubSubSubscriptions.push({
			pubsubname: this.config.clientConfig?.pubSubName as string,
			topic: subscription.eventName,
			route: path,
		})

		return path
	}
}
