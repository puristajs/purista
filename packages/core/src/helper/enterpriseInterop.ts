import type { SchemaObject } from 'openapi3-ts/oas31'
import type { EventBridgeCapabilities } from '../core/EventBridge/types/EventBridgeCapabilities.js'
import type { QueueBridgeCapabilities } from '../core/QueueBridge/types/QueueBridgeCapabilities.js'
import type { CustomMessage } from '../core/types/CustomMessage.js'
import { EBMessageType } from '../core/types/EBMessageType.enum.js'
import type { QueueResultPolicy } from '../core/types/queue/QueueResultPolicy.js'
import type { ScheduleDefinition } from '../core/types/schedule/index.js'
import { puristaVersion } from '../version.js'
import { validationToSchema } from '../zodOpenApi/validationToSchema.js'
import type { FullDefinition } from './types/FullDefinition.js'
import type { FullServiceDefinition } from './types/FullServiceDefinition.js'

type JsonRecord = Record<string, unknown>

export type ServiceContractInput = FullDefinition | FullServiceDefinition

export type ExportAsyncApiOptions = {
	title: string
	version: string
	services: ServiceContractInput
}

export type ExportScheduleManifestOptions = {
	title?: string
	version: string
	services: ServiceContractInput
}

export type RuntimeBridgeCapabilities<TCapabilities> = {
	name: string
	capabilities?: TCapabilities
}

export type RuntimeCapabilityReportMode = 'definition-only' | 'runtime-inspect'

export type ExportRuntimeCapabilitiesOptions = {
	mode?: RuntimeCapabilityReportMode
	eventBridge?: RuntimeBridgeCapabilities<EventBridgeCapabilities>
	queueBridge?: RuntimeBridgeCapabilities<QueueBridgeCapabilities>
}

export type CloudEvent = {
	specversion: '1.0'
	id: string
	source: string
	type: string
	time?: string
	datacontenttype?: string
	data?: unknown
	[key: string]: unknown
}

export type FromCloudEventOptions = {
	mode: 'strict' | 'compat'
}

const isFullDefinition = (input: ServiceContractInput): input is FullDefinition =>
	'services' in input && 'version' in input

const getServices = (input: ServiceContractInput): FullServiceDefinition =>
	isFullDefinition(input) ? input.services : input

const sortEntries = <T>(input: Record<string, T> | undefined): [string, T][] =>
	Object.entries(input ?? {}).sort(([a], [b]) => a.localeCompare(b))

const omitUndefined = <T>(input: T): T => {
	if (Array.isArray(input)) {
		return input.map(item => omitUndefined(item)) as T
	}
	if (!input || typeof input !== 'object') {
		return input
	}

	const result: JsonRecord = {}
	for (const [key, value] of Object.entries(input as JsonRecord).sort(([a], [b]) => a.localeCompare(b))) {
		if (value !== undefined) {
			result[key] = omitUndefined(value)
		}
	}
	return result as T
}

const schemaOrUndefined = async (schema: unknown): Promise<SchemaObject | undefined> => {
	if (!schema) {
		return undefined
	}
	if (
		typeof schema === 'object' &&
		('type' in schema || '$ref' in schema || 'properties' in schema || 'oneOf' in schema)
	) {
		return schema as SchemaObject
	}
	return validationToSchema(schema as never)
}

const channelId = (...parts: string[]) =>
	parts
		.join('.')
		.replace(/[^a-zA-Z0-9._-]/g, '_')
		.replace(/_{2,}/g, '_')

const ref = (path: string) => ({ $ref: path })

const getCommandPayloadSchema = (command: JsonRecord) =>
	(command.metadata as { expose?: { inputPayload?: SchemaObject } } | undefined)?.expose?.inputPayload

const getCommandOutputSchema = (command: JsonRecord) =>
	(command.metadata as { expose?: { outputPayload?: SchemaObject } } | undefined)?.expose?.outputPayload

const getSubscriptionPayloadSchema = (subscription: JsonRecord) =>
	(subscription.metadata as { expose?: { inputPayload?: SchemaObject } } | undefined)?.expose?.inputPayload

