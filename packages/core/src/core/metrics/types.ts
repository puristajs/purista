import type { Meter } from '@opentelemetry/api'
import type { InferIn, Schema } from '../../schema/index.js'

/**
 * Supported PURISTA metric instrument kinds.
 *
 * @example
 * ```ts
 * const kind: PuristaMetricKind = 'counter'
 * ```
 */
export type PuristaMetricKind = 'counter' | 'upDownCounter' | 'histogram'

/**
 * Scalar metric attribute value accepted by PURISTA.
 *
 * @example
 * ```ts
 * const attributes: PuristaMetricAttributes = { channel: 'web', retries: 1, cached: false }
 * ```
 */
export type PuristaMetricAttributeValue = string | number | boolean

/**
 * Attribute map accepted by PURISTA metrics after low-cardinality policy checks.
 *
 * @example
 * ```ts
 * const attributes: PuristaMetricAttributes = { 'purista.service.name': 'orders' }
 * ```
 */
export type PuristaMetricAttributes = Record<string, PuristaMetricAttributeValue>

/**
 * Declares one framework or application metric.
 *
 * @example
 * ```ts
 * const createdOrders = {
 *   kind: 'counter',
 *   unit: '{order}',
 *   description: 'Created orders',
 * } satisfies PuristaMetricDefinition
 * ```
 */
export interface PuristaMetricDefinition<AttributesSchema = undefined> {
	kind: PuristaMetricKind
	description: string
	unit: string
	attributes?: AttributesSchema
}

/**
 * Named metric definitions keyed by their metric name.
 *
 * @example
 * ```ts
 * const metrics = {
 *   'app.orders.created': { kind: 'counter', unit: '{order}', description: 'Created orders' },
 * } satisfies PuristaMetricDefinitions
 * ```
 */
export type PuristaMetricDefinitions = Record<string, PuristaMetricDefinition<any>>

/**
 * Infers the attribute input type for a metric definition.
 *
 * @example
 * ```ts
 * type Attributes = InferMetricAttributes<typeof metricDefinition>
 * ```
 */
export type InferMetricAttributes<Definition> =
	Definition extends PuristaMetricDefinition<infer AttributesSchema>
		? AttributesSchema extends Schema
			? InferIn<AttributesSchema>
			: undefined
		: never

/**
 * Method argument tuple for metric attributes.
 *
 * @example
 * ```ts
 * type Args = MetricAttributeArgs<{ channel: string }>
 * ```
 */
export type MetricAttributeArgs<Attributes> = [Attributes] extends [undefined] ? [] : [attributes: Attributes]

/**
 * Handler-facing metric handle. Counters use `add`; histograms use `record`.
 *
 * @example
 * ```ts
 * context.metrics['app.orders.created'].add(1, { channel: 'web' })
 * context.metrics['app.payment.capture.duration'].record(127)
 * ```
 */
export type PuristaMetricHandle<Definition> = Definition extends { kind: 'histogram' }
	? { record(value: number, ...args: MetricAttributeArgs<InferMetricAttributes<Definition>>): void }
	: { add(value: number, ...args: MetricAttributeArgs<InferMetricAttributes<Definition>>): void }

/**
 * Typed metric context exposed to handlers.
 *
 * @example
 * ```ts
 * type Metrics = PuristaMetricContext<typeof metricDefinitions>
 * ```
 */
export type PuristaMetricContext<Definitions extends PuristaMetricDefinitions> = {
	readonly [Name in keyof Definitions]: PuristaMetricHandle<Definitions[Name]>
}

/**
 * Runtime metrics options consumed by PURISTA recorders.
 *
 * @example
 * ```ts
 * const options: PuristaMetricsRuntimeOptions = {
 *   defaultAttributes: { 'purista.service.name': 'orders' },
 * }
 * ```
 */
export interface PuristaMetricsRuntimeOptions {
	enabled?: boolean
	meter?: Meter
	defaultAttributes?: PuristaMetricAttributes
	recordFrameworkMetrics?: boolean
	recordCustomMetrics?: boolean
}

/**
 * A provider-neutral recorder used by framework code and metric contexts.
 *
 * @example
 * ```ts
 * recorder.recordFrameworkMetric('purista.command.executions', 1, {
 *   'purista.command.name': 'createOrder',
 * })
 * ```
 */
export interface PuristaMetricsRecorder {
	recordFrameworkMetric(name: string, value: number, attributes?: PuristaMetricAttributes): void
	recordCustomMetric(
		name: string,
		definition: PuristaMetricDefinition<any>,
		value: number,
		attributes?: PuristaMetricAttributes,
	): void
}

/**
 * Deterministic metric record captured by the memory recorder.
 *
 * @example
 * ```ts
 * const first = recorder.records[0]
 * ```
 */
export interface MemoryMetricRecord {
	name: string
	kind: PuristaMetricKind
	value: number
	attributes: PuristaMetricAttributes
}

export type PuristaMetricRecord = MemoryMetricRecord

export type { Meter }
