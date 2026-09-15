import { randomUUID } from 'node:crypto'

import type { JsonValue } from '@purista/harness'
import type { StandardJSONSchemaV1, StandardSchemaV1 } from '@standard-schema/spec'

import type { HarnessEventBridgeInvokeParameter } from './invokeTypes.js'

/** @internal Closed serializable parameter stored with one Harness queue job. */
export type HarnessQueueDeliveryEnvelope = Readonly<{
	schemaVersion: 1
	invocationId: string
	sessionId: string
	parameter: Omit<HarnessEventBridgeInvokeParameter, 'sessionId'>
}>

/** @internal Authenticated root identity restored by the generated queue worker. */
export type HarnessQueueInvocationIdentity = Readonly<{
	invocationId: string
	sessionId: string
}>

const restoredInvocationIdentities = new WeakMap<object, HarnessQueueInvocationIdentity>()
const deliveryEnvelopeJsonSchema = Object.freeze({
	type: 'object',
	additionalProperties: false,
	required: ['schemaVersion', 'invocationId', 'sessionId', 'parameter'],
	properties: {
		schemaVersion: { const: 1 },
		invocationId: { type: 'string', minLength: 1 },
		sessionId: { type: 'string', minLength: 1 },
		parameter: {
			type: 'object',
			additionalProperties: false,
			properties: {
				idempotencyKey: { type: 'string', minLength: 1 },
				timeoutMs: { anyOf: [{ const: false }, { type: 'integer', minimum: 1 }] },
				metadata: { type: 'object' },
				durable: { type: 'object' },
				resume: { type: 'object' },
			},
		},
	},
})

/** @internal Standard Schema used by the generated native queue definition. */
export const harnessQueueDeliveryEnvelopeSchema: StandardSchemaV1<
	HarnessQueueDeliveryEnvelope,
	HarnessQueueDeliveryEnvelope
> &
	StandardJSONSchemaV1 = {
	'~standard': {
		version: 1,
		vendor: 'purista',
		validate(value) {
			try {
				return { value: requireHarnessQueueDeliveryEnvelope(value) }
			} catch {
				return { issues: [{ message: 'Harness queue delivery envelope is invalid.' }] }
			}
		},
		types: undefined as unknown as {
			input: HarnessQueueDeliveryEnvelope
			output: HarnessQueueDeliveryEnvelope
		},
		jsonSchema: {
			input: () => deliveryEnvelopeJsonSchema,
			output: () => deliveryEnvelopeJsonSchema,
		},
	},
}

/**
 * Create the reserved, serializable parameter stored with one Harness queue job.
 *
 * @internal The public enqueue client owns creation before writing to a queue;
 * workers only validate and consume this closed envelope.
 */
export function createHarnessQueueDeliveryEnvelope(
	parameter: HarnessEventBridgeInvokeParameter = {},
	invocationId: string = randomUUID(),
): HarnessQueueDeliveryEnvelope {
	if (!nonempty(invocationId)) throw invalidDeliveryEnvelope()
	assertPlainFields(parameter, [], ['sessionId', 'idempotencyKey', 'timeoutMs', 'metadata', 'durable', 'resume'])
	if (parameter.resume !== undefined && parameter.idempotencyKey !== undefined) throw invalidDeliveryEnvelope()
	if (
		parameter.timeoutMs !== undefined &&
		parameter.timeoutMs !== false &&
		(!Number.isSafeInteger(parameter.timeoutMs) || parameter.timeoutMs <= 0)
	) {
		throw invalidDeliveryEnvelope()
	}
	const { sessionId: requestedSessionId, ...invocationParameter } = parameter
	const sessionId = requestedSessionId ?? invocationId
	if (!nonempty(sessionId)) throw invalidDeliveryEnvelope()
	const serializableParameter = freezeJson(invocationParameter) as Omit<HarnessEventBridgeInvokeParameter, 'sessionId'>
	return Object.freeze({
		schemaVersion: 1,
		invocationId,
		sessionId,
		parameter: serializableParameter,
	})
}

