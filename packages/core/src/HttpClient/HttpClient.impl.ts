import { join } from 'node:path'

import type { Context, Span, SpanOptions } from '@opentelemetry/api'
import { context, propagation, SpanKind, SpanStatusCode } from '@opentelemetry/api'
import { defaultResource, resourceFromAttributes } from '@opentelemetry/resources'
import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import {
	ATTR_HTTP_REQUEST_METHOD,
	ATTR_HTTP_RESPONSE_STATUS_CODE,
	ATTR_SERVICE_NAME,
	ATTR_URL_FULL,
} from '@opentelemetry/semantic-conventions'
import { HandledError } from '../core/Error/HandledError.impl.js'
import { UnhandledError } from '../core/Error/UnhandledError.impl.js'
import { createNoopMetricsRecorder } from '../core/metrics/createNoopMetricsRecorder.js'
import type { PuristaMetricsRecorder } from '../core/metrics/types.js'
import type { EmptyObject } from '../core/types/EmptyObject.js'
import type { Logger } from '../core/types/Logger.js'
import { PuristaSpanTag } from '../core/types/PuristaSpanTag.enum.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import { initLogger } from '../DefaultLogger/initLogger.impl.js'
import { puristaVersion } from '../version.js'
import type { AuthCredentials } from './types/AuthCredentials.js'
import type { HttpClientConfig } from './types/HttpClientConfig.js'
import type { HttpClientRequestOptions } from './types/HttpClientRequestOptions.js'
import type { RestClient } from './types/RestClient.js'

/**
 * A HTTP client which will provide simple methods for GET, POST, PATCH, PUT and DELETE.
 * Body payload will be handled as JSON requests
 * It includes timeout and error handling and simple json response body parsing
 *
 * @example
 * ```typescript
 * const client = new HttpClient({baseUrl: 'http://localhost/api})
 *
 * // GET http://localhost/api/v1/orders
 * const result = await client.get('v1/orders')
 * ```
 */
export class HttpClient<CustomConfig extends Record<string, unknown> = EmptyObject> implements RestClient {
	public name = 'HttpClient'
	public logger: Logger
	public config: HttpClientConfig<CustomConfig>

	public timeout: number

	public baseUrl: URL | undefined = undefined

	spanProcessor: SpanProcessor | undefined
	traceProvider: NodeTracerProvider
	private readonly metricsRecorder: PuristaMetricsRecorder

