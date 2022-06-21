import { EBMessageType, InfoServiceFunctionAdded, SubscriptionDefinition } from '../../../core'
import { serviceCommandsToRestApi } from './serviceCommandsToRestApi.impl'

/**
 * This function listens for messages of type `InfoServiceFunctionAdded` and calls the
 * `serviceCommandsToRestApi` function
 * @returns A subscription definition.
 */
export const getServiceCommandsToRestApi = (): SubscriptionDefinition<InfoServiceFunctionAdded> => {
  const subscription: SubscriptionDefinition<InfoServiceFunctionAdded> = {
    subscriptionName: 'AddServiceCommandSubscription',
    subscriptionDescription:
      'subscription which listens for infos about commands from services which should be exposed as rest api endpoints',
    call: serviceCommandsToRestApi,
    messageTypes: [EBMessageType.InfoServiceFunctionAdded],
  }

  return subscription
}
