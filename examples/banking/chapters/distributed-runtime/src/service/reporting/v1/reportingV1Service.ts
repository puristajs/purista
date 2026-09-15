import { reportingV1ServiceBuilder } from './reportingV1ServiceBuilder.js'
import { generateSnapshotQueueBuilder } from "./queue/generateSnapshot/generateSnapshotQueueBuilder.js";
import { generateSnapshotWorkerQueueWorkerBuilder } from "./queue-worker/generateSnapshotWorker/generateSnapshotWorkerQueueWorkerBuilder.js";
import { requestSnapshotCommandBuilder } from "./command/requestSnapshot/requestSnapshotCommandBuilder.js";

type QueueDefinition = Parameters<typeof reportingV1ServiceBuilder['addQueueDefinition']>[number]
type QueueWorkerDefinition = Parameters<typeof reportingV1ServiceBuilder['addQueueWorkerDefinition']>[number]



const commandDefinitions: Parameters<typeof reportingV1ServiceBuilder['addCommandDefinition']>[0][] = [requestSnapshotCommandBuilder.getDefinition()]

const subscriptionDefinitions: Parameters<typeof reportingV1ServiceBuilder['addSubscriptionDefinition']>[0][] = []

const streamDefinitions: Parameters<typeof reportingV1ServiceBuilder['addStreamDefinition']>[0][] = []
const queueDefinitions: QueueDefinition[] = [generateSnapshotQueueBuilder.getDefinition()]
const queueWorkerDefinitions: QueueWorkerDefinition[] = [generateSnapshotWorkerQueueWorkerBuilder.getDefinition()]


export const reportingV1Service = reportingV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
	.addStreamDefinition(...streamDefinitions)
	.addQueueDefinition(...queueDefinitions)
	.addQueueWorkerDefinition(...queueWorkerDefinitions)
