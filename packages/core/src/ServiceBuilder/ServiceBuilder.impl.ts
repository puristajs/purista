import { fail } from 'node:assert'

import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import { AgentQueueBuilder } from '../AgentQueueBuilder/AgentQueueBuilder.js'
import {
	bindAgentRuntimeScope,
	createAgentRuntimeScope,
	initializeAttachedAgentRuntimes,
} from '../AgentQueueBuilder/runtime/scopedRuntime.js'
import type {
	AgentModelBinding,
	AgentQueueBuilderTypes,
	AgentRuntimeOptions,
	AttachedAgentDefinition,
} from '../AgentQueueBuilder/types.js'
import { CommandDefinitionBuilder } from '../CommandDefinitionBuilder/CommandDefinitionBuilder.impl.js'
import type { CommandDefinitionBuilderTypes } from '../CommandDefinitionBuilder/CommandDefinitionBuilderTypes.js'
import type { ConfigStore } from '../core/ConfigStore/types/ConfigStore.js'
import { UnhandledError } from '../core/Error/UnhandledError.impl.js'
import type { EventBridge } from '../core/EventBridge/types/EventBridge.js'
import type { QueueBridge } from '../core/QueueBridge/types/QueueBridge.js'
import type { SecretStore } from '../core/SecretStore/types/SecretStore.js'
import { Service } from '../core/Service/Service.impl.js'
import type { StateStore } from '../core/StateStore/types/StateStore.js'
import type { Complete } from '../core/types/Complete.js'
import type {
	CommandDefinitionList,
	CommandDefinitionListResolved,
} from '../core/types/commandType/CommandDefinitionList.js'
import type { EmptyObject } from '../core/types/EmptyObject.js'
import type { InvokeList } from '../core/types/InvokeList.js'
import type { ServiceInfoType } from '../core/types/infoType/ServiceInfoType.js'
import type { Logger } from '../core/types/Logger.js'
import type { LogLevelName } from '../core/types/LogLevelName.js'
import type { NeverObject } from '../core/types/NeverObject.js'
import type { Prettify } from '../core/types/Prettify.js'
import type {
	PuristaMetricDefinition,
	PuristaMetricDefinitions,
	PuristaMetricsRecorder,
	PuristaMetricsRuntimeOptions,
} from '../core/types/PuristaMetrics.js'
import type { EventToQueueBindingDefinition } from '../core/types/queue/EventToQueueBindingDefinition.js'
import type { QueueDefinitionList, QueueDefinitionListResolved } from '../core/types/queue/QueueDefinitionList.js'
import type { QueueInvokeList } from '../core/types/queue/QueueInvokeList.js'
import type { QueueJobStore } from '../core/types/queue/QueueJobStore.js'
import type {
	QueueWorkerDefinitionList,
	QueueWorkerDefinitionListResolved,
} from '../core/types/queue/QueueWorkerDefinitionList.js'
import type { ServiceBuilderTypes } from '../core/types/ServiceBuilderTypes.js'
import type { ServiceClassTypes } from '../core/types/ServiceClassTypes.js'
import type { ServiceConstructorInput } from '../core/types/ServiceConstructorInput.js'
import type { SetNewTypeValue, SetNewTypeValues } from '../core/types/SetNewTypeValue.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import type { StreamInvokeList } from '../core/types/StreamInvokeList.js'
import type { ScheduleDefinition } from '../core/types/schedule/index.js'
import type { StreamDefinitionList, StreamDefinitionListResolved } from '../core/types/stream/StreamDefinitionList.js'
import type {
	SubscriptionDefinitionList,
	SubscriptionDefinitionListResolved,
} from '../core/types/subscription/SubscriptionDefinitionList.js'
import { initDefaultConfigStore } from '../DefaultConfigStore/initDefaultConfigStore.impl.js'
import { initLogger } from '../DefaultLogger/initLogger.impl.js'
import { DefaultQueueBridge } from '../DefaultQueueBridge/DefaultQueueBridge.impl.js'
import { initDefaultSecretStore } from '../DefaultSecretStore/initDefaultSecretStore.impl.js'
import { initDefaultStateStore } from '../DefaultStateStore/initDefaultStateStore.impl.js'
import type { InstanceOrType } from '../helper/types/InstanceOrType.js'
import type { NonEmptyString } from '../helper/types/NonEmptyString.js'
import { QueueDefinitionBuilder } from '../QueueDefinitionBuilder/QueueDefinitionBuilder.impl.js'
import { QueueWorkerBuilder } from '../QueueWorkerBuilder/QueueWorkerBuilder.impl.js'
import { ScheduleDefinitionBuilder } from '../ScheduleDefinitionBuilder/ScheduleDefinitionBuilder.impl.js'
import { StreamDefinitionBuilder } from '../StreamDefinitionBuilder/StreamDefinitionBuilder.impl.js'
import type { StreamDefinitionBuilderTypes } from '../StreamDefinitionBuilder/StreamDefinitionBuilderTypes.js'
import { SubscriptionDefinitionBuilder } from '../SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.js'
import type { SubscriptionDefinitionBuilderTypes } from '../SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilderTypes.js'
import { type Infer, type InferIn, type Schema, validate } from '../schema/index.js'

