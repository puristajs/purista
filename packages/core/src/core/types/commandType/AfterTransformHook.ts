import type { Logger } from '../Logger'
import type { ServiceClass } from '../ServiceClass'
import type { Command } from './Command'

/**
 * This transform hook is executed after function output validation and AfterGuardHooks.
 */
export type AfterTransformHook<
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
) => Promise<unknown>
