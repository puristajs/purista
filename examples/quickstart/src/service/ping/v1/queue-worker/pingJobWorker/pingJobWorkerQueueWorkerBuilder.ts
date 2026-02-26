import { pingV1ServiceBuilder } from '../../pingV1ServiceBuilder.js'

export const pingJobWorkerQueueWorkerBuilder = pingV1ServiceBuilder
	.getQueueWorkerBuilder('pingJob', 'pingJobWorker')
	.setMode('sequential')
	.setHandler(async function (context, message) {
		context.logger.info({ jobId: message.id }, 'processing async ping job')
		await context.job.complete()
		return undefined
	})
