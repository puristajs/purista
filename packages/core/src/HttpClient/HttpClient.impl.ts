import { join } from 'node:path'

import { Context, context, propagation, Span, SpanKind, SpanOptions, SpanStatusCode } from '@opentelemetry/api'
import { Resource } from '@opentelemetry/resources'
import { NodeTracerProvider, SpanProcessor } from '@opentelemetry/sdk-trace-node'
import { SemanticAttributes, SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'

import { HandledError, initLogger, Logger, PuristaSpanTag, StatusCode, UnhandledError } from '../core'
import { puristaVersion } from '../version'
import { AuthCredentials, HttpClientConfig, HttpClientRequestOptions, RestClient } from './types'

/**
 * A HTTP client which will provide simple methods for GET, POST, PATCH, PUT and DELETE.
 * Body payload will be handled as JSON requests
 * It includes timeout and error handling and simple json response body parsing
 *
 * @example ```typescript
 * const client = new HttpClient({baseUrl: 'http://localhost/api})
 *
 * // GET http://localhost/api/v1/orders
 * const result = await client.get('v1/orders')
 * ```
 */
export class HttpClient<CustomConfig extends Record<string, unknown> = never> implements RestClient {
  public name = 'HttpClient'
  public logger: Logger
  public config: HttpClientConfig<CustomConfig>

  public timeout: number

  public baseUrl: URL

  spanProcessor: SpanProcessor | undefined
  traceProvider: NodeTracerProvider

  private auth: AuthCredentials
  constructor(config: HttpClientConfig<CustomConfig>) {
    const name = config.name || this.name
    this.name = name

    const logger = config.logger?.getChildLogger({ name }) || initLogger(config.logLevel, { name })

    this.config = {
      logger,
      isKeepAlive: true,
      defaultTimeout: 30000,
      ...config,
    }

    this.baseUrl = new URL(this.config.baseUrl)

    this.auth = {
      basicAuth: this.config.basicAuth,
      bearerToken: this.config.bearerToken,
    }
    this.timeout = this.config.defaultTimeout || 30000
    this.logger = logger

    const resource = Resource.default().merge(
      new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: this.name,
      }),
    )
    this.traceProvider = new NodeTracerProvider({
      resource,
    })

    if (config.spanProcessor) {
      this.traceProvider.addSpanProcessor(config.spanProcessor)
    }

    this.traceProvider.register()
  }

  /**
   * Returns open telemetry tracer of this service
   *
   * @returns Tracer
   */
  getTracer() {
    return this.traceProvider.getTracer(this.name)
  }

  /**
   * Start a child span for opentelemetry tracking
   * @param name name of span
   * @param opts span options
   * @param context optional context
   * @param fn function to be executed within the span
   * @returns return value of fn
   */
  async startActiveSpan<F>(
    name: string,
    opts: SpanOptions,
    context: Context | undefined,
    fn: (span: Span) => Promise<F>,
  ): Promise<F> {
    const tracer = this.getTracer()

    const callback = async (span: Span) => {
      span.setAttribute(PuristaSpanTag.PuristaVersion, puristaVersion)
      try {
        return await fn(span)
      } catch (error) {
        let message = 'error'
        if (error instanceof Error) {
          message = error.message
        }

        span.recordException(error as Error)
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message,
        })

        throw error
      } finally {
        span.end()
      }
    }

    return context
      ? tracer.startActiveSpan(name, opts, context, callback)
      : tracer.startActiveSpan(name, opts, callback)
  }

  private getUrlAndHeader(path: string, options?: HttpClientRequestOptions) {
    let fullPath = join(this.baseUrl.pathname, path)

    if (options?.hash) {
      fullPath += `#${options.hash}`
    }

    const url = new URL(fullPath, this.baseUrl)

    for (const [key, value] of Object.entries(options?.query || {})) {
      url.searchParams.set(key, value)
    }

    if (this.auth.basicAuth) {
      url.password = this.auth.basicAuth.password
      url.username = this.auth.basicAuth.username
    }

    const headers = {
      ...this.config.defaultHeaders,
      ...options?.headers,
    }

    propagation.inject(context.active(), headers)

    if (this.auth.bearerToken) {
      headers['Authorization'] = `Bearer ${this.auth.bearerToken}`
    }

    return {
      url,
      headers,
    }
  }

  /**
   * Set the bearer token for all following requests.
   * @param token the bearer token
   */
  setBearerToken(token: string | undefined) {
    this.auth.bearerToken = token
  }

  /**
   * Helper method
   * @param method
   * @param path
   * @param options
   * @param payload
   * @throws UnhandledError
   * @returns
   */
  private async execute(method: string, path: string, options?: HttpClientRequestOptions, payload?: unknown) {
    const controller = new AbortController()
    const timeout = setTimeout(() => {
      controller.abort(
        new UnhandledError(StatusCode.RequestTimeout, `request exceeded ${this.timeout} ms`, {
          name: this.name,
          path,
          method,
        }),
      )
    }, this.timeout)

    const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload)
    const body = payload ? payloadString : undefined

    return this.startActiveSpan(`${this.name}.${method}`, { kind: SpanKind.CLIENT }, context.active(), async (span) => {
      span.setAttribute(SemanticAttributes.HTTP_METHOD, method)

      try {
        const { url, headers } = this.getUrlAndHeader(path, options)
        span.setAttribute(SemanticAttributes.HTTP_URL, url.toString())
        const response = await fetch(url, {
          method,
          signal: controller.signal,
          keepalive: this.config.isKeepAlive,
          headers,
          credentials: 'include',
          body,
        })

        span.setAttribute(SemanticAttributes.HTTP_STATUS_CODE, response.status)

        if (!response.ok) {
          let txt = ''
          try {
            txt = await response.text()
          } catch (err) {
            this.logger.warn({ err }, 'unable to get response text')
          }

          const err = new UnhandledError(response.status as StatusCode, response.statusText, {
            method,
            url,
            path,
            response: txt,
          })
          span.recordException(err)
          throw err
        }

        if (response.status === StatusCode.NoContent) {
          return undefined
        }

        if (response.headers.get('Content-Type')?.startsWith('application/json')) {
          return await response.json()
        }
        return response.text()
      } catch (error) {
        this.logger.error({ err: error }, (error as Error).message)
        const err =
          error instanceof UnhandledError || error instanceof HandledError ? error : UnhandledError.fromError(error)
        err.data = {
          method,
          path,
        }
        this.logger.error({ err, method, path }, err.message)
        span.recordException(err)
        throw err
      } finally {
        clearTimeout(timeout)
      }
    })
  }

  /**
   * GET request
   * @param path
   * @param options
   * @returns
   */
  async get<T>(path: string, options?: HttpClientRequestOptions): Promise<T> {
    return this.execute('GET', path, options) as Promise<T>
  }

  /**
   * POST request
   * @param path
   * @param options
   * @returns
   */
  async post<T>(path: string, payload: unknown, options?: HttpClientRequestOptions): Promise<T> {
    return this.execute('POST', path, options, payload) as Promise<T>
  }

  /**
   * PUT request
   * @param path
   * @param options
   * @returns
   */
  async put<T>(path: string, payload: unknown, options?: HttpClientRequestOptions): Promise<T> {
    return this.execute('PUT', path, options, payload) as Promise<T>
  }

  /**
   * PATCH request
   * @param path
   * @param options
   * @returns
   */
  async patch<T>(path: string, payload: unknown, options?: HttpClientRequestOptions): Promise<T> {
    return this.execute('PATCH', path, options, payload) as Promise<T>
  }

  /**
   * DELETE request
   * @param path
   * @param options
   * @returns
   */
  async delete<T>(path: string, options?: HttpClientRequestOptions): Promise<T> {
    return this.execute('DELETE', path, options) as Promise<T>
  }
}
