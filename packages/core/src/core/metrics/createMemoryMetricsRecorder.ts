import { mergeMetricAttributes } from './attributePolicy.js'
import { getFrameworkMetricDefinition } from './frameworkMetrics.js'
import type {
	MemoryMetricRecord,
	PuristaMetricAttributes,
	PuristaMetricDefinition,
	PuristaMetricsRecorder,
	PuristaMetricsRuntimeOptions,
} from './types.js'

/**
 * Memory recorder useful for deterministic unit tests.
 *
 * @example
 * ```ts
 * const recorder = createMemoryMetricsRecorder()
 * recorder.recordFrameworkMetric('purista.command.executions', 1)
 * expect(recorder.records).toHaveLength(1)
 * ```
 */
export const createMemoryMetricsRecorder = (
	options: PuristaMetricsRuntimeOptions = {},
): PuristaMetricsRecorder & { readonly records: MemoryMetricRecord[]; clear(): void } => {
	const records: MemoryMetricRecord[] = []
	const enabled = options.enabled ?? true
	const recordFrameworkMetrics = options.recordFrameworkMetrics ?? true
	const recordCustomMetrics = options.recordCustomMetrics ?? true

	const pushRecord = (
		name: string,
		definition: PuristaMetricDefinition<any>,
		value: number,
		attributes?: PuristaMetricAttributes,
	) => {
		const mergedAttributes = mergeMetricAttributes(options.defaultAttributes, attributes).attributes
		records.push({
			name,
			kind: definition.kind,
			value,
			attributes: mergedAttributes,
		})
	}

	return {
		get records() {
			return records
		},
		clear() {
			records.length = 0
		},
		recordFrameworkMetric(name, value, attributes) {
			if (!enabled || !recordFrameworkMetrics) {
				return
			}

			const definition = getFrameworkMetricDefinition(name)
			if (!definition) {
				return
			}

			pushRecord(name, definition, value, attributes)
		},
		recordCustomMetric(name, definition, value, attributes) {
			if (!enabled || !recordCustomMetrics) {
				return
			}

			pushRecord(name, definition, value, attributes)
		},
	}
}
