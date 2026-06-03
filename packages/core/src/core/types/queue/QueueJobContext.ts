import type { AgentInvokeMap, AllowedAgentDefinition } from '../../../AgentQueueBuilder/types.js'
import type { Schema } from '../../../schema/index.js'
import type { QueueRetryRequest } from '../../QueueBridge/types/QueueRetryRequest.js'
import type { ContextBase } from '../ContextBase.js'
import type { EmitCustomMessageFunction } from '../EmitCustomMessageFunction.js'
import type { EmptyObject } from '../EmptyObject.js'
import type { InvokeList } from '../InvokeList.js'
import type { PuristaMetricContextProperty, PuristaMetricDefinitions } from '../PuristaMetrics.js'
import type { StreamInvokeList } from '../StreamInvokeList.js'
import type { QueueContext } from './QueueContext.js'
import type { QueueInvokeList } from './QueueInvokeList.js'
import type { QueueMessage } from './QueueMessage.js'

/**
 * Runtime controls available to a queue worker for the currently leased job.
 *
 * Prefer returning a {@link QueueHandlerResult} from handlers. Use these
 * controls when work needs explicit progress, cancellation, or lease handling.
 *
 * @group Queue
 */
export type QueueJobControls = {
	/** Mark the current job complete. */
	complete(output?: unknown, headers?: Record<string, string>): Promise<void>
	/** Request another attempt, optionally with delay and safe reason. */
	retry(request?: QueueRetryRequest): Promise<void>
	/** Mark the job failed and let lifecycle policy decide retry/dead-letter. */
	fail(reason: string, fatal?: boolean): Promise<void>
	/** Move the job directly to the dead-letter store. */
	moveToDeadLetter(reason?: string): Promise<void>
	/** Extend the current queue lease. */
	extendLease(durationMs: number): Promise<void>
	/** True when shutdown or lease loss requested cooperative cancellation. */
	cancelRequested(): boolean
}

/**
 * Context object passed to queue worker handlers.
 *
 * The context exposes service invokes, streams, queues, resources, stores,
 * telemetry helpers, a cancellation signal, and typed custom metrics. Handler
 * code should minimize data emitted to logs, metrics, spans, queue headers,
 * and result events.
 *
 * @group Queue
 */
export type QueueJobContext<
	MessagePayloadType = unknown,
	MessageParamsType = unknown,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = Record<string, never>,
	QueueInvokes extends QueueInvokeList = QueueInvokeList,
	Metrics extends PuristaMetricDefinitions = EmptyObject,
	AgentInvokes extends Record<string, AllowedAgentDefinition> = Record<never, never>,
> = ContextBase<Metrics> &
	PuristaMetricContextProperty<Metrics> & {
		/** Immutable queue message for this lease. */
		message: Readonly<QueueMessage<MessagePayloadType, MessageParamsType>>
		/** Queue lifecycle controls for this leased job. */
		job: QueueJobControls
		/** Abort signal for cooperative cancellation. */
		signal: AbortSignal
		/** Typed event emitter for declared service events. */
		emit: EmitCustomMessageFunction<EmitList>
		/** Typed command invocation clients. */
		service: Invokes
		/** Typed stream invocation clients. */
		stream: StreamInvokes
		/** Typed queue enqueue and schedule clients. */
		queue: QueueContext<QueueInvokes>
		/** Typed same-service agent invocation clients. */
		agent: AgentInvokeMap<AgentInvokes>
		/** Runtime resources supplied to the service. */
		resources: Resources
	}