/** Constructor type accepted by `ServiceBuilder.setCustomClass(...)`. */
export type Newable<T extends Service, S extends ServiceClassTypes> = new (config: ServiceConstructorInput<S>) => T

/** Runtime configuration accepted by `ServiceBuilder.getInstance(...)`. */
export type InstanceConfigType<S extends ServiceBuilderTypes<any, any, any, any, any>> = Prettify<
	{
		/** Log level used when no custom logger is provided. */
		logLevel?: LogLevelName
		/** Custom service logger. */
		logger?: Logger
		/** Optional OpenTelemetry span processor. */
		spanProcessor?: SpanProcessor
		/** Secret store used by service handlers. */
		secretStore?: SecretStore
		/** Config store used by service handlers. */
		configStore?: ConfigStore
		/** State store used by service handlers and attached agents. */
		stateStore?: StateStore
		/** Queue bridge used by queue definitions and attached agents. */
		queueBridge?: QueueBridge
		/** Optional queue job store for queue bridge implementations that use one. */
		queueJobStore?: QueueJobStore
		/** OpenTelemetry metrics runtime options. */
		metrics?: PuristaMetricsRuntimeOptions
		/** Low-level metrics recorder override. */
		metricsRecorder?: PuristaMetricsRecorder
		/** Runtime model/provider bindings for attached agents. */
		ai?: AgentRuntimeOptions<Record<string, AgentModelBinding>>
	} & (keyof S['Resources'] extends never ? { resources?: never } : { resources: S['Resources'] }) &
		(keyof S['ConfigInputType'] extends never ? { serviceConfig?: never } : { serviceConfig?: S['ConfigInputType'] })
>

/**
 * This class is used to build a service.
 *
 * @group Service
 */
export class ServiceBuilder<S extends ServiceBuilderTypes<any, any, any, any, any> = ServiceBuilderTypes> {
	private commandDefinitionList: CommandDefinitionList<S['ServiceClassType']> = []
	private subscriptionDefinitionList: SubscriptionDefinitionList<S['ServiceClassType']> = []
	private streamDefinitionList: StreamDefinitionList<S['ServiceClassType']> = []
	private queueDefinitionList: QueueDefinitionList<S['ServiceClassType']> = []
	private queueWorkerDefinitionList: QueueWorkerDefinitionList<S['ServiceClassType']> = []
	private scheduleDefinitionList: ScheduleDefinition[] = []
	private eventToQueueBindingList: EventToQueueBindingDefinition[] = []
	private agentDefinitionList: AttachedAgentDefinition<any>[] = []

