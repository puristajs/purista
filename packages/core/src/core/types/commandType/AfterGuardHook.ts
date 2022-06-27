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
  ParamsType = Record<string, unknown>,
> = (
  this: ServiceClassType,
  log: Logger,
  result: ResultType,
  input: PayloadType,
  params: ParamsType,
  message: Command<PayloadType, ParamsType>,
) => Promise<void>
