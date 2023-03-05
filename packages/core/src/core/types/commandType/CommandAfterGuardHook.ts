import type { ServiceClass } from '../ServiceClass'
import type { CommandFunctionContext } from './CommandFunctionContext'

/**
 * Definition of after guard hook functions.
 * This guard is called after function successfully returns and after output validation.
 */
export type CommandAfterGuardHook<
  ServiceClassType = ServiceClass,
  ResultType = unknown,
  PayloadType = unknown,
  ParamsType = unknown,
> = (
  this: ServiceClassType,
  context: CommandFunctionContext<PayloadType, ParamsType>,
  result: Readonly<ResultType>,
  input: Readonly<PayloadType>,
  parameter: Readonly<ParamsType>,
) => Promise<void>
