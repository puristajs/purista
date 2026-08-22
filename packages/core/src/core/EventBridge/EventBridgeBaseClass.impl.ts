import type { Context, Span, SpanOptions } from '@opentelemetry/api'
import { SpanStatusCode } from '@opentelemetry/api'
import { defaultResource, resourceFromAttributes } from '@opentelemetry/resources'
import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions'

import { initLogger } from '../../DefaultLogger/initLogger.impl.js'
import { puristaVersion } from '../../version.js'
import { UnhandledError } from '../Error/UnhandledError.impl.js'
import { getNewInstanceId } from '../helper/getNewInstanceId.impl.js'
import { createNoopMetricsRecorder } from '../metrics/createNoopMetricsRecorder.js'
import { PuristaMetricsRecorder as OpenTelemetryMetricsRecorder } from '../metrics/PuristaMetricsRecorder.js'
import type { PuristaMetricAttributes, PuristaMetricsRecorder } from '../metrics/types.js'
import type { Complete } from '../types/Complete.js'
import type { DefinitionEventBridgeConfig } from '../types/DefinitionEventBridgeConfig.js'
import type { EBMessageAddress } from '../types/EBMessageAddress.js'
import type { InstanceId } from '../types/InstanceId.js'
import type { Logger } from '../types/Logger.js'
import { PuristaSpanTag } from '../types/PuristaSpanTag.enum.js'
import type {
	ObservabilityValueSource,
	ServiceObservabilityContext,
	ServiceObservabilityInheritance,
} from '../types/ServiceObservability.js'
import type {
	InFlightExecutionCounts,
	PausedSubscriptionConsumersByRegistrationKey,
} from '../types/ServiceOperatorState.js'
import { StatusCode } from '../types/StatusCode.enum.js'
import type { StreamDefinitionMetadataBase } from '../types/stream/StreamDefinitionMetadataBase.js'
import type { StreamHandle } from '../types/stream/StreamHandle.js'
import type { StreamMessage } from '../types/stream/StreamMessage.js'
import type { StreamOpenRequest } from '../types/stream/StreamOpenRequest.js'
import { InFlightExecutionTracker } from './InFlightExecutionTracker.impl.js'
import type { EventBridgeCapabilities } from './types/EventBridgeCapabilities.js'
import {
	EventBridgeCommandTransport,
	EventBridgeResponseConfirmationLevel,
} from './types/EventBridgeCommandCapabilities.js'
import type { EventBridgeConfig } from './types/EventBridgeConfig.js'
import { EventBridgeLateResponseHandling } from './types/EventBridgeLateResponseHandling.js'
import { EventBridgeStreamLateFrameHandling } from './types/EventBridgeStreamLateFrameHandling.js'

/**
 * The base class to be extended by event bridge implementations
 *
 * @group Event bridge
 */
export class EventBridgeBaseClass<ConfigType> {
	logger: Logger
	traceProvider: NodeTracerProvider
	protected metricsRecorder: PuristaMetricsRecorder

	config: Complete<EventBridgeConfig<ConfigType>>

	name: string
	capabilities: EventBridgeCapabilities = {
		supportsStreams: false,
		durableCommands: false,
		durableSubscriptions: false,
		manualAckSupported: false,
		lateResponseHandling: EventBridgeLateResponseHandling.NotApplicable,
		gracefulDrainSupported: true,
		nativeDeadLettering: false,
		commandHandling: {
			transport: EventBridgeCommandTransport.InMemory,
			pendingInvocationCancellation: true,
			responseConfirmation: EventBridgeResponseConfirmationLevel.None,
			strictMode: true,
		},
		streamHandling: {
			incrementalDelivery: false,
			consumerCancellation: false,
			gracefulStreamDrain: true,
			aggregatedFinalSupported: false,
			lateFrameHandling: EventBridgeStreamLateFrameHandling.NotApplicable,
		},
		consumerFailureHandling: {
			boundedRetry: false,
			delayedRetry: false,
			deadLetterTarget: false,
			drop: false,
			stopConsumer: false,
			consumerPauseResume: false,
			bridgeManagedDeadLettering: false,
			nativeDeadLettering: false,
			fatalClassification: false,
			strictMode: true,
		},
	}

