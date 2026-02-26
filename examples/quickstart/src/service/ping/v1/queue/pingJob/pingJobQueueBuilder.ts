import { pingV1ServiceBuilder } from '../../pingV1ServiceBuilder.js'
import { pingV1PingJobQueueParameterSchema, pingV1PingJobQueuePayloadSchema } from './schema.js'

export const pingJobQueueBuilder = pingV1ServiceBuilder
	.getQueueBuilder('pingJob', 'Processes ping requests asynchronously via the queue bridge')
	.addPayloadSchema(pingV1PingJobQueuePayloadSchema)
	.addParameterSchema(pingV1PingJobQueueParameterSchema)
