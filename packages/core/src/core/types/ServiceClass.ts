import type { Context, Span, SpanOptions } from '@opentelemetry/api'
import type { Tracer } from '@opentelemetry/sdk-trace-node'

import type { EmptyObject } from './EmptyObject.js'
import type { CommandDefinition } from './commandType/index.js'
import type { SubscriptionDefinition } from './subscription/index.js'

/**
 * The ServiceClass interface
 *
 * @group Service
 */
export interface ServiceClass<ConfigType = unknown, Resources = EmptyObject> {
	config: ConfigType
	resources: Resources

	/**
	 * Stop and destroy the current service
	 */
	destroy(): Promise<void>

	/**
	 * Start the service
	 */
	start(): Promise<void>

	/**
	 * Wrap the given function in a opententelemetry span.
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

	/**
	 * Registers a new command for the service
	 * @param commandDefinition the service command definition
	 */
	registerCommand(commandDefinition: CommandDefinition): Promise<void>

	/**
	 * Registers a new subscription for the service
	 * @param subscriptionDefinition the subscription definition
	 */
	registerSubscription(subscriptionDefinition: SubscriptionDefinition): Promise<void>
}
