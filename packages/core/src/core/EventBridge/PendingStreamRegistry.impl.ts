import { UnhandledError } from '../Error/UnhandledError.impl.js'
import { StatusCode } from '../types/StatusCode.enum.js'
import type { StreamFrame } from '../types/stream/StreamFrame.js'
import type { StreamHandle } from '../types/stream/StreamHandle.js'

type PushResult = 'accepted' | 'late' | 'missing'

type PendingStreamSession<Chunk = unknown, Final = unknown> = {
	handle: StreamHandle<Chunk, Final>
	push: (frame: StreamFrame<Chunk, Final>) => PushResult
	reject: (error: unknown) => void
	markOwner: (instanceId: string) => string | undefined
	requestCancel: (reason?: string) => {
		ownerInstanceId?: string
		reason?: string
		shouldSend: boolean
	}
}

export class PendingStreamRegistry<Chunk = unknown, Final = unknown> {
	private readonly pending = new Map<string, PendingStreamSession<Chunk, Final>>()
	private readonly timedOut = new Map<string, number>()

	constructor(
		private readonly options: {
			retentionMs?: number
			onLateFrame?: (correlationId: string) => void
		} = {},
	) {}

	get size() {
		return this.pending.size
	}

	register(correlationId: string, timeoutMs: number, traceId: string | undefined): PendingStreamSession<Chunk, Final> {
		const queue: StreamFrame<Chunk, Final>[] = []
		const waiters: Array<(value: IteratorResult<StreamFrame<Chunk, Final>>) => void> = []
		let ownerInstanceId: string | undefined
		let pendingCancelReason: string | undefined
		let isDone = false
		let streamError: unknown

		const flushDone = () => {
			while (waiters.length > 0) {
				const resolve = waiters.shift()
				if (resolve) {
					resolve({ done: true, value: undefined })
				}
			}
		}

		const clearSession = () => {
			this.pending.delete(correlationId)
		}

		const timeout = setTimeout(() => {
			if (isDone) {
				return
			}

			streamError = new UnhandledError(StatusCode.GatewayTimeout, 'stream invocation timed out', undefined, traceId)
			isDone = true
			this.timedOut.set(correlationId, Date.now())
			this.cleanupTimedOut()
			clearSession()
			flushDone()
		}, timeoutMs)

		const push = (frame: StreamFrame<Chunk, Final>): PushResult => {
			if (isDone) {
				return this.handleMissing(correlationId)
			}

			queue.push(frame)
			const waiter = waiters.shift()
			if (waiter) {
				const nextFrame = queue.shift()
				if (nextFrame) {
					waiter({ done: false, value: nextFrame })
				}
			}

			const frameType = frame.payload.frameType
			if (frameType === 'complete' || frameType === 'error' || frameType === 'cancel') {
				isDone = true
				clearTimeout(timeout)
				clearSession()
				if (queue.length === 0) {
					flushDone()
				}
			}

			return 'accepted'
		}

		const reject = (error: unknown) => {
			if (isDone) {
				return
			}

			streamError = error
			isDone = true
			clearTimeout(timeout)
			clearSession()
			flushDone()
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

						return await new Promise<IteratorResult<StreamFrame<Chunk, Final>>>(resolve => {
							waiters.push(resolve)
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

	get(correlationId: string) {
		return this.pending.get(correlationId)
	}

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
