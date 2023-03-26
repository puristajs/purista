/**
 * Emits the given payload as custom message with the given event name.
 *
 * @example ```typescript
 * await emit('my-custom-event-name', { the: 'payload' })
 * ```
 */
export type EmitCustomMessageFunction = <Payload = unknown>(eventName: string, payload?: Payload) => Promise<void>
