import type { PuristaMetricAttributes, PuristaMetricAttributeValue } from './types.js'

const ATTRIBUTE_KEY_PATTERN = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/
const FORBIDDEN_ATTRIBUTE_KEYS = new Set([
	'authorization',
	'cookie',
	'set_cookie',
	'password',
	'secret',
	'token',
	'api_key',
	'payload',
	'body',
	'headers',
	'prompt',
	'completion',
	'tool_args',
	'tool_result',
	'trace_id',
	'span_id',
	'correlation_id',
	'message_id',
	'job_id',
	'run_id',
	'session_id',
	'principal_id',
	'tenant_id',
])

/**
 * Checks whether a metric attribute key follows PURISTA's low-cardinality policy.
 *
 * @example
 * ```ts
 * isAllowedMetricAttributeKey('purista.command.name') // true
 * isAllowedMetricAttributeKey('trace_id') // false
 * ```
 */
export const isAllowedMetricAttributeKey = (key: string): boolean => {
	if (!ATTRIBUTE_KEY_PATTERN.test(key)) {
		return false
	}
	if (FORBIDDEN_ATTRIBUTE_KEYS.has(key)) {
		return false
	}
	if (key.endsWith('.id') || key.endsWith('_id')) {
		return false
	}

	return true
}

const isMetricAttributeValue = (value: unknown): value is PuristaMetricAttributeValue =>
	typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'

/**
 * Normalizes metric attributes by keeping only safe scalar attributes.
 *
 * @example
 * ```ts
 * const { attributes } = validateMetricAttributes({ channel: 'web', trace_id: 'drop' })
 * ```
 */
export const validateMetricAttributes = (
	attributes?: Record<string, unknown>,
): { attributes: PuristaMetricAttributes; droppedAttributeKeys: string[] } => {
	const safeAttributes: PuristaMetricAttributes = {}
	const droppedAttributeKeys: string[] = []

	for (const [key, value] of Object.entries(attributes ?? {})) {
		if (!isAllowedMetricAttributeKey(key) || !isMetricAttributeValue(value)) {
			droppedAttributeKeys.push(key)
			continue
		}

		safeAttributes[key] = value
	}

	return { attributes: safeAttributes, droppedAttributeKeys }
}

export const mergeMetricAttributes = (
	defaultAttributes?: PuristaMetricAttributes,
	attributes?: PuristaMetricAttributes,
): { attributes: PuristaMetricAttributes; droppedAttributeKeys: string[] } => {
	const merged = { ...(defaultAttributes ?? {}), ...(attributes ?? {}) }

	return validateMetricAttributes(merged)
}
