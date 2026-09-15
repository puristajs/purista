import { knowledgeV1ServiceBuilder } from './knowledgeV1ServiceBuilder.js'
import { ingestKnowledgeQueueBuilder } from "./queue/ingestKnowledge/ingestKnowledgeQueueBuilder.js";
import { ingestKnowledgeWorkerQueueWorkerBuilder } from "./queue-worker/ingestKnowledgeWorker/ingestKnowledgeWorkerQueueWorkerBuilder.js";
import { requestKnowledgeIngestionCommandBuilder } from "./command/requestKnowledgeIngestion/requestKnowledgeIngestionCommandBuilder.js";

type QueueDefinition = Parameters<typeof knowledgeV1ServiceBuilder['addQueueDefinition']>[number]
type QueueWorkerDefinition = Parameters<typeof knowledgeV1ServiceBuilder['addQueueWorkerDefinition']>[number]



const commandDefinitions: Parameters<typeof knowledgeV1ServiceBuilder['addCommandDefinition']>[0][] = [requestKnowledgeIngestionCommandBuilder.getDefinition()]

const subscriptionDefinitions: Parameters<typeof knowledgeV1ServiceBuilder['addSubscriptionDefinition']>[0][] = []

const streamDefinitions: Parameters<typeof knowledgeV1ServiceBuilder['addStreamDefinition']>[0][] = []
const queueDefinitions: QueueDefinition[] = [ingestKnowledgeQueueBuilder.getDefinition()]
const queueWorkerDefinitions: QueueWorkerDefinition[] = [ingestKnowledgeWorkerQueueWorkerBuilder.getDefinition()]


export const knowledgeV1Service = knowledgeV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addSubscriptionDefinition(...subscriptionDefinitions)
	.addStreamDefinition(...streamDefinitions)
	.addQueueDefinition(...queueDefinitions)
	.addQueueWorkerDefinition(...queueWorkerDefinitions)
