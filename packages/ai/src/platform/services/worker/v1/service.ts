import { aiWorkerServiceBuilder } from './info.js'
import { aiWorkloadsQueueBuilder, executeWorkloadQueueWorkerBuilder } from './queue/aiWorkloads.js'

const queueDefinitions = [aiWorkloadsQueueBuilder.getDefinition()]
const queueWorkerDefinitions = [executeWorkloadQueueWorkerBuilder.getDefinition()]

export const aiWorkerService = aiWorkerServiceBuilder
	.addQueueDefinition(...queueDefinitions)
	.addQueueWorkerDefinition(...queueWorkerDefinitions)