	instanceId: Readonly<InstanceId>

	defaultCommandTimeout: Readonly<number>
	/** @internal Runtime tracker; adapter implementations must not depend on it. */
	protected readonly inFlightExecutions = new InFlightExecutionTracker()
	private readonly hasExplicitLogger: boolean
	private readonly hasExplicitMetrics: boolean
	private readonly hasExplicitSpanProcessor: boolean
	private spanProcessorSource: ObservabilityValueSource
	private observabilityStarted = false
	constructor(name: string, config: EventBridgeConfig<ConfigType>) {
		this.name = name
		this.hasExplicitLogger = config?.logger !== undefined
		this.hasExplicitMetrics = config?.metrics !== undefined || config?.metricsRecorder !== undefined
		this.hasExplicitSpanProcessor = config?.spanProcessor !== undefined
		const logger = config?.logger ?? initLogger(config?.logLevel)
		this.logger = logger.getChildLogger({ name })

		this.instanceId = config.instanceId ?? getNewInstanceId()
		this.config = {
			logger: logger.getChildLogger({ name }),
			instanceId: this.instanceId,
			defaultCommandTimeout: config.defaultCommandTimeout ?? 30000,
			spanProcessor: undefined,
			metrics: undefined,
			metricsRecorder: undefined,
			...config,
		}
		this.metricsRecorder =
			config.metricsRecorder ??
			(config.metrics?.enabled === false
				? createNoopMetricsRecorder()
				: new OpenTelemetryMetricsRecorder({
						...config.metrics,
						defaultAttributes: {
							'purista.bridge.name': name,
							'purista.bridge.type': 'event',
							...config.metrics?.defaultAttributes,
						},
					}))

		this.defaultCommandTimeout = config.defaultCommandTimeout ?? 30000

		this.spanProcessorSource = this.hasExplicitSpanProcessor ? 'component' : 'default'
		this.traceProvider = this.createTraceProvider(config.spanProcessor)
	}

	/**
	 * Apply service observability where an event bridge can do so safely before startup.
	 *
	 * Explicit bridge options always win. Logger and metrics settings can be
	 * replaced before the bridge starts. The tracer provider is rebuilt before
	 * startup when the bridge has no explicit span processor, so all subclasses
	 * inherit one service-owned processor without adapter-specific wiring. Once
	 * startup begins, provider replacement is refused and reported as
	 * `unsupported`.
	 *
	 * @group Observability
	 */
	inheritServiceObservability(context: ServiceObservabilityContext): ServiceObservabilityInheritance {
		if (!this.hasExplicitLogger) {
			const logger = context.logger.getChildLogger({ name: this.name })
			this.logger = logger
		}

		if (!this.hasExplicitMetrics) {
			this.metricsRecorder =
				context.metricsRecorder ??
				(context.metrics?.enabled === false
					? createNoopMetricsRecorder()
					: new OpenTelemetryMetricsRecorder({
							...context.metrics,
							defaultAttributes: {
								'purista.bridge.name': this.name,
								'purista.bridge.type': 'event',
								...context.metrics?.defaultAttributes,
							},
						}))
		}

		let spanProcessor: ObservabilityValueSource = this.spanProcessorSource
		if (!this.hasExplicitSpanProcessor && context.spanProcessor) {
			if (this.observabilityStarted) {
				spanProcessor = 'unsupported'
			} else {
				this.traceProvider = this.createTraceProvider(context.spanProcessor)
				this.spanProcessorSource = context.sources.spanProcessor
				spanProcessor = this.spanProcessorSource
			}
		}

		return {
			logger: this.hasExplicitLogger ? 'component' : context.sources.logger,
			spanProcessor,
			metrics: this.hasExplicitMetrics
				? 'component'
				: context.metrics || context.metricsRecorder
					? context.sources.metrics
					: 'default',
		}
	}

