import { HttpClient, StatusCode, UnhandledError } from '@purista/core'

import { SECRET_TYPE } from './constants.js'
import { decrypt } from './decrypt.impl.js'
import { encrypt } from './encrypt.impl.js'
import type { ClientConfig, HttpClientConfigCustom } from './types/ClientConfig.js'
import type { Secret } from './types/Secret.js'
import type { TokenData } from './types/TokenData.js'

/**
 * HTTP client for the Infisical API used by `InfisicalSecretStore`.
 *
 * The client derives the project encryption key from the configured service
 * token and decrypts secret values before returning them. Treat the bearer token,
 * token data, project key, encrypted payloads, and decrypted values as secrets.
 *
 * Most applications should use `InfisicalSecretStore` instead of this lower-level
 * client so PURISTA store permissions and caching are applied consistently.
 */
export class InfisicalClient extends HttpClient<HttpClientConfigCustom> {
	private serviceTokenSecret: string
	private tokenData: TokenData | undefined
	private projectKey = ''

	private static getServiceTokenSecretFromBearerToken(token: unknown): string {
		if (typeof token !== 'string' || token.trim().length === 0) {
			throw new UnhandledError(StatusCode.InvalidToken, 'Invalid service token - bearer token is missing')
		}

		const tokenSecret = token.substring(token.lastIndexOf('.') + 1)
		if (tokenSecret.trim().length === 0) {
			throw new UnhandledError(StatusCode.InvalidToken, 'Invalid service token - token secret segment is missing')
		}

		return tokenSecret
	}

	/**
	 * Creates an Infisical API client.
	 *
	 * @param conf HTTP client configuration with a required Infisical service token
	 * in `bearerToken`.
	 */
	constructor(conf: ClientConfig) {
		const config = {
			name: 'InfisicalClient',
			defaultHeaders: {
				'User-Agent': 'InfisicalNodeSDK',
				'content-type': 'application/json',
				...conf.defaultHeaders,
			},
			...conf,
		}
		super(config)
		this.serviceTokenSecret = InfisicalClient.getServiceTokenSecretFromBearerToken(config.bearerToken)
	}

	/**
	 * Encrypts an Infisical secret key, value, and optional comment for API writes.
	 */
	private encryptSecret(secretKey: string, secretValue: string, secretComment = '') {
		const {
			ciphertext: secretKeyCiphertext,
			iv: secretKeyIV,
			tag: secretKeyTag,
		} = encrypt({
			text: secretKey,
			secret: this.projectKey,
		})

		const {
			ciphertext: secretValueCiphertext,
			iv: secretValueIV,
			tag: secretValueTag,
		} = encrypt({
			text: secretValue,
			secret: this.projectKey,
		})

		const {
			ciphertext: secretCommentCiphertext,
			iv: secretCommentIV,
			tag: secretCommentTag,
		} = encrypt({
			text: secretComment,
			secret: this.projectKey,
		})

		return {
			secretKeyCiphertext,
			secretKeyIV,
			secretKeyTag,
			secretValueCiphertext,
			secretValueIV,
			secretValueTag,
			secretCommentCiphertext,
			secretCommentIV,
			secretCommentTag,
		}
	}

	/**
	 * Fetches service-token metadata and decrypts the project key for later calls.
	 *
	 * The returned token data contains sensitive account and encrypted key
	 * metadata; do not log it.
	 */
	async getServiceTokenData() {
		this.tokenData = await this.get<TokenData>('/api/v2/service-token')

		this.projectKey = decrypt({
			ciphertext: this.tokenData.encryptedKey,
			iv: this.tokenData.iv,
			tag: this.tokenData.tag,
			secret: this.serviceTokenSecret,
		})

		return this.tokenData
	}

	/**
	 * Reads and decrypts a single shared Infisical secret.
	 *
	 * Returns `undefined` when Infisical reports that the secret does not exist.
	 *
	 * @param name Secret name as stored in Infisical.
	 */
	async getSecret(name: string) {
		if (!this.tokenData) {
			this.tokenData = await this.getServiceTokenData()
		}

		const environment = this.tokenData.scopes[0]?.environment

		if (!environment) {
			throw new UnhandledError(StatusCode.InvalidToken, 'Invalid service token - environment is missing')
		}

		try {
			const { secret: encryptedSecret } = await this.get<{ secret: Secret }>(encodeURI(`/api/v3/secrets/${name}`), {
				query: {
					environment,
					workspaceId: this.tokenData.workspace,
					type: SECRET_TYPE,
				},
			})

			return decrypt({
				ciphertext: encryptedSecret.secretValueCiphertext,
				iv: encryptedSecret.secretValueIV,
				tag: encryptedSecret.secretValueTag,
				secret: this.projectKey,
			})
		} catch (error) {
			if (error instanceof UnhandledError) {
				if (error.errorCode === StatusCode.NotFound) {
					return undefined
				}
			}
			throw error
		}
	}

	/**
	 * Creates or updates a shared Infisical secret.
	 *
	 * The method first attempts an update and falls back to create when Infisical
	 * reports that the secret does not exist.
	 *
	 * @param name Secret name as stored in Infisical.
	 * @param value Plaintext secret value to encrypt before sending.
	 */
	async setSecret(name: string, value: string) {
		if (!this.tokenData) {
			this.tokenData = await this.getServiceTokenData()
		}

		const environment = this.tokenData.scopes[0]?.environment

		if (!environment) {
			throw new UnhandledError(StatusCode.InvalidToken, 'Invalid service token - environment is missing')
		}

		const payload = {
			environment,
			workspaceId: this.tokenData.workspace,
			type: SECRET_TYPE,
			...this.encryptSecret(name, value),
		}

		try {
			await this.patch<{ secret: Secret }>(encodeURI(`/api/v3/secrets/${name}`), payload)
		} catch (patchError) {
			if (!(patchError instanceof UnhandledError) || patchError.errorCode !== StatusCode.NotFound) {
				const err = UnhandledError.fromError(patchError)
				this.logger.error({ err })
				throw err
			}

			this.logger.debug({ err: patchError }, 'Secret seems to be a new one')
			try {
				await this.post<{ secret: Secret }>(encodeURI(`/api/v3/secrets/${name}`), payload)
			} catch (error) {
				const err = UnhandledError.fromError(error)
				this.logger.error({ err })
				throw err
			}
		}
	}

	/**
	 * Removes a shared Infisical secret from the token's first environment scope.
	 *
	 * @param name Secret name as stored in Infisical.
	 */
	async removeSecret(name: string) {
		if (!this.tokenData) {
			this.tokenData = await this.getServiceTokenData()
		}

		const environment = this.tokenData.scopes[0]?.environment

		if (!environment) {
			throw new UnhandledError(StatusCode.InvalidToken, 'Invalid service token - environment is missing')
		}

		await this.delete(
			encodeURI(`/api/v3/secrets/${name}`),
			{},
			{
				environment,
				workspaceId: this.tokenData.workspace,
				type: SECRET_TYPE,
			},
		)
	}
}
