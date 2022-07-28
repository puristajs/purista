import { ZodError } from 'zod'

import { HandledError } from '../HandledError.impl'
import {
  createErrorResponse,
  createInfoMessage,
  createSuccessResponse,
  getCleanedMessage,
  getNewTraceId,
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
  EventBridge,
  InfoMessageType,
  IServiceClass,
  Logger,
  ServiceClass,
  ServiceInfoType,
  StatusCode,
  Subscription,
  SubscriptionContext,
  SubscriptionDefinition,
  SubscriptionDefinitionList,
  TraceId,
} from '../types'
import { UnhandledError } from '../UnhandledError.impl'
import { ServiceInfoValidator } from './ServiceInfoValidator'

/**
 * Base class for all services.
 * This class provides base functions to work with the event bridge, logging and so on
 *
 * Every service should extend this class and should not directly access the eventbridge or other service
 *
 * ```typescript
 * class MyService extends Service {
 *
 *   constructor(baseLogger: Logger, info: ServiceInfoType, eventBridge: EventBridge) {
 *     super( baseLogger, info, eventBridge )
 *     // ... initial service logic
 *   }
 *   // ... service methods, functions and logic
 * }
 * ```
 */
export class Service<ConfigType = unknown | undefined> extends ServiceClass<ConfigType> implements IServiceClass {
  protected info: ServiceInfoType
  protected serviceLogger: Logger
  protected eventBridge: EventBridge
  protected subscriptions = new Map<string, SubscriptionDefinition>()
  protected commands = new Map<string, CommandDefinition>()

  constructor(
    baseLogger: Logger,
    info: ServiceInfoType,
    eventBridge: EventBridge,
    private commandFunctions: CommandDefinitionList<any>,
    private subscriptionList: SubscriptionDefinitionList<any>,
    public config: ConfigType,
  ) {
    super()
    this.info = new Proxy(
      {
        serviceName: '',
        serviceDescription: '',
        serviceVersion: '1',
      },
      ServiceInfoValidator,
    )

    this.info.serviceDescription = info.serviceDescription
    this.info.serviceName = info.serviceName
    this.info.serviceVersion = info.serviceVersion

    this.serviceLogger = baseLogger.getChildLogger({
      serviceName: this.info.serviceName,
      serviceVersion: this.info.serviceVersion,
    })
    this.serviceLogger.debug(`creating ${this.info.serviceName} ${this.info.serviceVersion}`)

    this.eventBridge = eventBridge
  }

  /**
   * It connects to the event bridge and subscribes to the topics that are in the subscription list.
   */
  async start() {
    this.emit('service-started', undefined)
    try {
      await this.initializeEventbridgeConnect(this.commandFunctions, this.subscriptionList)
      await this.sendServiceInfo(EBMessageType.InfoServiceReady)
    } catch (err) {
      this.serviceLogger.error(`failed to start service`, err)
      this.emit('service-not-available', err)
      throw err
    }
  }

  /**
   * Get service info
   */
  get serviceInfo(): ServiceInfoType {
    return Object.freeze({ ...this.info })
  }

  /**
   * Connect service to event bridge to receive commands and command responses
   */
  protected async initializeEventbridgeConnect(
    commandFunctions: CommandDefinitionList<any>,
    subscriptions: SubscriptionDefinition[],
  ) {
    // send info message that this service is going to start up now
    await this.sendServiceInfo(EBMessageType.InfoServiceInit)

    // register subscriptions for this service
    for (const subscription of subscriptions) {
      this.serviceLogger.debug('start subscription', subscription.subscriptionName)
      await this.registerSubscription(subscription)
    }

    // register commands for this service
    for (const command of commandFunctions) {
      await this.registerCommand(command)
    }
  }

