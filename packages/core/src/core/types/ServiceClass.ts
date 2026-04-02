import type { Context, Span, SpanOptions, Tracer } from '@opentelemetry/api'

import type { ContextBase } from './ContextBase.js'
import type { Logger } from './Logger.js'
import type { ServiceClassTypes } from './ServiceClassTypes.js'
import type { ServiceHealthState } from './ServiceHealthState.js'

/**
 * The ServiceClass interface
 *
 * @group Service
 */
export interface ServiceClass<S extends ServiceClassTypes = ServiceClassTypes> {
	config: S['ConfigType']
	resources: S['Resources']

	/**
	 * Stop and destroy the current service
	 */
	destroy(): Promise<void>

	/**
	 * Start the service
	 */
	start(): Promise<void>

	/**
	 * Wrap the given function in an OpenTelemetry span.
	 * The span will be on same hierarchy level as the current span.
	 *
	 * @param name the name of the span
	 * @param opts the additional span options
	 * @param fn the function to be wrapped in span
	 * @param context the span context
	 */
	wrapInSpan<F>(name: string, opts: SpanOptions, fn: (span: Span) => Promise<F>, context?: Context): Promise<F>

	/**
	 * Start a new active opentelemetry span with given options.
	 * A active span will be below the current span in hierarchy
	 *
	 * @param name the name of the span
	 * @param opts the additional span options
	 * @param context the span context
	 * @param fn the function to be wrapped into the span
	 */
	startActiveSpan<F>(
		name: string,
		opts: SpanOptions,
		context: Context | undefined,
		fn: (span: Span) => Promise<F>,
	): Promise<F>

	/**
	 * get the opentelemetry tracer of the service
	 */
	getTracer(): Tracer

	/*
	 * Registers a new command for the service
	 * @param commandDefinition the service command definition
	 */
	/* commented out to prevent cycling deps
	registerCommand(
		commandDefinition: CommandDefinition<any, any, any, any, any, any, any, any, any, any, any, any, any>,
	): Promise<void>
*/
	/*
	 * Registers a new subscription for the service
	 * @param subscriptionDefinition the subscription definition
	 */
	/* commented out to prevent cycling deps
	registerSubscription(
		subscriptionDefinition: SubscriptionDefinition<any, any, any, any, any, any, any, any, any, any, any>,
	): Promise<void>
  */

	getContextFunctions(logger: Logger): ContextBase
	getServiceHealth(): Promise<ServiceHealthState>
	getPausedSubscriptionConsumerState(): Record<string, { pausedAt: number; reason: string }>
	resumeSubscriptionConsumer(registrationKey: string): Promise<void>
}
