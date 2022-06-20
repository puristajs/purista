import type { Service } from '../../Service'
import { Logger } from '../Logger'

export type AfterGuardHook<ServiceClassType = Service, ResultType = unknown> = (
  this: ServiceClassType,
  log: Logger,
  result: ResultType,
) => Promise<void>
