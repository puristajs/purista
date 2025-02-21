import type { CommandDefinitionListResolved } from '../../core/types/commandType/CommandDefinitionList.js'
import type { SubscriptionDefinitionListResolved } from '../../core/types/subscription/SubscriptionDefinitionList.js'

export type ServiceDefinitions = {
	commands: CommandDefinitionListResolved<any>
	subscriptions: SubscriptionDefinitionListResolved<any>
	serviceName: string
	serviceVersion: string
	serviceDescription: string
	deprecated: boolean
}
