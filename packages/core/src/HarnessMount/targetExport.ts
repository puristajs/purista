import type { HarnessInterruptKind, HarnessOutputUpdateKind, harnessExecutionEventTypesV1 } from '@purista/harness'

/** Canonical JSON Schema value stored in mounted target metadata. */
export type HarnessTargetJsonSchema = boolean | Readonly<Record<string, unknown>>

/** Closed JSON export for one mounted Harness target. */
export type SerializedHarnessTargetExportV1 = Readonly<{
	targetName: string
	kind: 'agent' | 'workflow'
	description?: string
	inputSchema: HarnessTargetJsonSchema
	validatedInputSchema: HarnessTargetJsonSchema
	outputSchema: HarnessTargetJsonSchema
	updateSchema: HarnessTargetJsonSchema
	interruptSchema: HarnessTargetJsonSchema
	invocation: Readonly<{
		aggregate: true
		stream: true
		resumableInterrupts: readonly HarnessInterruptKind[]
	}>
	stream: Readonly<{
		protocol: 'harness-execution-events-v1'
		eventTypes: typeof harnessExecutionEventTypesV1
		outputUpdates: readonly Exclude<HarnessOutputUpdateKind, 'none'>[]
	}>
	queue?: Readonly<{ name: string }>
	exportDigest: `sha256:${string}`
}>
