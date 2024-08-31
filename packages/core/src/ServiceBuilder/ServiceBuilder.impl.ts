import { fail } from 'node:assert'

import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import type { Infer, InferIn, Schema } from '@typeschema/main'

import { CommandDefinitionBuilder } from '../CommandDefinitionBuilder/index.js'
import { initDefaultConfigStore } from '../DefaultConfigStore/index.js'
import { initDefaultSecretStore } from '../DefaultSecretStore/index.js'
import { initDefaultStateStore } from '../DefaultStateStore/index.js'
import { SubscriptionDefinitionBuilder } from '../SubscriptionDefinitionBuilder/index.js'
import type {
	CommandDefinitionList,
	CommandDefinitionListResolved,
	Complete,
	ConfigStore,
	EmptyObject,
	EventBridge,
	LogLevelName,
	Logger,
	Prettify,
	SecretStore,
	ServiceClass,
	ServiceConstructorInput,
	ServiceInfoType,
	StateStore,
	SubscriptionDefinitionList,
	SubscriptionDefinitionListResolved,
} from '../core/index.js'
import { Service, StatusCode, UnhandledError, initLogger } from '../core/index.js'
import type { InstanceOrType, NonEmptyString } from '../helper/index.js'

export type Newable<T, ConfigType extends {}, Resources extends {}> = new (
	config: ServiceConstructorInput<ConfigType, Resources>,
) => T

/**
 * This class is used to build a service.
 * The `ServiceBuilder` class is used to build a service. It has a few methods that are used to add
 * command definitions and subscription definitions to the service. It also has a method that is used
 * to create an instance of the service class.
 *
 * @group Service
 */
export class ServiceBuilder<
	ConfigType extends {} = Record<string, unknown>,
	ConfigInputType = Record<string, unknown>,
	Resources extends {} = EmptyObject,
	ServiceClassType extends ServiceClass = Service<ConfigType, Resources>,
