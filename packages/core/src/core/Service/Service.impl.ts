import { SpanStatusCode, trace } from '@opentelemetry/api'
import type { Infer, Schema } from '@typeschema/main'
import { validate } from '@typeschema/main'

import { DefaultConfigStore } from '../../DefaultConfigStore/index.js'
import { DefaultSecretStore } from '../../DefaultSecretStore/index.js'
import { DefaultStateStore } from '../../DefaultStateStore/index.js'
import { puristaVersion } from '../../version.js'
import type { ConfigDeleteFunction, ConfigGetterFunction, ConfigSetterFunction } from '../ConfigStore/index.js'
import { HandledError } from '../Error/HandledError.impl.js'
import { UnhandledError } from '../Error/UnhandledError.impl.js'
import {
  createErrorResponse,
  createInfoMessage,
  createInvokeFunctionProxy,
  createSuccessResponse,
  deserializeOtp,
  getCleanedMessage,
  serializeOtp,
} from '../helper/index.js'
import type { SecretDeleteFunction, SecretGetterFunction, SecretSetterFunction } from '../SecretStore/index.js'
import type { StateDeleteFunction, StateGetterFunction, StateSetterFunction } from '../StateStore/index.js'
import type {
  Command,
  CommandDefinition,
  CommandDefinitionListResolved,
  CommandFunctionContext,
  ContextBase,
  CustomMessage,
  EBMessage,
  EBMessageAddress,
  EBMessageSenderAddress,
  EmitSchemaList,
  InfoMessageType,
  Logger,
  PrincipalId,
  ServiceClass,
  ServiceConstructorInput,
  Subscription,
  SubscriptionDefinition,
  SubscriptionDefinitionListResolved,
  SubscriptionFunctionContext,
  TenantId,
  TraceId,
} from '../types/index.js'
import {
  EBMessageType,
  PuristaSpanName,
  PuristaSpanTag,
  ServiceEventsNames,
  StatusCode,
  StoreType,
} from '../types/index.js'
import { commandTransformInput } from './commandTransformInput.impl.js'
import { ServiceBaseClass } from './ServiceBaseClass/index.js'
import { subscriptionTransformInput } from './subscriptionTransformInput.impl.js'

/**
 * Base class for all services.
 * This class provides base functions to work with the event bridge, logging and so on
 *
 * Every service should extend this class and should not directly access the eventbridge or other service
 *
 * ```typescript
 * class MyService extends Service {
 *
 *   async start() {
 *     await super.start()
 *     // your custom implementation
 *   }
 *
 *   async destroy() {
 *     // your custom implementation
 *    await super.destroy()
 *   }
 * }
 * ```
 *
 * @group Service
 */
export class Service<ConfigType = unknown> extends ServiceBaseClass implements ServiceClass<ConfigType> {
  protected subscriptions = new Map<string, SubscriptionDefinition>()
  protected commands = new Map<string, CommandDefinition>()

  public commandDefinitionList: CommandDefinitionListResolved<any>
  public subscriptionDefinitionList: SubscriptionDefinitionListResolved<any>
  public config: ConfigType

  public isStarted: boolean = false

  constructor(config: ServiceConstructorInput<ConfigType>) {
    super({
      logger: config.logger,
      info: config.info,
      eventBridge: config.eventBridge,
      spanProcessor: config.spanProcessor,
      secretStore: config.secretStore ?? new DefaultSecretStore(),
      configStore: config.configStore ?? new DefaultConfigStore(),
      stateStore: config.stateStore ?? new DefaultStateStore(),
      configSchema: config.configSchema,
    })

    this.config = config.config
    this.commandDefinitionList = config.commandDefinitionList
    this.subscriptionDefinitionList = config.subscriptionDefinitionList
  }

  get name() {
    return `${this.info.serviceName}V${this.info.serviceVersion}`
  }

