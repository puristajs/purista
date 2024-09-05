import type { Service } from '../../Service/index.js'
import type { SubscriptionTransformFunctionContext } from './SubscriptionTransformFunctionContext.js'

/**
 * This transform hook is executed after function output validation and AfterGuardHooks.
 *
 * @group Subscription
 */
export type SubscriptionTransformOutputHook<
	S extends Service,
	FinalFunctionOutputType,
	FunctionParamsType,
	TransformOutputHookOutput,
> = (
	this: S,
	context: SubscriptionTransformFunctionContext,
	payload: Readonly<FinalFunctionOutputType>,
	parameter: Readonly<FunctionParamsType>,
) => Promise<TransformOutputHookOutput>