/** @internal Validate one envelope after queue transport serialization. */
export function requireHarnessQueueDeliveryEnvelope(value: unknown): HarnessQueueDeliveryEnvelope {
	assertPlainFields(value, ['schemaVersion', 'invocationId', 'sessionId', 'parameter'])
	const envelope = value as Record<string, unknown>
	if (envelope.schemaVersion !== 1 || !nonempty(envelope.invocationId) || !nonempty(envelope.sessionId)) {
		throw invalidDeliveryEnvelope()
	}
	assertPlainFields(envelope.parameter, [], ['idempotencyKey', 'timeoutMs', 'metadata', 'durable', 'resume'])
	const parameter = envelope.parameter as Record<string, unknown>
	if (Object.hasOwn(parameter, 'resume') && Object.hasOwn(parameter, 'idempotencyKey')) throw invalidDeliveryEnvelope()
	if (
		parameter.timeoutMs !== undefined &&
		parameter.timeoutMs !== false &&
		(!Number.isSafeInteger(parameter.timeoutMs) || Number(parameter.timeoutMs) <= 0)
	) {
		throw invalidDeliveryEnvelope()
	}
	if (parameter.idempotencyKey !== undefined && !nonempty(parameter.idempotencyKey)) throw invalidDeliveryEnvelope()
	assertJson(parameter)
	return value as HarnessQueueDeliveryEnvelope
}

/**
 * Restore public invocation options plus private queue-authenticated identity.
 *
 * @internal The returned frozen object is the only value recognized by
 * `readHarnessQueueInvocationIdentity`.
 */
export function createHarnessQueueDeliveryInvokeParameter(
	value: HarnessQueueDeliveryEnvelope,
): HarnessEventBridgeInvokeParameter {
	const envelope = requireHarnessQueueDeliveryEnvelope(value)
	const parameter = Object.freeze({ ...envelope.parameter, sessionId: envelope.sessionId })
	restoredInvocationIdentities.set(
		parameter,
		Object.freeze({ invocationId: envelope.invocationId, sessionId: envelope.sessionId }),
	)
	return parameter
}

/** @internal Read identity only from an exact worker-restored options object. */
export function readHarnessQueueInvocationIdentity(
	parameter: HarnessEventBridgeInvokeParameter,
): HarnessQueueInvocationIdentity | undefined {
	return typeof parameter === 'object' && parameter !== null ? restoredInvocationIdentities.get(parameter) : undefined
}

function assertPlainFields(value: unknown, required: readonly string[], optional: readonly string[] = []): void {
	if (!value || typeof value !== 'object' || Array.isArray(value)) throw invalidDeliveryEnvelope()
	const prototype = Object.getPrototypeOf(value)
	if (prototype !== Object.prototype && prototype !== null) throw invalidDeliveryEnvelope()
	const keys = Object.keys(value)
	if (
		required.some(key => !Object.hasOwn(value, key)) ||
		keys.some(key => !required.includes(key) && !optional.includes(key))
	) {
		throw invalidDeliveryEnvelope()
	}
}

function nonempty(value: unknown): value is string {
	return typeof value === 'string' && value.trim() !== ''
}

function invalidDeliveryEnvelope(): TypeError {
	return new TypeError('Harness queue delivery envelope is invalid.')
}

function assertJson(value: unknown): asserts value is JsonValue {
	if (value === null || typeof value === 'string' || typeof value === 'boolean') return
	if (typeof value === 'number') {
		if (Number.isFinite(value)) return
		throw invalidDeliveryEnvelope()
	}
	if (Array.isArray(value)) {
		for (const item of value) assertJson(item)
		return
	}
	if (value && typeof value === 'object') {
		const prototype = Object.getPrototypeOf(value)
		if (prototype !== Object.prototype && prototype !== null) throw invalidDeliveryEnvelope()
		for (const item of Object.values(value)) assertJson(item)
		return
	}
	throw invalidDeliveryEnvelope()
}

function freezeJson(value: unknown): JsonValue {
	assertJson(value)
	if (Array.isArray(value)) return Object.freeze(value.map(item => freezeJson(item))) as unknown as JsonValue
	if (value && typeof value === 'object') {
		return Object.freeze(Object.fromEntries(Object.entries(value).map(([key, item]) => [key, freezeJson(item)])))
	}
	return value
}
