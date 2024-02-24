import { getDefaultHttpEventBridgeConfig, HttpEventBridge } from '@purista/base-http-bridge'
import type { CustomMessage, EBMessage, EventBridge, EventBridgeConfig, Subscription } from '@purista/core'
import { EventBridgeEventNames, initLogger, safeBind, StatusCode, UnhandledError } from '@purista/core'

import { DaprClient } from '../DaprClient/index.js'
import type { DaprPubSubType } from '../types/index.js'
import { puristaVersion } from '../version.js'
import { getDefaultConfig } from './getDefaultConfig.impl.js'
import { configRoute } from './routes/index.js'
import type { DaprEventBridgeConfig } from './types/index.js'

/**
 * The DaprEventBridge connects to the Dapr sidecar container.
 * It provides endpoints for invoking commands, triggering subscriptions and emitting event messages.
 * The sidecar container invokes commands and subscriptions of the service connected to the event bridge.
 * A DaprClient (http fetch) is used for communication from the service/event bridge to the sidecar container.
 *
 * Names for services, commands, subscriptions and events are converted to kebab-case.
 * If the event bridge is configured to expose REST endpoints defined in command builder, the endpoints are generated as defined in the command builder.
 *
 * The event bridge is using Hono under the hood. You need to provide a `serve` function.
 * Depending on your runtime (Node, Bun, Deno) an adapter might be needed.
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

  async start() {
    this.app.get('/dapr/subscribe', async (c) => {
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

  async registerSubscription(
    subscription: Subscription,
    cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp'> | undefined>,
  ): Promise<string> {
    if (!subscription.eventName) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'only subscriptions by event name are supported')
      this.emit(EventBridgeEventNames.EventbridgeError, err)
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
