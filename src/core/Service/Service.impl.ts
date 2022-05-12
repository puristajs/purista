import { HandledError } from '../HandledError.impl'
import {
  createErrorResponse,
  createInfoMessage,
  createSuccessResponse,
  getCleanedMessage,
  getNewCorrelationId,
  getNewEBMessageId,
  getNewTraceId,
} from '../helper'
import {
  Command,
  CommandDefinition,
  EBMessage,
  EBMessageId,
  EBMessageType,
  EventBridge,
  InfoMessageType,
  isCommand,
  isCommandErrorResponse,
  isCommandResponse,
  isCommandSuccessResponse,
  Logger,
  ServiceClass,
  ServiceInfoType,
  StatusCode,
  Subscription,
  SubscriptionDefinition,
  SubscriptionId,
} from '../types'
import { UnhandledError } from '../UnhandledError.impl'

type PendigInvocation = {
  ttl: number
  command: Command
  resolve(responsePayload: unknown): void
  reject(error: UnhandledError): void
}

const TTL_INTERVAL = 1000

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
export class Service extends ServiceClass {
  info: ServiceInfoType
  log: Logger

  protected eventBridge: EventBridge

  protected pendingInvocations = new Map<EBMessageId, PendigInvocation>()

  protected ttlInterval: ReturnType<typeof setInterval>

  protected subscriptions = new Map<SubscriptionId, SubscriptionDefinition>()

  protected commands = new Map<string, CommandDefinition>()

  protected mainSubscriptionId: SubscriptionId | undefined

  constructor(
    baseLogger: Logger,
    info: ServiceInfoType,
    eventBridge: EventBridge,
    private commandFunctions: CommandDefinition[],
    private subscriptionList: SubscriptionDefinition[],
  ) {
    super()
    this.info = info

    this.log = baseLogger.getChildLogger({ name: this.info.serviceName })
    this.log.debug(`creating ${this.info.serviceName} ${this.info.serviceVersion}`)

    this.eventBridge = eventBridge
    this.ttlInterval = setInterval(this.rejectExpiredInvocations.bind(this), TTL_INTERVAL)
  }

  /**
   * It connects to the event bridge and subscribes to the topics that are in the subscription list.
   */
  async start() {
    this.connectToEventBridge(this.commandFunctions, this.subscriptionList)
  }

