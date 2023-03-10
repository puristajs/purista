import { SpanStatusCode, trace } from '@opentelemetry/api'

import { puristaVersion } from '../../version'
import { DefaultSecretStore } from '../DefaultSecretStore'
import { HandledError } from '../Error/HandledError.impl'
import { UnhandledError } from '../Error/UnhandledError.impl'
import {
  createErrorResponse,
  createInfoMessage,
  createSuccessResponse,
  deserializeOtp,
  getCleanedMessage,
  getNewTraceId,
  serializeOtp,
} from '../helper'
import {
  Command,
  CommandDefinition,
  CommandDefinitionList,
  CommandFunctionContext,
  CustomMessage,
  EBMessage,
  EBMessageAddress,
  EBMessageType,
  InfoMessageType,
  PuristaSpanTag,
  ServiceClass,
  ServiceConstructorInput,
  StatusCode,
  Subscription,
  SubscriptionDefinition,
  SubscriptionDefinitionList,
  SubscriptionFunctionContext,
  TraceId,
} from '../types'
import { commandTransformInput } from './commandTransformInput.impl'
import { ServiceBaseClass } from './ServiceBaseClass'
import { subscriptionTransformInput } from './subscriptionTransformInput.impl'

/**
 * Base class for all services.
 * This class provides base functions to work with the event bridge, logging and so on
 *
 * Every service should extend this class and should not directly access the eventbridge or other service
 *
 * ```typescript
 * class MyService extends Service {
 *
 *   constructor(baseLogger: Logger, info: ServiceInfoType, eventBridge: EventBridge, config: MyServiceConfig, options: {
 *              spanProcessor?: SpanProcessor,
 *              secretStore?: SecretStore
 *    }) {
 *     super( baseLogger, info, eventBridge, config, options: {
 *          spanProcessor,
 *          secretStore
 *      } )
 *     // ... initial service logic
 *   }
 *   // ... service methods, functions and logic
 * }
 * ```
 */
export class Service<ConfigType = unknown | undefined> extends ServiceBaseClass implements ServiceClass<ConfigType> {
  protected subscriptions = new Map<string, SubscriptionDefinition>()
  protected commands = new Map<string, CommandDefinition>()

  private commandDefinitionList: CommandDefinitionList<any>
  private subscriptionDefinitionList: SubscriptionDefinitionList<any>
  public config: ConfigType

  constructor(config: ServiceConstructorInput<ConfigType>) {
    super({
      logger: config.logger,
      info: config.info,
      eventBridge: config.eventBridge,
      spanProcessor: config.spanProcessor,
      secretStore: config.secretStore || new DefaultSecretStore(),
    })

    this.config = config.config
    this.commandDefinitionList = config.commandDefinitionList
    this.subscriptionDefinitionList = config.subscriptionDefinitionList
  }

  /**
   * It connects to the event bridge and subscribes to the topics that are in the subscription list.
   */
  async start() {
    return this.startActiveSpan('purista.start', {}, undefined, async (span) => {
      this.emit('service-started')
      try {
        if (!this.secretStore.isReady()) {
          await this.secretStore.start()
        }

        await this.initializeEventbridgeConnect(this.commandDefinitionList, this.subscriptionDefinitionList)
        await this.sendServiceInfo(EBMessageType.InfoServiceReady)
        this.logger.info(
          { ...span.spanContext(), puristaVersion },
          `service ${this.serviceInfo.serviceName} ${this.serviceInfo.serviceVersion} started`,
        )
      } catch (err) {
        this.logger.error({ err, ...span.spanContext(), puristaVersion }, `failed to start service`)
        this.emit('service-not-available', err)
        throw err
      }
    })
  }

  /**
   * Connect service to event bridge to receive commands and command responses
   */
  protected async initializeEventbridgeConnect(
    commandDefinitionList: CommandDefinitionList<any>,
    subscriptions: SubscriptionDefinition[],
  ) {
    return this.startActiveSpan('purista.initializeEventbridgeConnect', {}, undefined, async (span) => {
      const isEventBridgeReady = this.eventBridge.isHealthy()

      if (!isEventBridgeReady) {
        const err = new UnhandledError(StatusCode.ServiceUnavailable, 'eventbridge not healthy')
        this.logger.error({ err }, 'Eventbridge is not ready - can not start service')
        throw err
      }

      // send info message that this service is going to start up now
      await this.sendServiceInfo(EBMessageType.InfoServiceInit)

      // register subscriptions for this service
      for (const subscription of subscriptions) {
        this.logger.debug({ name: subscription.subscriptionName, ...span.spanContext() }, 'start subscription')
        await this.registerSubscription(subscription)
      }

      // register commands for this service
      for (const command of commandDefinitionList) {
        await this.registerCommand(command)
      }
    })
  }

