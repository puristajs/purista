import type { QueueWorkerDefinition } from './QueueWorkerDefinition.js'

export type QueueWorkerDefinitionList<_S> = Promise<QueueWorkerDefinition>[]
export type QueueWorkerDefinitionListResolved<_S> = QueueWorkerDefinition[]
