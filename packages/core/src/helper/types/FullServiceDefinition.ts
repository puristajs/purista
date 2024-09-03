import type { CommandDefinition, Service, SubscriptionDefinition } from '../../core/index.js'

export type FullServiceDefinition<S extends Service = Service> = {
	[serviceName: string]: {
		[serviceVersion: string]: {
			description: string
			deprecated: boolean
			commands: {
				[commandName: string]: CommandDefinition<S, any, any, any, any, any, any, any, any, any, any, any, any>
			}
			subscriptions: {
				[subscriptionName: string]: SubscriptionDefinition
			}
		}
	}
}
