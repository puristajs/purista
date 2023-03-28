import { ContextBase } from '../ContextBase'
import { EmitCustomMessageFunction } from '../EmitCustomMessageFunction'
import { InvokeFunction } from '../InvokeFunction'
import type { Command } from './Command'

/**
 * It provides the original command message with types for payload and parameter.
 * Also, the methods:
 *
 * - `emit` which allows to emit custom events to the event bridge
 * - `invoke` which allows to call other commands
 *
 * @group Command
 */
export type CommandFunctionContextEnhancements<MessagePayloadType = unknown, MessageParamsType = unknown> = {
  /** the original message */
  message: Readonly<Command<MessagePayloadType, MessageParamsType>>
  /** emit a custom message */
  emit: EmitCustomMessageFunction
  /**
   * Invokes a command and returns the result.
   * It is recommended to validate the result against a schema which only contains the data you actually need.
   *
   * @example ```typescript
   *
   * const address: EBMessageAddress = {
   *   serviceName: 'name-of-service-to-invoke',
   *   serviceVersion: '1',
   *   serviceTarget: 'command-name-to-invoke',
   * }
   *
   * const inputPayload = { my: 'input' }
   * const inputParameter = { search: 'for_me' }
   *
   * const result = await invoke<MyResultType>(address, inputPayload inputParameter )
   * ```
   */
  invoke: InvokeFunction
}

/**
 * The command function context which will be passed into command function.
 *
 * @group Command
 */
export type CommandFunctionContext<MessagePayloadType = unknown, MessageParamsType = unknown> = ContextBase &
  CommandFunctionContextEnhancements<MessagePayloadType, MessageParamsType>