const getStreamChunkSchema = (stream: JsonRecord) =>
	(stream.metadata as { expose?: { chunkPayload?: SchemaObject } } | undefined)?.expose?.chunkPayload

const getStreamFinalSchema = (stream: JsonRecord) =>
	(stream.metadata as { expose?: { finalPayload?: SchemaObject } } | undefined)?.expose?.finalPayload

const addMessage = (messages: JsonRecord, name: string, title: string, payload?: SchemaObject, extra?: JsonRecord) => {
	messages[name] = omitUndefined({
		name,
		title,
		headers: ref('#/components/schemas/PuristaHeaders'),
		payload,
		...extra,
	})
}

/**
 * Export service definitions as a provider-neutral AsyncAPI 3 document.
 *
 * The helper only reads PURISTA definitions and never starts services, brokers,
 * HTTP servers, or cloud adapters.
 *
 * @example
 * ```ts
 * const document = await exportAsyncApi({
 *   title: 'Billing contracts',
 *   version: '1.0.0',
 *   services: exportedDefinitions,
 * })
 * ```
 */
export const exportAsyncApi = async (options: ExportAsyncApiOptions) => {
	const services = getServices(options.services)
	const channels: JsonRecord = {}
	const operations: JsonRecord = {}
	const messages: JsonRecord = {}

	for (const [serviceName, versions] of sortEntries(services)) {
		for (const [serviceVersion, definition] of sortEntries(versions)) {
			for (const [commandName, command] of sortEntries(definition.commands)) {
				const requestChannelId = channelId(serviceName, serviceVersion, 'command', commandName, 'request')
				const responseEventName = command.eventName
				addMessage(
					messages,
					`${requestChannelId}.message`,
					`${commandName} command request`,
					getCommandPayloadSchema(command),
				)
				channels[requestChannelId] = {
					address: `purista/${serviceName}/${serviceVersion}/commands/${commandName}`,
					messages: { request: ref(`#/components/messages/${requestChannelId}.message`) },
					'x-purista': { serviceName, serviceVersion, commandName, kind: 'command' },
				}
				operations[`${requestChannelId}.receive`] = {
					action: 'receive',
					channel: ref(`#/channels/${requestChannelId}`),
					messages: [ref(`#/components/messages/${requestChannelId}.message`)],
				}

				if (responseEventName) {
					const responseChannelId = channelId('event', responseEventName)
					addMessage(
						messages,
						`${responseChannelId}.message`,
						`${responseEventName} event`,
						getCommandOutputSchema(command),
						{ 'x-purista': { producedBy: { serviceName, serviceVersion, commandName } } },
					)
					channels[responseChannelId] = {
						address: responseEventName,
						messages: { event: ref(`#/components/messages/${responseChannelId}.message`) },
						'x-purista': { eventName: responseEventName, kind: 'event' },
					}
					operations[`${responseChannelId}.send`] = {
						action: 'send',
						channel: ref(`#/channels/${responseChannelId}`),
						messages: [ref(`#/components/messages/${responseChannelId}.message`)],
					}
				}
			}

			for (const [subscriptionName, subscription] of sortEntries(definition.subscriptions)) {
				if (!subscription.eventName) {
					continue
				}
				const eventChannelId = channelId('event', subscription.eventName)
				addMessage(
					messages,
					`${eventChannelId}.message`,
					`${subscription.eventName} event`,
					getSubscriptionPayloadSchema(subscription),
				)
				channels[eventChannelId] = channels[eventChannelId] ?? {
					address: subscription.eventName,
					messages: { event: ref(`#/components/messages/${eventChannelId}.message`) },
					'x-purista': { eventName: subscription.eventName, kind: 'event' },
				}
				operations[channelId(serviceName, serviceVersion, 'subscription', subscriptionName, 'receive')] = {
					action: 'receive',
					channel: ref(`#/channels/${eventChannelId}`),
					messages: [ref(`#/components/messages/${eventChannelId}.message`)],
					'x-purista': { serviceName, serviceVersion, subscriptionName },
				}
			}

			for (const [streamName, stream] of sortEntries(definition.streams)) {
				const streamChannelId = channelId(serviceName, serviceVersion, 'stream', streamName)
				addMessage(messages, `${streamChannelId}.chunk`, `${streamName} stream chunk`, getStreamChunkSchema(stream))
				addMessage(messages, `${streamChannelId}.final`, `${streamName} stream final`, getStreamFinalSchema(stream))
				channels[streamChannelId] = {
					address: `purista/${serviceName}/${serviceVersion}/streams/${streamName}`,
					messages: {
						chunk: ref(`#/components/messages/${streamChannelId}.chunk`),
						final: ref(`#/components/messages/${streamChannelId}.final`),
					},
					'x-purista': { serviceName, serviceVersion, streamName, kind: 'stream' },
				}
				operations[`${streamChannelId}.receive`] = {
					action: 'receive',
					channel: ref(`#/channels/${streamChannelId}`),
					messages: [
						ref(`#/components/messages/${streamChannelId}.chunk`),
						ref(`#/components/messages/${streamChannelId}.final`),
					],
				}
			}

			for (const [queueName, queue] of sortEntries(definition.queues)) {
				const queueChannelId = channelId('queue', queueName)
				const payload = await schemaOrUndefined(queue.payloadSchema)
				addMessage(messages, `${queueChannelId}.job`, `${queueName} queue job`, payload)
				channels[queueChannelId] = {
					address: queueName,
					messages: { job: ref(`#/components/messages/${queueChannelId}.job`) },
					'x-purista': {
						serviceName,
						serviceVersion,
						queueName,
						kind: 'queue',
						resultPolicy: serializeResultPolicy(queue.resultPolicy),
					},
				}
				operations[`${queueChannelId}.send`] = {
					action: 'send',
					channel: ref(`#/channels/${queueChannelId}`),
					messages: [ref(`#/components/messages/${queueChannelId}.job`)],
				}
				operations[`${queueChannelId}.receive`] = {
					action: 'receive',
					channel: ref(`#/channels/${queueChannelId}`),
					messages: [ref(`#/components/messages/${queueChannelId}.job`)],
				}
			}

			for (const binding of definition.eventToQueueBindings ?? []) {
				const eventChannelId = channelId('event', binding.eventName)
				const queueChannelId = channelId('queue', binding.queueName)
				operations[channelId('binding', binding.eventName, binding.queueName)] = {
					action: 'receive',
					channel: ref(`#/channels/${eventChannelId}`),
					reply: { channel: ref(`#/channels/${queueChannelId}`) },
					'x-purista': {
						kind: 'event-to-queue-binding',
						eventName: binding.eventName,
						queueName: binding.queueName,
						idempotencyMode: binding.idempotencyMode,
						idempotencyKey: typeof binding.idempotencyKey === 'function' ? 'function' : binding.idempotencyKey,
					},
				}
			}
		}
	}

	return omitUndefined({
		asyncapi: '3.0.0',
		info: { title: options.title, version: options.version },
		defaultContentType: 'application/json',
		channels,
		operations,
		components: {
			messages,
			schemas: {
				PuristaHeaders: {
					type: 'object',
					properties: {
						traceId: { type: 'string' },
						correlationId: { type: 'string' },
						tenantId: { type: 'string' },
						principalId: { type: 'string' },
						messageId: { type: 'string' },
						timestamp: { type: 'number' },
						contentType: { type: 'string' },
						contentEncoding: { type: 'string' },
					},
				},
			},
		},
		'x-purista': { version: puristaVersion },
	})
}

