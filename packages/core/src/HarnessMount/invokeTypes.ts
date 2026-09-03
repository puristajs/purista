import type { InvokeOptions } from '@purista/harness'

/** Consumer-controlled run options accepted by a mounted Harness target. */
export type HarnessInvokeParameter = Readonly<{
	sessionId?: string
	idempotencyKey?: string
	timeoutMs?: number
	metadata?: Record<string, string | number | boolean | null>
	durable?: InvokeOptions['durable']
	/** Resume one durable Harness interruption, such as a human tool approval. */
	resume?: InvokeOptions['resume']
}>
