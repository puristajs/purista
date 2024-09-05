import type { Schema } from '@typeschema/main'
import type { Service } from '../../Service/index.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { SubscriptionFunctionContext } from './SubscriptionFunctionContext.js'

/**
 * Guard is called after command function input validation and before executing the command function.
 * The guard is usefull to separate for example auth checks from business logic.
 * It should throw HandledError or return void.
 *
 * @group Subscription
 */
export type SubscriptionBeforeGuardHook<
	S extends Service = Service,
	FunctionPayloadType = unknown,
	FunctionParamsType = unknown,
	Resources extends Record<string, any> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
> = (
	this: S,
	context: SubscriptionFunctionContext<Resources, Invokes, EmitList>,
	payload: Readonly<FunctionPayloadType>,
	parameter: Readonly<FunctionParamsType>,
) => Promise<void>
