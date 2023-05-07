import { initLogger, Logger, Prettify, StatusCode, UnhandledError } from '@purista/core'
import mqtt, {
  IClientOptions,
  IClientPublishOptions,
  IClientReconnectOptions,
  IClientSubscribeOptions,
  IConnackPacket,
  ISubscriptionGrant,
  MqttClient,
} from 'mqtt'

export type ISubscriptionResponse = Prettify<
  ISubscriptionGrant & {
    properties?: {
      subscriptionIdentifier?: number
    }
  }
>

export class AsyncClient {
  protected mqttClient: MqttClient | undefined
  protected logger: Logger

  constructor(logger?: Logger) {
    const log = logger || initLogger()
    this.logger = log.getChildLogger({ name: 'AsyncClient' })
  }

  async connect(opts: IClientOptions, allowRetries = true) {
    this.mqttClient = mqtt.connect(opts)

    this.mqttClient.on('error', (err) => this.logger.error({ err }, err.message))

    this.mqttClient.on('connect', (packet) => this.logger.info({ packet }, 'connect'))
    this.mqttClient.on('disconnect', (packet) =>
      this.logger.warn({ packet }, `disconnect ${packet.properties?.reasonString || ''}`),
    )
    this.mqttClient.on('end', () => this.logger.warn('end'))
    this.mqttClient.on('close', () => this.logger.info('close'))
    this.mqttClient.on('offline', () => this.logger.warn('offline'))

    this.mqttClient.on('reconnect', () => this.logger.info('reconnect'))
    this.mqttClient.on('outgoingEmpty', () => this.logger.warn('outgoingEmpty'))

    return new Promise((resolve, reject) => {
      const remove = removePromiseResolutionListeners.bind(this)

      // Listeners added to client to trigger promise resolution
      const promiseResolutionListeners = {
        connect: (_connack: IConnackPacket) => {
          remove()
          resolve(this.mqttClient) // Resolve on connect
        },
        end: () => {
          remove()
          resolve(this.mqttClient) // Resolve on end
        },
        error: (err: Error) => {
          remove()
          this.logger.error({ err }, err?.message || 'MQTT error in client end()')
          this.mqttClient?.end(true, {}, (err) => {
            this.logger.error({ err }, err?.message || 'MQTT error in client end()')
          })
          reject(err) // Reject on error
        },
        close: () => {
          this.logger.error('MQTT client closed')
        },
      }

      // If retries are not allowed, reject on close
      if (allowRetries === false) {
        promiseResolutionListeners.close = () => {
          promiseResolutionListeners.error(new Error("Couldn't connect to server"))
        }
      }

      // Remove listeners added to client by this promise
      function removePromiseResolutionListeners(this: AsyncClient) {
        Object.keys(promiseResolutionListeners).forEach((eventName) => {
          this.mqttClient?.removeListener(eventName, (promiseResolutionListeners as any)[eventName])
        })
      }

      // Add listeners to client
      Object.keys(promiseResolutionListeners).forEach((eventName) => {
        this.mqttClient?.on(eventName, (promiseResolutionListeners as any)[eventName])
      })
    })
  }

  set handleMessage(newHandler) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    this.mqttClient.handleMessage = newHandler
  }

  get handleMessage() {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.handleMessage
  }

  get connected() {
    if (!this.mqttClient) {
      return false
    }
    return this.mqttClient.connected
  }

  set connected(connectedNew) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    this.mqttClient.connected = connectedNew
  }

  get disconnecting() {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.disconnecting
  }

  set disconnecting(disconnectingNew) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    this.mqttClient.disconnecting = disconnectingNew
  }

  get disconnected() {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.disconnected
  }

  set disconnected(disconnectedNew) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    this.mqttClient.disconnected = disconnectedNew
  }

  get reconnecting() {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.reconnecting
  }

  set reconnecting(reconnectingNew) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    this.mqttClient.reconnecting = reconnectingNew
  }

  get incomingStore() {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.incomingStore
  }

  set incomingStore(incomingStoreNew) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    this.mqttClient.incomingStore = incomingStoreNew
  }

  get outgoingStore() {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.outgoingStore
  }

  set outgoingStore(outgoingStoreNew) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    this.mqttClient.outgoingStore = outgoingStoreNew
  }

  get options() {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.options
  }

  set options(optionsNew) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    this.mqttClient.options = optionsNew
  }

  get queueQoSZero() {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.queueQoSZero
  }

  set queueQoSZero(queueQoSZeroNew) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    this.mqttClient.queueQoSZero = queueQoSZeroNew
  }

  async publish(topic: string, message: string, opts: IClientPublishOptions) {
    return new Promise((resolve, reject) => {
      if (!this.mqttClient) {
        this.logger.error('connect not called - client does not exist')
        reject(new Error('connect not called - client does not exist'))
        return
      }
      this.mqttClient.publish(topic, message, opts, (err, result) => {
        if (err) {
          this.logger.error({ err })
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  subscribe(topic: string | string[], opts: IClientSubscribeOptions) {
    return new Promise<ISubscriptionResponse[]>((resolve, reject) => {
      if (!this.mqttClient) {
        reject(new Error('connect not called - client does not exist'))
        return
      }
      this.mqttClient.subscribe(topic, opts, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  unsubscribe(topic: string | string[], opts?: Object) {
    return new Promise((resolve, reject) => {
      if (!this.mqttClient) {
        reject(new Error('connect not called - client does not exist'))
        return
      }
      this.mqttClient.unsubscribe(topic, opts, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  end(force?: boolean, opts?: Object) {
    return new Promise((resolve, reject) => {
      if (!this.mqttClient) {
        reject(new Error('connect not called - client does not exist'))
        return
      }
      this.mqttClient.end(force, opts, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(undefined)
        }
      })
    })
  }

  reconnect(opts?: IClientReconnectOptions) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.reconnect(opts)
  }

  addListener(eventName: string | symbol, listener: (...args: any[]) => void) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.addListener(eventName, listener)
  }

  emit(eventName: string | symbol, ...args: any[]) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.emit(eventName, ...args)
  }

  eventNames() {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.eventNames()
  }

  getLastMessageId() {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.getLastMessageId()
  }

  getMaxListeners() {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.getMaxListeners()
  }

  listenerCount(eventName: string | symbol, listener?: Function) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.listenerCount(eventName, listener)
  }

  listeners(eventName: string | symbol) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.listeners(eventName)
  }

  off(eventName: string | symbol, listener: (...args: any[]) => void) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.off(eventName, listener)
  }

  on(event: any, cb: any) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.on(event, cb)
  }

  once(event: any, cb: any) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.once(event, cb)
  }

  prependListener(eventName: string | symbol, listener: (...args: any[]) => void) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.prependListener(eventName, listener)
  }

  prependOnceListener(eventName: string | symbol, listener: (...args: any[]) => void) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.prependOnceListener(eventName, listener)
  }

  rawListeners(eventName: string | symbol) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.rawListeners(eventName)
  }

  removeAllListeners(event?: string | symbol) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.removeAllListeners(event)
  }

  removeListener(eventName: string | symbol, listener: (...args: any[]) => void) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.removeListener(eventName, listener)
  }

  removeOutgoingMessage(mid: number) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.removeOutgoingMessage(mid)
  }

  setMaxListeners(n: number) {
    if (!this.mqttClient) {
      const err = new UnhandledError(StatusCode.InternalServerError, 'connect not called - client does not exist')
      this.logger.error({ err }, err.message)
      throw err
    }
    return this.mqttClient.setMaxListeners(n)
  }
}
