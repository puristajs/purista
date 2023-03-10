import { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import { z } from 'zod'

import {
  CommandDefinitionList,
  ConfigStore,
  EventBridge,
  initLogger,
  Logger,
  SecretStore,
  Service,
  ServiceClass,
  ServiceConstructorInput,
  ServiceInfoType,
  StateStore,
  SubscriptionDefinitionList,
} from '../core'
import { initDefaultConfigStore } from '../core/DefaultConfigStore'
import { initDefaultSecretStore } from '../core/DefaultSecretStore'
import { initDefaultStateStore } from '../core/DefaultStateStore'
import { CommandDefinitionBuilder } from './CommandDefinitionBuilder.impl'
import { SubscriptionDefinitionBuilder } from './SubscriptionDefinitionBuilder.impl'

export type Newable<T, ConfigType> = { new (config: ServiceConstructorInput<ConfigType>): T }

/**
 * This class is used to build a service.
 * The `ServiceBuilder` class is used to build a service. It has a few methods that are used to add
 * command definitions and subscription definitions to the service. It also has a method that is used
 * to create an instance of the service class
 */
export class ServiceBuilder<
  ConfigType = Record<string, unknown>,
  ConfigInputType = Record<string, unknown>,
  ServiceClassType extends ServiceClass = Service<ConfigType>,
> {
  private commandDefinitionList: CommandDefinitionList<ServiceClassType> = []
  private subscriptionDefinitionList: SubscriptionDefinitionList<ServiceClassType> = []

  private configSchema?: z.ZodType
  private defaultConfig?: ConfigType

  instance?: ServiceClassType
  SClass: Newable<any, ConfigType> = Service

  // eslint-disable-next-line no-useless-constructor
  constructor(public info: ServiceInfoType) {}

  /**
   * "This function sets the config schema for the service builder."
   *
   * @param schema - The schema that will be used to validate the config.
   * @returns The ServiceBuilder<O, I, Service<O>>
   */
  setConfigSchema<I = unknown, D extends z.ZodTypeDef = z.ZodTypeDef, O = unknown>(schema: z.ZodType<O, D, I>) {
    this.configSchema = schema
    return this as unknown as ServiceBuilder<O, I, Service<O>>
  }

  /**
   * "This function sets the default configuration for the service."
   *
   * @param {ConfigType} config - ConfigType - The default configuration for the service.
   * @returns The ServiceBuilder instance.
   */
  setDefaultConfig(config: ConfigType): ServiceBuilder<ConfigType, ConfigInputType, ServiceClassType> {
    let conf = config
    if (this.configSchema) {
      conf = this.configSchema.parse(config)
    }
    this.defaultConfig = conf
    return this
  }

  /**
   *
   * @deprecated use addCommandDefinition instead of addFunctionDefinition as it will be removed soon.
   */
  addFunctionDefinition(...functions: CommandDefinitionList<ServiceClassType>) {
    return this.addCommandDefinition(...functions)
  }

  /**
   * `addCommandDefinition` adds a list of command definitions to the service builder
   * @param commands - CommandDefinitionList<ServiceClassType>
   * @returns The service builder
   */
  addCommandDefinition(...commands: CommandDefinitionList<ServiceClassType>) {
    const existing = commands.filter((fn) =>
      this.commandDefinitionList.some((definition) => definition.commandName === fn.commandName),
    )

    if (existing.length) {
      // eslint-disable-next-line no-console
      console.error(
        `duplicate function definitions ${this.info.serviceName} version ${this.info.serviceVersion}`,
        existing,
      )
      throw new Error('duplicate function definitions')
    }

    this.commandDefinitionList.push(...commands)
    return this as ServiceBuilder<ConfigType, ConfigInputType, ServiceClassType>
  }

  /**
   * It adds a subscription definition to the service builder
   * @param subscription - SubscriptionDefinitionList<ServiceClassType>
   * @returns The service builder
   */
  addSubscriptionDefinition(...subscription: SubscriptionDefinitionList<ServiceClassType>) {
    const existing = subscription.filter((fn) =>
      this.subscriptionDefinitionList.some((definition) => definition.subscriptionName === fn.subscriptionName),
    )

    if (existing.length) {
      // eslint-disable-next-line no-console
      console.error(
        `duplicate subscription definitions ${this.info.serviceName} version ${this.info.serviceVersion}`,
        existing,
      )
      throw new Error('duplicate function definitions')
    }

    this.subscriptionDefinitionList.push(...subscription)
    return this as ServiceBuilder<ConfigType, ConfigInputType, ServiceClassType>
  }

  /**
   * It sets the class type of the service.
   * @param c - Newable<T>
   * @returns The builder itself, but with the type of the service class changed.
   */
  setCustomClass<T extends ServiceClass<ConfigType>>(c: Newable<T, ConfigType>) {
    this.SClass = c as Newable<T, ConfigType>
    return this as unknown as ServiceBuilder<ConfigType, ConfigInputType, T>
  }

  getCustomClass() {
    return this.SClass
  }

  /**
   * It creates a new instance of the service class, passing in the logger, service info, event bridge,
   * command functions, subscription list, and configuration
   * @param {EventBridge} eventBridge - EventBridge
   * @param options - { serviceConfig?: ConfigInputType; logger?: Logger; spanProcessor?: SpanProcessor
   * } = {}
   * @returns The instance of the service class
   */
  getInstance(
    eventBridge: EventBridge,
    options: {
      serviceConfig?: ConfigInputType
      logger?: Logger
      spanProcessor?: SpanProcessor
      secretStore?: SecretStore
      configStore?: ConfigStore
      stateStore?: StateStore
    } = {},
  ) {
    let config = {
      ...this.defaultConfig,
      ...options?.serviceConfig,
    } as ConfigType

    const logger = options.logger || initLogger()

    if (this.configSchema && options.serviceConfig) {
      try {
        config = this.configSchema.parse(options.serviceConfig)
      } catch (err) {
        logger.error({ err, ...this.info }, 'Invalid configuration for')
        throw new Error('Fatal - unable to create service instance because provided configuration is invalid')
      }
    }

    const secretStore: SecretStore =
      options.secretStore ||
      initDefaultSecretStore({
        logger,
      })

    const configStore: ConfigStore =
      options.configStore ||
      initDefaultConfigStore({
        logger,
      })

    const stateStore: StateStore =
      options.stateStore ||
      initDefaultStateStore({
        logger,
      })

    const C = this.getCustomClass()
    this.instance = new C({
      logger,
      eventBridge,
      info: this.info,
      commandDefinitionList: this.commandDefinitionList,
      subscriptionDefinitionList: this.subscriptionDefinitionList,
      config,
      spanProcessor: options.spanProcessor,
      secretStore,
      configStore,
      stateStore,
    })

    return this.instance as ServiceClassType
  }

  /**
   *
   * @deprecated user getCommandBuilder instead. It will be removed soon.
   */
  getFunctionBuilder(
    commandName: string,
    description: string,
    eventName?: string,
  ): CommandDefinitionBuilder<ServiceClassType> {
    return new CommandDefinitionBuilder<ServiceClassType>(commandName, description, eventName)
  }

  /**
   * It returns a new instance of the CommandDefinitionBuilder class, which is a class that is used to
   * build a command definition
   * @param {string} commandName - The name of the command.
   * @param {string} description - The description of the command.
   * @param {string} [eventName] - The name of the event that will be emitted when the command is
   * executed.
   * @returns A CommandDefinitionBuilder object.
   */
  getCommandBuilder(
    commandName: string,
    description: string,
    eventName?: string,
  ): CommandDefinitionBuilder<ServiceClassType> {
    return new CommandDefinitionBuilder<ServiceClassType>(commandName, description, eventName)
  }

  /**
   * It returns a new instance of the `SubscriptionDefinitionBuilder` class, which is a class that is
   * used to build a subscription definition
   * @param {string} subscriptionName - The name of the subscription.
   * @param {string} description - The description of the subscription.
   * @returns A SubscriptionDefinitionBuilder<ServiceClassType>
   */
  getSubscriptionBuilder(
    subscriptionName: string,
    description: string,
  ): SubscriptionDefinitionBuilder<ServiceClassType> {
    return new SubscriptionDefinitionBuilder<ServiceClassType>(subscriptionName, description)
  }
}
