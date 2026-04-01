import { UnhandledError } from '../Error/UnhandledError.impl.js'
import { StatusCode } from '../types/StatusCode.enum.js'

type PendingInvocation<T = unknown> = {
	resolve: (value: T) => void
	reject: (reason?: unknown) => void
	timeout: ReturnType<typeof setTimeout>
}

export class PendingInvocationRegistry<T = unknown> {
	private readonly pending = new Map<string, PendingInvocation<T>>()
	private readonly timedOut = new Map<string, number>()

	constructor(
		private readonly options: {
			retentionMs?: number
			onLateResponse?: (correlationId: string) => void
		} = {},
	) {}

	get size() {
		return this.pending.size
	}

	getPendingMap() {
		return this.pending
	}

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

	resolve(correlationId: string, payload: T) {
		const pending = this.pending.get(correlationId)
		if (!pending) {
			return this.handleMissing(correlationId)
		}
		pending.resolve(payload)
		return 'resolved' as const
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
			clearTimeout(pending.timeout)
			pending.reject(error)
			this.pending.delete(correlationId)
		}
		this.timedOut.clear()
	}

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