	protected auth: AuthCredentials
	constructor(config: HttpClientConfig<CustomConfig>) {
		const name = config.name ?? this.name
		this.name = name

		const logger = config.logger?.getChildLogger({ name }) ?? initLogger(config.logLevel, { name })

		this.config = {
			logger,
			isKeepAlive: true,
			defaultTimeout: 30000,
			...config,
		}

		if (this.config.baseUrl) {
			this.baseUrl = new URL(this.config.baseUrl)
		}

		this.auth = {
			basicAuth: this.config.basicAuth,
			bearerToken: this.config.bearerToken,
		}
		this.timeout = this.config.defaultTimeout ?? 30000
		this.logger = logger
		this.metricsRecorder = config.metricsRecorder ?? createNoopMetricsRecorder()

		const resource = defaultResource().merge(
			resourceFromAttributes({
				[ATTR_SERVICE_NAME]: this.name,
			}),
		)
		this.traceProvider = new NodeTracerProvider({
			resource,
			spanProcessors: config.spanProcessor ? [config.spanProcessor] : undefined,
		})

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

	private recordHttpClientDuration(startedAt: number, attributes: Record<string, string | number | boolean>) {
		try {
			this.metricsRecorder.recordFrameworkMetric(
				'http.client.request.duration',
				Math.max(0, Date.now() - startedAt) / 1000,
				attributes,
			)
		} catch {
			return
		}
	}

	protected getUrlAndHeader(path: string, options?: HttpClientRequestOptions) {
		let fullPath = this.baseUrl ? join(this.baseUrl.pathname, path) : path

		if (options?.hash) {
			fullPath += `#${options.hash}`
		}

		const url = new URL(fullPath, this.baseUrl)

		for (const [key, value] of Object.entries(options?.query ?? {})) {
			url.searchParams.set(key, value)
		}

		if (this.auth.basicAuth) {
			url.password = this.auth.basicAuth.password
			url.username = this.auth.basicAuth.username
		}

		const headers: Record<string, string> = {
			...this.config.defaultHeaders,
			...options?.headers,
		}

		propagation.inject(context.active(), headers)

		if (this.auth.bearerToken) {
			headers.Authorization = `Bearer ${this.auth.bearerToken}`
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
	protected async execute(method: string, path: string, options?: HttpClientRequestOptions, payload?: unknown) {
		const startedAt = Date.now()
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

		let body: string | undefined

		if (typeof payload === 'string') {
			body = payload
		} else {
			body = payload ? JSON.stringify(payload) : undefined
		}

		return this.startActiveSpan(`${this.name}.${method}`, { kind: SpanKind.CLIENT }, context.active(), async span => {
			span.setAttribute(ATTR_HTTP_REQUEST_METHOD, method)
			let metricAttributes: Record<string, string | number | boolean> = {
				'http.request.method': method,
				'purista.package.name': this.name,
			}

			const log = this.logger.getChildLogger({ ...span.spanContext(), customTraceId: this.config.traceId })

			try {
				const { url, headers } = this.getUrlAndHeader(path, options)
				metricAttributes = {
					...metricAttributes,
					'server.address': url.hostname,
					...(url.port ? { 'server.port': Number(url.port) } : {}),
				}
				span.setAttribute(ATTR_URL_FULL, url.toString())

				const response = await fetch(url, {
					method,
					signal: controller.signal,
					keepalive: this.config.isKeepAlive,
					headers,
					credentials: 'include',
					body,
				})

				span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, response.status)
				metricAttributes = {
					...metricAttributes,
					'http.response.status_code': response.status,
				}

				if (!response.ok) {
					let body = ''
					try {
						if (response.headers.get('content-type')?.startsWith('application/json')) {
							body = await response.json()
						} else {
							body = await response.text()
						}
					} catch (err) {
						log.warn({ err, method, url, path }, 'unable to get response text')
					}

					const headers = Array.from(response.headers)

					const err = new UnhandledError(response.status as StatusCode, response.statusText, {
						statusCode: response.status,
						method,
						url,
						path,
						headers,
						response: body,
					})
					throw err
				}

				if (response.status === StatusCode.NoContent) {
					this.recordHttpClientDuration(startedAt, { ...metricAttributes, 'purista.outcome': 'success' })
					return undefined
				}

				if (response.headers.get('content-type')?.startsWith('application/json')) {
					this.recordHttpClientDuration(startedAt, { ...metricAttributes, 'purista.outcome': 'success' })
					return await response.json()
				}
				this.recordHttpClientDuration(startedAt, { ...metricAttributes, 'purista.outcome': 'success' })
				return response.text()
			} catch (error) {
				const err =
					error instanceof UnhandledError || error instanceof HandledError ? error : UnhandledError.fromError(error)

				log.error({ err, method, path }, err.message)
				span.recordException(err)
				span.setStatus({
					code: SpanStatusCode.ERROR,
					message: err.message,
				})
				this.recordHttpClientDuration(startedAt, {
					...metricAttributes,
					'purista.outcome': err instanceof HandledError ? 'handled_error' : 'unhandled_error',
					'error.type': StatusCode[err.errorCode] ?? err.name,
				})
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
	async delete<T>(path: string, options?: HttpClientRequestOptions, payload?: unknown): Promise<T> {
		return this.execute('DELETE', path, options, payload) as Promise<T>
	}
}