const serializeResultPolicy = (policy?: QueueResultPolicy) => {
	if (!policy) {
		return undefined
	}
	return {
		...policy,
		eventId: typeof policy.eventId === 'function' ? 'function' : policy.eventId,
	}
}

/**
 * Export provider-neutral schedule metadata from service definitions.
 *
 * @example
 * ```ts
 * const manifest = await exportScheduleManifest({
 *   title: 'Billing schedules',
 *   version: '1.0.0',
 *   services: exportedDefinitions,
 * })
 * ```
 */
export const exportScheduleManifest = async (options: ExportScheduleManifestOptions) => {
	const schedules: JsonRecord[] = []
	for (const [serviceName, versions] of sortEntries(getServices(options.services))) {
		for (const [serviceVersion, definition] of sortEntries(versions)) {
			for (const [, schedule] of sortEntries(definition.schedules)) {
				schedules.push(await serializeSchedule(schedule, serviceName, serviceVersion))
			}
		}
	}

	return omitUndefined({
		title: options.title,
		version: options.version,
		schedules: schedules.sort((a, b) => String(a.name).localeCompare(String(b.name))),
	})
}

const serializeSchedule = async (schedule: ScheduleDefinition, serviceName: string, serviceVersion: string) =>
	omitUndefined({
		name: schedule.name,
		description: schedule.description,
		targetKind: schedule.targetKind,
		targetServiceName: schedule.targetServiceName ?? serviceName,
		targetServiceVersion: schedule.targetServiceVersion ?? serviceVersion,
		targetName: schedule.targetName,
		payloadSchema: await schemaOrUndefined(schedule.payloadSchema),
		parameterSchema: await schemaOrUndefined(schedule.parameterSchema),
		expression: schedule.expression,
		timezone: schedule.timezone,
		concurrencyPolicy: schedule.concurrencyPolicy,
		missedRunPolicy: schedule.missedRunPolicy,
		maxCatchUpCount: schedule.maxCatchUpCount,
		jitterWindowMs: schedule.jitterWindowMs,
		idempotencyKey: schedule.idempotencyKey,
		enabledByDefault: schedule.enabledByDefault,
		providerHints: schedule.providerHints,
	})

