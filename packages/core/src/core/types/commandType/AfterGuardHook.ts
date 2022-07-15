import type { Logger } from '../Logger'
import type { ServiceClass } from '../ServiceClass'
import type { Command } from './Command'

/**
 * Definition of after guard hook functions.
 * This guard is called after function successfully returns and after output validation.
 */
export type AfterGuardHook<
  ServiceClassType = ServiceClass,
  ResultType = unknown,
  PayloadType = unknown,
  ParamsType = unknown,
> = (
  this: ServiceClassType,
  context: { logger: Logger; message: Command<PayloadType, ParamsType> },
  result: ResultType,
  input: PayloadType,
  params: ParamsType,
) => Promise<void>
