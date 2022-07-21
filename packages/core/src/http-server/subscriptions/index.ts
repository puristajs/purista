import { SubscriptionDefinitionList } from '../../core'
import { HttpServerService } from '../HttpServerService.impl'
import { getServiceCommandsToRestApi } from './ServiceCommandsToRestApi'

export const SUBSCRIPTIONS: SubscriptionDefinitionList<HttpServerService> = [getServiceCommandsToRestApi()]
