import type { CommandDefinitionListResolved, SubscriptionDefinitionListResolved } from '../../core/index.js'

export type ServiceDefinitions = {
  commands: CommandDefinitionListResolved<any>
  subscriptions: SubscriptionDefinitionListResolved<any>
  serviceName: string
  serviceVersion: string
  serviceDescription: string
}
