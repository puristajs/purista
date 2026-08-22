import type { AgentManifest } from '../../AgentQueueBuilder/types.js'
import type { CommandDefinitionListResolved } from '../../core/types/commandType/CommandDefinitionList.js'
import type { EventToQueueBindingDefinition } from '../../core/types/queue/EventToQueueBindingDefinition.js'
import type { QueueDefinitionListResolved } from '../../core/types/queue/QueueDefinitionList.js'
import type { QueueWorkerDefinitionListResolved } from '../../core/types/queue/QueueWorkerDefinitionList.js'
import type { ScheduleDefinition } from '../../core/types/schedule/index.js'
import type { StreamDefinitionListResolved } from '../../core/types/stream/StreamDefinitionList.js'
import type { SubscriptionDefinitionListResolved } from '../../core/types/subscription/SubscriptionDefinitionList.js'

export type ServiceDefinitions = {
	commands: CommandDefinitionListResolved<any>
	subscriptions: SubscriptionDefinitionListResolved<any>
	streams?: StreamDefinitionListResolved<any>
	queues?: QueueDefinitionListResolved<any>
	queueWorkers?: QueueWorkerDefinitionListResolved<any>
	agents?: AgentManifest[]
	schedules?: ScheduleDefinition[]
	eventToQueueBindings?: EventToQueueBindingDefinition[]
	serviceName: string
	serviceVersion: string
	serviceDescription: string
	deprecated: boolean
}
