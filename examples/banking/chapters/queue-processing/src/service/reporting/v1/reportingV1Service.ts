import { reportingV1ServiceBuilder } from './reportingV1ServiceBuilder.js'
import { generateStatementQueueBuilder } from "./queue/generateStatement/generateStatementQueueBuilder.js";
import { generateStatementWorkerQueueWorkerBuilder } from "./queue-worker/generateStatementWorker/generateStatementWorkerQueueWorkerBuilder.js";
import { requestStatementCommandBuilder } from "./command/requestStatement/requestStatementCommandBuilder.js";
import { getStatementStatusCommandBuilder } from "./command/getStatementStatus/getStatementStatusCommandBuilder.js";

type QueueDefinition = Parameters<typeof reportingV1ServiceBuilder['addQueueDefinition']>[number]
type QueueWorkerDefinition = Parameters<typeof reportingV1ServiceBuilder['addQueueWorkerDefinition']>[number]



const commandDefinitions: Parameters<typeof reportingV1ServiceBuilder['addCommandDefinition']>[0][] = [requestStatementCommandBuilder.getDefinition(), getStatementStatusCommandBuilder.getDefinition()]

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