  /**
   * Broadcast service info message
   * @param infoType type of info message
   * @param target function name is need in messages like InfoServiceFunctionAdded
   */
  async sendServiceInfo(infoType: InfoMessageType, target?: string, payload?: Record<string, unknown>) {
    return this.startActiveSpan('purista.sendServiceInfo', {}, undefined, async (span) => {
      const info = createInfoMessage(
        infoType,
        { serviceName: this.info.serviceName, serviceVersion: this.info.serviceVersion, serviceTarget: target || '' },
        { payload },
      )

      const result = await this.eventBridge.emitMessage(info)

      span.end()
      return result
    })
  }

  protected getInvokeFunction(serviceTarget: string, traceId: TraceId, principalId?: string) {
    const sender: EBMessageAddress = {
      serviceName: this.info.serviceName,
      serviceVersion: this.info.serviceVersion,
      serviceTarget,
    }

    const invokeCommand = async (
      receiver: EBMessageAddress,
      eventPayload: unknown,
      parameter: unknown,
      contentType = 'application/json',
      contentEncoding = 'utf-8',
    ): Promise<any> => {
      const msg: Readonly<Omit<Command, 'correlationId' | 'id' | 'timestamp' | 'instanceId'>> = Object.freeze({
        messageType: EBMessageType.Command,
        traceId,
        sender,
        receiver,
        contentType,
        contentEncoding,
        payload: {
          payload: eventPayload,
          parameter,
        },
        principalId,
      })

      return this.eventBridge.invoke(msg)
    }

    return invokeCommand.bind(this)
  }

  protected getEmitFunction(serviceTarget: string, traceId: TraceId, principalId?: string) {
    const sender: EBMessageAddress = {
      serviceName: this.info.serviceName,
      serviceVersion: this.info.serviceVersion,
      serviceTarget,
    }

    const emitCustomEvent = async <Payload>(
      eventName: string,
      eventPayload?: Payload,
      contentType = 'application/json',
      contentEncoding = 'utf-8',
    ) => {
      await this.startActiveSpan('purista.emitEvent', {}, undefined, async (span) => {
        span.addEvent(eventName)
        const msg: Readonly<Omit<CustomMessage<Payload>, 'id' | 'instanceId' | 'timestamp'>> = Object.freeze({
          messageType: EBMessageType.CustomMessage,
          traceId,
          contentType,
          contentEncoding,
          sender,
          eventName,
          payload: eventPayload,
          principalId,
        })

        return this.eventBridge.emitMessage(msg)
      })
    }

    return emitCustomEvent.bind(this)
  }

  /**
   * Called when a command is received by the service
   *
   * @param subscriptionId
   * @param command
   */
  protected async executeCommand(message: Readonly<Command>) {
    const command = this.commands.get(message.receiver.serviceTarget)

    const context = await deserializeOtp(this.logger, message.otp)

    return this.startActiveSpan(command?.commandName || 'purista.executeCommand', {}, context, async (span) => {
      const traceId = message.traceId || span.spanContext().traceId

      const logger = this.logger.getChildLogger({
        serviceTarget: command?.commandName,
        ...span.spanContext(),
        principalId: message.principalId,
      })

      if (message.principalId) {
        span.setAttribute(PuristaSpanTag.PrincipalId, message.principalId)
      }

      if (!command) {
        logger.error({ message: getCleanedMessage(message) }, 'received invalid command')

        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: 'received invalid command',
        })
        return await this.startActiveSpan('sendErrorResponse', {}, undefined, async () =>
          createErrorResponse(message, StatusCode.NotImplemented),
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
              logger,
              message,
              emit: this.getEmitFunction(command.commandName, traceId, message.principalId),
              invoke: this.getInvokeFunction(command.commandName, traceId, message.principalId),
              wrapInSpan: this.wrapInSpan.bind(this),
              startActiveSpan: this.startActiveSpan.bind(this),
              getSecret: this.secretStore.getSecret,
              setSecret: this.secretStore.setSecret,
            }
            const call = command.call.bind(this, context)
            return await call(payload, parameter)
          },
        )