  /**
   * It connects to the event bridge and subscribes to the topics that are in the subscription list.
   */
  async start() {
    if (this.isStarted) {
      throw new UnhandledError(StatusCode.InternalServerError, 'Service already started')
    }
    return this.startActiveSpan('purista.start', {}, undefined, async (span) => {
      try {
        if (this.configSchema) {
          const validationResult = await validate(this.configSchema, this.config)
          if (!validationResult.success) {
            const err = new UnhandledError(
              StatusCode.InternalServerError,
              `service ${this.serviceInfo.serviceName} ${this.serviceInfo.serviceVersion}: invalid service configuration provided`,
              validationResult.issues,
            )
            this.logger.error({ ...span.spanContext(), puristaVersion, err }, err.message)
            throw err
          }
        }

        await this.initializeEventbridgeConnect(this.commandDefinitionList, this.subscriptionDefinitionList)
        await this.sendServiceInfo(EBMessageType.InfoServiceReady)
        this.logger.info(
          { ...span.spanContext(), puristaVersion },
          `service ${this.serviceInfo.serviceName} ${this.serviceInfo.serviceVersion} started`,
        )
        this.emit(ServiceEventsNames.ServiceStarted)
      } catch (err) {
        this.logger.error({ err, ...span.spanContext(), puristaVersion }, `failed to start service`)
        this.emit(ServiceEventsNames.ServiceUnavailable, err)
        throw err
      }

      this.isStarted = true
    })
  }

  /**
   * Connect service to event bridge to receive commands and command responses
   */
  protected async initializeEventbridgeConnect(
    commandDefinitionList: CommandDefinitionListResolved<any>,
    subscriptions: SubscriptionDefinitionListResolved<any>,
  ) {
    return this.startActiveSpan('purista.initializeEventbridgeConnect', {}, undefined, async (span) => {
      const isEventBridgeReady = await this.eventBridge.isHealthy()

      if (!isEventBridgeReady) {
        const err = new UnhandledError(StatusCode.ServiceUnavailable, 'eventbridge not healthy')
        this.logger.error({ err }, 'Eventbridge is not ready - can not start service')
        throw err
      }

      // send info message that this service is going to start up now
      await this.sendServiceInfo(EBMessageType.InfoServiceInit)

      // register commands for this service
      const commandProms = commandDefinitionList.map((command) => this.registerCommand(command))
      await Promise.all(commandProms)

      // register subscriptions for this service
      const subscriptionProms = subscriptions.map((subscription) => {
        this.logger.debug({ name: subscription.subscriptionName, ...span.spanContext() }, 'start subscription')
        return this.registerSubscription(subscription)
      })
      await Promise.all(subscriptionProms)
    })
  }

  /**
   * Broadcast service info message
   * @param infoType type of info message
   * @param target function name is need in messages like InfoServiceFunctionAdded
   */
  protected async sendServiceInfo(infoType: InfoMessageType, target?: string, payload?: Record<string, unknown>) {
    return this.startActiveSpan('purista.sendServiceInfo', {}, undefined, async (span) => {
      const info = createInfoMessage(
        infoType,
        {
          serviceName: this.info.serviceName,
          serviceVersion: this.info.serviceVersion,
          serviceTarget: target ?? '',
          instanceId: this.eventBridge.instanceId,
        },
        { payload },
      )

      const result = await this.eventBridge.emitMessage(info)

      span.end()
      return result
    })
  }

