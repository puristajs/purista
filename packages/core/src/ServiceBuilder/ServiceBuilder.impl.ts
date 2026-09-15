import { fail } from 'node:assert'

import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import type {
	AnyHarnessTargetContract,
	HarnessContracts,
	Schema as HarnessSchema,
	ModelSchema,
	RuntimeRequirements,
} from '@purista/harness'
import { assertHarnessHostToolOwner, createHostOwnerToken } from '@purista/harness/integrator'
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
import { HarnessHostToolBuilder } from '../HarnessMount/hostToolBuilder.js'
import {
	createServiceBoundHarnessTargetReference,
	finalizeRegisteredHarnessInvocations,
} from '../HarnessMount/invocation.js'
import { createMountedHarnessTargetProjections } from '../HarnessMount/projection.js'
import { createMountedHarnessQueueDefinitions } from '../HarnessMount/queue.js'
import type { QueuedHarnessTargetReference } from '../HarnessMount/queueBinding.js'
import { canonicalHarnessJson } from '../HarnessMount/remoteTargetContract.js'
import { HarnessMountRuntime } from '../HarnessMount/runtime.js'
import type {
	HarnessDefinitionMountPolicy,
	HarnessHostToolSchemaBoundary,
	HarnessMount,
	HarnessTargetJsonSchema,
	MountedHarnessRuntimeConfig,
	PuristaHostToolRuntimeDefinition,
} from '../HarnessMount/types.js'
import { createMountedHarnessServiceExport } from '../helper/exportServiceDefinitions.js'
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
import { validationToSchema } from '../zodOpenApi/validationToSchema.js'

const emptyMountedServiceEventContracts = Object.freeze({}) as Readonly<Record<string, HarnessTargetJsonSchema>>

// Core consumes only Harness's public contracts and runtime requirements. The
// Harness integrator authenticates the concrete definition at runtime.
type HarnessDefinitionBoundary<D> =
	D extends Readonly<{
		kind: 'harness'
		contracts: HarnessContracts
		requirements: RuntimeRequirements
	}>
		? unknown
		: never

/** Constructor type accepted by `ServiceBuilder.setCustomClass(...)`. */
export type Newable<T extends Service, S extends ServiceClassTypes> = new (config: ServiceConstructorInput<S>) => T

/** Runtime configuration accepted by `ServiceBuilder.getInstance(...)`. */
export type InstanceConfigType<S extends ServiceBuilderTypes<any, any, any, any, any, any>> = Prettify<
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
		/** State store used by service handlers. */
		stateStore?: StateStore
		/** Queue bridge used by queue definitions. */
		queueBridge?: QueueBridge
		/** Optional queue job store for queue bridge implementations that use one. */
		queueJobStore?: QueueJobStore
		/** OpenTelemetry metrics runtime options. */
		metrics?: PuristaMetricsRuntimeOptions
		/** Low-level metrics recorder override. */
		metricsRecorder?: PuristaMetricsRecorder
	} & (S['Harnesses'] extends readonly [infer D]
		? { /** Runtime bindings required by the mounted Harness definition. */ ai: MountedHarnessRuntimeConfig<D> }
		: { ai?: never }) &
		(keyof S['Resources'] extends never ? { resources?: never } : { resources: S['Resources'] }) &
		(keyof S['ConfigInputType'] extends never ? { serviceConfig?: never } : { serviceConfig?: S['ConfigInputType'] })
>

/**
 * This class is used to build a service.
 *
 * @group Service
 */
export class ServiceBuilder<
	S extends ServiceBuilderTypes<any, any, any, any, any, any> = ServiceBuilderTypes,
	const Info extends ServiceInfoType = ServiceInfoType,
