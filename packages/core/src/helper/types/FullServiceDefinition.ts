import type { CommandDefinition, SubscriptionDefinition } from '../../core/index.js'

export type FullServiceDefinition = {
	[serviceName: string]: {
		[serviceVersion: string]: {
			description: string
			deprecated: boolean
			commands: {
				[commandName: string]: CommandDefinition
			}
			subscriptions: {
				[subscriptionName: string]: SubscriptionDefinition
			}
		}
	}
}
