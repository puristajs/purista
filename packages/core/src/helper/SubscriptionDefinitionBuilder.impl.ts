import type { EBMessage, EBMessageType, ServiceClass, SubscriptionDefinition, SubscriptionFunction } from '../core'

export class SubscriptionDefinitionBuilder<
  ServiceClassType = ServiceClass,
  MessageType = EBMessage,
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

  private eventName?: string

  // eslint-disable-next-line no-useless-constructor
  constructor(
    private subscriptionName: string,
    private subscriptionDescription: string,
    private fn: SubscriptionFunction<ServiceClassType, MessageType, Payload>,
  ) {}

  subscribeToEvent(eventName: string) {
    this.eventName = eventName
    return this
  }

  sendFrom(serviceName: string | undefined, serviceVersion: string | undefined, serviceTarget: string | undefined) {
    this.sender = {
      serviceName,
      serviceVersion,
      serviceTarget,
    }
    return this
  }

  receivedBy(serviceName: string | undefined, serviceVersion: string | undefined, serviceTarget: string | undefined) {
    this.receiver = {
      serviceName,
      serviceVersion,
      serviceTarget,
    }
    return this
  }

  addMessageType(messageType: EBMessageType) {
    this.messageType = messageType

    return this
  }

  getDefinition(): SubscriptionDefinition<ServiceClassType, MessageType, Payload> {
    const subscription: SubscriptionDefinition<ServiceClassType, MessageType, Payload> = {
      sender: this.sender,
      receiver: this.receiver,
      subscriptionName: this.subscriptionName,
      subscriptionDescription: this.subscriptionDescription,
      call: this.fn,
      messageType: this.messageType,
      eventName: this.eventName,
    }

    return subscription
  }
}
