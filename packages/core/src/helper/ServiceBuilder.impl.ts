import { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import { z } from 'zod'

import {
  CommandDefinitionList,
  EventBridge,
  initLogger,
  Logger,
  Service,
  ServiceClass,
  ServiceInfoType,
  SubscriptionDefinitionList,
} from '../core'
import { CommandDefinitionBuilder } from './CommandDefinitionBuilder.impl'
import { SubscriptionDefinitionBuilder } from './SubscriptionDefinitionBuilder.impl'

export type Newable<T> = { new (...args: any[]): T }

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
  private commandFunctions: CommandDefinitionList<ServiceClassType> = []
  private subscriptionList: SubscriptionDefinitionList<ServiceClassType> = []

  private configSchema?: z.ZodType
  private defaultConfig?: ConfigType

  instance?: ServiceClassType

  SClass: any = Service

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
      this.commandFunctions.some((definition) => definition.commandName === fn.commandName),
    )

    if (existing.length) {
      // eslint-disable-next-line no-console
      console.error(
        `duplicate function definitions ${this.info.serviceName} version ${this.info.serviceVersion}`,
        existing,
      )
      throw new Error('duplicate function definitions')
    }

    this.commandFunctions.push(...commands)
    return this as ServiceBuilder<ConfigType, ConfigInputType, ServiceClassType>
  }

  /**
   * It adds a subscription definition to the service builder
   * @param subscription - SubscriptionDefinitionList<ServiceClassType>
   * @returns The service builder
   */
  addSubscriptionDefinition(...subscription: SubscriptionDefinitionList<ServiceClassType>) {
    const existing = subscription.filter((fn) =>
      this.subscriptionList.some((definition) => definition.subscriptionName === fn.subscriptionName),
    )

    if (existing.length) {
      // eslint-disable-next-line no-console
      console.error(
        `duplicate subscription definitions ${this.info.serviceName} version ${this.info.serviceVersion}`,
        existing,
      )
      throw new Error('duplicate function definitions')
    }

    this.subscriptionList.push(...subscription)
    return this as ServiceBuilder<ConfigType, ConfigInputType, ServiceClassType>
  }

  /**
   * It sets the class type of the service.
   * @param c - Newable<T>
   * @returns The builder itself, but with the type of the service class changed.
   */
  setCustomClass<T extends ServiceClass<ConfigType>>(c: Newable<T>) {
    this.SClass = c
    return this as unknown as ServiceBuilder<ConfigType, ConfigInputType, T>
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
    options: { serviceConfig?: ConfigInputType; logger?: Logger; spanProcessor?: SpanProcessor } = {},
  ) {
    let conf = {
      ...this.defaultConfig,
      ...options?.serviceConfig,
    }

    const logInstance = options?.logger || initLogger()

    if (this.configSchema && options?.serviceConfig) {
      try {
        conf = this.configSchema.parse(options?.serviceConfig)
      } catch (err) {
        logInstance.error({ err, ...this.info }, 'Invalid configuration for')
        throw new Error('Fatal - unable to create service instance because provided configuration is invalid')
      }
    }

    this.instance = new this.SClass(
      logInstance,
      this.info,
      eventBridge,
      this.commandFunctions,
      this.subscriptionList,
      conf as ConfigType,
      options?.spanProcessor,
    )

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
