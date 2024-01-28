import type { EBMessageAddress } from './EBMessageAddress.js'

/**
 * Invokes a command and returns the result.
 * It is recommended to validate the result against a schema which only contains the data you actually need.
 *
 * @example
 * ```typescript
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
export type InvokeFunction = <InvokeResponseType = unknown, PayloadType = unknown, ParameterType = unknown>(
  address: EBMessageAddress,
  payload: PayloadType,
  parameter: ParameterType,
) => Promise<InvokeResponseType>
