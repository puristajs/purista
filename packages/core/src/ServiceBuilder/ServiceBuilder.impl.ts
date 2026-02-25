import { fail } from 'node:assert'

import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import { CommandDefinitionBuilder } from '../CommandDefinitionBuilder/CommandDefinitionBuilder.impl.js'
import type { CommandDefinitionBuilderTypes } from '../CommandDefinitionBuilder/CommandDefinitionBuilderTypes.js'
import type { ConfigStore } from '../core/ConfigStore/types/ConfigStore.js'
import { UnhandledError } from '../core/Error/UnhandledError.impl.js'
import type { EventBridge } from '../core/EventBridge/types/EventBridge.js'
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
import type { ServiceBuilderTypes } from '../core/types/ServiceBuilderTypes.js'
import type { ServiceClassTypes } from '../core/types/ServiceClassTypes.js'
import type { ServiceConstructorInput } from '../core/types/ServiceConstructorInput.js'
import type { SetNewTypeValue, SetNewTypeValues } from '../core/types/SetNewTypeValue.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import type { StreamInvokeList } from '../core/types/StreamInvokeList.js'
import type { StreamDefinitionList, StreamDefinitionListResolved } from '../core/types/stream/StreamDefinitionList.js'
import type {
	SubscriptionDefinitionList,
	SubscriptionDefinitionListResolved,
} from '../core/types/subscription/SubscriptionDefinitionList.js'
import { initDefaultConfigStore } from '../DefaultConfigStore/initDefaultConfigStore.impl.js'
import { initLogger } from '../DefaultLogger/initLogger.impl.js'
import { initDefaultSecretStore } from '../DefaultSecretStore/initDefaultSecretStore.impl.js'
import { initDefaultStateStore } from '../DefaultStateStore/initDefaultStateStore.impl.js'
import type { InstanceOrType } from '../helper/types/InstanceOrType.js'
import type { NonEmptyString } from '../helper/types/NonEmptyString.js'
import { StreamDefinitionBuilder } from '../StreamDefinitionBuilder/StreamDefinitionBuilder.impl.js'
import type { StreamDefinitionBuilderTypes } from '../StreamDefinitionBuilder/StreamDefinitionBuilderTypes.js'
import { SubscriptionDefinitionBuilder } from '../SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.js'
import type { SubscriptionDefinitionBuilderTypes } from '../SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilderTypes.js'
import { type Infer, type InferIn, type Schema, validate } from '../schema/index.js'

export type Newable<T extends Service, S extends ServiceClassTypes> = new (config: ServiceConstructorInput<S>) => T

type InstanceConfigType<S extends ServiceBuilderTypes> = Prettify<
	{
		logLevel?: LogLevelName
		logger?: Logger
		spanProcessor?: SpanProcessor
		secretStore?: SecretStore
		configStore?: ConfigStore
		stateStore?: StateStore
	} & (keyof S['Resources'] extends NeverObject ? { resources?: never } : { resources: S['Resources'] }) &
		(keyof S['ConfigInputType'] extends NeverObject
			? { serviceConfig?: never }
			: { serviceConfig?: S['ConfigInputType'] })
>

/**
 * This class is used to build a service.
 *
 * @group Service
 */
export class ServiceBuilder<S extends ServiceBuilderTypes = ServiceBuilderTypes> {
	private commandDefinitionList: CommandDefinitionList<S['ServiceClassType']> = []
	private subscriptionDefinitionList: SubscriptionDefinitionList<S['ServiceClassType']> = []
	private streamDefinitionList: StreamDefinitionList<S['ServiceClassType']> = []

	private commandDefinitionListResolved: CommandDefinitionListResolved<S['ServiceClassType']> = []
	private subscriptionDefinitionListResolved: SubscriptionDefinitionListResolved<S['ServiceClassType']> = []
	private streamDefinitionListResolved: StreamDefinitionListResolved<S['ServiceClassType']> = []

	private configSchema?: Schema
	private defaultConfig?: Complete<S['ConfigType']>

	private definitionsResolved = false

	private deprecated = false

	private requiresResources = false

	SClass: Newable<S['ServiceClassType'], ServiceClassTypes<S['ConfigType'], S['Resources']>> = Service

	// eslint-disable-next-line no-useless-constructor
	constructor(public info: ServiceInfoType) {}

