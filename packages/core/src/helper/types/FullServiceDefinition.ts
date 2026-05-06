import type { Service } from '../../core/Service/Service.impl.js'
import type { CommandDefinition } from '../../core/types/commandType/CommandDefinition.js'
import type { EventToQueueBindingDefinition } from '../../core/types/queue/EventToQueueBindingDefinition.js'
import type { QueueDefinition } from '../../core/types/queue/QueueDefinition.js'
import type { QueueWorkerDefinition } from '../../core/types/queue/QueueWorkerDefinition.js'
import type { ScheduleDefinition } from '../../core/types/schedule/index.js'
import type { StreamDefinition } from '../../core/types/stream/StreamDefinition.js'
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
			streams?: {
				[streamName: string]: StreamDefinition<S, any, any, any, any, any, any, any, any, any, any, any>
			}
			queues?: {
				[queueName: string]: QueueDefinition<any, any, any, any, any>
			}
			queueWorkers?: {
				[workerName: string]: QueueWorkerDefinition<any, any, any, any, any>
			}
			schedules?: {
				[scheduleName: string]: ScheduleDefinition
			}
			eventToQueueBindings?: EventToQueueBindingDefinition[]
		}
	}
}
