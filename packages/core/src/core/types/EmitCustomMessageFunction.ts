import type { ContentType } from './ContentType.js'
import type { EmitSchemaList } from './EmitSchemaList.js'

/**
 * Emits the given payload as custom message with the given event name.
 *
 * @example
 * ```typescript
 * await emit('my-custom-event-name', { the: 'payload' })
 * ```
 */
export type EmitCustomMessageFunction<EmitList> = <K extends keyof EmitSchemaList<EmitList>>(
  eventName: K,
  payload: EmitList[K],
  contentType?: ContentType,
  contentEncoding?: string,
) => Promise<void>
