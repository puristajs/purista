import type { Counter, Histogram, Meter, UpDownCounter } from '@opentelemetry/api'
import { metrics } from '@opentelemetry/api'
import { mergeMetricAttributes } from './attributePolicy.js'
import { getFrameworkMetricDefinition } from './frameworkMetrics.js'
import type {
	PuristaMetricDefinition,
	PuristaMetricsRecorder as PuristaMetricsRecorderInterface,
	PuristaMetricsRuntimeOptions,
} from './types.js'

type Instrument = Counter | UpDownCounter | Histogram

const noopInstrument = {
	add: () => {},
	record: () => {},
} as Counter & Histogram & UpDownCounter

/**
 * OpenTelemetry API backed PURISTA metrics recorder.
 *
 * The recorder depends only on `@opentelemetry/api`. Applications provide the
 * actual MeterProvider and exporters at runtime.
 *
 * @example
 * ```ts
 * const recorder = new PuristaMetricsRecorder({
 *   defaultAttributes: { 'purista.service.name': 'orders' },
 * })
 * recorder.recordFrameworkMetric('purista.command.executions', 1, {
 *   'purista.command.name': 'createOrder',
 * })
 * ```
 */
export class PuristaMetricsRecorder implements PuristaMetricsRecorderInterface {
	readonly #meter: Meter
	readonly #enabled: boolean
	readonly #recordFrameworkMetrics: boolean
	readonly #recordCustomMetrics: boolean
	readonly #defaultAttributes: PuristaMetricsRuntimeOptions['defaultAttributes']
	readonly #instruments = new Map<string, Instrument>()

	constructor(options: PuristaMetricsRuntimeOptions = {}) {
		this.#meter = options.meter ?? metrics.getMeter('purista')
		this.#enabled = options.enabled ?? true
		this.#recordFrameworkMetrics = options.recordFrameworkMetrics ?? true
		this.#recordCustomMetrics = options.recordCustomMetrics ?? true
		this.#defaultAttributes = options.defaultAttributes
	}

	recordFrameworkMetric(name: string, value: number, attributes?: Record<string, string | number | boolean>): void {
		if (!this.#enabled || !this.#recordFrameworkMetrics) {
			return
		}

		const definition = getFrameworkMetricDefinition(name)
		if (!definition) {
			return
		}

		this.#record(name, definition, value, attributes)
	}

	recordCustomMetric(
		name: string,
		definition: PuristaMetricDefinition<any>,
		value: number,
		attributes?: Record<string, string | number | boolean>,
	): void {
		if (!this.#enabled || !this.#recordCustomMetrics) {
			return
		}

		this.#record(name, definition, value, attributes)
	}

	#record(
		name: string,
		definition: PuristaMetricDefinition<any>,
		value: number,
		attributes?: Record<string, string | number | boolean>,
	) {
		const metricAttributes = mergeMetricAttributes(this.#defaultAttributes, attributes).attributes
		const instrument = this.#getInstrument(name, definition)

		try {
			if (definition.kind === 'histogram') {
				;(instrument as Histogram).record(value, metricAttributes)
				return
			}

			;(instrument as Counter | UpDownCounter).add(value, metricAttributes)
		} catch {
			return
		}
	}

	#getInstrument(name: string, definition: PuristaMetricDefinition<any>): Instrument {
		const existing = this.#instruments.get(name)
		if (existing) {
			return existing
		}

		let instrument: Instrument
		try {
			if (definition.kind === 'histogram') {
				instrument = this.#meter.createHistogram(name, {
					description: definition.description,
					unit: definition.unit,
				})
			} else if (definition.kind === 'upDownCounter') {
				instrument = this.#meter.createUpDownCounter(name, {
					description: definition.description,
					unit: definition.unit,
				})
			} else {
				instrument = this.#meter.createCounter(name, {
					description: definition.description,
					unit: definition.unit,
				})
			}
		} catch {
			instrument = noopInstrument
		}

		this.#instruments.set(name, instrument)
		return instrument
	}
}
