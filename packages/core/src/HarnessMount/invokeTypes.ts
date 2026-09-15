import type {
	AnyHarnessTargetContract,
	DurableInvokeOptions,
	InvokeOptions,
	ToolApprovalResume,
} from '@purista/harness'

/** Continuation input narrowed to the interruption capabilities of one target. */
export type HarnessTargetResume<C extends AnyHarnessTargetContract> =
	| ('tool-approval' extends C['interrupts'][number] ? ToolApprovalResume : never)
	| ('external-wait' extends C['interrupts'][number] ? Readonly<{ type: 'external-wait'; runId: string }> : never)

/** Consumer-controlled run options accepted by a mounted Harness target. */
export type HarnessInvokeParameter<C extends AnyHarnessTargetContract = AnyHarnessTargetContract> = Readonly<
	Omit<InvokeOptions, 'contextProjection' | 'signal' | 'traceparent' | 'tracestate' | 'durable'> & {
		readonly sessionId?: string
	} & (C extends { readonly durable: false }
			? { readonly durable?: never }
			: { readonly durable?: DurableInvokeOptions })
>

/** Options supplied when continuing a persisted Harness interruption. */
export type HarnessResumeParameter<C extends AnyHarnessTargetContract = AnyHarnessTargetContract> = Readonly<
	Omit<HarnessInvokeParameter<C>, 'durable' | 'idempotencyKey'>
>

/** @internal EventBridge protocol envelope. Continuations never appear in the public fresh-invocation options. */
export type HarnessEventBridgeInvokeParameter<C extends AnyHarnessTargetContract = AnyHarnessTargetContract> =
	HarnessInvokeParameter<C> & Readonly<{ readonly resume?: HarnessTargetResume<C> }>
