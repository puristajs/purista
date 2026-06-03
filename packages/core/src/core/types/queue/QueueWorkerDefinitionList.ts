import type { QueueWorkerDefinition } from './QueueWorkerDefinition.js'

export type AnyQueueWorkerDefinition = QueueWorkerDefinition<any, any, any, any, any, any, any, any, any>

export type QueueWorkerDefinitionList<_S> = Promise<AnyQueueWorkerDefinition>[]
export type QueueWorkerDefinitionListResolved<_S> = AnyQueueWorkerDefinition[]
