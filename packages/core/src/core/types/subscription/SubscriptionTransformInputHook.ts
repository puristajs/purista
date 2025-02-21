import type { ServiceClass } from '../ServiceClass.js'
import type { SubscriptionTransformFunctionContext } from './SubscriptionTransformFunctionContext.js'

/**
 * @group Subscription
 */
export type SubscriptionTransformInputHook<
	S extends ServiceClass,
	TransformInputPayload,
	TransformInputParams,
	FunctionPayloadType,
	FunctionParamsType,
> = (
	this: S,
	context: SubscriptionTransformFunctionContext,
	payload: Readonly<TransformInputPayload>,
	parameter: Readonly<TransformInputParams>,
) => Promise<{
	payload: Readonly<FunctionPayloadType>
	parameter: Readonly<FunctionParamsType>
}>