        if (Object.keys(command.hooks.afterGuard || {}).length) {
          const guards = command.hooks.afterGuard

          await this.startActiveSpan(command.commandName + '.afterGuardHooks', {}, undefined, async () => {
            const guardsPromises: Promise<void>[] = []

            for (const [name, hook] of Object.entries(guards || {})) {
              const context: CommandFunctionContext = {
                logger,
                message,
                emit: this.getEmitFunction(command.commandName, traceId, message.principalId),
                invoke: this.getInvokeFunction(command.commandName, traceId, message.principalId),
                wrapInSpan: this.wrapInSpan.bind(this),
                startActiveSpan: this.startActiveSpan.bind(this),
                getSecret: this.secretStore.getSecret,
                setSecret: this.secretStore.setSecret,
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
          await this.startActiveSpan(command.commandName + '.outputTransformation', {}, undefined, async () => {
            const afterTransform = transformOutput.transformFunction.bind(this, {
              logger,
              message,
              startActiveSpan: this.startActiveSpan.bind(this),
              wrapInSpan: this.wrapInSpan.bind(this),
              getSecret: this.secretStore.getSecret,
              setSecret: this.secretStore.setSecret,
            })
            const resultTransformed = await afterTransform(result as Readonly<unknown>, parameter)
            result = transformOutput.transformOutputSchema.parse(resultTransformed)
          })
        }

        return await this.startActiveSpan(command.commandName + '.success', {}, undefined, async (subSpan) => {
          if (command.eventName) {
            subSpan.addEvent(command.eventName)
          }
          return { ...createSuccessResponse(message, result, command.eventName), otp: serializeOtp() }
        })
      } catch (error) {
        span.recordException(error as Error)

        if (error instanceof HandledError) {
          this.emit('handled-function-error', { functionName: command.commandName, error, traceId })
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error.message,
          })

          return await this.startActiveSpan('sendErrorResponse', {}, undefined, async () =>
            createErrorResponse(message, (error as HandledError).errorCode, error),
          )
        }

        this.emit('unhandled-function-error', { functionName: command.commandName, error, traceId })

        logger.error(
          { err: error, message: getCleanedMessage(message), ...span.spanContext() },
          'executeCommand unhandled error',
        )

        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: 'executeCommand unhandled error',
        })

