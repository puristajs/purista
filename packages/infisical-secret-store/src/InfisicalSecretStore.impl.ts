import type { StoreBaseConfig } from '@purista/core'
import { SecretStoreBaseClass, StatusCode, UnhandledError } from '@purista/core'

import { InfisicalClient } from './InfisicalClient'
import type { InfisicalSecretConfig } from './types'

/**
A secret store for using [Infisical](https://infisical.com/) as storage.  

For performance reasons, and to reduce costs, the secret values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.  
If the cache is enabled, you can set the ttl for cached secret values via config cacheTtl (in ms).  

This will return the cached secret if available and if ttl is not exceeded.  
If a secret value exceeds the ttl, it does not automatically get removed from cache.  
It will be removed/overwritten on next get request.  

@example ```typescript
const config = {
  baseUrl: 'http://example.com'
}

const store = new InfisicalSecretStore( config )

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
    super('InfisicalSecretStore', { enableCache: true, ...config })

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
    for (const name of secretNames) {
      if (this.config.enableCache) {
        const cachedValue = this.cache.get(name)
        if (cachedValue) {
          if (this.config.cacheTtl !== undefined) {
            result[name] = cachedValue.createdAt + this.config.cacheTtl >= Date.now() ? cachedValue.value : undefined
          } else {
            result[name] = cachedValue.value
          }
        }
      }

      if (!result[name]) {
        try {
          result[name] = await this.client.getSecret(name)
        } catch (err) {
          const msg = `error in secret store getting value ${name}`
          this.logger.error({ err }, msg)
          throw new UnhandledError(StatusCode.InternalServerError, msg)
        }
      }
    }
    return result
  }

  async removeSecret(secretName: string) {
    if (!this.config.enableRemove) {
      throw new UnhandledError(StatusCode.Unauthorized, 'remove secret from store is disabled by config')
    }

    this.cache.delete(secretName)

    try {
      await this.client.removeSecret(secretName)
    } catch (err) {
      const msg = `error in secret store removing value ${secretName}`
      this.logger.error({ err }, msg)
      throw new UnhandledError(StatusCode.InternalServerError, msg)
    }
  }

  async setSecret(secretName: string, secretValue: string) {
    if (!this.config.enableSet) {
      throw new UnhandledError(StatusCode.Unauthorized, 'set secret at store is disabled by config')
    }

    try {
      await this.client.setSecret(secretName, secretValue)

      if (this.config.enableCache) {
        this.cache.set(secretName, { value: secretValue, createdAt: Date.now() })
      }
    } catch (err) {
      const msg = `error in secret store setting value ${secretName}`
      this.logger.error({ err }, msg)
      throw new UnhandledError(StatusCode.InternalServerError, msg)
    }
  }
}
