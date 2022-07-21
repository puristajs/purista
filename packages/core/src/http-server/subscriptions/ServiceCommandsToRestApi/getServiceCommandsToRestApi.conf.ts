import { EBMessageType, InfoServiceFunctionAdded, SubscriptionDefinition } from '../../../core'
import { HttpServerService } from '../../HttpServerService.impl'
import { serviceCommandsToRestApi } from './serviceCommandsToRestApi.impl'

/**
 * This function listens for messages of type `InfoServiceFunctionAdded` and calls the
 * `serviceCommandsToRestApi` function
 * @returns A subscription definition.
 */
export const getServiceCommandsToRestApi = (): SubscriptionDefinition<HttpServerService, InfoServiceFunctionAdded> => {
  const subscription: SubscriptionDefinition<HttpServerService, InfoServiceFunctionAdded> = {
    subscriptionName: 'AddServiceCommandSubscription',
    subscriptionDescription:
      'subscription which listens for infos about commands from services which should be exposed as rest api endpoints',
    call: serviceCommandsToRestApi,
    messageType: EBMessageType.InfoServiceFunctionAdded,
  }

  return subscription
}
