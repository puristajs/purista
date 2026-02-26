import { pingV1ServiceBuilder } from '../../pingV1ServiceBuilder.js'
import { pingV1PingJobQueueParameterSchema, pingV1PingJobQueuePayloadSchema } from '../../queue/pingJob/schema.js'
import {
	pingV1PingAsyncInputParameterSchema,
	pingV1PingAsyncInputPayloadSchema,
	pingV1PingAsyncOutputPayloadSchema,
} from './schema.js'

export const pingAsyncCommandBuilder = pingV1ServiceBuilder
	.getCommandBuilder('pingAsync', 'Enqueues ping requests for async processing via queues')
	.addPayloadSchema(pingV1PingAsyncInputPayloadSchema)
	.addParameterSchema(pingV1PingAsyncInputParameterSchema)
	.addOutputSchema(pingV1PingAsyncOutputPayloadSchema)
	.canEnqueue('pingJob', pingV1PingJobQueuePayloadSchema, pingV1PingJobQueueParameterSchema)
	.exposeAsHttpEndpoint('POST', 'ping/async', undefined, undefined, undefined, undefined, { mode: 'async' })
	.setCommandFunction(async function (context, payload, parameter) {
		const job = await context.queue.enqueue.pingJob(payload, parameter)
		return {
			jobId: job.jobId,
			queueName: job.queueName,
			scheduledAt: job.scheduledAt,
		}
	})