	/** Mark a built-in bridge as started so observability cannot be replaced. */
	protected markObservabilityStarted() {
		this.observabilityStarted = true
	}

	private createTraceProvider(spanProcessor?: SpanProcessor): NodeTracerProvider {
		const resource = defaultResource().merge(
			resourceFromAttributes({
				[ATTR_SERVICE_NAME]: this.name,
				[ATTR_SERVICE_VERSION]: puristaVersion,
			}),
		)
		const traceProvider = new NodeTracerProvider({
			resource,
			spanProcessors: spanProcessor ? [spanProcessor] : undefined,
		})
		traceProvider.register()
		return traceProvider
	}

	/**
	 * Returns open telemetry tracer of this service
	 *
	 * @returns Tracer
	 */
	getTracer() {
		return this.traceProvider.getTracer('DefaultEventBridge', puristaVersion)
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
		const startedAt = Date.now()

		const callback = async (span: Span) => {
			span.setAttribute(PuristaSpanTag.PuristaVersion, puristaVersion)
			let outcome: 'success' | 'unhandled_error' = 'success'
			try {
				return await fn(span)
			} catch (error) {
				outcome = 'unhandled_error'
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
				this.recordBridgeOperation(name, startedAt, outcome)
				span.end()
			}
		}

		return context
			? tracer.startActiveSpan(name, opts, context, callback)
			: tracer.startActiveSpan(name, opts, callback)
	}

	private recordBridgeOperation(name: string, startedAt: number, outcome: 'success' | 'unhandled_error') {
		const attributes: PuristaMetricAttributes = {
			'purista.bridge.name': this.name,
			'purista.bridge.type': 'event',
			'purista.bridge.operation': name,
			'purista.outcome': outcome,
			...(outcome === 'success' ? {} : { 'error.type': 'unknown' }),
		}
		try {
			this.metricsRecorder.recordFrameworkMetric(
				'purista.bridge.operation.duration',
				Math.max(0, Date.now() - startedAt),
				attributes,
			)
		} catch {
			return
		}
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

	async destroy() {}
	async start() {
		this.markObservabilityStarted()
	}

	runInFlight<T>(
		fn: () => Promise<T>,
		kind: 'command' | 'subscription' | 'stream' | 'generic' = 'generic',
	): Promise<T> {
		return this.inFlightExecutions.run(fn, kind)
	}

	async waitForInFlightDrain(timeoutMs = this.defaultCommandTimeout) {
		return this.inFlightExecutions.waitForIdle(timeoutMs)
	}

	getInFlightExecutionCount() {
		return this.inFlightExecutions.size
	}

	getInFlightExecutionCounts(): InFlightExecutionCounts {
		return this.inFlightExecutions.getCounts()
	}

	getPausedSubscriptionConsumers(): PausedSubscriptionConsumersByRegistrationKey {
		return {}
	}

	async resumeSubscriptionConsumer(_registrationKey: string) {}

	async openStream<Chunk = unknown, Final = unknown>(
		_input: Omit<StreamOpenRequest, 'id' | 'messageType' | 'timestamp' | 'correlationId'>,
		_ttl?: number,
	): Promise<StreamHandle<Chunk, Final>> {
		throw new UnhandledError(StatusCode.NotImplemented, `${this.name} does not support streams`)
	}

	async registerStream(
		_address: EBMessageAddress,
		_cb: (message: StreamMessage) => Promise<void>,
		_metadata: StreamDefinitionMetadataBase,
		_eventBridgeConfig: DefinitionEventBridgeConfig,
	): Promise<string> {
		throw new UnhandledError(StatusCode.NotImplemented, `${this.name} does not support streams`)
	}

	async unregisterStream(_address: EBMessageAddress): Promise<void> {
		throw new UnhandledError(StatusCode.NotImplemented, `${this.name} does not support streams`)
	}
}
