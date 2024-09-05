import type { Schema } from '@typeschema/main'
import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { ServiceClass } from '../ServiceClass.js'
import type { SubscriptionFunctionContext } from './SubscriptionFunctionContext.js'

/**
 * Definition of after guard hook functions.
 * This guard is called after function successfully returns and after output validation.
 *
 * @group Subscription
 */
export type SubscriptionAfterGuardHook<
	ServiceClassType = ServiceClass,
	FunctionResultType = unknown,
	FunctionPayloadOutputType = unknown,
	FunctionParameterType = unknown,
	Resources extends Record<string, any> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
> = (
	this: ServiceClassType,
	context: SubscriptionFunctionContext<Resources, Invokes, EmitList>,
	result: Readonly<FunctionResultType>,
	payload: Readonly<FunctionPayloadOutputType>,
	parameter: Readonly<FunctionParameterType>,
) => Promise<void>
