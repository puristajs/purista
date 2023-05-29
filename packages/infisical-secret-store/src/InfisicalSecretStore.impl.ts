import { SecretStoreBaseClass, StatusCode, StoreBaseConfig, UnhandledError } from '@purista/core'

import { InfisicalClient } from './InfisicalClient'
import { InfisicalSecretConfig } from './types'

/**
A secret store for using [Infisical](https://infisical.com/) as storage.  

@example ```typescript
const config = {
  url: 'redis://alice:foobared@awesome.redis.server:6380'
}

const store = new InfisicalSecretStore({ config })

await store.setSecret('mySecret', 'value')

let value = await store.getSecret('mySecret')
console.log(value) // outputs: { mySecret: 'value' }

await store.removeSecret('mySecret')

value = await store.getSecret('mySecret')
console.log(value) // outputs: undefined

```
 */
export class InfisicalSecretStore extends SecretStoreBaseClass<InfisicalSecretConfig> {
  public client: InfisicalClient

  constructor(config: StoreBaseConfig<InfisicalSecretConfig>) {
    super('InfisicalSecretStore', { ...config })
    // this.client = new InfisicalClient(this.config)

    this.client = new InfisicalClient({
      name: 'InfisicalClient',
      ...config,
    })
  }

  async getSecret(...secretNames: string[]): Promise<Record<string, string | undefined>> {
    if (!this.config.enableGet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'get secret from store is disabled by config')
    }

    const result: Record<string, string | undefined> = {}
    for await (const name of secretNames) {
      try {
        result[name] = await this.client.getSecret(name)
      } catch (err) {
        const msg = `error in secret store getting value ${name}`
        this.logger.error({ err }, msg)
        throw new UnhandledError(StatusCode.InternalServerError, msg)
      }
    }
    return result
  }

  async removeSecret(secretName: string) {
    if (!this.config.enableRemove) {
      throw new UnhandledError(StatusCode.Unauthorized, 'remove secret from store is disabled by config')
    }

    try {
      await this.client.removeSecret(secretName)
    } catch (err) {
      const msg = `error in secret store removing value ${secretName}`
      this.logger.error({ err }, msg)
      throw new UnhandledError(StatusCode.InternalServerError, msg)
    }
  }

  async setSecret(secretName: string, configValue: string) {
    if (!this.config.enableSet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'set secret at store is disabled by config')
    }

    try {
      await this.client.setSecret(secretName, configValue)
    } catch (err) {
      const msg = `error in secret store setting value ${secretName}`
      this.logger.error({ err }, msg)
      throw new UnhandledError(StatusCode.InternalServerError, msg)
    }
  }
}
