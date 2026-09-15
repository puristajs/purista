import type { CommandDefinitionListResolved } from '../../core/types/commandType/CommandDefinitionList.js'
import type { EventToQueueBindingDefinition } from '../../core/types/queue/EventToQueueBindingDefinition.js'
import type { QueueDefinitionListResolved } from '../../core/types/queue/QueueDefinitionList.js'
import type { QueueWorkerDefinitionListResolved } from '../../core/types/queue/QueueWorkerDefinitionList.js'
import type { ScheduleDefinition } from '../../core/types/schedule/index.js'
import type { StreamDefinitionListResolved } from '../../core/types/stream/StreamDefinitionList.js'
import type { SubscriptionDefinitionListResolved } from '../../core/types/subscription/SubscriptionDefinitionList.js'
import type { SerializedHarnessTargetExportV1 } from '../../HarnessMount/types.js'
import type { MountedHarnessDefinition } from './HarnessServiceDefinition.js'

export type ServiceDefinitions = {
	commands: CommandDefinitionListResolved<any>
	subscriptions: SubscriptionDefinitionListResolved<any>
	streams?: StreamDefinitionListResolved<any>
	queues?: QueueDefinitionListResolved<any>
	queueWorkers?: QueueWorkerDefinitionListResolved<any>
	schedules?: ScheduleDefinition[]
	eventToQueueBindings?: EventToQueueBindingDefinition[]
	/** Explicit Harness roots only. Dependency targets are never callable exports. */
	agents?: Readonly<Record<string, SerializedHarnessTargetExportV1>>
	/** Explicit Harness roots only. Dependency targets are never callable exports. */
	workflows?: Readonly<Record<string, SerializedHarnessTargetExportV1>>
	/** Sanitized, non-callable Harness composition metadata. */
	harness?: MountedHarnessDefinition
	serviceName: string
	serviceVersion: string
	serviceDescription: string
	deprecated: boolean
}
