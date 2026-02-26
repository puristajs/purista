import type { Schema } from '../../../schema/index.js'

export type QueueInvokeList = Record<string, { payloadSchema?: Schema; parameterSchema?: Schema }>
