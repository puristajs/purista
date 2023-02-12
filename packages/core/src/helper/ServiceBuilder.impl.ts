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
import { FunctionDefinitionBuilder } from './FunctionDefinitionBuilder.impl'
import { SubscriptionDefinitionBuilder } from './SubscriptionDefinitionBuilder.impl'

export type Newable<T> = { new (...args: any[]): T }

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

  setConfigSchema<I = unknown, D extends z.ZodTypeDef = z.ZodTypeDef, O = unknown>(schema: z.ZodType<O, D, I>) {
    this.configSchema = schema
    return this as unknown as ServiceBuilder<O, I, Service<O>>
  }

  setDefaultConfig(config: ConfigType): ServiceBuilder<ConfigType, ConfigInputType, ServiceClassType> {
    let conf = config
    if (this.configSchema) {
      conf = this.configSchema.parse(config)
    }
    this.defaultConfig = conf
    return this
  }

  addFunctionDefinition(...functions: CommandDefinitionList<ServiceClassType>) {
    const existing = functions.filter((fn) =>
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

    this.commandFunctions.push(...functions)
    return this as ServiceBuilder<ConfigType, ConfigInputType, ServiceClassType>
  }

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

  setCustomClass<T extends ServiceClass<ConfigType>>(c: Newable<T>) {
    this.SClass = c
    return this as unknown as ServiceBuilder<ConfigType, ConfigInputType, T>
  }

  getInstance(
    eventBridge: EventBridge,
    options: { serviceConfig?: ConfigInputType; logger?: Logger; spanProcessor?: SpanProcessor } = {},
  ) {
    let conf = {
      ...this.defaultConfig,
      ...options?.serviceConfig,
    }

    const logInstance = options?.logger || initLogger()

    if (this.configSchema) {
      try {
        conf = this.configSchema.parse(options?.serviceConfig)
      } catch (err) {
        logInstance.error({ err, ...this.info }, 'Invalid configuration for')
        throw new Error('Fatal - unable to create service instance')
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

  getFunctionBuilder(
    commandName: string,
    description: string,
    eventName?: string,
  ): FunctionDefinitionBuilder<ServiceClassType> {
    return new FunctionDefinitionBuilder<ServiceClassType>(commandName, description, eventName)
  }

  getSubscriptionBuilder(
    subscriptionName: string,
    description: string,
  ): SubscriptionDefinitionBuilder<ServiceClassType> {
    return new SubscriptionDefinitionBuilder<ServiceClassType>(subscriptionName, description)
  }
}