  /**
   * Connect service to event bridge to receive commands and command responses
   */
  protected async connectToEventBridge(commandFunctions: CommandDefinition[], subscriptions: SubscriptionDefinition[]) {
    // send info message that this service is going to start up now
    await this.sendServiceInfo(EBMessageType.InfoServiceInit)

    // create a subscription for all commands, and command responses send to this service
    const ebSubscription: Subscription = {
      receiver: {
        serviceName: this.info.serviceName,
        serviceVersion: this.info.serviceVersion,
      },
      messageTypes: [EBMessageType.Command, EBMessageType.CommandSuccessResponse, EBMessageType.CommandErrorResponse],
      callback: this.defaultMessageHandler.bind(this),
      subscriber: {
        serviceName: this.info.serviceName,
        serviceVersion: this.info.serviceVersion,
        serviceTarget: '__defaultCommandResponseSubscription',
      },
    }
    this.mainSubscriptionId = await this.eventBridge.subscribe(ebSubscription)

    // register subscriptions for this service
    for (const subscription of subscriptions) {
      this.log.debug('start subscription', subscription.subscriptionName)
      await this.subscribe(subscription)
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
  async sendServiceInfo(infoType: InfoMessageType, target?: string, data?: Record<string, unknown>) {
    const info = createInfoMessage(infoType, this.info.serviceName, this.info.serviceVersion, target, data)

    return this.eventBridge.emit(info)
  }

  /**
   * There is one subscription with a specific id which set during init.
   * This subscriptions handles all incoming commands and invoke responses.
   *
   * If the handler receives a message for a subscription with different id,
   * the message relates to a regular subscription (passiv listener)
   *
   * @param subscriptionId id of subscription
   * @param message event bridge message
   */
  protected async defaultMessageHandler(subscriptionId: SubscriptionId, message: EBMessage) {
    if (isCommand(message)) {
      // handle incoming command
      this.executeCommand(subscriptionId, message)
      return
    }

    if (this.mainSubscriptionId !== subscriptionId) {
      // handle incoming subscription message
      this.handleSubscriptionMessage(subscriptionId, message)
      return
    }

    // if it is a response to request resolve/reject pending local request
    if (isCommandResponse(message)) {
      const pending = this.pendingInvocations.get(message.correlationId)
      if (pending) {
        if (isCommandSuccessResponse(message)) {
          pending.resolve(message.response)
        } else if (isCommandErrorResponse(message)) {
          const error = UnhandledError.fromMessage(message)
          pending.reject(error)
        }
        this.pendingInvocations.delete(message.correlationId)
      } else {
        this.log.warn('invocation message id not found - maybe already timed out', getCleanedMessage(message))
      }
    }
  }

  async invoke<T>(
    input: Omit<Command, 'id' | 'sender' | 'messageType' | 'timestamp' | 'correlationId'>,
    ttl = this.eventBridge.defaultTtl,
    originalCommand?: Partial<Command>,
  ): Promise<T> {
    const command: Command = {
      id: getNewEBMessageId(),
      correlationId: getNewCorrelationId(),
      timestamp: Date.now(),
      traceId: originalCommand?.traceId || getNewTraceId(),
      messageType: EBMessageType.Command,
      ...input,
      sender: {
        serviceName: this.info.serviceName,
        serviceVersion: this.info.serviceVersion,
        serviceTarget: '',
      },
    }
    return new Promise((resolve, reject) => {
      this.pendingInvocations.set(command.correlationId, {
        ttl: Date.now() + ttl,
        command,
        resolve,
        reject,
      })
      this.eventBridge.emit(command)
    })
  }

  protected async subscribe(subscription: SubscriptionDefinition): Promise<SubscriptionId> {
    const ebSubscription: Subscription = {
      sender: subscription.sender,
      receiver: subscription.receiver,
      messageTypes: subscription.messageTypes,
      callback: this.defaultMessageHandler.bind(this),
      subscriber: {
        serviceName: this.info.serviceName,
        serviceVersion: this.info.serviceVersion,
        serviceTarget: subscription.subscriptionName,
      },
    }
    const id = await this.eventBridge.subscribe(ebSubscription)
    this.subscriptions.set(id, subscription)
    return id
  }

  /**
   * Called when a command is received by the service
   *
   * @param subscriptionId
   * @param command
   */
  protected async executeCommand(_subscriptionId: SubscriptionId, message: Command) {
    const command = this.commands.get(message.receiver.serviceTarget)
    if (!command) {
      this.log.error('received invalid command', getCleanedMessage(message))
      const errorResponse = createErrorResponse(message, StatusCode.NotImplemented)
      await this.eventBridge.emit(errorResponse)
      return
    }

    try {
      const call = command.call.bind(this)
      const payload = await call(message.command.payload, message.command.parameter, message)

      const successResponse = createSuccessResponse(message, payload)
      await this.eventBridge.emit(successResponse)
    } catch (error) {
      if (error instanceof HandledError) {
        await this.eventBridge.emit(createErrorResponse(message, error.errorCode, error))
        return
      }

      this.log.error('executeCommand unhandled error', { error, message: getCleanedMessage(message) })
      await this.eventBridge.emit(createErrorResponse(message, StatusCode.InternalServerError, error))
    }
  }

  protected async handleSubscriptionMessage(subscriptionId: SubscriptionId, message: EBMessage) {
    const subscription = this.subscriptions.get(subscriptionId)
    if (!subscription) {
      this.log.error('received message for non existing subscription', {
        subscriptionId,
        message: getCleanedMessage(message),
      })
      return
    }

    try {
      await subscription.call.bind(this)(subscriptionId, message)
    } catch (error) {
      this.log.error(error)
    }
  }

  /**
   * Function which runs in internval to reject all invocations which are timed out
   */
  protected rejectExpiredInvocations() {
    const now = Date.now()

    this.pendingInvocations.forEach((value, key) => {
      if (now > value.ttl) {
        const errorResponse = createErrorResponse(value.command, StatusCode.GatewayTimeout)
        this.log.error('rejecting timed out invocation', { command: getCleanedMessage(value.command) })
        const error = UnhandledError.fromMessage(errorResponse)
        value.reject(error)
        this.pendingInvocations.delete(key)
      }
    })
  }

  protected async registerCommand(commandDefinition: CommandDefinition): Promise<void> {
    this.log.debug(
      'register command',
      `${this.serviceInfo.serviceName} ${this.serviceInfo.serviceVersion} ${commandDefinition.commandName}`,
    )
    this.commands.set(commandDefinition.commandName, commandDefinition)
    await this.sendServiceInfo(
      EBMessageType.InfoServiceFunctionAdded,
      commandDefinition.commandName,
      commandDefinition.metadata,
    )
  }

  async destroy() {
    await this.sendServiceInfo(EBMessageType.InfoServiceDrain)
    this.log.info('destroy', this.info)
    if (this.ttlInterval) {
      clearInterval(this.ttlInterval)
    }
    await this.eventBridge.unsubscribeService({
      serviceName: this.info.serviceName,
      serviceVersion: this.info.serviceVersion,
      serviceTarget: '*',
    })
    await this.sendServiceInfo(EBMessageType.InfoServiceShutdown)
  }
}
