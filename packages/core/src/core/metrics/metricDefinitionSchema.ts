import type { SchemaObject } from 'openapi3-ts/oas31'
import { toJSONSchema } from '../../schema/index.js'
import { UnhandledError } from '../Error/UnhandledError.impl.js'
import { StatusCode } from '../types/StatusCode.enum.js'
import { isAllowedMetricAttributeKey } from './attributePolicy.js'
import { frameworkMetricDefinitions } from './frameworkMetrics.js'
import type { PuristaMetricDefinition } from './types.js'

const CUSTOM_METRIC_NAME_PATTERN = /^app\.[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/
const RESERVED_METRIC_PREFIXES = ['purista.', 'http.', 'messaging.', 'rpc.', 'gen_ai.', 'harness.', 'otel.']

const metricDefinitionError = (message: string, data?: unknown) =>
	new UnhandledError(StatusCode.InternalServerError, message, data)

const getSchemaProperties = (schema: SchemaObject): Record<string, unknown> => {
	if (schema.type === 'object' && schema.properties && typeof schema.properties === 'object') {
		return schema.properties as Record<string, unknown>
	}

	return {}
}

/**
 * Validates a custom application metric definition.
 *
 * @example
 * ```ts
 * await validateMetricDefinition('app.orders.created', {
 *   kind: 'counter',
 *   unit: '{order}',
 *   description: 'Created orders',
 * })
 * ```
 */
export const validateMetricDefinition = async (
	name: string,
	definition: PuristaMetricDefinition<any>,
	knownMetricNames: Iterable<string> = [],
): Promise<void> => {
	if (!CUSTOM_METRIC_NAME_PATTERN.test(name)) {
		throw metricDefinitionError(`Invalid custom metric name "${name}"`)
	}
	if (RESERVED_METRIC_PREFIXES.some(prefix => name.startsWith(prefix) && prefix !== 'app.')) {
		throw metricDefinitionError(`Metric name "${name}" uses a reserved prefix`)
	}
	if (name in frameworkMetricDefinitions) {
		throw metricDefinitionError(`Metric name "${name}" collides with a framework metric`)
	}
	if ([...knownMetricNames].filter(metricName => metricName === name).length > 0) {
		throw metricDefinitionError(`Duplicate metric name "${name}"`)
	}
	if (!['counter', 'upDownCounter', 'histogram'].includes(definition.kind)) {
		throw metricDefinitionError(`Unsupported metric kind for "${name}"`)
	}
	if (!definition.description?.trim()) {
		throw metricDefinitionError(`Metric "${name}" requires a description`)
	}
	if (!definition.unit?.trim()) {
		throw metricDefinitionError(`Metric "${name}" requires a unit`)
	}

	if (!definition.attributes) {
		return
	}

	const jsonSchema = await toJSONSchema(definition.attributes, { mode: 'input' })
	const attributeKeys = Object.keys(getSchemaProperties(jsonSchema))
	if (attributeKeys.length > 8) {
		throw metricDefinitionError(`Metric "${name}" declares more than 8 attributes`)
	}

	const forbiddenAttributeKeys = attributeKeys.filter(key => !isAllowedMetricAttributeKey(key))
	if (forbiddenAttributeKeys.length > 0) {
		throw metricDefinitionError(`Metric "${name}" declares forbidden attribute keys`, { forbiddenAttributeKeys })
	}
}

/**
 * Validates multiple custom metric definitions as one registry.
 *
 * @example
 * ```ts
 * await validateMetricDefinitions({ 'app.orders.created': definition })
 * ```
 */
export const validateMetricDefinitions = async (
	definitions: Record<string, PuristaMetricDefinition<any>>,
): Promise<void> => {
	const seen = new Set<string>()
	for (const [name, definition] of Object.entries(definitions)) {
		await validateMetricDefinition(name, definition, seen)
		seen.add(name)
	}
}
