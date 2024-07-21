import type { EmptyObject } from '../EmptyObject.js'
import type { ServiceClass } from '../ServiceClass.js'
import type { SubscriptionFunctionContext } from './SubscriptionFunctionContext.js'

/**
 * Guard is called after command function input validation and before executing the command function.
 * The guard is usefull to separate for example auth checks from business logic.
 * It should throw HandledError or return void.
 *
 * @group Subscription
 */
export type SubscriptionBeforeGuardHook<
	ServiceClassType = ServiceClass,
	FunctionPayloadType = unknown,
	FunctionParamsType = unknown,
	Invokes = EmptyObject,
	EmitListType = EmptyObject,
	Resources = EmptyObject,
> = (
	this: ServiceClassType,
	context: SubscriptionFunctionContext<Invokes, EmitListType, Resources>,
	payload: Readonly<FunctionPayloadType>,
	parameter: Readonly<FunctionParamsType>,
) => Promise<void>
