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

/**
 * JSON object shape used by provider export helpers for provider-native
 * manifest fragments.
 *
 * @example
 * ```ts
 * const annotations: JsonRecord = { 'purista.dev/source': 'billing' }
 * ```
 */
export type JsonRecord = Record<string, unknown>

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

export type ScheduleManifest = {
	title?: string
	version: string
	schedules: KubernetesCronJobScheduleInput[]
}

export type KubernetesCronJobScheduleInput = {
	name: string
	description?: string
	targetKind: string
	targetServiceName?: string
	targetServiceVersion?: string
	targetName: string
	payloadSchema?: SchemaObject
	parameterSchema?: SchemaObject
	expression: ScheduleDefinition['expression']
	timezone?: string
	concurrencyPolicy?: ScheduleDefinition['concurrencyPolicy']
	missedRunPolicy?: ScheduleDefinition['missedRunPolicy']
	maxCatchUpCount?: number
	jitterWindowMs?: number
	idempotencyKey?: string
	schedulerGroup?: string
	enabledByDefault?: boolean
	providerHints?: Record<string, unknown>
}

export type KubernetesCronJobTriggerTemplate = {
	image: string
	name?: string
	command?: string[]
	args?: string[]
	http?: {
		method?: string
		url: string
		headers?: Record<string, string>
		body?: unknown
	}
	env?: JsonRecord[]
	envFrom?: JsonRecord[]
	imagePullPolicy?: string
}

export type ExportKubernetesCronJobsOptions = {
	services?: ServiceContractInput
	manifest?: ScheduleManifest
	trigger: KubernetesCronJobTriggerTemplate
	namespace?: string
	labels?: Record<string, string>
	annotations?: Record<string, string>
	restartPolicy?: 'Never' | 'OnFailure'
}

