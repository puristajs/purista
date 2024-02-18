import type { ObjectWithKeysFromStringArray, StoreBaseConfig } from '@purista/core'
import { StateStoreBaseClass, StatusCode, UnhandledError } from '@purista/core'
import type { KV, NatsConnection } from 'nats'
import { connect, JSONCodec } from 'nats'

import type { NatsStateStoreConfig } from './types/index.js'

/**
A state store for using NATS (with JetStream) as storage.  

@example
* ```typescript
const config = {
  port: 8222
}

const store = new NatsStateStore({ config })

await store.setState('stateKey',{ myState: 'value' })

let value = await store.getState('stateKey')
console.log(value) // outputs: { stateKey: { myState: 'value' } }

await store.removeState('stateKey')

value = await store.getState('stateKey')
console.log(value) // outputs: undefined

```
 */
export class NatsStateStore extends StateStoreBaseClass<NatsStateStoreConfig> {
  public connection: NatsConnection | undefined

  sc = JSONCodec()
  kv: KV | undefined

  constructor(config?: StoreBaseConfig<Partial<NatsStateStoreConfig>>) {
    const conf = {
      keyValueStoreName: 'purista-state-store',
      ...config,
    }
    super('NatsStateStore', { ...conf })
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

  protected async getStateImpl<StateNames extends string[]>(
    ...stateNames: StateNames
  ): Promise<ObjectWithKeysFromStringArray<StateNames>> {
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
    return result as ObjectWithKeysFromStringArray<StateNames>
  }

  protected async removeStateImpl(stateName: string) {
    const store = await this.getStore()

    try {
      await store.delete(stateName)
    } catch (err) {
      const msg = `error in state store removing value ${stateName}`
      this.logger.error({ err }, msg)
      throw new UnhandledError(StatusCode.InternalServerError, msg)
    }
  }

  protected async setStateImpl(stateName: string, stateValue: unknown) {
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
