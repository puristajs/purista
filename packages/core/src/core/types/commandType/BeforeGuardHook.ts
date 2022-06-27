import type { Logger } from '../Logger'
import type { ServiceClass } from '../ServiceClass'
import type { Command } from './Command'

/**
 * Guard is called after command function input validation and before executing the command function.
 * The guard is usefull to separate for example auth checks from business logic.
 * It should throw HandledError or return void.
 */
export type BeforeGuardHook<
  ServiceClassType = ServiceClass,
  PayloadType = unknown,
  ParamsType = Record<string, unknown>,
> = (
  this: ServiceClassType,
  log: Logger,
  payload: PayloadType,
  params: ParamsType,
  message: Command<PayloadType, ParamsType>,
) => Promise<void>