/**
 * Export a normalized runtime capability report from bridge declarations.
 *
 * Definition-only mode is pure data transformation. Runtime inspection can pass
 * already-instantiated adapter capability objects without requiring this helper
 * to connect to infrastructure.
 */
export const exportRuntimeCapabilities = (options: ExportRuntimeCapabilitiesOptions) => {
	const mode = options.mode ?? 'definition-only'
	return omitUndefined({
		version: '1.0.0',
		mode,
		eventBridge: options.eventBridge
			? {
					name: options.eventBridge.name,
					capabilities: options.eventBridge.capabilities,
				}
			: undefined,
		queueBridge: options.queueBridge
			? {
					name: options.queueBridge.name,
					capabilities: options.queueBridge.capabilities,
					longRunning: options.queueBridge.capabilities
						? {
								leaseExtension: true,
								leaseInspection: options.queueBridge.capabilities.leaseInspectionSupported,
								strictStartupValidation: options.queueBridge.capabilities.strictStartupValidation,
							}
						: undefined,
					idempotency: options.queueBridge.capabilities
						? {
								enforced: options.queueBridge.capabilities.idempotencyEnforcement,
								exactlyOnce: options.queueBridge.capabilities.exactlyOnce,
							}
						: undefined,
					resultPolicies: options.queueBridge.capabilities
						? {
								event: true,
								state: false,
								stateAndEvent: false,
							}
						: undefined,
				}
			: undefined,
	})
}

/**
 * Convert a PURISTA custom event message to a CloudEvents 1.0 structured object.
 *
 * @example
 * ```ts
 * const event = toCloudEvent(puristaMessage)
 * ```
 */
export const toCloudEvent = <Payload>(message: CustomMessage<Payload>): CloudEvent =>
	omitUndefined({
		specversion: '1.0',
		id: message.id,
		source: `/purista/${message.sender.serviceName}/${message.sender.serviceVersion}/${message.sender.serviceTarget}`,
		type: message.eventName,
		time: new Date(message.timestamp).toISOString(),
		datacontenttype: message.contentType,
		data: message.payload,
		traceid: message.traceId,
		correlationid: message.correlationId,
		tenantid: message.tenantId,
		principalid: message.principalId,
		serviceName: message.sender.serviceName,
		serviceVersion: message.sender.serviceVersion,
		serviceTarget: message.sender.serviceTarget,
		instanceId: message.sender.instanceId,
		contentencoding: message.contentEncoding,
		otp: message.otp,
	})

