import type { Schema } from '@typeschema/main'
import type { Service } from '../../Service/index.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { SubscriptionFunctionContext } from './SubscriptionFunctionContext.js'
/**
 * CommandFunction is a function which will be triggered when a matching event bridge message is received by the service
 *
 * @group Subscription
 */
export type SubscriptionFunction<
	ServiceClassType extends Service,
	FunctionPayloadType = unknown,
	FunctionParamsType = unknown,
	FunctionOutputType = unknown,
	Resources extends Record<string, any> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
> = (
	this: ServiceClassType,
	context: SubscriptionFunctionContext<Resources, Invokes, EmitList>,
	payload: Readonly<FunctionPayloadType>,
	parameter: Readonly<FunctionParamsType>,
) => Promise<FunctionOutputType>
