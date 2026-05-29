import { UnhandledError } from '../Error/UnhandledError.impl.js'
import { StatusCode } from '../types/StatusCode.enum.js'

/**
 * Internal pending command invocation callbacks and timeout handle.
 *
 * @group Event bridge
 */
export type PendingInvocation<T = unknown> = {
	/** Resolve the caller with a command result payload. */
	resolve: (value: T) => void
	/** Reject the caller with a PURISTA or provider error. */
	reject: (reason?: unknown) => void
	/** Timeout that rejects the invocation when no response arrives. */
	timeout: ReturnType<typeof setTimeout>
}

/**
 * Registry for command invocations awaiting correlated responses.
 *
 * The registry rejects timed-out invocations and retains timed-out correlation
 * ids briefly so late responses can be classified and logged without resolving
 * stale callers.
 *
 * @group Event bridge
 */
export class PendingInvocationRegistry<T = unknown> {
	private readonly pending = new Map<string, PendingInvocation<T>>()
	private readonly timedOut = new Map<string, number>()

	constructor(
		private readonly options: {
			retentionMs?: number
			onLateResponse?: (correlationId: string) => void
		} = {},
	) {}

	/** Number of invocations currently awaiting a response. */
	get size() {
		return this.pending.size
	}

	/** Exposes the pending map for low-level bridge diagnostics. */
	getPendingMap() {
		return this.pending
	}

	/** Register one invocation and reject it automatically after `timeoutMs`. */
	register(correlationId: string, timeoutMs: number, traceId: string | undefined) {
		return new Promise<T>((resolve, reject) => {
			const timeout = setTimeout(() => {
				const err = new UnhandledError(StatusCode.GatewayTimeout, 'invocation timed out', undefined, traceId)
				this.timedOut.set(correlationId, Date.now())
				this.cleanupTimedOut()
				this.pending.delete(correlationId)
				reject(err)
			}, timeoutMs)

			this.pending.set(correlationId, {
				resolve: value => {
					clearTimeout(timeout)
					this.pending.delete(correlationId)
					resolve(value)
				},
				reject: error => {
					clearTimeout(timeout)
					this.pending.delete(correlationId)
					reject(error)
				},
				timeout,
			})
		})
	}

	/** Resolve a pending invocation or classify the response as late/missing. */
	resolve(correlationId: string, payload: T) {
		const pending = this.pending.get(correlationId)
		if (!pending) {
			return this.handleMissing(correlationId)
		}
		pending.resolve(payload)
		return 'resolved' as const
	}

	/** Reject a pending invocation or classify the response as late/missing. */
	reject(correlationId: string, error: unknown) {
		const pending = this.pending.get(correlationId)
		if (!pending) {
			return this.handleMissing(correlationId)
		}
		pending.reject(error)
		return 'rejected' as const
	}

	/** Reject all pending invocations, typically during bridge shutdown. */
	rejectAll(error: unknown) {
		for (const [correlationId, pending] of Array.from(this.pending.entries())) {
			clearTimeout(pending.timeout)
			pending.reject(error)
			this.pending.delete(correlationId)
		}
		this.timedOut.clear()
	}

	/** Clear pending and timed-out entries without resolving callers. */
	clear() {
		for (const pending of this.pending.values()) {
			clearTimeout(pending.timeout)
		}
		this.pending.clear()
		this.timedOut.clear()
	}

	private handleMissing(correlationId: string) {
		if (this.timedOut.has(correlationId)) {
			this.timedOut.delete(correlationId)
			this.options.onLateResponse?.(correlationId)
			return 'late' as const
		}
		return 'missing' as const
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
