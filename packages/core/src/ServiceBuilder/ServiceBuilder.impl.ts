import { fail } from 'node:assert'

import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import type { Infer, InferIn, Schema } from '@typeschema/main'

import { CommandDefinitionBuilder } from '../CommandDefinitionBuilder/index.js'
import type {
  CommandDefinitionList,
  CommandDefinitionListResolved,
  Complete,
  ConfigStore,
  EventBridge,
  Logger,
  LogLevelName,
  SecretStore,
  ServiceClass,
  ServiceConstructorInput,
  ServiceInfoType,
  StateStore,
  SubscriptionDefinitionList,
  SubscriptionDefinitionListResolved,
} from '../core/index.js'
import { initLogger, Service, StatusCode, UnhandledError } from '../core/index.js'
import { initDefaultConfigStore } from '../DefaultConfigStore/index.js'
import { initDefaultSecretStore } from '../DefaultSecretStore/index.js'
import { initDefaultStateStore } from '../DefaultStateStore/index.js'
import type { NonEmptyString } from '../helper/index.js'
import { SubscriptionDefinitionBuilder } from '../SubscriptionDefinitionBuilder/index.js'

export type Newable<T, ConfigType> = { new (config: ServiceConstructorInput<ConfigType>): T }

/**
 * This class is used to build a service.
 * The `ServiceBuilder` class is used to build a service. It has a few methods that are used to add
 * command definitions and subscription definitions to the service. It also has a method that is used
 * to create an instance of the service class.
 *
 * @group Service
 */
export class ServiceBuilder<
  ConfigType = Record<string, unknown>,
  ConfigInputType = Record<string, unknown>,
  ServiceClassType extends ServiceClass = Service<ConfigType>,
> {
  private commandDefinitionList: CommandDefinitionList<ServiceClassType> = []
  private subscriptionDefinitionList: SubscriptionDefinitionList<ServiceClassType> = []

  private commandDefinitionListResolved: CommandDefinitionListResolved<ServiceClassType> = []
  private subscriptionDefinitionListResolved: SubscriptionDefinitionListResolved<ServiceClassType> = []

  private configSchema?: Schema
  private defaultConfig?: Complete<ConfigType>

  private definitionsResolved: boolean = false

  instance?: ServiceClassType
  SClass: Newable<any, ConfigType> = Service

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
    return this as unknown as ServiceBuilder<Infer<T>, InferIn<T>, Service<Infer<T>>>
  }

  /**
   * "This function sets the default configuration for the service."
   *
   * @param config - ConfigType - The default configuration for the service.
   * @returns The ServiceBuilder instance.
   */
  setDefaultConfig(config: Complete<ConfigType>): ServiceBuilder<ConfigType, ConfigInputType, ServiceClassType> {
    this.defaultConfig = config
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
    return this as ServiceBuilder<ConfigType, ConfigInputType, ServiceClassType>
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
    return this as ServiceBuilder<ConfigType, ConfigInputType, ServiceClassType>
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
   * It sets the class type of the service.
   * @param customClass - A class which extends the Service class
   * @returns The builder itself, but with the type of the service class changed.
   */
  setCustomClass<T extends ServiceClass<ConfigType>>(customClass: Newable<T, ConfigType>) {
    this.SClass = customClass as Newable<T, ConfigType>
    return this as unknown as ServiceBuilder<ConfigType, ConfigInputType, T>
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
    options: {
      logLevel?: LogLevelName
      serviceConfig?: Partial<ConfigInputType>
      logger?: Logger
      spanProcessor?: SpanProcessor
      secretStore?: SecretStore
      configStore?: ConfigStore
      stateStore?: StateStore
    } = {},
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
  ): CommandDefinitionBuilder<ServiceClassType> {
    return new CommandDefinitionBuilder<ServiceClassType>(commandName, description, eventName)
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
  ): SubscriptionDefinitionBuilder<ServiceClassType> {
    return new SubscriptionDefinitionBuilder<ServiceClassType>(subscriptionName, description)
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

    commandDefinitions.forEach((definition) => {
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
    })
  }

  protected validateSubscriptions(subscriptionDefinitions: SubscriptionDefinitionListResolved<any>) {
    const existingNames = new Set()
    subscriptionDefinitions.forEach((definition) => {
      const name = definition.subscriptionName.toLowerCase().trim()

      if (existingNames.has(name)) {
        fail(`duplicate subscription name ${name}`)
      }
      existingNames.add(name)
    })
  }

  /**
   * @deprecated Use validateServiceConfig() instead
   */
  validateCommandDefinitions() {
    // eslint-disable-next-line no-console
    console.warn('deprecated: Use validateServiceConfig() instead')
  }

  /**
   * @deprecated Use validateServiceConfig() instead
   */
  validateSubscriptionDefinitions() {
    // eslint-disable-next-line no-console
    console.warn('deprecated: Use validateServiceConfig() instead')
  }
}
