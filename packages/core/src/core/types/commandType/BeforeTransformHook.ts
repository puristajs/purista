import type { Logger } from '../Logger'
import type { ServiceClass } from '../ServiceClass'
import type { Command } from './Command'

/**
 * The transform hook is called before input validation.
 */
export type BeforeTransformHook<ServiceClassType = ServiceClass> = (
  this: ServiceClassType,
  log: Logger,
  payload: unknown,
  params: Record<string, unknown>,
  message: Command,
) => Promise<{
  payload: unknown
  params: Record<string, unknown>
}>
