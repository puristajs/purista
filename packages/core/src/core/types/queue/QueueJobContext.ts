import type { Schema } from '../../../schema/index.js'
import type { QueueRetryRequest } from '../../QueueBridge/types/QueueRetryRequest.js'
import type { ContextBase } from '../ContextBase.js'
import type { EmitCustomMessageFunction } from '../EmitCustomMessageFunction.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { StreamInvokeList } from '../StreamInvokeList.js'
import type { QueueMessage } from './QueueMessage.js'

export type QueueJobControls = {
	complete(output?: unknown, headers?: Record<string, string>): Promise<void>
	retry(request?: QueueRetryRequest): Promise<void>
	fail(reason: string, fatal?: boolean): Promise<void>
	moveToDeadLetter(reason?: string): Promise<void>
	extendLease(durationMs: number): Promise<void>
	cancelRequested(): boolean
}

export type QueueJobContext<
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = Record<string, never>,
> = ContextBase & {
	message: Readonly<QueueMessage<MessagePayloadType, MessageParamsType>>
	job: QueueJobControls
	signal: AbortSignal
	emit: EmitCustomMessageFunction<EmitList>
	service: Invokes
	stream: StreamInvokes
	resources: Resources
}
