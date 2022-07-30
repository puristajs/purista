import type {
  EBMessage,
  EBMessageType,
  InstanceId,
  PrincipalId,
  ServiceClass,
  SubscriptionDefinition,
  SubscriptionFunction,
} from '../core'

/**
 * Subscription definition builder is a helper to create and define a subscriptions for a service.
 * It helps to set all needed filters.
 *
 * A working schema definition needs at least a subscription name, a short description and the subscription implementation.
 */
export class SubscriptionDefinitionBuilder<
  ServiceClassType extends ServiceClass = ServiceClass,
  MsgType extends EBMessage = EBMessage,
  Payload = unknown,
> {
  private messageType: EBMessageType | undefined

  private sender?: {
    serviceName?: string
    serviceVersion?: string
    serviceTarget?: string
  }

  private receiver?: {
    serviceName?: string
    serviceVersion?: string
    serviceTarget?: string
  }

  private fn?: SubscriptionFunction<ServiceClassType, any, any>

  private eventName?: string

  private principalId?: PrincipalId

  private instanceId?: InstanceId

  private settings = { durable: true }

  // eslint-disable-next-line no-useless-constructor
  constructor(private subscriptionName: string, private subscriptionDescription: string) {}

  /**
   * Add a filter to only subscribe to messages with matching event name
   * @param eventName Event name
   * @returns SubscriptionDefinitionBuilder
   */
  subscribeToEvent(eventName: string) {
    this.eventName = eventName
    return this
  }

  /**
   * Filter messages only from instance id
   * @param instanceId
   * @returns
   */
  onlyInstanceId(instanceId: InstanceId) {
    this.instanceId = instanceId
    return this
  }

  /**
   * Filter messages only for principalId
   * @param principalId
   * @returns
   */
  onlyPrincipalId(principalId: PrincipalId) {
    this.principalId = principalId
    return this
  }

  setDurable(durable: boolean) {
    this.settings.durable = durable
    return this
  }

  /**
   * Add filter to only match messages send by given service function & version.
   * Set one or more parameters to undefined means "do not filter by this criteria".
   * For example:
   *
   * This will filter for all messages send from function testFunction of service UserService.
   * This will include messages from all versions of this function.
   *
   * ```typescript
   * sendFrom('UserService', undefined, 'testFunction')
   * ```
   *
   * @param serviceName
   * @param serviceVersion
   * @param serviceTarget
   * @returns
   */
  sendFrom(serviceName: string | undefined, serviceVersion: string | undefined, serviceTarget: string | undefined) {
    this.sender = {
      serviceName,
      serviceVersion,
      serviceTarget,
    }
    return this
  }

  /**
   * Add filter to only match messages received by given service function & version.
   * Set one or more parameters to undefined means "do not filter by this criteria".
   * For example:
   *
   * This will filter for all messages send to function testFunction of service UserService.
   * This will include messages from all versions of this function.
   *
   * ```typescript
   * receivedBy('UserService', undefined, 'testFunction')
   * ```
   *
   * @param serviceName
   * @param serviceVersion
   * @param serviceTarget
   * @returns
   */
  receivedBy(serviceName: string | undefined, serviceVersion: string | undefined, serviceTarget: string | undefined) {
    this.receiver = {
      serviceName,
      serviceVersion,
      serviceTarget,
    }
    return this
  }

  /**
   * Adds a filter to match specific message type.
   *
   * Common message types are `Command`, `CommandSuccessResponse` and `CommandErrorResponse`.
   *
   * See @enum EBMessageType for full available list.
   *
   * @param messageType
   * @returns
   */
  addMessageType(messageType: EBMessageType) {
    this.messageType = messageType

    return this
  }

  /**
   * Required: Set the function implementation.
   * The types should be automatically set as soon as schemas previously defined.
   * As the function will be a a function of a service class you need to implement as function declaration.
   * Anonymous functions do not have access to the `this` scope.
   *
   * @example
   * ```ts
   * async function (context, payload, parameter) {
   *
   *    return `the result output payload`
   * }
   * ```
   * @param fn the function implementation
   * @returns SubscriptionDefinitionBuilder
   */
  setFunction<PayloadType = unknown, MType extends EBMessage = MsgType>(
    fn: SubscriptionFunction<ServiceClassType, MType, PayloadType>,
  ) {
    this.fn = fn
    return this as unknown as SubscriptionDefinitionBuilder<ServiceClassType, MType, PayloadType>
  }

  /**
   * Get the function implementation
   * @returns the function
   */
  getFunction(): SubscriptionFunction<ServiceClassType, MsgType, Payload> {
    if (!this.fn) {
      throw new Error(`No function implementation for ${this.subscriptionName}`)
    }
    return this.fn
  }

  /**
   * Returns the final subscription definition which will be passed into the service class.
   * @returns SubscriptionDefinition
   */
  getDefinition(): SubscriptionDefinition<ServiceClassType, MsgType, Payload> {
    if (!this.fn) {
      throw new Error(`SubscriptionDefinitionBuilder: missing function implementation for ${this.subscriptionName}`)
    }

    const subscription: SubscriptionDefinition<ServiceClassType, MsgType, Payload> = {
      sender: this.sender,
      receiver: this.receiver,
      subscriptionName: this.subscriptionName,
      subscriptionDescription: this.subscriptionDescription,
      call: this.fn,
      messageType: this.messageType,
      eventName: this.eventName,
      principalId: this.principalId,
      instanceId: this.instanceId,
      settings: this.settings,
    }

    return subscription
  }
}
