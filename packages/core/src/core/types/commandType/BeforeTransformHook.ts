import type { Service } from '../../Service'
import { Logger } from '../Logger'
import { Command } from './Command'

/**
 * The transform hook is called before input validation.
 */
export type BeforeTransformHook<ServiceClassType = Service> = (
  this: ServiceClassType,
  log: Logger,
  payload: unknown,
  params: Record<string, unknown>,
  message: Command,
) => Promise<{
  payload: unknown
  params: Record<string, unknown>
}>
