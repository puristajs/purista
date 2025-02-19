import type { Service } from '../../Service/index.js'
import type { SubscriptionDefinition } from './SubscriptionDefinition.js'

/**
 * Helper type for creating list of service commands to be passed as input to service class
 *
 * ```typescript
 * export const userServiceCommands: SubscriptionDefinitionList<UserService> = [signUp.getDefinition()]
 * ```
 */
export type SubscriptionDefinitionList<ServiceClassType extends Service> = Promise<
	SubscriptionDefinition<ServiceClassType, any, any, any, any, any, any, any, any, any, any, any>
>[]

export type SubscriptionDefinitionListResolved<ServiceClassType extends Service> = SubscriptionDefinition<
	ServiceClassType,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any
>[]
