import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { ServiceClass } from '../ServiceClass.js'
import type { StreamInvokeList } from '../StreamInvokeList.js'
import type { QueueHandlerResult } from './QueueHandlerResult.js'
import type { QueueJobContext } from './QueueJobContext.js'
import type { QueueMessage } from './QueueMessage.js'

export type QueueWorkerAfterGuardHook<
	S extends ServiceClass = ServiceClass,
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
> = (
	this: S,
	context: QueueJobContext<MessagePayloadType, MessageParamsType, Resources, Invokes, StreamInvokes>,
	result: Readonly<QueueHandlerResult | undefined>,
	message: Readonly<QueueMessage<MessagePayloadType, MessageParamsType>>,
) => Promise<void>