> {
	private commandDefinitionList: CommandDefinitionList<S['ServiceClassType']> = []
	private subscriptionDefinitionList: SubscriptionDefinitionList<S['ServiceClassType']> = []
	private streamDefinitionList: StreamDefinitionList<S['ServiceClassType']> = []
	private queueDefinitionList: QueueDefinitionList<S['ServiceClassType']> = []
	private queueWorkerDefinitionList: QueueWorkerDefinitionList<S['ServiceClassType']> = []
	private scheduleDefinitionList: ScheduleDefinition[] = []
	private eventToQueueBindingList: EventToQueueBindingDefinition[] = []
	private harnessMount?: HarnessMount<any, any>
	readonly #harnessHostOwner = createHostOwnerToken<unknown>()
	readonly #harnessHostTools = new Map<string, PuristaHostToolRuntimeDefinition>()

	private commandDefinitionListResolved: CommandDefinitionListResolved<S['ServiceClassType']> = []
	private subscriptionDefinitionListResolved: SubscriptionDefinitionListResolved<S['ServiceClassType']> = []
	private streamDefinitionListResolved: StreamDefinitionListResolved<S['ServiceClassType']> = []
	private queueDefinitionListResolved: QueueDefinitionListResolved<S['ServiceClassType']> = []
	private queueWorkerDefinitionListResolved: QueueWorkerDefinitionListResolved<S['ServiceClassType']> = []
	private scheduleDefinitionListResolved: ScheduleDefinition[] = []
	private eventToQueueBindingListResolved: EventToQueueBindingDefinition[] = []
	private definitionsResolution?: Promise<{
		commands: CommandDefinitionListResolved<S['ServiceClassType']>
		subscriptions: SubscriptionDefinitionListResolved<S['ServiceClassType']>
		streams: StreamDefinitionListResolved<S['ServiceClassType']>
		queues: QueueDefinitionListResolved<S['ServiceClassType']>
		queueWorkers: QueueWorkerDefinitionListResolved<S['ServiceClassType']>
		schedules: ScheduleDefinition[]
		eventToQueueBindings: EventToQueueBindingDefinition[]
	}>

	private configSchema?: Schema
	private defaultConfig?: Complete<S['ConfigType']>

	private definitionsResolved = false

	private deprecated = false

	private requiresResources = false

	private customMetricDefinitions: PuristaMetricDefinitions = {}

	/** Service class constructor used by `getInstance(...)`. */
	SClass: Newable<S['ServiceClassType'], ServiceClassTypes<S['ConfigType'], S['Resources'], S['Metrics']>> = Service

	// eslint-disable-next-line no-useless-constructor
	constructor(public info: Info) {}

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
			>,
			Info
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
	 * Mount a provider-neutral Harness definition on this service.
	 *
	 * Every explicit Harness root receives a versioned PURISTA address. Its
	 * private dependency closure remains available only to nested dispatch.
	 *
	 * @example
	 * ```ts
	 * const support = supportServiceBuilder.mountHarness(supportHarness)
	 * ```
	 */
	mountHarness<const D>(
		...args: S['Harnesses'] extends readonly []
			? [definition: D & HarnessDefinitionBoundary<D>, policy?: HarnessDefinitionMountPolicy<D, S['Resources']>]
			: [definition: never, policy?: never]
	) {
		const [definition, policy] = args
		if (this.definitionsResolved) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'You can not mount a Harness after resolveDefinitions is called.',
			)
		}
		if (this.harnessMount) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'Only one Harness definition can be mounted on a service. Compose additional capabilities with native Harness modules.',
			)
		}
		// Harness authenticates this public mount projection before reading its private compiled graph.
		assertHarnessHostToolOwner(definition as never, this.#harnessHostOwner)
		const mountedPolicy = snapshotHarnessMountPolicy<D, S['Resources']>(policy)
		const projections = createMountedHarnessTargetProjections(
			definition as never,
			{
				serviceName: this.info.serviceName,
				serviceVersion: this.info.serviceVersion,
				...(mountedPolicy === undefined ? {} : { policy: mountedPolicy }),
			} as never,
		)
		this.harnessMount = Object.freeze({
			definition,
			...(mountedPolicy === undefined ? {} : { policy: mountedPolicy }),
			projections,
		}) as unknown as HarnessMount<any, any>
		return this as unknown as ServiceBuilder<SetNewTypeValue<S, 'Harnesses', readonly [D]>, Info>
	}

	/**
	 * Bind an authentic target contract to this builder's service address. Pass
	 * the reference to a one-argument
	 * `canInvokeAgent(...)` or `canInvokeWorkflow(...)` declaration.
	 *
	 * The helper is available before service composition. Mount finalization
	 * rejects a target that is not an explicit root of this service's Harness.
	 */
	harnessTarget<
		const Source extends AnyHarnessTargetContract | QueuedHarnessTargetReference<AnyHarnessTargetContract, string>,
	>(target: Source) {
		return createServiceBoundHarnessTargetReference<Source, Info['serviceName'], Info['serviceVersion']>(target, {
			serviceName: this.info.serviceName,
			serviceVersion: this.info.serviceVersion,
		})
	}

	/** Preserve resource-aware contextual typing for one Harness mount policy. */
	defineHarnessPolicy<const D>(
		_definition: D & HarnessDefinitionBoundary<D>,
		policy: HarnessDefinitionMountPolicy<D, S['Resources']>,
	): HarnessDefinitionMountPolicy<D, S['Resources']> {
		return policy
	}

	/**
	 * Define one resource-aware Harness host tool owned by this service lineage.
	 *
	 * Chain only the outgoing capabilities the handler needs, then call
	 * `setHandler(...)` to obtain the final frozen definition for an agent or
	 * workflow tool list.
	 */
	defineTool<const Id extends string, Input extends ModelSchema, Output extends HarnessSchema>(
		id: Id,
		options: Readonly<{
			description: string
			input: HarnessHostToolSchemaBoundary<Input>
			output: HarnessHostToolSchemaBoundary<Output>
		}>,
	) {
		return new HarnessHostToolBuilder<Id, Input, Output, S['Resources'], S['Metrics']>(
			this.#harnessHostOwner,
			id,
			options,
			definition => {
				if (this.#harnessHostTools.has(id)) {
					throw new TypeError(`Harness host tool "${id}" is already defined on this ServiceBuilder.`)
				}
				this.#harnessHostTools.set(id, definition)
			},
		)
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
		if (this.definitionsResolution) return this.definitionsResolution

		this.definitionsResolution = this.resolveDefinitionsOnce()
		return this.definitionsResolution
	}

	private async resolveDefinitionsOnce() {
		const mountedQueues = this.harnessMount
			? createMountedHarnessQueueDefinitions(this.harnessMount)
			: { queueDefinitions: [], queueWorkerDefinitions: [] }
		const [commands, subscriptions, streams, queues, queueWorkers] = await Promise.all([
			Promise.all(this.commandDefinitionList),
			Promise.all(this.subscriptionDefinitionList),
			Promise.all(this.streamDefinitionList),
			Promise.all([...this.queueDefinitionList, ...mountedQueues.queueDefinitions]),
			Promise.all([...this.queueWorkerDefinitionList, ...mountedQueues.queueWorkerDefinitions]),
		])
		const projections = this.harnessMount?.projections ?? []
		const resolvedCommands = commands.map(definition => finalizeDefinitionHarnessInvocations(definition, projections))
		const resolvedSubscriptions = subscriptions.map(definition =>
			finalizeDefinitionHarnessInvocations(definition, projections),
		)
		const resolvedStreams = streams.map(definition => finalizeDefinitionHarnessInvocations(definition, projections))
		const resolvedQueueWorkers = queueWorkers.map(definition =>
			finalizeDefinitionHarnessInvocations(definition, projections),
		)

		this.commandDefinitionListResolved = resolvedCommands
		this.subscriptionDefinitionListResolved = resolvedSubscriptions
		this.streamDefinitionListResolved = resolvedStreams
		this.queueDefinitionListResolved = queues
		this.queueWorkerDefinitionListResolved = resolvedQueueWorkers
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
			SetNewTypeValue<S, 'Resources', S['Resources'] & { [K in ResourceName]: InstanceOrType<ResourcesType> }>,
			Info
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
			>,
			Info
		>
	}

	/** Use a custom service subclass when creating service instances. */
	setCustomClass<T extends Service<ServiceClassTypes<S['ConfigType'], S['Resources'], S['Metrics']>>>(
		customClass: Newable<T, ServiceClassTypes<S['ConfigType'], S['Resources'], S['Metrics']>>,
	) {
		this.SClass = customClass
		return this as unknown as ServiceBuilder<SetNewTypeValue<S, 'ServiceClassType', T>, Info>
	}

	/** Return the service class constructor currently configured for this builder. */
	getCustomClass() {
		return this.SClass
	}

	/** Create a runnable service instance with runtime bridges, stores, resources, and agent bindings. */
	async getInstance(
		eventBridge: EventBridge,
		...args: S['Harnesses'] extends readonly [] ? [options?: InstanceConfigType<S>] : [options: InstanceConfigType<S>]
	) {
		const [options] = args
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
		const serviceEventContracts = this.harnessMount
			? await stageServiceEventContracts(commands, subscriptions, streams)
			: undefined
		const mountedRootTargets = this.harnessMount
			? this.harnessMount.projections.filter(entry => entry.visibility === 'root').map(entry => entry.target.id)
			: []
		const mountedStreamTargets = this.harnessMount?.projections.map(entry => entry.target.id) ?? []
		const commandTargets = new Set(commands.map(command => command.commandName))
		const streamTargets = new Set(streams.map(stream => stream.streamName))
		const occupiedMountedTargets = new Set<string>()
		for (const target of mountedStreamTargets) {
			if (occupiedMountedTargets.has(target)) {
				throw new UnhandledError(
					StatusCode.InternalServerError,
					`Harness target address "${target}" is published more than once.`,
				)
			}
			occupiedMountedTargets.add(target)
		}
		const commandCollision = mountedRootTargets.find(target => commandTargets.has(target))
		if (commandCollision) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				`Harness target address "${commandCollision}" conflicts with a command address.`,
			)
		}
		const streamCollision = mountedStreamTargets.find(target => streamTargets.has(target))
		if (streamCollision) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				`Harness target address "${streamCollision}" conflicts with a stream address.`,
			)
		}
		if (this.harnessMount) {
			assertCompletedEventCompatibility(this.harnessMount, serviceEventContracts ?? emptyMountedServiceEventContracts)
		}

		const C = this.getCustomClass()

		const service: InstanceType<typeof C> = new C({
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
		service.bindHarnessHostTools(this.#harnessHostTools, this.harnessMount?.projections ?? [])

		let harnessMountRuntime: HarnessMountRuntime | undefined
		if (this.harnessMount) {
			const occupiedEvents = serviceEventContracts ?? emptyMountedServiceEventContracts
			if (!options?.ai) {
				const error = new UnhandledError(
					StatusCode.InternalServerError,
					'This service mounts a Harness and requires ai runtime configuration.',
				)
				await cleanupAndRethrow(error, () => service.destroy(), logger, 'service construction')
				throw error
			}
			harnessMountRuntime = new HarnessMountRuntime({
				serviceName: this.info.serviceName,
				serviceVersion: this.info.serviceVersion,
				eventBridge,
				logger,
				mount: this.harnessMount,
				config: options.ai as never,
				resources: (options.resources ?? {}) as Record<string, unknown>,
				createHostContext: request => service.createHarnessHostToolContext(request),
				hostOwner: this.#harnessHostOwner as never,
				occupied: {
					commands: [...commandTargets],
					streams: [...streamTargets],
					events: occupiedEvents,
				},
			})
			const runtime = harnessMountRuntime
			try {
				runtime.preflight()
			} catch (error) {
				await cleanupAndRethrow(error, () => service.destroy(), logger, 'Harness mount preflight')
			}
			const start = service.start.bind(service)
			service.start = async () => {
				try {
					await start()
					await runtime.start()
				} catch (error) {
					await cleanupAndRethrow(error, () => service.destroy(), logger, 'service startup')
				}
			}
		}

		if (harnessMountRuntime) {
			const destroy = service.destroy.bind(service)
			let destroyPromise: Promise<void> | undefined
			service.destroy = () => {
				destroyPromise ??= (async () => {
					let runtimeFailed = false
					let runtimeFailure: unknown
					try {
						await harnessMountRuntime?.shutdown()
					} catch (error) {
						runtimeFailed = true
						runtimeFailure = error
					}
					try {
						await destroy()
					} catch (error) {
						if (!runtimeFailed) throw error
						logger.error({ err: error }, 'Service cleanup also failed after Harness shutdown failed.')
					}
					if (runtimeFailed) throw runtimeFailure
				})()
				return destroyPromise
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
		let mountedHarness = {}
		if (this.harnessMount) {
			const inspection = this.harnessMount.definition.inspect()
			mountedHarness = createMountedHarnessServiceExport({
				name: inspection.name,
				dependencies: inspection.dependencies,
				projections: this.harnessMount.projections,
			})
		}

		return {
			...this.info,
			...definitions,
			...mountedHarness,
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

function finalizeDefinitionHarnessInvocations<
	T extends Readonly<{ invokes: InvokeList; streamInvokes: StreamInvokeList }>,
>(definition: T, projections: readonly import('../HarnessMount/types.js').MountedHarnessTargetProjection<any>[]): T {
	const finalized = finalizeRegisteredHarnessInvocations(definition.invokes, definition.streamInvokes, projections)
	if (finalized.invokes === definition.invokes && finalized.streamInvokes === definition.streamInvokes)
		return definition
	return { ...definition, invokes: finalized.invokes, streamInvokes: finalized.streamInvokes }
}

async function cleanupAndRethrow(
	primaryError: unknown,
	cleanup: () => Promise<void>,
	logger: Logger,
	operation: string,
): Promise<never> {
	try {
		await cleanup()
	} catch (cleanupError) {
		logger.error({ err: cleanupError }, `${operation} cleanup also failed.`)
	}
	throw primaryError
}

function snapshotHarnessMountPolicy<D, Resources extends Record<string, unknown>>(
	policy: HarnessDefinitionMountPolicy<D, Resources> | undefined,
): HarnessDefinitionMountPolicy<D, Resources> | undefined {
	if (policy === undefined) return undefined
	return snapshotPolicyRecord(policy, 'Harness mount policy', (key, value) =>
		(key === 'agents' || key === 'workflows') && value !== undefined
			? snapshotPolicyRecord(value, 'Harness target policy group', (_target, targetPolicy) =>
					snapshotPolicyRecord(targetPolicy, 'Harness target policy', (field, fieldValue) => {
						if ((field === 'beforeGuards' || field === 'afterGuards') && fieldValue !== undefined) {
							return snapshotPolicyRecord(fieldValue, `Harness target policy ${field}`)
						}
						if (field === 'durableResume' && fieldValue !== undefined) {
							return snapshotPolicyRecord(fieldValue, 'Harness durable resume policy')
						}
						return fieldValue
					}),
				)
			: value,
	) as HarnessDefinitionMountPolicy<D, Resources>
}

async function stageServiceEventContracts(
	commands: CommandDefinitionListResolved<any>,
	subscriptions: SubscriptionDefinitionListResolved<any>,
	streams: StreamDefinitionListResolved<any>,
): Promise<Readonly<Record<string, HarnessTargetJsonSchema>>> {
	const contracts = new Map<string, HarnessTargetJsonSchema>()
	const add = (name: string | undefined, schema: unknown) => {
		if (name === undefined) return
		const jsonSchema = snapshotEventSchema(schema)
		const existing = contracts.get(name)
		if (existing !== undefined && canonicalHarnessJson(existing) !== canonicalHarnessJson(jsonSchema)) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				`Event contract "${name}" is declared with incompatible schemas.`,
			)
		}
		if (existing === undefined) contracts.set(name, jsonSchema)
	}
	const addEmitList = async (emitList: Readonly<Record<string, Schema>>) => {
		for (const [name, schema] of Object.entries(emitList)) add(name, await validationToSchema(schema))
	}

	for (const definition of commands) {
		add(definition.eventName, definition.metadata.expose.outputPayload)
		await addEmitList(definition.emitList)
	}
	for (const definition of subscriptions) {
		add(definition.emitEventName, definition.metadata.expose.outputPayload)
		await addEmitList(definition.emitList)
	}
	for (const definition of streams) {
		add(definition.finalEventName, definition.metadata.expose.finalPayload)
		await addEmitList(definition.emitList)
	}
	return Object.freeze(Object.fromEntries(contracts))
}

function snapshotEventSchema(value: unknown): HarnessTargetJsonSchema {
	return deepFreezePolicyValue(JSON.parse(canonicalHarnessJson(value ?? {})) as HarnessTargetJsonSchema)
}

function assertCompletedEventCompatibility(
	mount: HarnessMount,
	serviceEventContracts: Readonly<Record<string, HarnessTargetJsonSchema>>,
): void {
	const schemas = new Map(
		Object.entries(serviceEventContracts).map(([name, schema]) => [name, canonicalHarnessJson(schema)]),
	)
	for (const projection of mount.projections) {
		const completedEvent = projection.completedEvent
		if (!completedEvent) continue
		const canonical = canonicalHarnessJson(completedEvent.jsonSchema)
		const existing = schemas.get(completedEvent.name)
		if (existing !== undefined && existing !== canonical) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				`Harness completed event "${completedEvent.name}" conflicts with an existing event contract.`,
			)
		}
		schemas.set(completedEvent.name, canonical)
	}
}

function deepFreezePolicyValue<T>(value: T): T {
	if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
		for (const child of Object.values(value)) deepFreezePolicyValue(child)
		Object.freeze(value)
	}
	return value
}

function snapshotPolicyRecord(
	value: unknown,
	label: string,
	project: (key: string, value: unknown) => unknown = (_key, entry) => entry,
): Readonly<Record<string, unknown>> {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		throw new TypeError(`${label} must be a plain object.`)
	}
	const prototype = Object.getPrototypeOf(value)
	if (prototype !== Object.prototype && prototype !== null) {
		throw new TypeError(`${label} must be a plain object.`)
	}
	const snapshot: Record<string, unknown> = {}
	for (const key of Reflect.ownKeys(value)) {
		const descriptor = Object.getOwnPropertyDescriptor(value, key)
		if (typeof key !== 'string' || descriptor?.enumerable !== true || !Object.hasOwn(descriptor, 'value')) {
			throw new TypeError(`${label} must contain enumerable string data properties only.`)
		}
		snapshot[key] = project(key, descriptor.value)
	}
	return Object.freeze(snapshot)
}
