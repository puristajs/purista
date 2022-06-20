import type { Service } from '../../Service'
import { Logger } from '../Logger'
import { Command } from './Command'

export type TransformHook<ServiceClassType = Service, PayloadType = unknown, ParamsType = Record<string, unknown>> = (
  this: ServiceClassType,
  log: Logger,
  payload: unknown,
  params: unknown,
  message: Command<PayloadType, ParamsType>,
) => Promise<{
  payload: PayloadType
  params: ParamsType
  message: Command<PayloadType, ParamsType>
}>
