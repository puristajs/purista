/**
 * Canonical public Guardrails lifecycle and composition guarantees.
 *
 * Keep website projections aligned by importing this module rather than
 * restating phase timing, protected values, or build-preflight boundaries.
 */
export const guardrailsPhases = [
	{
		id: 'input',
		label: 'Input rails',
		value: 'Parsed agent input',
		timing: 'Before instructions, transcript use, and model work',
		transformTarget: 'user_message',
		diagramTiming: 'Before model work',
		diagramDescription: 'Allow, block, or transform',
	},
	{
		id: 'output',
		label: 'Final-output rails',
		value: 'Final answer candidate',
		timing: 'Before output validation, persistence, and delivery',
		transformTarget: 'bot_message',
		diagramTiming: 'Final answer candidate only',
		diagramDescription: 'Intermediate tool-call responses skip output rails',
	},
	{
		id: 'tool_input',
		label: 'Tool-input rails',
		value: 'Raw JSON tool-call arguments',
		timing: 'Before binding, permission, governance, approval, and the side effect',
		transformTarget: 'tool_input',
		diagramTiming: 'Before a requested tool runs',
		diagramDescription: 'Protect the exact selected tool value',
	},
	{
		id: 'tool_output',
		label: 'Tool-output rails',
		value: 'Schema-validated tool result',
		timing: 'Before its JSON projection returns to the model',
		transformTarget: 'tool_output',
		diagramTiming: 'After a requested tool returns',
		diagramDescription: 'Protect the exact selected tool value',
	},
	{
		id: 'retrieval',
		label: 'Retrieval rails',
		value: 'Application-provided JSON-compatible chunk array',
		timing: 'Only when application code calls filterRetrievedChunks(...)',
		transformTarget: 'relevant_chunks',
		diagramTiming: 'Application-owned',
		diagramDescription: 'Explicit filter before context joins',
	},
] as const

export type GuardrailsPhase = (typeof guardrailsPhases)[number]

export const guardrailsPhasesById = Object.fromEntries(
	guardrailsPhases.map(phase => [phase.id, phase]),
) as Record<GuardrailsPhase['id'], GuardrailsPhase>

export const guardrailsInlineConfigurationGuarantee =
	'One typed TypeScript config object and opaque action tokens define Guardrails at the application composition root.'

export const guardrailsOutputRailGuarantee =
	'Output rails run only on final answer candidates. Intermediate tool-call responses skip output rails.'

export const guardrailsBuildGuarantee =
	'build() verifies selected tool IDs and required model aliases/capabilities before a session, provider request, detector inspection, approval request, or tool side effect.'

export const guardrailsStageGuarantees = [
	{
		stage: 'TypeScript inline configuration',
		guarantees: 'Action ID/phase correlation and callback types',
		doesNotGuarantee: 'Arbitrary Zod refinement equivalence',
	},
	{
		stage: 'Zod parse/compile',
		guarantees: 'Structural fields, defaults, semantic action/policy checks',
		doesNotGuarantee: 'Provider availability or arbitrary schema inclusion',
	},
	{
		stage: 'Harness build()',
		guarantees: 'Required models/tools/capabilities before invocation',
		doesNotGuarantee: 'Model, detector, tool, session, sandbox, or network invocation',
	},
	{
		stage: 'Invocation',
		guarantees: 'Selected payload parsing and existing decision behavior',
		doesNotGuarantee: 'Retrofitting semantic compatibility into an unrelated rail',
	},
] as const
