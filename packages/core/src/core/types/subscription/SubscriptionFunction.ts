import type { Schema } from '../../../schema/index.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { ServiceClass } from '../ServiceClass.js'
import type { SubscriptionFunctionContext } from './SubscriptionFunctionContext.js'
/**
 * CommandFunction is a function which will be triggered when a matching event bridge message is received by the service
 *
 * @group Subscription
 */
export type SubscriptionFunction<
	ServiceClassType extends ServiceClass,
	FunctionPayloadType = unknown,
	FunctionParamsType = unknown,
	FunctionOutputType = unknown,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
> = (
	this: ServiceClassType,
	context: SubscriptionFunctionContext<Resources, Invokes, EmitList>,
	payload: Readonly<FunctionPayloadType>,
	parameter: Readonly<FunctionParamsType>,
) => Promise<FunctionOutputType>
