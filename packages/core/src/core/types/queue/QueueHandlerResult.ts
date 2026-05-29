/**
 * Result returned by a queue worker handler.
 *
 * Returning `undefined` is treated by the service runtime as successful
 * completion. Use explicit retry/fail results when the handler wants to
 * influence queue lifecycle policy.
 *
 * @group Queue
 */
export type QueueHandlerResult =
	| { status: 'success'; output?: unknown; headers?: Record<string, string> }
	| { status: 'retry'; reason?: string; delayMs?: number }
	| { status: 'fail'; reason: string; fatal?: boolean; delayMs?: number }
