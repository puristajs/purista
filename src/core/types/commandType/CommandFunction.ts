import { Service } from '../../Service'
import { Command } from './Command'

/**
 * CommandFunction is a function which will be triggered when a matching event bridge message is received by the service
 */
export type CommandFunction<
  ServiceClassType = Service,
  PayloadType = unknown,
  ParamsType = unknown,
  ResultType = unknown,
> = (
  this: ServiceClassType,
  payload: PayloadType,
  params: ParamsType,
  message: Command<PayloadType, ParamsType>,
) => Promise<ResultType>
