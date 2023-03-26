import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'

import type { ConfigStore } from '../ConfigStore'
import type { EventBridge } from '../EventBridge'
import type { SecretStore } from '../SecretStore'
import type { StateStore } from '../StateStore'
import type { CommandDefinitionList } from './commandType'
import type { ServiceInfoType } from './infoType'
import type { Logger } from './Logger'
import type { SubscriptionDefinitionList } from './subscription'

/**
 * @group Service
 */
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
  /** the config store instance */
  configStore?: ConfigStore
  /** the state store instance */
  stateStore?: StateStore
  /** the opentelemetry span processor instance */
  spanProcessor?: SpanProcessor
}
