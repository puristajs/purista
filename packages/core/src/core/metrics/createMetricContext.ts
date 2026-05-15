import type { StandardSchemaV1 } from '@standard-schema/spec'
import { UnhandledError } from '../Error/UnhandledError.impl.js'
import { StatusCode } from '../types/StatusCode.enum.js'
import { validateMetricAttributes } from './attributePolicy.js'
import type {
	PuristaMetricAttributes,
	PuristaMetricContext,
	PuristaMetricDefinition,
	PuristaMetricDefinitions,
	PuristaMetricsRecorder,
} from './types.js'

const isPromise = (value: unknown): value is Promise<unknown> =>
	typeof value === 'object' && value !== null && 'then' in value && typeof value.then === 'function'

const metricContextError = (message: string, data?: unknown) =>
	new UnhandledError(StatusCode.InternalServerError, message, data)

const validateDeclaredAttributes = (
	name: string,
	definition: PuristaMetricDefinition<any>,
	attributes?: unknown,
): PuristaMetricAttributes | undefined => {
	if (!definition.attributes) {
		if (attributes === undefined) {
			return undefined
		}

		throw metricContextError(`Metric "${name}" does not declare attributes`)
	}

	const result = definition.attributes['~standard'].validate(attributes)
	if (isPromise(result)) {
		throw metricContextError(`Metric "${name}" uses an asynchronous attribute schema`)
	}

	const syncResult = result as StandardSchemaV1.Result<unknown>
	if (Array.isArray(syncResult.issues) && syncResult.issues.length > 0) {
		throw metricContextError(`Metric "${name}" attributes failed validation`, syncResult.issues)
	}

	return validateMetricAttributes((syncResult as { value: Record<string, unknown> }).value).attributes
}

/**
 * Creates the typed handler-facing metric context for declared custom metrics.
 *
 * @example
 * ```ts
 * const metrics = createMetricContext(metricDefinitions, recorder)
 * metrics['app.orders.created'].add(1, { channel: 'web' })
 * ```
 */
export const createMetricContext = <Definitions extends PuristaMetricDefinitions>(
	definitions: Definitions,
	recorder: PuristaMetricsRecorder,
): PuristaMetricContext<Definitions> => {
	const context: Record<string, unknown> = {}

	for (const [name, definition] of Object.entries(definitions)) {
		if (definition.kind === 'histogram') {
			context[name] = {
				record(value: number, attributes?: unknown) {
					recorder.recordCustomMetric(name, definition, value, validateDeclaredAttributes(name, definition, attributes))
				},
			}
			continue
		}

		context[name] = {
			add(value: number, attributes?: unknown) {
				recorder.recordCustomMetric(name, definition, value, validateDeclaredAttributes(name, definition, attributes))
			},
		}
	}

	return context as PuristaMetricContext<Definitions>
}