	private commandDefinitionListResolved: CommandDefinitionListResolved<S['ServiceClassType']> = []
	private subscriptionDefinitionListResolved: SubscriptionDefinitionListResolved<S['ServiceClassType']> = []
	private streamDefinitionListResolved: StreamDefinitionListResolved<S['ServiceClassType']> = []
	private queueDefinitionListResolved: QueueDefinitionListResolved<S['ServiceClassType']> = []
	private queueWorkerDefinitionListResolved: QueueWorkerDefinitionListResolved<S['ServiceClassType']> = []
	private scheduleDefinitionListResolved: ScheduleDefinition[] = []
	private eventToQueueBindingListResolved: EventToQueueBindingDefinition[] = []

	private configSchema?: Schema
	private defaultConfig?: Complete<S['ConfigType']>

	private definitionsResolved = false

	private deprecated = false

	private requiresResources = false

	private customMetricDefinitions: PuristaMetricDefinitions = {}

	/** Service class constructor used by `getInstance(...)`. */
	SClass: Newable<S['ServiceClassType'], ServiceClassTypes<S['ConfigType'], S['Resources'], S['Metrics']>> = Service

	// eslint-disable-next-line no-useless-constructor
	constructor(public info: ServiceInfoType) {}

	/** Add a configuration schema and infer typed `serviceConfig` for `getInstance(...)`. */
	setConfigSchema<T extends Schema>(schema: T) {
		this.configSchema = schema
		return this as unknown as ServiceBuilder<
			SetNewTypeValues<
				S,
				{
					ConfigType: Infer<T> extends Record<string, unknown> ? Infer<T> : NeverObject
					ConfigInputType: InferIn<T> extends Record<string, unknown> ? InferIn<T> : NeverObject
					ServiceClassType: Service<
						ServiceClassTypes<
							Infer<T> extends Record<string, unknown> ? Infer<T> : EmptyObject,
							S['Resources'],
							S['Metrics']
						>
					>
				}
			>
		>
	}

	/** Set default service configuration merged before runtime `serviceConfig`. */
	setDefaultConfig(config: Complete<S['ConfigType']>): this {
		this.defaultConfig = config
		return this
	}

	/** Mark the entire service definition as deprecated. */
	markAsDeprecated() {
		this.deprecated = true
		return this
	}

