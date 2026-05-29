import { UnhandledError } from '../Error/UnhandledError.impl.js'
import { StatusCode } from '../types/StatusCode.enum.js'
import type { StreamFrame } from '../types/stream/StreamFrame.js'
import type { StreamHandle } from '../types/stream/StreamHandle.js'

/**
 * Result of routing a stream frame or error to a pending stream session.
 *
 * @group Event bridge
 */
export type PushResult = 'accepted' | 'late' | 'missing'

/**
 * Mutable stream session stored for one pending stream invocation.
 *
 * @group Event bridge
 */
export type PendingStreamSession<Chunk = unknown, Final = unknown> = {
	/** Async-iterable handle returned to the stream caller. */
	handle: StreamHandle<Chunk, Final>
	/** Push one correlated stream frame into the session. */
	push: (frame: StreamFrame<Chunk, Final>) => PushResult
	/** Reject the stream handle and any waiting iterator calls. */
	reject: (error: unknown) => void
	/** Record the producer instance and return a queued cancel reason, if any. */
	markOwner: (instanceId: string) => string | undefined
	/** Request caller cancellation and report whether a cancel frame should be sent. */
	requestCancel: (reason?: string) => {
		ownerInstanceId?: string
		reason?: string
		shouldSend: boolean
	}
}

/**
 * Registry for stream invocations awaiting correlated frames.
 *
 * Streams time out when frames stop arriving. Timed-out stream ids are retained
 * briefly so late frames can be classified and logged without reaching a closed
 * async iterator.
 *
 * @group Event bridge
 */
export class PendingStreamRegistry<Chunk = unknown, Final = unknown> {
	private readonly pending = new Map<string, PendingStreamSession<Chunk, Final>>()
	private readonly timedOut = new Map<string, number>()

	constructor(
		private readonly options: {
			retentionMs?: number
			onLateFrame?: (correlationId: string) => void
		} = {},
	) {}

	/** Number of streams currently awaiting frames. */
	get size() {
		return this.pending.size
	}

	/** Register one stream session and create its async-iterable handle. */
	register(correlationId: string, timeoutMs: number, traceId: string | undefined): PendingStreamSession<Chunk, Final> {
		const queue: StreamFrame<Chunk, Final>[] = []
		const waiters: Array<{
			resolve: (value: IteratorResult<StreamFrame<Chunk, Final>>) => void
			reject: (reason?: unknown) => void
		}> = []
		let ownerInstanceId: string | undefined
		let pendingCancelReason: string | undefined
		let isDone = false
		let streamError: unknown
		let timeout: ReturnType<typeof setTimeout> | undefined

		const flushDone = () => {
			while (waiters.length > 0) {
				const waiter = waiters.shift()
				if (waiter) {
					waiter.resolve({ done: true, value: undefined })
				}
			}
		}

		const rejectWaiters = (error: unknown) => {
			while (waiters.length > 0) {
				const waiter = waiters.shift()
				waiter?.reject(error)
			}
		}

		const clearSession = () => {
			this.pending.delete(correlationId)
		}

		const scheduleTimeout = () => {
			if (timeout !== undefined) {
				clearTimeout(timeout)
			}
			timeout = setTimeout(() => {
				if (isDone) {
					return
				}

				streamError = new UnhandledError(StatusCode.GatewayTimeout, 'stream invocation timed out', undefined, traceId)
				isDone = true
				this.timedOut.set(correlationId, Date.now())
				this.cleanupTimedOut()
				clearSession()
				rejectWaiters(streamError)
			}, timeoutMs)
		}

		scheduleTimeout()

		const push = (frame: StreamFrame<Chunk, Final>): PushResult => {
			if (isDone) {
				return this.handleMissing(correlationId)
			}

			if (timeout !== undefined) {
				clearTimeout(timeout)
			}

			queue.push(frame)
			const waiter = waiters.shift()
			if (waiter) {
				const nextFrame = queue.shift()
				if (nextFrame) {
					waiter.resolve({ done: false, value: nextFrame })
				}
			}

			const frameType = frame.payload.frameType
			if (frameType === 'complete' || frameType === 'error' || frameType === 'cancel') {
				isDone = true
				clearSession()
				if (queue.length === 0) {
					flushDone()
				}
				return 'accepted'
			}

			scheduleTimeout()
			return 'accepted'
		}

		const reject = (error: unknown) => {
			if (isDone) {
				return
			}

			streamError = error
			isDone = true
			if (timeout !== undefined) {
				clearTimeout(timeout)
			}
			clearSession()
			rejectWaiters(error)
		}

		const requestCancel = (reason?: string) => {
			if (isDone) {
				return {
					reason,
					shouldSend: false,
					ownerInstanceId,
				}
			}

			if (!ownerInstanceId) {
				pendingCancelReason = reason
				return {
					reason,
					shouldSend: false,
				}
			}

			return {
				ownerInstanceId,
				reason,
				shouldSend: true,
			}
		}

		const markOwner = (instanceId: string) => {
			ownerInstanceId = instanceId
			if (pendingCancelReason !== undefined) {
				const reason = pendingCancelReason
				pendingCancelReason = undefined
				return reason
			}
			return undefined
		}

		const handle: StreamHandle<Chunk, Final> = {
			sessionId: correlationId,
			cancel: async reason => {
				void requestCancel(reason)
			},
			[Symbol.asyncIterator]: () => {
				return {
					next: async () => {
						if (queue.length > 0) {
							const value = queue.shift()
							if (value) {
								if (isDone && queue.length === 0) {
									flushDone()
								}
								return { done: false, value }
							}
						}

						if (streamError) {
							throw streamError
						}

						if (isDone) {
							return { done: true, value: undefined }
						}

						return await new Promise<IteratorResult<StreamFrame<Chunk, Final>>>((resolve, reject) => {
							waiters.push({ resolve, reject })
						})
					},
				}
			},
		}

		const session: PendingStreamSession<Chunk, Final> = {
			handle,
			push,
			reject,
			markOwner,
			requestCancel,
		}
		this.pending.set(correlationId, session)
		return session
	}

	/** Return a pending stream session by correlation id. */
	get(correlationId: string) {
		return this.pending.get(correlationId)
	}

	/** Reject one pending stream or classify it as late/missing. */
	reject(correlationId: string, error: unknown) {
		const pending = this.pending.get(correlationId)
		if (!pending) {
			return this.handleMissing(correlationId)
		}
		pending.reject(error)
		return 'rejected' as const
	}

	rejectAll(error: unknown) {
		for (const [correlationId, pending] of Array.from(this.pending.entries())) {
			pending.reject(error)
			this.pending.delete(correlationId)
		}
		this.timedOut.clear()
	}

	clear() {
		this.pending.clear()
		this.timedOut.clear()
	}

	private handleMissing(correlationId: string): PushResult {
		if (this.timedOut.has(correlationId)) {
			this.timedOut.delete(correlationId)
			this.options.onLateFrame?.(correlationId)
			return 'late'
		}
		return 'missing'
	}

	private cleanupTimedOut() {
		const retentionMs = this.options.retentionMs ?? 60_000
		const now = Date.now()
		for (const [correlationId, timestamp] of this.timedOut.entries()) {
			if (now - timestamp > retentionMs) {
				this.timedOut.delete(correlationId)
			}
		}
	}
}
