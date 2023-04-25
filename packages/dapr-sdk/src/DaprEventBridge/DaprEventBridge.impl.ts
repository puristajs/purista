import {
  CustomMessage,
  EBMessage,
  EventBridge,
  EventBridgeConfig,
  EventBridgeEventNames,
  HttpEventBridge,
  initLogger,
  StatusCode,
  Subscription,
  UnhandledError,
} from '@purista/core'

import { DaprClient } from '../DaprClient'
import { DaprPubSubType } from '../types'
import { puristaVersion } from '../version'
import { getDefaultConfig } from './getDefaultConfig.impl'
import { configRoute } from './routes/index.impl'
import { DaprEventBridgeConfig } from './types'

/**
 * The DaprEventBridge connects to the Dapr sidecar container.
 * It provides endpoints for invoking commands, triggering subscriptions and emitting event messages.
 * The sidecar container invokes commands and subscriptions of the service connected to the event bridge.
 * A DaprClient (http fetch) is used for communication from the service/event bridge to the sidecar container.
 *
 * Names for services, commands, subscriptions and events are converted to kebab-case.
 * If the event bridge is configured to expose REST endpoints defined in command builder, the endpoints are generated as defined in the command builder.
 */
export class DaprEventBridge extends HttpEventBridge<DaprEventBridgeConfig> implements EventBridge {
  private pubSubSubscriptions: DaprPubSubType[] = []

  constructor(config: EventBridgeConfig<DaprEventBridgeConfig>) {
    const conf = {
      ...config,
      config: { ...getDefaultConfig(), ...config?.config },
    }

    const logger = conf.logger || initLogger(config?.logLevel, { name: conf.config.name || 'DaprEventBridge' })

    const clientConfig = conf.config.clientConfig

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
      spanProcessor: conf.spanProcessor,
      ...clientConfig,
    })

    super({ ...conf, config: { ...conf.config } }, client)
  }

  async start() {
    this.app.get('/dapr/subscribe', async (c) => {
      return c.json(this.pubSubSubscriptions)
    })

    this.app.delete('/actors/:actorTypeName/:actorId')
    this.app.put('/actors/:actorTypeName/:actorId/method/:methodName')
    this.app.put('/actors/:actorTypeName/:actorId/method/timer/:timerName')
    this.app.put('/actors/:actorTypeName/:actorId/method/remind/:reminderName')

    this.app.get('/dapr/config', configRoute.bind(this))

    await super.start()
  }

  async registerSubscription(
    subscription: Subscription,
    cb: (message: EBMessage) => Promise<Omit<CustomMessage, 'id' | 'timestamp' | 'instanceId'> | undefined>,
  ): Promise<string> {
    if (!subscription.eventName) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'only subscriptions by event name are supported')
      this.emit(EventBridgeEventNames.EventbridgeError, err)
      throw err
    }
    const path = await super.registerSubscription(subscription, cb)
    this.pubSubSubscriptions.push({
      pubsubname: this.config.config.clientConfig.pubSubName as string,
      topic: subscription.eventName,
      route: path,
    })

    return path
  }
}
