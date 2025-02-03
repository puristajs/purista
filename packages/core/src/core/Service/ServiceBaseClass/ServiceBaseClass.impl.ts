import type { Context, Span, SpanOptions } from '@opentelemetry/api'

import { SpanStatusCode } from '@opentelemetry/api'
import { Resource } from '@opentelemetry/resources'
import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions'
import type { Schema } from '@typeschema/main'

import { puristaVersion } from '../../../version.js'
import type { ConfigStore } from '../../ConfigStore/index.js'
import type { EventBridge } from '../../EventBridge/index.js'
import type { SecretStore } from '../../SecretStore/index.js'
import type { StateStore } from '../../StateStore/index.js'
import type { Logger, ServiceEvents, ServiceInfoType } from '../../types/index.js'
import { GenericEventEmitter, PuristaSpanTag } from '../../types/index.js'
import { ServiceInfoValidator } from '../ServiceInfoValidator.impl.js'

/**
 * Class which contains basic functions that are not directly related to
 *
 * - handling of messages
 * - handling of commands
 * - handling of subscriptions
 *
 * @group Service
 */
export class ServiceBaseClass extends GenericEventEmitter<ServiceEvents> {
	readonly info: ServiceInfoType

	protected eventBridge: EventBridge

	public logger: Logger

	spanProcessor: SpanProcessor | undefined

	traceProvider: NodeTracerProvider

	protected secretStore: SecretStore
	protected configStore: ConfigStore
	protected stateStore: StateStore

	protected configSchema: Schema | undefined

	constructor(options: {
		logger: Logger
		info: ServiceInfoType
		eventBridge: EventBridge
		spanProcessor?: SpanProcessor
		secretStore: SecretStore
		configStore: ConfigStore
		stateStore: StateStore
		configSchema?: Schema
	}) {
		super()
		this.info = new Proxy(
			{
				serviceName: '',
				serviceDescription: '',
				serviceVersion: '1',
			},
			ServiceInfoValidator,
		)

		this.info.serviceDescription = options.info.serviceDescription
		this.info.serviceName = options.info.serviceName
		this.info.serviceVersion = options.info.serviceVersion

		this.logger = options.logger.getChildLogger({
			serviceName: this.info.serviceName,
			serviceVersion: this.info.serviceVersion,
			puristaVersion,
		})
		this.logger.debug({ ...this.info }, `creating ${this.info.serviceName} ${this.info.serviceVersion}`)

		const resource = Resource.default().merge(
			new Resource({
				[ATTR_SERVICE_NAME]: this.info.serviceName,
				[ATTR_SERVICE_VERSION]: this.info.serviceVersion,
			}),
		)
		this.traceProvider = new NodeTracerProvider({
			resource,
		})

		if (options.spanProcessor) {
			this.traceProvider.addSpanProcessor(options.spanProcessor)
		}

		this.traceProvider.register()
		this.spanProcessor = options.spanProcessor

		this.eventBridge = options.eventBridge

		this.secretStore = options.secretStore
		this.configStore = options.configStore
		this.stateStore = options.stateStore
	}

	/**
	 * Get service info
	 */
	get serviceInfo(): ServiceInfoType {
		return Object.freeze({ ...this.info })
	}

	/**
	 * Returns open telemetry tracer of this service
	 *
	 * @returns Tracer
	 */
	getTracer(name?: string, version?: string) {
		return this.traceProvider.getTracer(
			name ?? this.serviceInfo.serviceName,
			version ?? this.serviceInfo.serviceVersion,
		)
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

	/**
	 * Start span for opentelemetry tracking on same level.
	 * The created span will not become the "active" span within opentelemetry!
	 *
	 * This means during logging and similar the spanId of parent span is logged.
	 *
	 * Use wrapInSpan for marking points in flow of one bigger function,
	 * but not to trace the program flow itself
	 *
	 * @param name name of span
	 * @param opts span options
	 * @param fn function te be executed in the span
	 * @param context span context
	 * @returns return value of fn
	 */
	async wrapInSpan<F>(name: string, opts: SpanOptions, fn: (span: Span) => Promise<F>, context?: Context): Promise<F> {
		const tracer = this.getTracer()
		const span = tracer.startSpan(name, opts, context)
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

	async destroy() {
		this.logger.info({ ...this.info }, 'stopped')
	}
}
