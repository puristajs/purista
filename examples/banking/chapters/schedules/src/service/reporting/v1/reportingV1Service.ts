import { getStatementStatusCommandBuilder } from './command/getStatementStatus/getStatementStatusCommandBuilder.js'
import { requestStatementCommandBuilder } from './command/requestStatement/requestStatementCommandBuilder.js'
import { triggerDailyStatementCommandBuilder } from './command/triggerDailyStatement/triggerDailyStatementCommandBuilder.js'
import { generateStatementWorkerQueueWorkerBuilder } from './queue-worker/generateStatementWorker/generateStatementWorkerQueueWorkerBuilder.js'
import { generateStatementQueueBuilder } from './queue/generateStatement/generateStatementQueueBuilder.js'
import { reportingV1ServiceBuilder } from './reportingV1ServiceBuilder.js'
import {
	dailyStatementDueEventName,
	dailyStatementOccurrenceSchema,
} from './schedule/dailyStatementOccurrence.js'
import { dailyStatementSchedule } from './schedule/dailyStatementSchedule.js'

type QueueDefinition = Parameters<typeof reportingV1ServiceBuilder['addQueueDefinition']>[number]
type QueueWorkerDefinition = Parameters<typeof reportingV1ServiceBuilder['addQueueWorkerDefinition']>[number]

const commandDefinitions: Parameters<typeof reportingV1ServiceBuilder['addCommandDefinition']>[0][] = [
	requestStatementCommandBuilder.getDefinition(),
	getStatementStatusCommandBuilder.getDefinition(),
	triggerDailyStatementCommandBuilder.getDefinition(),
]
const subscriptionDefinitions: Parameters<typeof reportingV1ServiceBuilder['addSubscriptionDefinition']>[0][] = []
const streamDefinitions: Parameters<typeof reportingV1ServiceBuilder['addStreamDefinition']>[0][] = []
const queueDefinitions: QueueDefinition[] = [generateStatementQueueBuilder.getDefinition()]
const queueWorkerDefinitions: QueueWorkerDefinition[] = [generateStatementWorkerQueueWorkerBuilder.getDefinition()]

export const reportingV1Service = reportingV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
	.addStreamDefinition(...streamDefinitions)
	.addQueueDefinition(...queueDefinitions)
	.addQueueWorkerDefinition(...queueWorkerDefinitions)
	.addScheduleDefinition(dailyStatementSchedule)
	.bindEventToQueue(dailyStatementDueEventName, 'generateStatement', {
		idempotencyMode: 'advisory',
		idempotencyKey: 'eventField',
		mapPayload: event => {
			const occurrence = dailyStatementOccurrenceSchema.parse(event)
			return {
				accountId: occurrence.accountId,
				transactionId: occurrence.transactionId,
			}
		},
		mapParameter: () => ({}),
		onEnqueueFailure: {
			reason: 'daily_statement_enqueue_failed',
			delayMs: 250,
		},
	})
