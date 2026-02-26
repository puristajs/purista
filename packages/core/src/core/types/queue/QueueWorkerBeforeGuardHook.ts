import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { ServiceClass } from '../ServiceClass.js'
import type { StreamInvokeList } from '../StreamInvokeList.js'
import type { QueueJobContext } from './QueueJobContext.js'
import type { QueueMessage } from './QueueMessage.js'

export type QueueWorkerBeforeGuardHook<
	S extends ServiceClass = ServiceClass,
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
> = (
	this: S,
	context: QueueJobContext<MessagePayloadType, MessageParamsType, Resources, Invokes, StreamInvokes>,
	message: Readonly<QueueMessage<MessagePayloadType, MessageParamsType>>,
) => Promise<void>