	setConfigSchema<T extends Schema>(schema: T) {
		this.configSchema = schema
		return this as unknown as ServiceBuilder<
			SetNewTypeValues<
				S,
				{
					ConfigType: Infer<T> extends Record<string, unknown> ? Infer<T> : NeverObject
					ConfigInputType: InferIn<T> extends Record<string, unknown> ? InferIn<T> : NeverObject
					ServiceClassType: Service<
						ServiceClassTypes<Infer<T> extends Record<string, unknown> ? Infer<T> : EmptyObject, S['Resources']>
					>
				}
			>
		>
	}

	setDefaultConfig(config: Complete<S['ConfigType']>): this {
		this.defaultConfig = config
		return this
	}

	markAsDeprecated() {
		this.deprecated = true
		return this
	}

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

	public async resolveDefinitions() {
		if (this.definitionsResolved) {
			return {
				commands: this.commandDefinitionListResolved,
				subscriptions: this.subscriptionDefinitionListResolved,
				streams: this.streamDefinitionListResolved,
			}
		}

		this.commandDefinitionListResolved = await Promise.all(this.commandDefinitionList)
		this.subscriptionDefinitionListResolved = await Promise.all(this.subscriptionDefinitionList)
		this.streamDefinitionListResolved = await Promise.all(this.streamDefinitionList)

		this.subscriptionDefinitionList = []
		this.commandDefinitionList = []
		this.streamDefinitionList = []

		this.definitionsResolved = true
		return {
			commands: this.commandDefinitionListResolved,
			subscriptions: this.subscriptionDefinitionListResolved,
			streams: this.streamDefinitionListResolved,
		}
	}

	defineResource<ResourceName extends string, ResourcesType>() {
		this.requiresResources = true
		return this as unknown as ServiceBuilder<
			SetNewTypeValue<S, 'Resources', S['Resources'] & { [K in ResourceName]: InstanceOrType<ResourcesType> }>
		>
	}

	setCustomClass<T extends Service<ServiceClassTypes<S['ConfigType'], S['Resources']>>>(
		customClass: Newable<T, ServiceClassTypes<S['ConfigType'], S['Resources']>>,
	) {
		this.SClass = customClass
		return this as unknown as ServiceBuilder<SetNewTypeValue<S, 'ServiceClassType', T>>
	}

	getCustomClass() {
		return this.SClass
	}

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

		const { commands, subscriptions, streams } = await this.resolveDefinitions()

		const C = this.getCustomClass()

		return new C({
			logger,
			eventBridge,
			info: this.info,
			commandDefinitionList: commands,
			subscriptionDefinitionList: subscriptions,
			streamDefinitionList: streams,
			config,
			spanProcessor: options?.spanProcessor,
			secretStore,
			configStore,
			stateStore,
			configSchema: this.configSchema,
			resources: options?.resources,
		})
	}

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
				Record<string, Schema>
			>
		>(commandName, description, eventName, this.deprecated)
	}

	getSubscriptionBuilder<T extends string>(
		subscriptionName: NonEmptyString<T>,
		description: string,
	): SubscriptionDefinitionBuilder<
		S['ServiceClassType'],
		SubscriptionDefinitionBuilderTypes<any, any, any, any, any, any, S['Resources'], InvokeList, StreamInvokeList>
	> {
		return new SubscriptionDefinitionBuilder<
			S['ServiceClassType'],
			SubscriptionDefinitionBuilderTypes<any, any, any, any, any, any, S['Resources'], InvokeList, StreamInvokeList>
		>(subscriptionName, description, this.deprecated)
	}

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
				Record<string, Schema>
			>
		>(streamName, description, finalEventName, this.deprecated)
	}

	getCommandDefinitions() {
		if (!this.definitionsResolved) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'Definitions not resolve. Please call resolveDefinitions() before using getCommandDefinitions',
			)
		}
		return this.commandDefinitionListResolved
	}

	getSubscriptionDefinitions() {
		if (!this.definitionsResolved) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'Definitions not resolve. Please call resolveDefinitions() before using getCommandDefinitions',
			)
		}
		return this.subscriptionDefinitionListResolved
	}

	getStreamDefinitions() {
		if (!this.definitionsResolved) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'Definitions not resolve. Please call resolveDefinitions() before using getStreamDefinitions',
			)
		}
		return this.streamDefinitionListResolved
	}

	async testServiceSetup() {
		const { subscriptions, commands, streams } = await this.resolveDefinitions()

		this.validateCommands(commands)
		this.validateSubscriptions(subscriptions)
		this.validateStreams(streams)

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