	/** Add one or more resolved or pending command definitions to this service. */
	addCommandDefinition(...commands: CommandDefinitionList<S['ServiceClassType']>) {
		if (this.definitionsResolved) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'You can not add commands after resolveDefinitions is called.',
			)
		}
		this.commandDefinitionList.push(...commands)
		return this
	}

	/** Add one or more resolved or pending subscription definitions to this service. */
	addSubscriptionDefinition(...subscription: SubscriptionDefinitionList<S['ServiceClassType']>) {
		if (this.definitionsResolved) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'You can not add subscriptions after resolveDefinitions is called.',
			)
		}
		this.subscriptionDefinitionList.push(...subscription)
		return this
	}

	/** Add one or more resolved or pending stream definitions to this service. */
	addStreamDefinition(...streams: StreamDefinitionList<S['ServiceClassType']>) {
		if (this.definitionsResolved) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'You can not add streams after resolveDefinitions is called.',
			)
		}
		this.streamDefinitionList.push(...streams)
		return this
	}

	/** Add one or more resolved or pending queue definitions to this service. */
	addQueueDefinition(...queues: QueueDefinitionList<S['ServiceClassType']>) {
		if (this.definitionsResolved) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'You can not add queues after resolveDefinitions is called.',
			)
		}
		this.queueDefinitionList.push(...queues)
		return this
	}

	/** Add one or more resolved or pending queue worker definitions to this service. */
	addQueueWorkerDefinition(...workers: QueueWorkerDefinitionList<S['ServiceClassType']>) {
		if (this.definitionsResolved) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'You can not add queue workers after resolveDefinitions is called.',
			)
		}
		this.queueWorkerDefinitionList.push(...workers)
		return this
	}

	/**
	 * Add one or more attached agent definitions to this service.
	 *
	 * The attached agent is expanded into normal queue, queue worker, command,
	 * and stream definitions so the rest of core can treat it like any other
	 * declared PURISTA boundary.
	 *
	 * @example
	 * ```ts
	 * const triage = await service
	 *   .getAgentQueueBuilder('triageTicket', 'Triage a support ticket')
	 *   .setRunFunction(async context => ({ priority: 'normal' }))
	 *   .getDefinition()
	 *
	 * service.addAgentDefinition(triage)
	 * ```
	 */
	addAgentDefinition<const Definition extends AttachedAgentDefinition<any>>(...definitions: Definition[]) {
		if (this.definitionsResolved) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'You can not add agents after resolveDefinitions is called.',
			)
		}

		this.agentDefinitionList.push(...definitions)

		for (const definition of definitions) {
			this.queueDefinitionList.push(definition.queue as never)
			this.queueWorkerDefinitionList.push(definition.worker as never)
			this.commandDefinitionList.push(definition.command as never)
			this.streamDefinitionList.push(definition.stream as never)
			for (const [metricName, metricDefinition] of Object.entries(definition.metricDefinitions ?? {})) {
				this.customMetricDefinitions[metricName] = metricDefinition
			}
		}

		return this
	}

	/** Add one or more schedule contracts to this service. */
	addScheduleDefinition(...schedules: ScheduleDefinition[]) {
		if (this.definitionsResolved) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'You can not add schedules after resolveDefinitions is called.',
			)
		}
		this.scheduleDefinitionList.push(...schedules)
		return this
	}

	/**
	 * Bind a custom event to a durable queue job through a generated bounded subscription.
	 *
	 * @example
	 * ```ts
	 * service.bindEventToQueue('billing.monthlyCycleDue', 'billing.monthlyClosing', {
	 *   idempotencyKey: event => `billing-cycle:${event.cycleId}`,
	 * })
	 * ```
	 */
	bindEventToQueue(
		eventName: string,
		queueName: string,
		options: Omit<EventToQueueBindingDefinition, 'eventName' | 'queueName' | 'idempotencyMode'> & {
			idempotencyMode?: EventToQueueBindingDefinition['idempotencyMode']
		} = {},
	) {
		if (this.definitionsResolved) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'You can not add event-to-queue bindings after resolveDefinitions is called.',
			)
		}
		this.eventToQueueBindingList.push({
			eventName,
			queueName,
			idempotencyMode: options.idempotencyMode ?? 'advisory',
			idempotencyKey: options.idempotencyKey,
			mapPayload: options.mapPayload,
			mapParameter: options.mapParameter,
			onEnqueueFailure: options.onEnqueueFailure,
		})
		return this
	}

	/** Resolve all pending definitions once and cache the resolved service definition lists. */
	public async resolveDefinitions() {
		if (this.definitionsResolved) {
			return {
				commands: this.commandDefinitionListResolved,
				subscriptions: this.subscriptionDefinitionListResolved,
				streams: this.streamDefinitionListResolved,
				queues: this.queueDefinitionListResolved,
				queueWorkers: this.queueWorkerDefinitionListResolved,
				schedules: this.scheduleDefinitionListResolved,
				eventToQueueBindings: this.eventToQueueBindingListResolved,
			}
		}

		this.commandDefinitionListResolved = await Promise.all(this.commandDefinitionList)
		this.subscriptionDefinitionListResolved = await Promise.all(this.subscriptionDefinitionList)
		this.streamDefinitionListResolved = await Promise.all(this.streamDefinitionList)
		this.queueDefinitionListResolved = await Promise.all(this.queueDefinitionList)
		this.queueWorkerDefinitionListResolved = await Promise.all(this.queueWorkerDefinitionList)
		this.scheduleDefinitionListResolved = this.scheduleDefinitionList
		this.eventToQueueBindingListResolved = this.eventToQueueBindingList

		this.subscriptionDefinitionList = []
		this.commandDefinitionList = []
		this.streamDefinitionList = []
		this.queueDefinitionList = []
		this.queueWorkerDefinitionList = []
		this.scheduleDefinitionList = []
		this.eventToQueueBindingList = []

		this.definitionsResolved = true
		return {
			commands: this.commandDefinitionListResolved,
			subscriptions: this.subscriptionDefinitionListResolved,
			streams: this.streamDefinitionListResolved,
			queues: this.queueDefinitionListResolved,
			queueWorkers: this.queueWorkerDefinitionListResolved,
			schedules: this.scheduleDefinitionListResolved,
			eventToQueueBindings: this.eventToQueueBindingListResolved,
		}
	}

	/** Declare a resource required by handlers and enforce `resources` in `getInstance(...)`. */
	defineResource<ResourceName extends string, ResourcesType>() {
		this.requiresResources = true
		return this as unknown as ServiceBuilder<
			SetNewTypeValue<S, 'Resources', S['Resources'] & { [K in ResourceName]: InstanceOrType<ResourcesType> }>
		>
	}

	/**
	 * Declare a custom application metric available in every service handler.
	 *
	 * @example
	 * ```ts
	 * const service = new ServiceBuilder(serviceInfo).defineMetric('app.orders.created', {
	 *   kind: 'counter',
	 *   unit: '{order}',
	 *   description: 'Created orders',
	 * })
	 * ```
	 */
	defineMetric<const MetricName extends string, const Definition extends PuristaMetricDefinition<any>>(
		name: MetricName,
		definition: Definition,
	) {
		this.customMetricDefinitions[name] = definition
		return this as unknown as ServiceBuilder<
			SetNewTypeValues<
				S,
				{
					Metrics: S['Metrics'] & { [K in MetricName]: Definition }
					ServiceClassType: Service<
						ServiceClassTypes<S['ConfigType'], S['Resources'], S['Metrics'] & { [K in MetricName]: Definition }>
					>
				}
			>
		>
	}

	/** Use a custom service subclass when creating service instances. */
	setCustomClass<T extends Service<ServiceClassTypes<S['ConfigType'], S['Resources'], S['Metrics']>>>(
		customClass: Newable<T, ServiceClassTypes<S['ConfigType'], S['Resources'], S['Metrics']>>,
	) {
		this.SClass = customClass
		return this as unknown as ServiceBuilder<SetNewTypeValue<S, 'ServiceClassType', T>>
	}

	/** Return the service class constructor currently configured for this builder. */
	getCustomClass() {
		return this.SClass
	}

	/** Create a runnable service instance with runtime bridges, stores, resources, and agent bindings. */
	async getInstance(eventBridge: EventBridge, options?: InstanceConfigType<S>) {
		const logger = options?.logger ?? initLogger(options?.logLevel)
		const cfg: S['ConfigInputType'] = {
			...this.defaultConfig,
			...options?.serviceConfig,
		}

		let config: S['ConfigType'] = cfg as S['ConfigType']
		if (this.configSchema) {
			const validationResult = await validate(this.configSchema, cfg)
			if (!validationResult.success) {
				const err = new UnhandledError(
					StatusCode.InternalServerError,
					'The given service configuration is invalid',
					validationResult.issues,
				)
				logger.error({ err }, err.message)
				throw err
			}
			config = validationResult.data as S['ConfigType']
		}

		if (this.requiresResources && !options?.resources) {
			const err = new UnhandledError(
				StatusCode.InternalServerError,
				'This services requires resources to be set in getInstance options',
			)
			logger.error({ err }, err.message)
			throw err
		}

		const secretStore: SecretStore =
			options?.secretStore ??
			initDefaultSecretStore({
				logger,
			})

		const configStore: ConfigStore =
			options?.configStore ??
			initDefaultConfigStore({
				logger,
			})

		const stateStore: StateStore =
			options?.stateStore ??
			initDefaultStateStore({
				logger,
			})

		const queueBridge: QueueBridge = options?.queueBridge ?? new DefaultQueueBridge()

		const { commands, subscriptions, streams, queues, queueWorkers, eventToQueueBindings } =
			await this.resolveDefinitions()

		const C = this.getCustomClass()
		const agentRuntimeScope = createAgentRuntimeScope()
		const agentRuntimeShutdown = await initializeAttachedAgentRuntimes(
			agentRuntimeScope,
			this.agentDefinitionList,
			options?.ai
				? {
						...options.ai,
						logger: options.ai.logger ?? logger,
					}
				: undefined,
		)

		let service: InstanceType<typeof C>
		try {
			service = new C({
				logger,
				eventBridge,
				info: this.info,
				commandDefinitionList: commands,
				subscriptionDefinitionList: subscriptions,
				streamDefinitionList: streams,
				queueDefinitionList: queues,
				queueWorkerDefinitionList: queueWorkers,
				config,
				spanProcessor: options?.spanProcessor,
				secretStore,
				configStore,
				stateStore,
				queueBridge,
				queueJobStore: options?.queueJobStore,
				eventToQueueBindingList: eventToQueueBindings,
				configSchema: this.configSchema,
				metrics: options?.metrics,
				metricsRecorder: options?.metricsRecorder,
				metricDefinitionList: this.customMetricDefinitions,
				resources: options?.resources,
			})
		} catch (error) {
			await agentRuntimeShutdown.shutdown()
			throw error
		}
		bindAgentRuntimeScope(service, agentRuntimeScope)

		if (this.agentDefinitionList.length > 0) {
			const destroy = service.destroy.bind(service)
			service.destroy = async () => {
				try {
					await agentRuntimeShutdown.shutdown()
				} finally {
					// Always release core resources (bridges, stores) even if agent
					// runtime shutdown fails, so a failing executor cannot leak them.
					await destroy()
				}
			}
		}

		return service
	}

	/** Create a command builder scoped to this service's resource and metric types. */
	getCommandBuilder<T extends string, N extends string>(
		commandName: NonEmptyString<T>,
		description: string,
		eventName?: NonEmptyString<N>,
	) {
		return new CommandDefinitionBuilder<
			S['ServiceClassType'],
			CommandDefinitionBuilderTypes<
				Schema,
				Schema,
				Schema,
				Schema,
				Schema,
				Schema,
				S['Resources'],
				InvokeList,
				StreamInvokeList,
				Record<string, Schema>,
				QueueInvokeList
			>
		>(commandName, description, eventName, this.deprecated)
	}

	/** Create a subscription builder scoped to this service's resource and metric types. */
	getSubscriptionBuilder<T extends string>(
		subscriptionName: NonEmptyString<T>,
		description: string,
	): SubscriptionDefinitionBuilder<
		S['ServiceClassType'],
		SubscriptionDefinitionBuilderTypes<
			any,
			any,
			any,
			any,
			any,
			any,
			S['Resources'],
			InvokeList,
			StreamInvokeList,
			Record<string, Schema>,
			QueueInvokeList
		>
	> {
		return new SubscriptionDefinitionBuilder<
			S['ServiceClassType'],
			SubscriptionDefinitionBuilderTypes<
				any,
				any,
				any,
				any,
				any,
				any,
				S['Resources'],
				InvokeList,
				StreamInvokeList,
				Record<string, Schema>,
				QueueInvokeList
			>
		>(subscriptionName, description, this.deprecated)
	}

	/** Create a stream builder scoped to this service's resource and metric types. */
	getStreamBuilder<T extends string, N extends string>(
		streamName: NonEmptyString<T>,
		description: string,
		finalEventName?: NonEmptyString<N>,
	) {
		return new StreamDefinitionBuilder<
			S['ServiceClassType'],
			StreamDefinitionBuilderTypes<
				Schema,
				Schema,
				Schema,
				Schema,
				S['Resources'],
				InvokeList,
				StreamInvokeList,
				Record<string, Schema>,
				QueueInvokeList
			>
		>(streamName, description, finalEventName, this.deprecated)
	}

	/**
	 * Create a native core builder for a queue-backed PURISTA agent.
	 *
	 * The returned builder preserves this service builder's resource type and
	 * cascades payload, parameter, output, model, command-tool, and child-agent
	 * declarations into the agent handler context.
	 *
	 * @example
	 * ```ts
	 * const triage = service
	 *   .getAgentQueueBuilder('triageTicket', 'Triage a support ticket')
	 *   .addModel('primary', { capabilities: ['object'] })
	 * ```
	 */
	getAgentQueueBuilder<const AgentName extends string>(agentName: NonEmptyString<AgentName>, description: string) {
		return new AgentQueueBuilder(
			this.info.serviceName,
			this.info.serviceVersion,
			agentName,
			description,
		) as AgentQueueBuilder<
			AgentQueueBuilderTypes<
				Schema,
				Schema,
				Schema,
				S['Resources'] extends Record<string, unknown> ? S['Resources'] : Record<string, never>,
				Record<never, never>,
				Record<never, never>,
				Record<never, never>,
				undefined,
				S['Metrics']
			>
		>
	}

	/** Return resolved command definitions after `resolveDefinitions()` has completed. */
	getCommandDefinitions() {
		if (!this.definitionsResolved) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'Definitions not resolve. Please call resolveDefinitions() before using getCommandDefinitions',
			)
		}
		return this.commandDefinitionListResolved
	}

	/** Return resolved subscription definitions after `resolveDefinitions()` has completed. */
	getSubscriptionDefinitions() {
		if (!this.definitionsResolved) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'Definitions not resolve. Please call resolveDefinitions() before using getCommandDefinitions',
			)
		}
		return this.subscriptionDefinitionListResolved
	}

	/** Return resolved stream definitions after `resolveDefinitions()` has completed. */
	getStreamDefinitions() {
		if (!this.definitionsResolved) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'Definitions not resolve. Please call resolveDefinitions() before using getStreamDefinitions',
			)
		}
		return this.streamDefinitionListResolved
	}

	/** Create a queue definition builder. */
	getQueueBuilder<T extends string>(queueName: NonEmptyString<T>, description: string) {
		return new QueueDefinitionBuilder(queueName, description)
	}

	/** Create a queue worker builder for a queue name. */
	getQueueWorkerBuilder<T extends string>(queueName: NonEmptyString<T>, workerName: string) {
		return new QueueWorkerBuilder(queueName, workerName)
	}

	/** Create a schedule definition builder. */
	getScheduleBuilder<T extends string>(scheduleName: NonEmptyString<T>, description: string) {
		return new ScheduleDefinitionBuilder(scheduleName, description)
	}

	/** Return resolved queue definitions after `resolveDefinitions()` has completed. */
	getQueueDefinitions() {
		if (!this.definitionsResolved) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'Definitions not resolve. Please call resolveDefinitions() before using getQueueDefinitions',
			)
		}
		return this.queueDefinitionListResolved
	}

	/** Return resolved queue worker definitions after `resolveDefinitions()` has completed. */
	getQueueWorkerDefinitions() {
		if (!this.definitionsResolved) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'Definitions not resolve. Please call resolveDefinitions() before using getQueueWorkerDefinitions',
			)
		}
		return this.queueWorkerDefinitionListResolved
	}

	/** Return resolved schedule definitions after `resolveDefinitions()` has completed. */
	getScheduleDefinitions() {
		if (!this.definitionsResolved) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'Definitions not resolve. Please call resolveDefinitions() before using getScheduleDefinitions',
			)
		}
		return this.scheduleDefinitionListResolved
	}

	/** Return resolved event-to-queue bindings after `resolveDefinitions()` has completed. */
	getEventToQueueBindings() {
		if (!this.definitionsResolved) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'Definitions not resolve. Please call resolveDefinitions() before using getEventToQueueBindings',
			)
		}
		return this.eventToQueueBindingListResolved
	}

	/** Validate duplicate names and queue-worker references for local tests. */
	async testServiceSetup() {
		const { subscriptions, commands, streams, queues, queueWorkers } = await this.resolveDefinitions()

		this.validateCommands(commands)
		this.validateSubscriptions(subscriptions)
		this.validateStreams(streams)
		this.validateQueues(queues)
		this.validateQueueWorkers(queueWorkers, queues)

		return true
	}

	protected validateCommands(commandDefinitions: CommandDefinitionListResolved<any>) {
		const existingNames = new Set()
		const eventNames = new Set()

		for (const definition of commandDefinitions) {
			const name = definition.commandName.toLowerCase().trim()
			const eventName = definition.eventName

			if (existingNames.has(name)) {
				fail(`duplicate command name ${name}`)
			}
			existingNames.add(name)

			if (eventName) {
				if (eventNames.has(eventName)) {
					fail(`response event "${eventName}" in ${name} is used in other command`)
				}
				eventNames.add(eventName)
			}
		}
	}

	protected validateSubscriptions(subscriptionDefinitions: SubscriptionDefinitionListResolved<any>) {
		const existingNames = new Set()
		for (const definition of subscriptionDefinitions) {
			const name = definition.subscriptionName.toLowerCase().trim()

			if (existingNames.has(name)) {
				fail(`duplicate subscription name ${name}`)
			}
			existingNames.add(name)
		}
	}

	protected validateStreams(streamDefinitions: StreamDefinitionListResolved<any>) {
		const existingNames = new Set()
		for (const definition of streamDefinitions) {
			const name = definition.streamName.toLowerCase().trim()
			if (existingNames.has(name)) {
				fail(`duplicate stream name ${name}`)
			}
			existingNames.add(name)
		}
	}

	protected validateQueues(queueDefinitions: QueueDefinitionListResolved<any>) {
		const existingNames = new Set()
		for (const definition of queueDefinitions) {
			const name = definition.queueName.toLowerCase().trim()
			if (existingNames.has(name)) {
				fail(`duplicate queue name ${name}`)
			}
			existingNames.add(name)
		}
	}

	protected validateQueueWorkers(
		queueWorkers: QueueWorkerDefinitionListResolved<any>,
		queues: QueueDefinitionListResolved<any>,
	) {
		const queueNames = new Set(queues.map(queue => queue.queueName.toLowerCase().trim()))
		const workerNames = new Set<string>()

		for (const worker of queueWorkers) {
			const queueName = worker.queueName.toLowerCase().trim()
			if (!queueNames.has(queueName)) {
				fail(`queue worker ${worker.name} references unknown queue ${queueName}`)
			}
			if (workerNames.has(worker.name.toLowerCase().trim())) {
				fail(`duplicate queue worker name ${worker.name}`)
			}
			workerNames.add(worker.name.toLowerCase().trim())
		}
	}

	/** Return service metadata plus all resolved definitions. */
	async getFullServiceDefinition() {
		const definitions = await this.resolveDefinitions()

		return {
			...this.info,
			...definitions,
			deprecated: this.deprecated,
		}
	}

	/**
	 * @deprecated Use testServiceSetup() instead
	 */
	validateCommandDefinitions() {
		// biome-ignore lint/suspicious/noConsole: no logger available
		console.warn('deprecated: Use testServiceSetup() instead')
	}

	/**
	 * @deprecated Use testServiceSetup() instead
	 */
	validateSubscriptionDefinitions() {
		// biome-ignore lint/suspicious/noConsole: no logger available
		console.warn('deprecated: Use testServiceSetup() instead')
	}
}
