import { HttpClient, StatusCode, UnhandledError } from '@purista/core'

import { SECRET_TYPE } from './constants.js'
import { decrypt } from './decrypt.impl.js'
import { encrypt } from './encrypt.impl.js'
import type { ClientConfig, HttpClientConfigCustom, Secret, TokenData } from './types/index.js'

/**
 * The internal http client to connect to the Infisical server.
 */
export class InfisicalClient extends HttpClient<HttpClientConfigCustom> {
  private serviceTokenSecret: string
  private tokenData: TokenData | undefined
  private projectKey: string = ''

  constructor(conf: ClientConfig) {
    const config = {
      name: 'InfisicalClient',
      defaultHeaders: {
        'User-Agent': `InfisicalNodeSDK`,
        'content-type': 'application/json',
        ...conf.defaultHeaders,
      },
      ...conf,
    }
    super(config)
    this.serviceTokenSecret = config.bearerToken.substring(config.bearerToken.lastIndexOf('.') + 1)
  }

  /**
   * Encrypt the given key, value and optional comment
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
   * Fetches the token data from the server for given access token
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
   * Get a single secret
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
   * Set a secret.
   * It will first try to update and if the secret does not exist, it will create a new one
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
   * Remove a secret
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
