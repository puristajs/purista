import {
	type ObjectWithKeysFromStringArray,
	SecretStoreBaseClass,
	StatusCode,
	type StoreBaseConfig,
	UnhandledError,
} from '@purista/core/adapter'
import vault from 'node-vault'

import type { VaultSecretStoreConfig } from './types.js'

const normalizeMountPath = (mount: string): string => {
	let start = 0
	let end = mount.length

	while (start < end && mount[start] === '/') {
		start++
	}

	while (end > start && mount[end - 1] === '/') {
		end--
	}

	const normalized = mount.slice(start, end)
	return normalized.length > 0 ? normalized : 'secret'
}

/**
 * Secret store backed by HashiCorp Vault KV v2.
 *
 * Secret values are cached in memory after the first read. Set `enableCache` to
 * `false` to always read from Vault, or set `cacheTtl` in milliseconds to bound
 * cache reuse. Expired entries are refreshed on the next read.
 *
 * Values are written under `{mount}/data/{secretName}` using the field name
 * `value`, and removals delete `{mount}/metadata/{secretName}`. Use
 * tenant-aware names such as `tenants/acme/prod/payments/api-token`. Never log
 * returned secret values or Vault tokens.
 *
 * @example
 * ```typescript
 * const store = new VaultSecretStore({
 *   endpoint: 'https://vault.example.internal',
 *   token: process.env.VAULT_TOKEN ?? '',
 *   mount: 'secret',
 * })
 *
 * await store.setSecret('tenants/acme/prod/payments/api-token', 'placeholder-secret')
 * const secret = await store.getSecret('tenants/acme/prod/payments/api-token')
 * ```
 */
export class VaultSecretStore extends SecretStoreBaseClass<VaultSecretStoreConfig> {
	/**
	 * Node Vault client used for KV requests.
	 *
	 * Applications normally configure this through the constructor. Tests may
	 * replace it with a compatible client.
	 */
	client: ReturnType<typeof vault>

	/**
	 * Creates a Vault KV v2-backed secret store.
	 *
	 * @param config Store options, Vault endpoint, token, and optional mount.
	 */
	constructor(config: StoreBaseConfig<VaultSecretStoreConfig>) {
		super('VaultSecretStore', { enableCache: true, ...config })
		const mount = this.config.mount ?? 'secret'
		this.config.mount = normalizeMountPath(mount)
		this.client = vault({ endpoint: this.config.endpoint, token: this.config.token })
	}

	private isNotFoundError(err: unknown): err is { response?: { statusCode?: number } } {
		return (
			typeof err === 'object' &&
			err !== null &&
			'response' in err &&
			typeof err.response === 'object' &&
			err.response !== null &&
			'statusCode' in err.response &&
			err.response.statusCode === 404
		)
	}

	protected async getSecretImpl<SecretNames extends string[]>(
		...secretNames: SecretNames
	): Promise<ObjectWithKeysFromStringArray<SecretNames, string | undefined>> {
		const result: Record<string, string | undefined> = {}

		for (const name of secretNames) {
			result[name] = undefined
			try {
				const res = await this.client.read(`${this.config.mount}/data/${name}`)
				result[name] = res?.data?.data?.value
			} catch (err) {
				if (this.isNotFoundError(err)) {
					result[name] = undefined
					continue
				}
				throw UnhandledError.fromError(err, StatusCode.InternalServerError)
			}
		}

		return result as ObjectWithKeysFromStringArray<SecretNames, string | undefined>
	}

	protected async removeSecretImpl(secretName: string) {
		try {
			await this.client.delete(`${this.config.mount}/metadata/${secretName}`)
		} catch (err) {
			if (this.isNotFoundError(err)) {
				return
			}
			throw UnhandledError.fromError(err, StatusCode.InternalServerError)
		}
	}

	protected async setSecretImpl(secretName: string, secretValue: string) {
		try {
			await this.client.write(`${this.config.mount}/data/${secretName}`, { data: { value: secretValue } })
		} catch (err) {
			throw UnhandledError.fromError(err, StatusCode.InternalServerError)
		}
	}
}
