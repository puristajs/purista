import type { ServiceClass } from '../ServiceClass.js'
import type { SubscriptionTransformFunctionContext } from './SubscriptionTransformFunctionContext.js'

/**
 * This transform hook is executed after function output validation and AfterGuardHooks.
 *
 * @group Subscription
 */
export type SubscriptionTransformOutputHook<
	S extends ServiceClass,
	FinalFunctionOutputType,
	FunctionParamsType,
	TransformOutputHookOutput,
> = (
	this: S,
	context: SubscriptionTransformFunctionContext,
	payload: Readonly<FinalFunctionOutputType>,
	parameter: Readonly<FunctionParamsType>,
) => Promise<TransformOutputHookOutput>
