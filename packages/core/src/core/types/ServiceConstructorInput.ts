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
  /** A logger instance */
  logger: Logger
  /** The service info with name, version and description of service */
  info: ServiceInfoType
  /** The eventBridge instance */
  eventBridge: EventBridge
  /** The list of command definitions for this service */
  commandDefinitionList: CommandDefinitionList<any>
  /** The list of subscription definitions for this service */
  subscriptionDefinitionList: SubscriptionDefinitionList<any>
  /** The service specific config */
  config: ConfigType
  /** The secret store instance */
  secretStore?: SecretStore
  /** The config store instance */
  configStore?: ConfigStore
  /** the state store instance */
  stateStore?: StateStore
  /** The opentelemetry span processor instance */
  spanProcessor?: SpanProcessor
}
