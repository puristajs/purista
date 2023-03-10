import { SpanProcessor } from '@opentelemetry/sdk-trace-node'

import { CommandDefinitionList } from './commandType'
import { EventBridge } from './EventBridge'
import { ServiceInfoType } from './infoType'
import { Logger } from './Logger'
import { SecretStore } from './secretStore'
import { SubscriptionDefinitionList } from './subscription'

export type ServiceConstructorInput<ConfigType> = {
  /** the logger instance */
  logger: Logger
  /** the service info with name, version and description of service */
  info: ServiceInfoType
  /** the eventBridge instance */
  eventBridge: EventBridge
  /** the list of command definitions for this service */
  commandDefinitionList: CommandDefinitionList<any>
  /** the list of subscription definitions for this service */
  subscriptionDefinitionList: SubscriptionDefinitionList<any>
  /** the service specific config */
  config: ConfigType
  /** the secret store instance */
  secretStore?: SecretStore
  /** the opentelemetry span processor instance */
  spanProcessor?: SpanProcessor
}
