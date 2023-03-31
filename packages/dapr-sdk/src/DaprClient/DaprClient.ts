import { initLogger, Logger, LogLevelName } from '@purista/core'
import { URL } from 'url'

import { puristaVersion } from '../version'

type Opts = {
  /**
   * A logger instance
   */
  logger?: Logger
  /**
   * the loglevel if no logger instance is given
   */
  logLevel?: LogLevelName

  /**
   * Host location of the Dapr sidecar.
   * Default is 127.0.0.1.
   */
  daprHost?: string
  /**
   * Port of the Dapr sidecar.
   * Default is 3500.
   */
  daprPort?: string

  /**
   * API token to authenticate with Dapr.
   * See https://docs.dapr.io/operations/security/api-token/.
   */
  daprApiToken?: string

  /**
   * If set to false, the HTTP client will not reuse the same connection for multiple requests.
   * Default is true.
   */
  isKeepAlive?: boolean
}

const DEFAULT_DAPR_PORT = '3500'
const DEFAULT_DAPR_HOST = 'http://127.0.0.1'

export class DaprClient {
  private logger: Logger
  public clientUrl: string

  public config: Opts

  private clientBaseOptions: RequestInit
  constructor(config: Opts) {
    const logger = config.logger || initLogger(config.logLevel)
    this.logger = logger
    this.config = {
      logger,
      daprHost: DEFAULT_DAPR_HOST,
      daprPort: DEFAULT_DAPR_PORT,
      ...config,
    }

    this.clientUrl = `${this.config.daprHost}:${this.config.daprPort}/v1.0`
    if (!this.clientUrl.startsWith('http://') && !this.clientUrl.startsWith('https://')) {
      this.clientUrl = `http://${this.clientUrl}`
    }

    const keepalive = this.config.isKeepAlive

    const headers: HeadersInit = {}
    if (this.config.daprApiToken) {
      headers['dapr-api-token'] = this.config.daprApiToken
      headers['user-agent'] = `purista-dapr-client/v${puristaVersion} http/1`
    }

    this.clientBaseOptions = {
      keepalive,
      headers,
    }
  }

  async get<T>(path: string, abortTimeout = 3000): Promise<T> {
    const controller = new AbortController()
    const timeout = setTimeout(() => {
      controller.abort('Time out reached')
    }, abortTimeout)

    try {
      const port = this.config.daprPort ? parseInt(this.config.daprPort, 10) : DEFAULT_DAPR_PORT
      const hostname = this.config.daprHost || DEFAULT_DAPR_HOST

      const url = new URL(path, hostname)
      url.port = port.toString()

      const response = await fetch(url, { ...this.clientBaseOptions, method: 'GET', signal: controller.signal })
      return (await response.json()) as T
    } catch (err) {
      this.logger.error({ err }, (err as Error).message)
      throw err
    } finally {
      clearTimeout(timeout)
    }
  }

  async post<T>(path: string, payload: unknown, headers?: Record<string, string>, abortTimeout = 3000): Promise<T> {
    const controller = new AbortController()
    const timeout = setTimeout(() => {
      controller.abort('Time out reached')
    }, abortTimeout)

    try {
      const hostname = this.config.daprHost || DEFAULT_DAPR_HOST

      const url = new URL(path, hostname)
      url.port = this.config.daprPort || DEFAULT_DAPR_PORT

      const response = await fetch(url, {
        ...this.clientBaseOptions,
        method: 'GET',
        signal: controller.signal,
        body: JSON.stringify(payload),
        headers: {
          ...this.clientBaseOptions.headers,
          ...headers,
        },
      })
      return (await response.json()) as T
    } catch (err) {
      this.logger.error({ err }, (err as Error).message)
      throw err
    } finally {
      clearTimeout(timeout)
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      const result = this.get(`/metadata`)
      return !!result
    } catch (e) {
      return false
    }
  }
}