/**
 * Convert a CloudEvents 1.0 object into a PURISTA custom event message.
 *
 * Strict mode requires PURISTA sender extension metadata. Compat mode accepts
 * external CloudEvents and derives explicit external sender defaults.
 */
export const fromCloudEvent = <Payload = unknown>(
	cloudEvent: CloudEvent | JsonRecord,
	options: FromCloudEventOptions,
): CustomMessage<Payload> => {
	const required = ['specversion', 'id', 'source', 'type']
	for (const key of required) {
		if (!cloudEvent[key]) {
			throw new Error(`CloudEvent is missing required attribute "${key}"`)
		}
	}
	if (cloudEvent.specversion !== '1.0') {
		throw new Error('Only CloudEvents specversion "1.0" is supported')
	}

	const serviceName = cloudEvent.serviceName
	const serviceVersion = cloudEvent.serviceVersion
	const serviceTarget = cloudEvent.serviceTarget
	const instanceId = cloudEvent.instanceId
	if (options.mode === 'strict') {
		for (const [key, value] of Object.entries({ serviceName, serviceVersion, serviceTarget, instanceId })) {
			if (typeof value !== 'string' || value.trim() === '') {
				throw new Error(`CloudEvent is missing PURISTA ${key} extension`)
			}
		}
	}

	return omitUndefined({
		id: String(cloudEvent.id),
		timestamp: cloudEvent.time ? Date.parse(String(cloudEvent.time)) : 0,
		contentType: typeof cloudEvent.datacontenttype === 'string' ? cloudEvent.datacontenttype : 'application/json',
		contentEncoding: typeof cloudEvent.contentencoding === 'string' ? cloudEvent.contentencoding : 'utf-8',
		messageType: EBMessageType.CustomMessage,
		correlationId: typeof cloudEvent.correlationid === 'string' ? cloudEvent.correlationid : undefined,
		traceId: typeof cloudEvent.traceid === 'string' ? cloudEvent.traceid : undefined,
		principalId: typeof cloudEvent.principalid === 'string' ? cloudEvent.principalid : undefined,
		tenantId: typeof cloudEvent.tenantid === 'string' ? cloudEvent.tenantid : undefined,
		eventName: String(cloudEvent.type),
		otp: typeof cloudEvent.otp === 'string' ? cloudEvent.otp : undefined,
		sender: {
			serviceName: typeof serviceName === 'string' && serviceName ? serviceName : 'external',
			serviceVersion: typeof serviceVersion === 'string' && serviceVersion ? serviceVersion : '0',
			serviceTarget: typeof serviceTarget === 'string' && serviceTarget ? serviceTarget : String(cloudEvent.type),
			instanceId: typeof instanceId === 'string' && instanceId ? instanceId : 'external',
		},
		payload: cloudEvent.data as Payload,
	}) as CustomMessage<Payload>
}

export const exportCloudEventsSchema = () => ({
	$schema: 'https://json-schema.org/draft/2020-12/schema',
	title: 'PURISTA CloudEvents Mapping',
	type: 'object',
	required: ['specversion', 'id', 'source', 'type'],
	properties: {
		specversion: { const: '1.0' },
		id: { type: 'string' },
		source: { type: 'string' },
		type: { type: 'string' },
		time: { type: 'string', format: 'date-time' },
		datacontenttype: { type: 'string' },
		data: true,
		serviceName: { type: 'string' },
		serviceVersion: { type: 'string' },
		serviceTarget: { type: 'string' },
		instanceId: { type: 'string' },
		traceid: { type: 'string' },
		correlationid: { type: 'string' },
		tenantid: { type: 'string' },
		principalid: { type: 'string' },
		contentencoding: { type: 'string' },
	},
})