  protected getInvokeFunction(
    serviceTarget: string,
    traceId?: TraceId,
    principalId?: PrincipalId,
    tenantId?: TenantId,
    invokes?: Record<
      string,
      Record<string, Record<string, { outputSchema?: Schema; payloadSchema?: Schema; parameterSchema?: Schema }>>
    >,
  ) {
    const sender: EBMessageSenderAddress = {
      serviceName: this.info.serviceName,
      serviceVersion: this.info.serviceVersion,
      serviceTarget,
      instanceId: this.eventBridge.instanceId,
    }

    const invokeCommand = async (
      receiver: EBMessageAddress,
      invokePayload: unknown,
      invokeparameter: unknown,
      contentType = 'application/json',
      contentEncoding = 'utf-8',
    ): Promise<any> => {
      let payload = invokePayload
      let parameter = invokeparameter

      return await this.startActiveSpan(serviceTarget + '.invoke', {}, undefined, async (span) => {
        span.setAttributes({
          [PuristaSpanTag.ReceiverServiceName]: receiver.serviceName,
          [PuristaSpanTag.ReceiverServiceVersion]: receiver.serviceVersion,
          [PuristaSpanTag.ReceiverServiceTarget]: receiver.serviceTarget,
        })

        const payloadSchema =
          invokes?.[receiver.serviceName]?.[receiver.serviceVersion]?.[receiver.serviceTarget]?.payloadSchema

        if (payloadSchema) {
          const res = await validate(payloadSchema, payload)
          if (!res.success) {
            const err = new UnhandledError(StatusCode.BadRequest, 'invoke payload schema validation failed', {
              issues: res.issues,
              invokedFrom: sender,
              responseFrom: receiver,
            })

            span.recordException(err)
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: err.message,
            })

            throw err
          }
          payload = res.data
        }

        const parameterSchema =
          invokes?.[receiver.serviceName]?.[receiver.serviceVersion]?.[receiver.serviceTarget]?.parameterSchema

        if (parameterSchema) {
          const res = await validate(parameterSchema, parameter)
          if (!res.success) {
            const err = new UnhandledError(StatusCode.BadRequest, 'invoke parameter schema validation failed', {
              issues: res.issues,
              invokedFrom: sender,
              responseFrom: receiver,
            })

            span.recordException(err)
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: err.message,
            })

            throw err
          }

          parameter = res.data
        }

        const msg: Readonly<Omit<Command, 'correlationId' | 'id' | 'timestamp'>> = Object.freeze({
          messageType: EBMessageType.Command,
          traceId,
          sender,
          receiver,
          contentType,
          contentEncoding,
          payload: {
            payload,
            parameter,
          },
          principalId,
          tenantId,
        })

        const outputSchema =
          invokes?.[receiver.serviceName]?.[receiver.serviceVersion]?.[receiver.serviceTarget]?.outputSchema

        if (!outputSchema) {
          return this.eventBridge.invoke(msg)
        }

        const response = await this.eventBridge.invoke(msg)

        const outResult = await validate(outputSchema, response)

        if (outResult.success) {
          span.setStatus({
            code: SpanStatusCode.OK,
            message: 'OK',
          })
          return outResult.data
        }

        const err = new UnhandledError(
          StatusCode.InternalServerError,
          'invoke response output schema validation failed',
          {
            issues: outResult.issues,
            invokedFrom: sender,
            responseFrom: receiver,
          },
        )

