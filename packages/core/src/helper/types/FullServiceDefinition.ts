import type { Service } from '../../core/Service/Service.impl.js'
import type { CommandDefinition } from '../../core/types/commandType/CommandDefinition.js'
import type { SubscriptionDefinition } from '../../core/types/subscription/SubscriptionDefinition.js'

export type FullServiceDefinition<S extends Service = Service> = {
	[serviceName: string]: {
		[serviceVersion: string]: {
			description: string
			deprecated: boolean
			commands: {
				[commandName: string]: CommandDefinition<S, any, any, any, any, any, any, any, any, any, any, any, any, any>
			}
			subscriptions: {
				[subscriptionName: string]: SubscriptionDefinition<S, any, any, any, any, any, any, any, any, any, any, any>
			}
		}
	}
}
