import type { ObjectWithKeysFromStringArray, StoreBaseConfig } from '@purista/core'
import { SecretStoreBaseClass, StatusCode, UnhandledError } from '@purista/core'

import { InfisicalClient } from './InfisicalClient/index.js'
import type { InfisicalSecretConfig } from './types.js'

/**
A secret store for using [Infisical](https://infisical.com/) as storage.  

For performance reasons, and to reduce costs, the secret values are cached in memory after first fetch.

You can disable the whole caching via config by setting enableCache to false.  
If the cache is enabled, you can set the ttl for cached secret values via config cacheTtl (in ms).  

This will return the cached secret if available and if ttl is not exceeded.  
If a secret value exceeds the ttl, it does not automatically get removed from cache.  
It will be removed/overwritten on next get request.  

@example
* ```typescript
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

  protected async getSecretImpl<SecretNames extends string[]>(
    ...secretNames: SecretNames
  ): Promise<ObjectWithKeysFromStringArray<SecretNames, string | undefined>> {
    const result: Record<string, string | undefined> = {}
    for (const name of secretNames) {
      try {
        result[name] = await this.client.getSecret(name)
      } catch (err) {
        const msg = `error in secret store getting value ${name}`
        this.logger.error({ err }, msg)
        throw new UnhandledError(StatusCode.InternalServerError, msg)
      }
    }
    return result as ObjectWithKeysFromStringArray<SecretNames, string | undefined>
  }

  protected async removeSecretImpl(secretName: string) {
    try {
      await this.client.removeSecret(secretName)
    } catch (err) {
      const msg = `error in secret store removing value ${secretName}`
      this.logger.error({ err }, msg)
      throw new UnhandledError(StatusCode.InternalServerError, msg)
    }
  }

  protected async setSecretImpl(secretName: string, secretValue: string) {
    try {
      await this.client.setSecret(secretName, secretValue)
    } catch (err) {
      const msg = `error in secret store setting value ${secretName}`
      this.logger.error({ err }, msg)
      throw new UnhandledError(StatusCode.InternalServerError, msg)
    }
  }
}