        return await this.startActiveSpan(command.commandName + '.error', {}, undefined, async () =>
          createErrorResponse(message, StatusCode.InternalServerError, error),
        )
      }
    })
  }

  async registerCommand(commandDefinition: CommandDefinition): Promise<void> {
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
      )
      await this.sendServiceInfo(
        EBMessageType.InfoServiceFunctionAdded,
        commandDefinition.commandName,
        commandDefinition.metadata,
      )

      span.end()
    })
  }

  protected async executeSubscription(
    message: Readonly<EBMessage>,
    subscriptionName: string,
  ): Promise<Omit<CustomMessage, 'id' | 'timestamp' | 'instanceId'> | undefined> {
    const subscription = this.subscriptions.get(subscriptionName)

    const otpContext = await deserializeOtp(this.logger, message.otp)
    const spanContext = otpContext ? trace.getSpanContext(otpContext) : undefined

    return this.startActiveSpan(
      subscriptionName || 'purista.executeSubscription',
      { links: spanContext ? [{ context: spanContext }] : [] },
      undefined,
      async (span) => {
        const traceId = message.traceId || span.spanContext().traceId || getNewTraceId()

        const logger = this.logger.getChildLogger({
          serviceTarget: subscriptionName,
          ...span.spanContext(),
          principalId: message.principalId,
        })

        if (message.principalId) {
          span.setAttribute(PuristaSpanTag.PrincipalId, message.principalId)
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
                logger,
                message,
                emit: this.getEmitFunction(subscriptionName, traceId, message.principalId),
                invoke: this.getInvokeFunction(subscriptionName, traceId, message.principalId),
                wrapInSpan: this.wrapInSpan.bind(this),
                startActiveSpan: this.startActiveSpan.bind(this),
                getSecret: this.secretStore.getSecret,
                setSecret: this.secretStore.setSecret,
              }
              const call2 = subscription.call.bind(this, context)
              return await call2(payload, parameter)
            },
          )

          if (Object.keys(subscription.hooks.afterGuard || {}).length) {
            const guards = subscription.hooks.afterGuard

            await this.startActiveSpan(subscription.subscriptionName + '.afterGuardHooks', {}, undefined, async () => {
              const guardsPromises: Promise<void>[] = []

              for (const [name, hook] of Object.entries(guards || {})) {
                const context: SubscriptionFunctionContext = {
                  logger,
                  message,
                  emit: this.getEmitFunction(subscription.subscriptionName, traceId, message.principalId),
                  invoke: this.getInvokeFunction(subscription.subscriptionName, traceId, message.principalId),
                  wrapInSpan: this.wrapInSpan.bind(this),
                  startActiveSpan: this.startActiveSpan.bind(this),
                  getSecret: this.secretStore.getSecret,
                  setSecret: this.secretStore.setSecret,
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
              async () => {
                const afterTransform = transformOutput.transformFunction.bind(this, {
                  logger,
                  message,
                  wrapInSpan: this.wrapInSpan.bind(this),
                  startActiveSpan: this.startActiveSpan.bind(this),
                  getSecret: this.secretStore.getSecret,
                  setSecret: this.secretStore.setSecret,
                })
                const resultTransformed = await afterTransform(result as Readonly<unknown>, parameter)
                result = transformOutput.transformOutputSchema.parse(resultTransformed)
              },
            )
          }

          if (subscription.emitEventName) {
            return await this.startActiveSpan(
              subscription.subscriptionName + '.success',
              {},
              undefined,
              async (subSpan) => {
                subSpan.addEvent(subscription.emitEventName as string)
                const resultMsg: Omit<CustomMessage, 'id' | 'timestamp' | 'instanceId'> = {
                  messageType: EBMessageType.CustomMessage,
                  contentType: subscription.metadata.expose.contentTypeResponse || 'application/json',
                  contentEncoding: subscription.metadata.expose.contentEncodingResponse || 'utf-8',
                  sender: {
                    serviceName: this.serviceInfo.serviceName,
                    serviceVersion: this.serviceInfo.serviceVersion,
                    serviceTarget: subscription.subscriptionName,
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
            this.emit('handled-subscription-error', { subscriptionName, error: err, traceId })
            // handled errors prevent that the message is re-delivered for retry
            return
          }
          if (err instanceof UnhandledError) {
            this.emit('unhandled-subscription-error', { subscriptionName, error: err, traceId })
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

  async registerSubscription(subscriptionDefinition: SubscriptionDefinition): Promise<void> {
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
        settings: subscriptionDefinition.settings,
        principalId: subscriptionDefinition.principalId,
        instanceId: subscriptionDefinition.instanceId,
      }

      await this.eventBridge.registerSubscription(subscription, (message: EBMessage) =>
        this.executeSubscription(message, subscriptionDefinition.subscriptionName),
      )

      span.end()
    })
  }

  async destroy() {
    this.startActiveSpan('purista.destroy', {}, undefined, async (span) => {
      this.emit('service-drain', undefined)
      await this.sendServiceInfo(EBMessageType.InfoServiceDrain)
      this.logger.info({ ...this.info, ...span.spanContext() }, 'destroy')

      const functionUnregisterProms: Promise<any>[] = []
      this.commandDefinitionList.forEach((functionDefinition) => {
        functionUnregisterProms.push(
          this.eventBridge.unregisterCommand({
            serviceName: this.info.serviceName,
            serviceVersion: this.info.serviceVersion,
            serviceTarget: functionDefinition.commandName,
          }),
        )
      })

      this.subscriptions.forEach((subscriptionDefinition) => {
        functionUnregisterProms.push(
          this.eventBridge.unregisterSubscription({
            serviceName: this.info.serviceName,
            serviceVersion: this.info.serviceVersion,
            serviceTarget: subscriptionDefinition.subscriptionName,
          }),
        )
      })
      await Promise.allSettled(functionUnregisterProms)
      await this.sendServiceInfo(EBMessageType.InfoServiceShutdown)
      this.emit('service-stopped', undefined)

      span.end()
    })

    await super.destroy()
  }
}
