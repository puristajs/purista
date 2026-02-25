import type { Schema } from '../../../schema/index.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { ServiceClass } from '../ServiceClass.js'
import type { StreamInvokeList } from '../StreamInvokeList.js'
import type { QueueInvokeList } from '../queue/QueueInvokeList.js'
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
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
> = (
	this: ServiceClassType,
	context: SubscriptionFunctionContext<Resources, Invokes, StreamInvokes, EmitList, QueueInvokes>,
	result: Readonly<FunctionResultType>,
	payload: Readonly<FunctionPayloadOutputType>,
	parameter: Readonly<FunctionParameterType>,
) => Promise<void>
