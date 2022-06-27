import type { Logger } from '../Logger'
import type { ServiceClass } from '../ServiceClass'
import type { Command } from './Command'

/**
 * CommandFunction is a function which will be triggered when a matching event bridge message is received by the service
 */
export type CommandFunction<
  ServiceClassType = ServiceClass,
  PayloadType = unknown,
  ParamsType = Record<string, unknown>,
  ResultType = unknown,
> = (
  this: ServiceClassType,
  log: Logger,
  payload: PayloadType,
  params: ParamsType,
  message: Command<PayloadType, ParamsType>,
) => Promise<ResultType>
