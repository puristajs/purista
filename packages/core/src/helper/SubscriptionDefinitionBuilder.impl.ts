import type { EBMessage, EBMessageType, ServiceClass, SubscriptionCallback, SubscriptionDefinition } from '../core'

export class SubscriptionDefinitionBuilder<ServiceClassType = ServiceClass, MessageTypes = EBMessage> {
  private messageTypes: EBMessageType[] | undefined

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

  // eslint-disable-next-line no-useless-constructor
  constructor(
    private subscriptionName: string,
    private subscriptionDescription: string,
    private fn: SubscriptionCallback<ServiceClassType, MessageTypes>,
  ) {}

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

  addMessageTypes(...messageTypes: EBMessageType[]) {
    if (!this.messageTypes) {
      this.messageTypes = []
    }

    this.messageTypes.push(...messageTypes)

    return this
  }

  getDefinition(): SubscriptionDefinition<MessageTypes> {
    const subscription: SubscriptionDefinition<MessageTypes> = {
      sender: this.sender,
      receiver: this.receiver,
      subscriptionName: this.subscriptionName,
      subscriptionDescription: this.subscriptionDescription,
      call: this.fn,
      messageTypes: this.messageTypes,
    }

    return subscription
  }
}
