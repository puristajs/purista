import type { PuristaCommandId } from '../core/types.js'
import { addAgentCommand } from './add-agent.js'
import { addCommandCommand } from './add-command.js'
import { addQueueCommand } from './add-queue.js'
import { addQueueWorkerCommand } from './add-queue-worker.js'
import { addServiceCommand } from './add-service.js'
import { addStreamCommand } from './add-stream.js'
import { addSubscriptionCommand } from './add-subscription.js'
import { addWorkflowCommand } from './add-workflow.js'
import {
	exportAsyncApiCommand,
	exportCloudEventsSchemaCommand,
	exportKubernetesCronJobCommand,
	exportRuntimeCapabilitiesCommand,
	exportScheduleManifestCommand,
} from './export.js'
import { initProjectCommand } from './init-project.js'

export const commandRegistry = {
	'add-service': addServiceCommand,
	'add-command': addCommandCommand,
	'add-subscription': addSubscriptionCommand,
	'add-stream': addStreamCommand,
	'add-queue': addQueueCommand,
	'add-queue-worker': addQueueWorkerCommand,
	'add-agent': addAgentCommand,
	'add-workflow': addWorkflowCommand,
	'export-asyncapi': exportAsyncApiCommand,
	'export-runtime-capabilities': exportRuntimeCapabilitiesCommand,
	'export-schedule-manifest': exportScheduleManifestCommand,
	'export-kubernetes-cronjob': exportKubernetesCronJobCommand,
	'export-cloudevents-schema': exportCloudEventsSchemaCommand,
	'init-project': initProjectCommand,
} as const

export const getCommand = (commandId: PuristaCommandId) => commandRegistry[commandId]