        span.recordException(err)
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: err.message,
        })

        throw err
      })
    }

    return invokeCommand.bind(this)
  }

  protected getEmitFunction<EmitList = {}>(
    serviceTarget: string,
    traceId?: TraceId,
    principalId?: PrincipalId,
    tenantId?: TenantId,
    emitList?: EmitList,
  ) {
    const sender: EBMessageSenderAddress = {
      serviceName: this.info.serviceName,
      serviceVersion: this.info.serviceVersion,
      serviceTarget,
      instanceId: this.eventBridge.instanceId,
    }

    const emitCustomEvent = async <K extends keyof EmitList, Payload = EmitList[K]>(
      eventName: K,
      eventPayload?: Payload,
      contentType = 'application/json',
      contentEncoding = 'utf-8',
    ) => {
      await this.startActiveSpan('purista.emitEvent', {}, undefined, async (span) => {
        const eventSchemas = emitList as EmitSchemaList<EmitList>
        const schema = eventSchemas[eventName]

        if (!schema) {
          const err = new UnhandledError(StatusCode.InternalServerError, `No schema for ${eventName as string} found`, {
            eventName,
          })
          span.recordException(err)
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: err.message,
          })
          throw err
        }

        const validation = await validate(schema, eventPayload)
        if (!validation.success) {
          const err = new UnhandledError(
            StatusCode.InternalServerError,
            `Payload validation for event ${eventName as string} failed`,
            { eventName, issues: validation.issues },
          )
          span.recordException(err)
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: err.message,
          })
          throw err
        }

        span.addEvent(eventName as string)
        const msg: Readonly<Omit<CustomMessage<Infer<typeof schema>>, 'id' | 'timestamp'>> = Object.freeze({
          messageType: EBMessageType.CustomMessage,
          traceId,
          contentType,
          contentEncoding,
          sender,
          eventName: eventName as string,
          payload: validation.data,
          principalId,
          tenantId,
        })

        const res = this.eventBridge.emitMessage(msg)

        span.setStatus({
          code: SpanStatusCode.OK,
          message: 'OK',
        })

        return res
      })
    }

    return emitCustomEvent.bind(this)
  }

  public getContextFunctions(logger: Logger): ContextBase {
    const getSecretFunction = async function (this: Service<ConfigType>, ...secretNames: string[]) {
      return this.wrapInSpan(PuristaSpanName.SecretStoreGetValue, {}, async (span) => {
        try {
          span.setAttributes({
            [PuristaSpanTag.StoreName]: this.secretStore.name,
            [PuristaSpanTag.StoreType]: StoreType.SecretStore,
          })
          return this.secretStore.getSecret(...secretNames)
        } catch (err) {
          span.recordException(err as Error)
          throw err
        }
      })
    }
    const getSecret: SecretGetterFunction = getSecretFunction.bind(this)

    const setSecretFunction = async function (this: Service<ConfigType>, secretName: string, value: string) {
      return this.wrapInSpan(PuristaSpanName.SecretStoreGetValue, {}, async (span) => {
        try {
          span.setAttributes({
            [PuristaSpanTag.StoreName]: this.secretStore.name,
            [PuristaSpanTag.StoreType]: StoreType.SecretStore,
          })
          return this.secretStore.setSecret(secretName, value)
        } catch (err) {
          span.recordException(err as Error)
          throw err
        }
      })
    }
    const setSecret: SecretSetterFunction = setSecretFunction.bind(this)

    const removeSecretFunction = async function (this: Service<ConfigType>, secretName: string) {
      return this.wrapInSpan(PuristaSpanName.SecretStoreGetValue, {}, async (span) => {
        try {
          span.setAttributes({
            [PuristaSpanTag.StoreName]: this.secretStore.name,
            [PuristaSpanTag.StoreType]: StoreType.SecretStore,
          })
          return this.secretStore.removeSecret(secretName)
        } catch (err) {
          span.recordException(err as Error)
          throw err
        }
      })
    }
    const removeSecret: SecretDeleteFunction = removeSecretFunction.bind(this)

    const getConfigFunction = async function (this: Service<ConfigType>, ...configNames: string[]) {
      return this.wrapInSpan(PuristaSpanName.ConfigStoreGetValue, {}, async (span) => {
        try {
          span.setAttributes({
            [PuristaSpanTag.StoreName]: this.configStore.name,
            [PuristaSpanTag.StoreType]: StoreType.ConfigStore,
          })
          return this.configStore.getConfig(...configNames)
        } catch (err) {
          span.recordException(err as Error)
          throw err
        }
      })
    }
    const getConfig: ConfigGetterFunction = getConfigFunction.bind(this)

    const setConfigFunction = async function (this: Service<ConfigType>, configName: string, value: unknown) {
      return this.wrapInSpan(PuristaSpanName.ConfigStoreGetValue, {}, async (span) => {
        try {
          span.setAttributes({
            [PuristaSpanTag.StoreName]: this.configStore.name,
            [PuristaSpanTag.StoreType]: StoreType.ConfigStore,
          })
          return this.configStore.setConfig(configName, value)
        } catch (err) {
          span.recordException(err as Error)
          throw err
        }
      })
    }
    const setConfig: ConfigSetterFunction = setConfigFunction.bind(this)

    const removeConfigFunction = async function (this: Service<ConfigType>, configName: string) {
      return this.wrapInSpan(PuristaSpanName.ConfigStoreGetValue, {}, async (span) => {
        try {
          span.setAttributes({
            [PuristaSpanTag.StoreName]: this.configStore.name,
            [PuristaSpanTag.StoreType]: StoreType.ConfigStore,
          })
          return this.configStore.removeConfig(configName)
        } catch (err) {
          span.recordException(err as Error)
          throw err
        }
      })
    }
    const removeConfig: ConfigDeleteFunction = removeConfigFunction.bind(this)

    const getStateFunction = async function (this: Service<ConfigType>, ...stateNames: string[]) {
      return this.wrapInSpan(PuristaSpanName.StateStoreGetValue, {}, async (span) => {
        try {
          span.setAttributes({
            [PuristaSpanTag.StoreName]: this.stateStore.name,
            [PuristaSpanTag.StoreType]: StoreType.StateStore,
          })
          return this.stateStore.getState(...stateNames)
        } catch (err) {
          span.recordException(err as Error)
          throw err
        }
      })
    }
    const getState: StateGetterFunction = getStateFunction.bind(this)

    const setStateFunction = async function (this: Service<ConfigType>, stateName: string, value: unknown) {
      return this.wrapInSpan(PuristaSpanName.StateStoreGetValue, {}, async (span) => {
        try {
          span.setAttributes({
            [PuristaSpanTag.StoreName]: this.stateStore.name,
            [PuristaSpanTag.StoreType]: StoreType.StateStore,
          })
          return this.stateStore.setState(stateName, value)
        } catch (err) {
          span.recordException(err as Error)
          throw err
        }
      })
    }
    const setState: StateSetterFunction = setStateFunction.bind(this)

    const removeStateFunction = async function (this: Service<ConfigType>, stateName: string) {
      return this.wrapInSpan(PuristaSpanName.StateStoreGetValue, {}, async (span) => {
        try {
          span.setAttributes({
            [PuristaSpanTag.StoreName]: this.stateStore.name,
            [PuristaSpanTag.StoreType]: StoreType.StateStore,
          })
          return this.stateStore.removeState(stateName)
        } catch (err) {
          span.recordException(err as Error)
          throw err
        }
      })
    }
    const removeState: StateDeleteFunction = removeStateFunction.bind(this)

    return {
      logger,
      wrapInSpan: this.wrapInSpan.bind(this),
      startActiveSpan: this.startActiveSpan.bind(this),
      secrets: {
        getSecret,
        setSecret,
        removeSecret,
      },
      configs: {
        getConfig,
        setConfig,
        removeConfig,
      },
      states: {
        getState,
        setState,
        removeState,
      },
    }
  }

  /**
   * Called when a command is received by the service
   *
   * @param subscriptionId
   * @param command
   */
  public async executeCommand(message: Readonly<Command>) {
    const command = this.commands.get(message.receiver.serviceTarget)

    const context = deserializeOtp(this.logger, message.otp)

    return this.startActiveSpan(command?.commandName ?? 'purista.executeCommand', {}, context, async (span) => {
      const traceId = message.traceId

      const logger = this.logger.getChildLogger({
        serviceTarget: command?.commandName,
        ...span.spanContext(),
        customTraceId: traceId,
        principalId: message.principalId,
        tenantId: message.tenantId,
      })

      if (message.principalId) {
        span.setAttribute(PuristaSpanTag.PrincipalId, message.principalId)
      }

      if (message.tenantId) {
        span.setAttribute(PuristaSpanTag.TenantId, message.tenantId)
      }

      if (!command) {
        logger.error({ message: getCleanedMessage(message) }, 'received invalid command')

        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: 'received invalid command',
        })
        return await this.startActiveSpan('sendErrorResponse', {}, undefined, async () =>
          createErrorResponse(this.eventBridge.instanceId, message, StatusCode.NotImplemented),
        )
      }

      try {
        const { payload, parameter } = await commandTransformInput(this, logger, command, message)

        let result: unknown = await this.startActiveSpan(
          command.commandName + '.functionExecution',
          {},
          undefined,
          async (_subSpan) => {
            const context: CommandFunctionContext = {
              message,
              emit: this.getEmitFunction(
                command.commandName,
                traceId,
                message.principalId,
                message.tenantId,
                command.emitList,
              ),
              invoke: this.getInvokeFunction(
                command.commandName,
                traceId,
                message.principalId,
                message.tenantId,
                command.invokes,
              ),
              ...this.getContextFunctions(logger),
              service: createInvokeFunctionProxy(
                this.getInvokeFunction(
                  command.commandName,
                  traceId,
                  message.principalId,
                  message.tenantId,
                  command.invokes,
                ),
              ),
            }
            const call = command.call.bind(this, context)
            return await call(payload, parameter)
          },
        )

        if (Object.keys(command.hooks.afterGuard ?? {}).length) {
          const guards = command.hooks.afterGuard

          await this.startActiveSpan(command.commandName + '.afterGuardHooks', {}, undefined, async () => {
            const guardsPromises: Promise<void>[] = []

            for (const [name, hook] of Object.entries(guards ?? {})) {
              const context: CommandFunctionContext = {
                message,
                emit: this.getEmitFunction(
                  command.commandName,
                  traceId,
                  message.principalId,
                  message.tenantId,
                  command.emitList,
                ),
                invoke: this.getInvokeFunction(
                  command.commandName,
                  traceId,
                  message.principalId,
                  message.tenantId,
                  command.invokes,
                ),
                ...this.getContextFunctions(logger),
                service: createInvokeFunctionProxy(
                  this.getInvokeFunction(
                    command.commandName,
                    traceId,
                    message.principalId,
                    message.tenantId,
                    command.invokes,
                  ),
                ),
              }

              const guardPromise = this.wrapInSpan('afterGuardHook.' + name, {}, async (_subSpan) => {
                return hook.bind(this)(context, result as Readonly<unknown>, payload, parameter)
              })
              guardsPromises.push(guardPromise)
            }

            await Promise.all(guardsPromises)
          })
        }

        if (command.hooks.transformOutput) {
          const transformOutput = command.hooks.transformOutput
          await this.startActiveSpan(command.commandName + '.outputTransformation', {}, undefined, async (subSpan) => {
            const afterTransform = transformOutput.transformFunction.bind(this, {
              message,
              ...this.getContextFunctions(logger),
            })
            const resultTransformed = await afterTransform(result as Readonly<unknown>, parameter)

            const validationResult = await validate(transformOutput.transformOutputSchema, resultTransformed)
            if (!validationResult.success) {
              const err = new UnhandledError(StatusCode.InternalServerError, undefined, validationResult.issues)
              subSpan.recordException(err)
              logger.warn({ ...subSpan.spanContext(), err }, 'transform output validation failed:', err.message)

              subSpan.setStatus({
                code: SpanStatusCode.ERROR,
                message: 'transform output validation failed',
              })
              throw err
            }
            result = validationResult.data
          })
        }

        return await this.startActiveSpan(command.commandName + '.success', {}, undefined, async (subSpan) => {
          if (command.eventName) {
            subSpan.addEvent(command.eventName)
            this.emit(`custom-${command.eventName}`, result)
          }
          return {
            ...createSuccessResponse(this.eventBridge.instanceId, message, result, command.eventName),
            otp: serializeOtp(),
          }
        })
      } catch (error) {
        span.recordException(error as Error)

        if (error instanceof HandledError) {
          this.emit(ServiceEventsNames.CommandHandledError, { commandName: command.commandName, error, traceId })
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error.message,
          })

          return await this.startActiveSpan('sendErrorResponse', {}, undefined, async () =>
            createErrorResponse(this.eventBridge.instanceId, message, (error as HandledError).errorCode, error),
          )
        }

        this.emit(ServiceEventsNames.CommandUnhandledError, { commandName: command.commandName, error, traceId })

        logger.error(
          { err: error, message: getCleanedMessage(message), ...span.spanContext() },
          'executeCommand unhandled error',
        )

        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: 'executeCommand unhandled error',
        })

        return await this.startActiveSpan(command.commandName + '.error', {}, undefined, async () =>
          createErrorResponse(this.eventBridge.instanceId, message, StatusCode.InternalServerError, error),
        )
      }
    })
  }

  public async registerCommand(commandDefinition: CommandDefinition): Promise<void> {
    return this.startActiveSpan('purista.registerCommand', {}, undefined, async (span) => {
      this.logger.debug({ ...this.serviceInfo, ...span.spanContext() }, 'register command')

      span.setAttributes({
        serviceName: this.serviceInfo.serviceName,
        serviceVersion: this.serviceInfo.serviceVersion,
        commandName: commandDefinition.commandName,
      })

      this.commands.set(commandDefinition.commandName, commandDefinition)

      await this.eventBridge.registerCommand(
        {
          serviceName: this.serviceInfo.serviceName,
          serviceVersion: this.serviceInfo.serviceVersion,
          serviceTarget: commandDefinition.commandName,
        },
        this.executeCommand.bind(this),
        commandDefinition.metadata,
        commandDefinition.eventBridgeConfig,
      )

      span.end()
    })
  }

  public async executeSubscription(
    message: Readonly<EBMessage>,
    subscriptionName: string,
  ): Promise<Omit<CustomMessage, 'id' | 'timestamp'> | undefined> {
    const subscription = this.subscriptions.get(subscriptionName)

    const otpContext = deserializeOtp(this.logger, message.otp)
    const spanContext = otpContext ? trace.getSpanContext(otpContext) : undefined

    return this.startActiveSpan(
      subscriptionName || 'purista.executeSubscription',
      { links: spanContext ? [{ context: spanContext }] : [] },
      undefined,
      async (span) => {
        const traceId = message.traceId

        const logger = this.logger.getChildLogger({
          serviceTarget: subscriptionName,
          ...span.spanContext(),
          customTraceId: traceId,
          principalId: message.principalId,
          tenantId: message.tenantId,
        })

        if (message.principalId) {
          span.setAttribute(PuristaSpanTag.PrincipalId, message.principalId)
        }

        if (message.tenantId) {
          span.setAttribute(PuristaSpanTag.TenantId, message.tenantId)
        }

        if (!subscription) {
          logger.error({ message: getCleanedMessage(message) }, 'received message for invalid subscription')

          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: 'received message for invalid subscription',
          })
          return
        }

        try {
          const { payload, parameter } = await subscriptionTransformInput(this, logger, subscription, message)

          let result: unknown = await this.startActiveSpan(
            subscription.subscriptionName + '.functionExecution',
            {},
            undefined,
            async (_subSpan) => {
              const context: SubscriptionFunctionContext = {
                message,
                emit: this.getEmitFunction(
                  subscriptionName,
                  traceId,
                  message.principalId,
                  message.tenantId,
                  subscription.emitList,
                ),
                invoke: this.getInvokeFunction(
                  subscriptionName,
                  traceId,
                  message.principalId,
                  message.tenantId,
                  subscription.invokes,
                ),
                ...this.getContextFunctions(logger),
                service: createInvokeFunctionProxy(
                  this.getInvokeFunction(
                    subscriptionName,
                    traceId,
                    message.principalId,
                    message.tenantId,
                    subscription.invokes,
                  ),
                ),
              }
              const call2 = subscription.call.bind(this, context)
              return await call2(payload, parameter)
            },
          )

          if (Object.keys(subscription.hooks.afterGuard ?? {}).length) {
            const guards = subscription.hooks.afterGuard

            await this.startActiveSpan(subscription.subscriptionName + '.afterGuardHooks', {}, undefined, async () => {
              const guardsPromises: Promise<void>[] = []

              for (const [name, hook] of Object.entries(guards ?? {})) {
                const context: SubscriptionFunctionContext = {
                  message,
                  emit: this.getEmitFunction(
                    subscription.subscriptionName,
                    traceId,
                    message.principalId,
                    message.tenantId,
                    subscription.emitList,
                  ),
                  invoke: this.getInvokeFunction(
                    subscription.subscriptionName,
                    traceId,
                    message.principalId,
                    message.tenantId,
                  ),
                  ...this.getContextFunctions(logger),
                  service: createInvokeFunctionProxy(
                    this.getInvokeFunction(
                      subscription.subscriptionName,
                      traceId,
                      message.principalId,
                      message.tenantId,
                    ),
                  ),
                }

                const guardPromise = this.wrapInSpan('afterGuardHook.' + name, {}, async (_subSpan) => {
                  return hook.bind(this)(context, result as Readonly<unknown>, payload, parameter)
                })
                guardsPromises.push(guardPromise)
              }

              await Promise.all(guardsPromises)
            })
          }

          if (subscription.hooks.transformOutput) {
            const transformOutput = subscription.hooks.transformOutput
            await this.startActiveSpan(
              subscription.subscriptionName + '.outputTransformation',
              {},
              undefined,
              async (subSpan) => {
                const afterTransform = transformOutput.transformFunction.bind(this, {
                  message,
                  ...this.getContextFunctions(logger),
                })
                const resultTransformed = await afterTransform(result as Readonly<unknown>, parameter)

                const validationResult = await validate(transformOutput.transformOutputSchema, resultTransformed)
                if (!validationResult.success) {
                  const err = new UnhandledError(StatusCode.InternalServerError, undefined, validationResult.issues)
                  subSpan.recordException(err)
                  logger.warn({ ...subSpan.spanContext(), err }, 'transform output validation failed:', err.message)

                  subSpan.setStatus({
                    code: SpanStatusCode.ERROR,
                    message: 'transform output validation failed',
                  })
                  throw err
                }
                result = validationResult.data
              },
            )
          }

          if (subscription.emitEventName) {
            return await this.startActiveSpan(
              subscription.subscriptionName + '.success',
              {},
              undefined,
              async (subSpan) => {
                this.emit(`custom-${subscription.emitEventName}`, result)
                subSpan.addEvent(subscription.emitEventName as string)
                const resultMsg: Omit<CustomMessage, 'id' | 'timestamp'> = {
                  messageType: EBMessageType.CustomMessage,
                  contentType: subscription.metadata.expose.contentTypeResponse ?? 'application/json',
                  contentEncoding: subscription.metadata.expose.contentEncodingResponse ?? 'utf-8',
                  sender: {
                    serviceName: this.serviceInfo.serviceName,
                    serviceVersion: this.serviceInfo.serviceVersion,
                    serviceTarget: subscription.subscriptionName,
                    instanceId: this.eventBridge.instanceId,
                  },
                  payload: result,
                  eventName: subscription.emitEventName as string,
                  otp: serializeOtp(),
                }
                return resultMsg
              },
            )
          }
          return undefined
        } catch (err) {
          logger.error({ err }, 'Error in subscription execution')
          if (err instanceof HandledError) {
            this.emit(ServiceEventsNames.SubscriptionHandledError, { subscriptionName, error: err, traceId })
            // handled errors prevent that the message is re-delivered for retry
            return
          }
          if (err instanceof UnhandledError) {
            this.emit(ServiceEventsNames.SubscriptionUnhandledError, { subscriptionName, error: err, traceId })
          }
          span.recordException(err as Error)

          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: (err as Error).message,
          })

          // re-throw error here, so the underlaying event bridge driver can handle ack/re-delivery for retry
          throw err
        }
      },
    )
  }

  public async registerSubscription(subscriptionDefinition: SubscriptionDefinition): Promise<void> {
    return this.startActiveSpan('purista.registerSubscription', {}, undefined, async (span) => {
      this.logger.debug({ ...this.serviceInfo, ...span.spanContext() }, 'register subscription')

      span.setAttributes({
        serviceName: this.info.serviceName,
        serviceVersion: this.info.serviceVersion,
        subscriptionName: subscriptionDefinition.subscriptionName,
      })

      this.subscriptions.set(subscriptionDefinition.subscriptionName, subscriptionDefinition)

      const subscription: Subscription = {
        sender: subscriptionDefinition.sender,
        receiver: subscriptionDefinition.receiver,
        messageType: subscriptionDefinition.messageType,
        eventName: subscriptionDefinition.eventName,
        emitEventName: subscriptionDefinition.emitEventName,
        subscriber: {
          serviceName: this.info.serviceName,
          serviceVersion: this.info.serviceVersion,
          serviceTarget: subscriptionDefinition.subscriptionName,
        },
        eventBridgeConfig: subscriptionDefinition.eventBridgeConfig,
        principalId: subscriptionDefinition.principalId,
        tenantId: subscriptionDefinition.tenantId,
      }

      await this.eventBridge.registerSubscription(subscription, (message: EBMessage) =>
        this.executeSubscription(message, subscriptionDefinition.subscriptionName),
      )

      span.end()
    })
  }

  async destroy() {
    this.emit(ServiceEventsNames.ServiceDrain)
    this.emit(ServiceEventsNames.ServiceStopped)
    this.removeAllListeners()
    await super.destroy()
  }
}