> {
	private commandDefinitionList: CommandDefinitionList<ServiceClassType> = []
	private subscriptionDefinitionList: SubscriptionDefinitionList<ServiceClassType> = []

	private commandDefinitionListResolved: CommandDefinitionListResolved<ServiceClassType> = []
	private subscriptionDefinitionListResolved: SubscriptionDefinitionListResolved<ServiceClassType> = []

	private configSchema?: Schema
	private defaultConfig?: Complete<ConfigType>

	private definitionsResolved = false

	private deprecated = false

	instance?: ServiceClassType
	SClass: Newable<any, ConfigType, Resources> = Service

	// eslint-disable-next-line no-useless-constructor
	constructor(public info: ServiceInfoType) {}

	/**
	 * "This function sets the config schema for the service builder."
	 *
	 * @param schema - The schema that will be used to validate the config.
	 * @returns ServiceBuilder
	 */
	setConfigSchema<T extends Schema>(schema: T) {
		this.configSchema = schema
		return this as unknown as ServiceBuilder<
			Infer<T> extends EmptyObject ? Infer<T> : Record<string, never>,
			InferIn<T>,
			Resources,
			Service<Infer<T> extends EmptyObject ? Infer<T> : Record<string, never>, Resources>
		>
	}

	/**
	 * "This function sets the default configuration for the service."
	 *
	 * @param config - ConfigType - The default configuration for the service.
	 * @returns The ServiceBuilder instance
	 */
	setDefaultConfig(config: Complete<ConfigType>): this {
		this.defaultConfig = config
		return this
	}

	/**
	 * Mark this service as deprecated
	 * @returns The ServiceBuilder instance
	 */
	markAsDeprecated() {
		this.deprecated = true
		return this
	}

	/**
	 * `addCommandDefinition` adds a list of command definitions to the service builder
	 * @param commands - CommandDefinitionList
	 * @returns The service builder
	 */
	addCommandDefinition(...commands: CommandDefinitionList<ServiceClassType>) {
		if (this.definitionsResolved) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'You can not add commands after resolveDefinitions is called.',
			)
		}
		this.commandDefinitionList.push(...commands)
		return this as ServiceBuilder<ConfigType, ConfigInputType, Resources, ServiceClassType>
	}

	/**
	 * It adds a subscription definition to the service builder
	 * @param subscription - SubscriptionDefinitionList
	 * @returns The service builder
	 */
	addSubscriptionDefinition(...subscription: SubscriptionDefinitionList<ServiceClassType>) {
		if (this.definitionsResolved) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'You can not add subscriptions after resolveDefinitions is called.',
			)
		}
		this.subscriptionDefinitionList.push(...subscription)
		return this as ServiceBuilder<ConfigType, ConfigInputType, Resources, ServiceClassType>
	}

	/**
	 *
	 * Resolves the command and subscription definitions
	 */
	public async resolveDefinitions() {
		if (this.definitionsResolved) {
			return {
				commands: this.commandDefinitionListResolved,
				subscriptions: this.subscriptionDefinitionListResolved,
			}
		}

		this.commandDefinitionListResolved = await Promise.all(this.commandDefinitionList)
		this.subscriptionDefinitionListResolved = await Promise.all(this.subscriptionDefinitionList)

		this.subscriptionDefinitionList = []
		this.commandDefinitionList = []

		this.definitionsResolved = true
		return {
			commands: this.commandDefinitionListResolved,
			subscriptions: this.subscriptionDefinitionListResolved,
		}
	}

	/**
	 * Define the resources of the service.
	 * Resources are available within commands and subscriptions.
	 *
	 * @example
	 * ```ts
	 * serviceBuilder.defineResources<'db',MySQL>('db',MySQL)
	 * ```
	 *
	 * @returns The builder with defined types for resources
	 */
	defineResource<ResourceName extends string, ResourcesType>(name: ResourceName, resource: ResourcesType) {
		return this as unknown as ServiceBuilder<
			ConfigType,
			ConfigInputType,
			Resources & { [K in ResourceName]: InstanceOrType<ResourcesType> },
			ServiceClassType
		>
	}

	/**
	 * It sets the class type of the service.
	 * @param customClass - A class which extends the Service class
	 * @returns The builder itself, but with the type of the service class changed.
	 */
	setCustomClass<T extends ServiceClass<ConfigType, Resources>>(customClass: Newable<T, ConfigType, Resources>) {
		this.SClass = customClass
		return this as unknown as ServiceBuilder<ConfigType, ConfigInputType, Resources, T>
	}

	getCustomClass() {
		return this.SClass
	}

	/**
	 * It creates a new instance of the service class, passing in the logger, service info, event bridge,
	 * command functions, subscription list, and configuration
	 * @param eventBridge - EventBridge
	 * @param options - additional config like logger, stores and opentelemetry span processor
	 * @returns The instance of the service class
	 */
	async getInstance(
		eventBridge: EventBridge,
		options: Prettify<
			{
				logLevel?: LogLevelName
				serviceConfig?: Partial<ConfigInputType>
				logger?: Logger
				spanProcessor?: SpanProcessor
				secretStore?: SecretStore
				configStore?: ConfigStore
				stateStore?: StateStore
				//resources?: Resources
			} & (keyof Resources extends never ? { resources?: Resources } : { resources: Resources })
		>,
	) {
		const config = {
			...this.defaultConfig,
			...options?.serviceConfig,
		} as ConfigType

		const opt = options.serviceConfig as any
		const hasLogLevel = opt?.logLevel
			? ['info', 'error', 'warn', 'debug', 'trace', 'fatal'].includes(opt.logLevel)
			: false

		const logger = options.logger ?? initLogger(hasLogLevel ? opt.logLevel : options.logLevel)

		const secretStore: SecretStore =
			options.secretStore ??
			initDefaultSecretStore({
				logger,
			})

		const configStore: ConfigStore =
			options.configStore ??
			initDefaultConfigStore({
				logger,
			})

		const stateStore: StateStore =
			options.stateStore ??
			initDefaultStateStore({
				logger,
			})

		const { commands, subscriptions } = await this.resolveDefinitions()

		const C = this.getCustomClass()
		this.instance = new C({
			logger,
			eventBridge,
			info: this.info,
			commandDefinitionList: commands,
			subscriptionDefinitionList: subscriptions,
			config,
			spanProcessor: options.spanProcessor,
			secretStore,
			configStore,
			stateStore,
			configSchema: this.configSchema,
			resources: options.resources,
		})

		return this.instance as ServiceClassType
	}

	/**
	 * It returns a new instance of the CommandDefinitionBuilder class, which is a class that is used to
	 * build a command definition
	 * @param commandName - The name of the command.
	 * @param description - The description of the command.
	 * @param eventName - The name of the event that will be emitted when the command is
	 * executed.
	 * @returns A CommandDefinitionBuilder object.
	 */
	getCommandBuilder<T extends string, N extends string>(
		commandName: NonEmptyString<T>,
		description: string,
		eventName?: NonEmptyString<N>,
	): CommandDefinitionBuilder<ServiceClassType, Resources> {
		return new CommandDefinitionBuilder<ServiceClassType, Resources>(
			commandName,
			description,
			eventName,
			this.deprecated,
		)
	}

	/**
	 * It returns a new instance of the `SubscriptionDefinitionBuilder` class, which is a class that is
	 * used to build a subscription definition
	 * @param subscriptionName - The name of the subscription.
	 * @param description - The description of the subscription.
	 * @returns A SubscriptionDefinitionBuilder
	 */
	getSubscriptionBuilder<T extends string>(
		subscriptionName: NonEmptyString<T>,
		description: string,
	): SubscriptionDefinitionBuilder<ServiceClassType, Resources> {
		return new SubscriptionDefinitionBuilder<ServiceClassType, Resources>(
			subscriptionName,
			description,
			this.deprecated,
		)
	}

	/**
	 * @returns the definition of registered commands
	 */
	getCommandDefinitions() {
		if (!this.resolveDefinitions) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'Definitions not resolve. Please call resolveDefinitions() before using getCommandDefinitions',
			)
		}
		return this.commandDefinitionListResolved
	}

	/**
	 * @returns the definition of registered subscriptions
	 */
	getSubscriptionDefinitions() {
		if (!this.resolveDefinitions) {
			throw new UnhandledError(
				StatusCode.InternalServerError,
				'Definitions not resolve. Please call resolveDefinitions() before using getCommandDefinitions',
			)
		}
		return this.subscriptionDefinitionListResolved
	}

	/**
	 * A simple test helper, which ensures, that there ar no duplicate names used.
	 */
	async testServiceSetup() {
		const { subscriptions, commands } = await this.resolveDefinitions()

		this.validateCommands(commands)
		this.validateSubscriptions(subscriptions)

		return true
	}

	protected validateCommands(commandDefinitions: CommandDefinitionListResolved<any>) {
		const existingNames = new Set()
		const eventNames = new Set()

		for (const definition of commandDefinitions) {
			const name = definition.commandName.toLowerCase().trim()
			const eventName = definition.eventName

			// check for duplicate command names
			if (existingNames.has(name)) {
				fail(`duplicate command name ${name}`)
			}
			existingNames.add(name)

			// check for duplicate event names
			if (eventName) {
				if (eventNames.has(eventName)) {
					fail(`response event "${eventName}" in ${name} is used in other command`)
				}
				eventNames.add(eventName)
			}
		}
	}

	/**
	 * Returns the service definition.
	 * This inclues information about commands and subscriptions.
	 *
	 * @returns
	 */
	async getFullServiceDefintion() {
		const definitions = await this.resolveDefinitions()

		return {
			...this.info,
			...definitions,
			deprecated: this.deprecated,
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

	/**
	 * @deprecated Use testServiceSetup() instead
	 */
	validateCommandDefinitions() {
		// biome-ignore lint/nursery/noConsole: no logger available
		console.warn('deprecated: Use testServiceSetup() instead')
	}

	/**
	 * @deprecated Use testServiceSetup() instead
	 */
	validateSubscriptionDefinitions() {
		// biome-ignore lint/nursery/noConsole: no logger available
		console.warn('deprecated: Use testServiceSetup() instead')
	}
}
