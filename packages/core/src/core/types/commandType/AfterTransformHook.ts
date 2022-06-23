import { Service } from '../../Service'
import { Logger } from '../Logger'
import { Command } from './Command'

/**
 * This transform hook is executed after function output validation and AfterGuardHooks.
 */
export type AfterTransformHook<
  ServiceClassType = Service,
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
