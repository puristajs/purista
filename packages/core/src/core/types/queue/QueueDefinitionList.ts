import type { QueueDefinition } from './QueueDefinition.js'

export type QueueDefinitionList<_S> = Promise<QueueDefinition>[]
export type QueueDefinitionListResolved<_S> = QueueDefinition[]
