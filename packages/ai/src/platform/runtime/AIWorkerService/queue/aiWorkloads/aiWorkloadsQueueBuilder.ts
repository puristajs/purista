import { aiWorkerServiceBuilder } from '../../info/info.js'
import { aiWorkloadQueueParameterSchema, aiWorkloadQueuePayloadSchema } from './schema.js'

export const aiWorkloadsQueueBuilder = aiWorkerServiceBuilder
	.getQueueBuilder('aiWorkloads', 'Processes queued AI workloads via the queue bridge')
	.addPayloadSchema(aiWorkloadQueuePayloadSchema)
	.addParameterSchema(aiWorkloadQueueParameterSchema)