export type KubernetesCronJobManifest = {
	apiVersion: 'batch/v1'
	kind: 'CronJob'
	metadata: {
		name: string
		namespace?: string
		labels?: Record<string, string>
		annotations: Record<string, string>
	}
	spec: JsonRecord & {
		schedule: string
		timeZone?: string
		concurrencyPolicy?: 'Allow' | 'Forbid' | 'Replace'
		suspend?: boolean
		jobTemplate: {
			spec: {
				template: {
					spec: {
						restartPolicy: 'Never' | 'OnFailure'
						containers: JsonRecord[]
					}
				}
			}
		}
	}
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
export const exportScheduleManifest = async (options: ExportScheduleManifestOptions): Promise<ScheduleManifest> => {
	const schedules: KubernetesCronJobScheduleInput[] = []
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

const kubernetesConcurrencyPolicy = (policy?: ScheduleDefinition['concurrencyPolicy']) => {
	switch (policy) {
		case 'allow':
			return 'Allow'
		case 'forbid':
			return 'Forbid'
		case 'replace':
			return 'Replace'
		default:
			return undefined
	}
}

const sanitizeKubernetesMetadataName = (input: string) => {
	const sanitized = input
		.toLowerCase()
		.replace(/[^a-z0-9-]/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
	const name = sanitized || 'purista-schedule'
	return name.slice(0, 63).replace(/-$/g, '') || 'purista-schedule'
}

const deterministicHash = (input: string) => {
	let hash = 0x811c9dc5
	for (const char of input) {
		hash ^= char.charCodeAt(0)
		hash = Math.imul(hash, 0x01000193)
	}
	return (hash >>> 0).toString(36)
}

const uniqueKubernetesName = (baseName: string, identity: string, usedNames: Set<string>) => {
	const sanitized = sanitizeKubernetesMetadataName(baseName)
	if (!usedNames.has(sanitized)) {
		usedNames.add(sanitized)
		return sanitized
	}

	const suffix = deterministicHash(identity)
	const maxBaseLength = 63 - suffix.length - 1
	const candidate = `${sanitizeKubernetesMetadataName(sanitized.slice(0, maxBaseLength))}-${suffix}`
	usedNames.add(candidate)
	return candidate
}

const annotationValue = (value: unknown) => {
	if (value === undefined) {
		return undefined
	}
	if (typeof value === 'string') {
		return value
	}
	return JSON.stringify(value)
}

const scheduleTemplateValues = (schedule: KubernetesCronJobScheduleInput) => ({
	scheduleName: schedule.name,
	targetKind: schedule.targetKind,
	targetName: schedule.targetName,
	targetServiceName: schedule.targetServiceName ?? '',
	targetServiceVersion: schedule.targetServiceVersion ?? '',
})

const renderTemplate = (template: string, schedule: KubernetesCronJobScheduleInput) => {
	const values = scheduleTemplateValues(schedule)
	return template.replace(
		/\{\{(scheduleName|targetKind|targetName|targetServiceName|targetServiceVersion)\}\}/g,
		(_, key) => String(values[key as keyof typeof values]),
	)
}

const shellQuote = (input: string) => `'${input.replace(/'/g, "'\\''")}'`

const renderJsonTemplate = (input: unknown, schedule: KubernetesCronJobScheduleInput): unknown => {
	if (typeof input === 'string') {
		return renderTemplate(input, schedule)
	}
	if (Array.isArray(input)) {
		return input.map(item => renderJsonTemplate(item, schedule))
	}
	if (input && typeof input === 'object') {
		return Object.fromEntries(
			Object.entries(input as JsonRecord).map(([key, value]) => [key, renderJsonTemplate(value, schedule)]),
		)
	}
	return input
}

const buildHttpCurlArgs = (trigger: KubernetesCronJobTriggerTemplate, schedule: KubernetesCronJobScheduleInput) => {
	if (!trigger.http) {
		return undefined
	}

	const method = trigger.http.method ?? 'POST'
	const renderedUrl = renderTemplate(trigger.http.url, schedule)
	const parts = ['curl', '--fail', '--silent', '--show-error', '--request', method]
	for (const [name, value] of Object.entries(trigger.http.headers ?? {}).sort(([a], [b]) => a.localeCompare(b))) {
		parts.push('--header', `${name}: ${renderTemplate(value, schedule)}`)
	}
	if (trigger.http.body !== undefined) {
		parts.push('--data', JSON.stringify(renderJsonTemplate(trigger.http.body, schedule)))
	}
	parts.push(shellQuote(renderedUrl))
	return [parts.map(shellQuoteIfNeeded).join(' ')]
}

const shellQuoteIfNeeded = (input: string) => {
	if (input.startsWith("'") && input.endsWith("'")) {
		return input
	}
	if (/^[a-zA-Z0-9_./:=@-]+$/.test(input)) {
		return input
	}
	return shellQuote(input)
}

const buildTriggerContainer = (
	trigger: KubernetesCronJobTriggerTemplate,
	schedule: KubernetesCronJobScheduleInput,
): JsonRecord => {
	if (!trigger.image?.trim()) {
		throw new Error('Kubernetes CronJob export requires an explicit trigger image')
	}
	if (!trigger.command?.length && !trigger.args?.length && !trigger.http) {
		throw new Error('Kubernetes CronJob export requires command/args or http trigger configuration')
	}

	const httpArgs = buildHttpCurlArgs(trigger, schedule)
	return omitUndefined({
		name: trigger.name ?? 'purista-trigger',
		image: trigger.image,
		imagePullPolicy: trigger.imagePullPolicy,
		command: trigger.http ? ['sh', '-c'] : trigger.command?.map(item => renderTemplate(item, schedule)),
		args: trigger.http ? httpArgs : trigger.args?.map(item => renderTemplate(item, schedule)),
		env: trigger.env,
		envFrom: trigger.envFrom,
	})
}

const puristaScheduleAnnotations = (schedule: KubernetesCronJobScheduleInput) =>
	omitUndefined({
		'purista.dev/schedule-name': schedule.name,
		'purista.dev/schedule-description': schedule.description,
		'purista.dev/target-kind': schedule.targetKind,
		'purista.dev/target-name': schedule.targetName,
		'purista.dev/target-service-name': schedule.targetServiceName,
		'purista.dev/target-service-version': schedule.targetServiceVersion,
		'purista.dev/missed-run-policy': schedule.missedRunPolicy,
		'purista.dev/max-catch-up-count': annotationValue(schedule.maxCatchUpCount),
		'purista.dev/jitter-window-ms': annotationValue(schedule.jitterWindowMs),
		'purista.dev/idempotency-key': schedule.idempotencyKey,
		'purista.dev/scheduler-group': schedule.schedulerGroup,
		'purista.dev/provider-hints': annotationValue(schedule.providerHints),
	}) as Record<string, string>

const getKubernetesSchedules = async (options: ExportKubernetesCronJobsOptions) => {
	if (options.manifest) {
		return options.manifest.schedules
	}
	if (options.services) {
		const manifest = await exportScheduleManifest({ version: '1.0.0', services: options.services })
		return manifest.schedules as KubernetesCronJobScheduleInput[]
	}
	throw new Error('Kubernetes CronJob export requires services or a schedule manifest')
}

/**
 * Export cron-based PURISTA schedule metadata as Kubernetes `batch/v1`
 * `CronJob` manifest objects.
 *
 * The exporter is a pure JSON manifest generator. It requires the caller to
 * supply the trigger container image and command/args or HTTP request template;
 * it never invents URLs, images, credentials, namespaces, service accounts, or
 * cluster policy.
 *
 * @example
 * ```ts
 * const cronJobs = await exportKubernetesCronJobs({
 *   services: exportedDefinitions,
 *   trigger: {
 *     image: 'registry.example.com/purista-trigger:1.0.0',
 *     command: ['/app/trigger'],
 *     args: ['--kind', '{{targetKind}}', '--target', '{{targetName}}'],
 *   },
 * })
 * ```
 */
export const exportKubernetesCronJobs = async (
	options: ExportKubernetesCronJobsOptions,
): Promise<KubernetesCronJobManifest[]> => {
	if (!options.trigger.command?.length && !options.trigger.args?.length && !options.trigger.http) {
		throw new Error('Kubernetes CronJob export requires command/args or http trigger configuration')
	}
	const schedules = await getKubernetesSchedules(options)
	const usedNames = new Set<string>()

	return schedules
		.slice()
		.sort((a, b) => a.name.localeCompare(b.name))
		.map(schedule => {
			if (!['event', 'queue', 'command'].includes(schedule.targetKind)) {
				if (schedule.targetKind === 'subscription') {
					throw new Error('Kubernetes CronJob export direct subscription targets are not supported')
				}
				throw new Error(`Kubernetes CronJob export does not support schedule target kind "${schedule.targetKind}"`)
			}
			if (schedule.expression.kind !== 'cron') {
				throw new Error(
					`Kubernetes CronJob export only supports cron schedules; schedule "${schedule.name}" uses "${schedule.expression.kind}"`,
				)
			}

			const identity = [
				schedule.name,
				schedule.targetKind,
				schedule.targetServiceName,
				schedule.targetServiceVersion,
				schedule.targetName,
			].join('|')

			return omitUndefined({
				apiVersion: 'batch/v1',
				kind: 'CronJob',
				metadata: {
					name: uniqueKubernetesName(schedule.name, identity, usedNames),
					namespace: options.namespace,
					labels: options.labels,
					annotations: {
						...(options.annotations ?? {}),
						...puristaScheduleAnnotations(schedule),
					},
				},
				spec: {
					schedule: schedule.expression.value,
					timeZone: schedule.expression.timezone ?? schedule.timezone,
					concurrencyPolicy: kubernetesConcurrencyPolicy(schedule.concurrencyPolicy),
					suspend: schedule.enabledByDefault === false ? true : undefined,
					jobTemplate: {
						spec: {
							template: {
								spec: {
									restartPolicy: options.restartPolicy ?? 'OnFailure',
									containers: [buildTriggerContainer(options.trigger, schedule)],
								},
							},
						},
					},
				},
			}) as KubernetesCronJobManifest
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
		schedulerGroup: schedule.schedulerGroup,
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
