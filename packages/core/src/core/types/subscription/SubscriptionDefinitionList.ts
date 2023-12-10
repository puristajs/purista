import type { ServiceClass } from '../ServiceClass.js'
import type { SubscriptionDefinition } from './SubscriptionDefinition.js'

/**
 * Helper type for creating list of service commands to be passed as input to service class
 *
 * ```typescript
 * export const userServiceCommands: SubscriptionDefinitionList<UserService> = [signUp.getDefinition()]
 * ```
 */
export type SubscriptionDefinitionList<ServiceClassType extends ServiceClass> = SubscriptionDefinition<
  ServiceClassType,
  any,
  any,
  any,
  any
>[]