  /**
   * Broadcast service info message
   * @param infoType type of info message
   * @param target function name is need in messages like InfoServiceFunctionAdded
   */
  async sendServiceInfo(infoType: InfoMessageType, target?: string, payload?: Record<string, unknown>) {
    const info = createInfoMessage(infoType, this.info.serviceName, this.info.serviceVersion, target, payload)

    return this.eventBridge.emitMessage(info)
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
    ): Promise<any> => {
      const msg: Readonly<Omit<Command, 'correlationId' | 'id' | 'timestamp' | 'instanceId'>> = Object.freeze({
        messageType: EBMessageType.Command,
        traceId,
        sender,
        receiver,
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

    const emitCustomEvent = async <Payload>(eventName: string, eventPayload?: Payload) => {
      const msg: Readonly<Omit<CustomMessage<Payload>, 'id' | 'instanceId' | 'timestamp'>> = Object.freeze({
        messageType: EBMessageType.CustomMessage,
        traceId,
        sender,
        eventName,
        payload: eventPayload,
        principalId,
      })

      await this.eventBridge.emitMessage(msg)
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
    const traceId = message.traceId || getNewTraceId()

    if (!command) {
      this.serviceLogger
        .getChildLogger({
          serviceName: this.info.serviceName,
          serviceVersion: this.info.serviceVersion,
          traceId,
        })
        .error('received invalid command', getCleanedMessage(message))
      return createErrorResponse(message, StatusCode.NotImplemented)
    }

    const logger = this.serviceLogger.getChildLogger({
      serviceName: this.info.serviceName,
      serviceVersion: this.info.serviceVersion,
      serviceTarget: command.commandName,
      traceId,
    })

    try {
      let parameterInput = message.payload.parameter
      let payloadInput = message.payload.payload

      if (command.hooks.transformInput) {
        const transform = command.hooks.transformInput.transformFunction.bind(this, { logger, message })
        try {
          parameterInput = command.hooks.transformInput.transformParameterSchema.parse(parameterInput)
        } catch (err) {
          const error = err as ZodError
          logger.warn('input validation for params failed:', error.message)
          throw new HandledError(StatusCode.BadRequest, undefined, error.issues)
        }

        try {
          payloadInput = command.hooks.transformInput.transformInputSchema.parse(payloadInput)
        } catch (err) {
          const error = err as ZodError
          logger.warn('input validation for payload failed:', error.message)
          throw new HandledError(StatusCode.BadRequest, undefined, error.issues)
        }

        try {
          const transformedInput = await transform(payloadInput, parameterInput)
          parameterInput = transformedInput.params
          payloadInput = transformedInput.payload
        } catch (error) {
          if (error instanceof HandledError) {
            throw error
          }
          logger.warn('transformInput:', error)
          throw new HandledError(StatusCode.BadRequest, 'Unable to transform input')
        }
      }

      const context: CommandFunctionContext = {
        logger,
        message,
        emit: this.getEmitFunction(command.commandName, traceId, message.principalId),
        invoke: this.getInvokeFunction(command.commandName, traceId, message.principalId),
      }

      const call = command.call.bind(this, context)
      let payload = await call(payloadInput, parameterInput)

      if (command.hooks.afterGuard?.length) {
        const afterGuards = command.hooks.afterGuard.map((hook) => hook.bind(this, context))
        await Promise.all(afterGuards)
      }

      if (command.hooks.transformOutput) {
        const afterTransform = command.hooks.transformOutput.transformFunction.bind(this, { logger, message })
        payload = await afterTransform(payload, parameterInput)

        payload = command.hooks.transformOutput.transformOutputSchema.parse(payload)
      }

      return createSuccessResponse(message, payload, command.eventName)
    } catch (error) {
      if (error instanceof HandledError) {
        this.emit('handled-function-error', { functionName: command.commandName, error, traceId })
        return createErrorResponse(message, error.errorCode, error)
      }

      this.emit('unhandled-function-error', { functionName: command.commandName, error, traceId })

      logger.error('executeCommand unhandled error', { error, message: getCleanedMessage(message) })
      return createErrorResponse(message, StatusCode.InternalServerError, error)
    }
  }

  protected async registerCommand(commandDefinition: CommandDefinition): Promise<void> {
    this.serviceLogger.debug(
      'register command',
      `${this.serviceInfo.serviceName} ${this.serviceInfo.serviceVersion} ${commandDefinition.commandName}`,
    )
    this.commands.set(commandDefinition.commandName, commandDefinition)
    await this.eventBridge.registerServiceFunction(
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
  }

  protected async executeSubscription(message: EBMessage, subscriptionName: string): Promise<void> {
    const subscription = this.subscriptions.get(subscriptionName)
    const traceId = message.traceId || getNewTraceId()

    if (!subscription) {
      this.serviceLogger
        .getChildLogger({
          serviceName: this.info.serviceName,
          serviceVersion: this.info.serviceVersion,
          serviceTarget: subscriptionName,
          traceId,
        })
        .error('received message for invalid subscription', getCleanedMessage(message))
      return
    }

    const logger = this.serviceLogger.getChildLogger({
      serviceName: this.info.serviceName,
      serviceVersion: this.info.serviceVersion,
      serviceTarget: subscription?.subscriptionName,
      traceId,
    })

    const context: SubscriptionContext = {
      logger,
      message,
      emit: this.getEmitFunction(subscriptionName, traceId, message.principalId),
      invoke: this.getInvokeFunction(subscriptionName, traceId, message.principalId),
    }

    const call = subscription.call.bind(this, context)
    try {
      await call(message.payload)
    } catch (error) {
      this.serviceLogger.error(error)
      if (error instanceof HandledError) {
        this.emit('handled-subscription-error', { subscriptionName, error, traceId })
        // handled errors prevent that the message is re-delivered for retry
        return
      }
      if (error instanceof UnhandledError) {
        this.emit('unhandled-subscription-error', { subscriptionName, error, traceId })
      }
      // re-throw error here, so the underlaying event bridge driver can handle ack/re-delivery for retry
      throw error
    }
  }

  protected async registerSubscription(subscriptionDefinition: SubscriptionDefinition): Promise<void> {
    this.serviceLogger.debug(
      'register subscription',
      `${this.serviceInfo.serviceName} ${this.serviceInfo.serviceVersion} ${subscriptionDefinition.subscriptionName}`,
    )

    this.subscriptions.set(subscriptionDefinition.subscriptionName, subscriptionDefinition)

    const subscription: Subscription = {
      sender: subscriptionDefinition.sender,
      receiver: subscriptionDefinition.receiver,
      messageType: subscriptionDefinition.messageType,
      eventName: subscriptionDefinition.eventName,
      subscriber: {
        serviceName: this.info.serviceName,
        serviceVersion: this.info.serviceVersion,
        serviceTarget: subscriptionDefinition.subscriptionName,
      },
      settings: subscriptionDefinition.settings,
    }

    await this.eventBridge.registerSubscription(subscription, (message: EBMessage) =>
      this.executeSubscription(message, subscriptionDefinition.subscriptionName),
    )
  }

  async destroy() {
    this.emit('service-drain', undefined)
    await this.sendServiceInfo(EBMessageType.InfoServiceDrain)
    this.serviceLogger.info('destroy', this.info)

    const functionUnregisterProms: Promise<any>[] = []
    this.commandFunctions.forEach((functionDefinition) => {
      functionUnregisterProms.push(
        this.eventBridge.unregisterServiceFunction({
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
  }
}
