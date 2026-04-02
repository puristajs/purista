import type { Context, Span, SpanOptions } from '@opentelemetry/api'
import { SpanStatusCode } from '@opentelemetry/api'
import { defaultResource, resourceFromAttributes } from '@opentelemetry/resources'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions'

import { initLogger } from '../../DefaultLogger/initLogger.impl.js'
import { puristaVersion } from '../../version.js'
import { UnhandledError } from '../Error/UnhandledError.impl.js'
import { getNewInstanceId } from '../helper/getNewInstanceId.impl.js'
import type { Complete } from '../types/Complete.js'
import type { DefinitionEventBridgeConfig } from '../types/DefinitionEventBridgeConfig.js'
import type { EBMessageAddress } from '../types/EBMessageAddress.js'
import type { InstanceId } from '../types/InstanceId.js'
import type { Logger } from '../types/Logger.js'
import { PuristaSpanTag } from '../types/PuristaSpanTag.enum.js'
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
			bridgeManagedDeadLettering: false,
			nativeDeadLettering: false,
			fatalClassification: false,
			strictMode: true,
		},
	}

	instanceId: Readonly<InstanceId>

	defaultCommandTimeout: Readonly<number>
	protected readonly inFlightExecutions = new InFlightExecutionTracker()
	constructor(name: string, config: EventBridgeConfig<ConfigType>) {
		this.name = name
		const logger = config?.logger ?? initLogger(config?.logLevel)
		this.logger = logger.getChildLogger({ name })

		this.instanceId = config.instanceId ?? getNewInstanceId()
		this.config = {
			logger: logger.getChildLogger({ name }),
			instanceId: this.instanceId,
			defaultCommandTimeout: config.defaultCommandTimeout ?? 30000,
			spanProcessor: undefined,
			...config,
		}

		this.defaultCommandTimeout = config.defaultCommandTimeout ?? 30000

		const resource = defaultResource().merge(
			resourceFromAttributes({
				[ATTR_SERVICE_NAME]: name,
				[ATTR_SERVICE_VERSION]: puristaVersion,
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

	async destroy() {}
	async start() {}

	runInFlight<T>(fn: () => Promise<T>): Promise<T> {
		return this.inFlightExecutions.run(fn)
	}

	async waitForInFlightDrain(timeoutMs = this.defaultCommandTimeout) {
		return this.inFlightExecutions.waitForIdle(timeoutMs)
	}

	getInFlightExecutionCount() {
		return this.inFlightExecutions.size
	}

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
