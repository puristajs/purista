import { SubscriptionDefinitionList } from '@purista/core'

import type { HttpServerService } from '../HttpServerService.impl'
import serviceCommandsToRestApi from './serviceCommandsToRestApi'

export const SUBSCRIPTIONS: SubscriptionDefinitionList<HttpServerService> = [serviceCommandsToRestApi.getDefinition()]
