import { ConfigStoreBaseClass, StatusCode, StoreBaseConfig, UnhandledError } from '@purista/core'
import { connect, JSONCodec, KV, NatsConnection } from 'nats'

import { NatsConfigStoreConfig } from './types'

/**
A config store for using NATS (with JetStream) as storage.
JetStream must be enabled at the NATS broker.

@example ```typescript
const config = {
  port: 8222
}

const store = new NatsConfigStore({ config })

await store.setConfig('configKey',{ myConfig: 'value' })

let value = await store.getConfig('configKey')
console.log(value) // outputs: { configKey: { myConfig: 'value' } }

await store.removeConfig('configKey')

value = await store.getConfig('configKey')
console.log(value) // outputs: undefined
```
 */
export class NatsConfigStore extends ConfigStoreBaseClass<NatsConfigStoreConfig> {
  public connection: NatsConnection | undefined

  sc = JSONCodec()
  kv: KV | undefined

  constructor(config?: StoreBaseConfig<Partial<NatsConfigStoreConfig>>) {
    const conf = {
      keyValueStoreName: 'purista-config-store',
      ...config,
    }
    super('NatsConfigStore', { ...conf })
  }

  async getStore() {
    if (this.kv) {
      return this.kv
    }

    try {
      this.connection = await connect({ ...this.config, name: this.name })
    } catch (error) {
      this.connection = undefined
      const err = UnhandledError.fromError(error)
      this.logger.error({ err }, err.message)
      throw err
    }

    if (!this.connection.info?.jetstream) {
      const err = new UnhandledError(StatusCode.BadGateway, 'JetStream is not enabled on NATS server')
      this.logger.error({ err }, err.message)
      await this.connection.close()
      this.connection = undefined
      throw err
    }

    const js = this.connection.jetstream()
    this.kv = await js.views.kv(this.config.keyValueStoreName, this.config)

    return this.kv
  }

  async getConfig(...stateNames: string[]): Promise<Record<string, unknown>> {
    if (!this.config.enableGet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'get state from store is disabled by config')
    }

    const store = await this.getStore()

    const result: Record<string, unknown> = {}
    for await (const name of stateNames) {
      try {
        const entry = await store.get(name)
        result[name] = entry?.value && entry?.value.length > 0 ? this.sc.decode(entry.value) : undefined
      } catch (err) {
        const msg = `error in state store getting value ${name}`
        this.logger.error({ err }, msg)
        throw new UnhandledError(StatusCode.InternalServerError, msg)
      }
    }
    return result
  }

  async removeConfig(stateName: string) {
    if (!this.config.enableRemove) {
      throw new UnhandledError(StatusCode.Unauthorized, 'remove state from store is disabled by config')
    }

    const store = await this.getStore()

    try {
      await store.delete(stateName)
    } catch (err) {
      const msg = `error in state store removing value ${stateName}`
      this.logger.error({ err }, msg)
      throw new UnhandledError(StatusCode.InternalServerError, msg)
    }
  }

  async setConfig(stateName: string, stateValue: unknown) {
    if (!this.config.enableSet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'set state at store is disabled by config')
    }

    const store = await this.getStore()

    try {
      await store.put(stateName, this.sc.encode(stateValue))
    } catch (err) {
      const msg = `error in state store setting value ${stateName}`
      this.logger.error({ err }, msg)
      throw new UnhandledError(StatusCode.InternalServerError, msg)
    }
  }

  async destroy() {
    await this.connection?.drain()
    await this.connection?.close()
  }
}
