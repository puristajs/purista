import type { ContextBase } from '../ContextBase.js'
import type { EBMessage } from '../EBMessage.js'
import type { EmitCustomMessageFunction } from '../EmitCustomMessageFunction.js'
import type { InvokeFunction } from '../InvokeFunction.js'
import type { Prettify } from '../Prettify.js'

/**
 * It provides the original command message.
 * Also, the methods:
 *
 * - `emit` which allows to emit custom events to the event bridge
 * - `invoke` which allows to call other commands
 *
 * @group Subscription
 */
export type SubscriptionFunctionContextEnhancements = {
  /** the original message */
  message: Readonly<EBMessage>
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
 * The subscription function context which will be passed into subscription function.
 *
 * @group Subscription
 */
export type SubscriptionFunctionContext = Prettify<ContextBase & SubscriptionFunctionContextEnhancements>
