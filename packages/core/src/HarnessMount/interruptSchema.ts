import type { HarnessInterruptKind } from '@purista/harness'

import type { HarnessTargetJsonSchema } from './targetExport.js'

/** @internal Derive the canonical exported schema for the declared resumable interruption kinds. */
export function createHarnessInterruptSchema(interrupts: readonly HarnessInterruptKind[]): HarnessTargetJsonSchema {
	if (interrupts.length === 0) return false
	const variants = interrupts.map(kind => {
		if (kind === 'tool-approval') return toolApprovalInterruptSchema()
		if (kind === 'external-wait') return externalWaitInterruptSchema()
		throw new TypeError('Unknown Harness interruption kind.')
	})
	const only = variants[0]
	return variants.length === 1 && only !== undefined ? only : deepFreeze({ oneOf: variants })
}

function toolApprovalInterruptSchema(): HarnessTargetJsonSchema {
	return deepFreeze({
		type: 'object',
		additionalProperties: false,
		required: ['type', 'id', 'revision', 'requests'],
		properties: {
			type: { const: 'tool-approval' },
			id: { type: 'string', pattern: '^approval_batch_[0-9a-f]{64}$' },
			revision: { type: 'string', pattern: '^[0-9a-f]{64}$' },
			requests: {
				type: 'array',
				minItems: 1,
				items: {
					type: 'object',
					additionalProperties: false,
					required: [
						'approvalId',
						'runId',
						'agentRunId',
						'agentId',
						'invocationId',
						'step',
						'toolId',
						'callId',
						'input',
						'demands',
					],
					properties: {
						approvalId: identifierSchema(),
						runId: identifierSchema(),
						agentRunId: identifierSchema(),
						parentRunId: identifierSchema(),
						parentInvocationId: identifierSchema(),
						agentId: identifierSchema(),
						workflowId: identifierSchema(),
						invocationId: identifierSchema(),
						step: { type: 'integer', minimum: 0, maximum: Number.MAX_SAFE_INTEGER },
						toolId: identifierSchema(),
						callId: identifierSchema(),
						input: true,
						demands: { type: 'array', items: decisionEvidenceSchema() },
					},
				},
			},
		},
	})
}

function identifierSchema(): Readonly<Record<string, unknown>> {
	return { type: 'string', pattern: '^[A-Za-z0-9][A-Za-z0-9_.:-]{0,255}$' }
}

function configurationIdentifierSchema(): Readonly<Record<string, unknown>> {
	return { type: 'string', minLength: 1, maxLength: 128, pattern: '^[^\\p{Cc}]+$' }
}

function decisionEvidenceSchema(): Readonly<Record<string, unknown>> {
	return {
		type: 'object',
		additionalProperties: false,
		required: ['decisionId', 'source', 'phase'],
		properties: {
			decisionId: { type: 'string', pattern: '^decision_[0-9a-f]{64}$' },
			source: {
				type: 'object',
				additionalProperties: false,
				required: ['kind', 'id'],
				properties: {
					kind: { enum: ['permission', 'policy', 'exposure', 'interceptor', 'guardrail'] },
					id: configurationIdentifierSchema(),
					version: configurationIdentifierSchema(),
					ruleId: configurationIdentifierSchema(),
				},
			},
			phase: {
				enum: [
					'input',
					'before_model',
					'after_model',
					'output',
					'tool_input',
					'permission',
					'policy',
					'approval',
					'tool_output',
					'exposure',
					'retrieval',
				],
			},
			reasonCode: { type: 'string', pattern: '^[a-z][a-z0-9_]{0,63}$' },
		},
	}
}

function externalWaitInterruptSchema(): HarnessTargetJsonSchema {
	const externalWaitIdentifier = { type: 'string', minLength: 1, maxLength: 200, pattern: '^[A-Za-z0-9_.:@/-]+$' }
	const timestamp = {
		type: 'string',
		pattern: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$',
	}
	return deepFreeze({
		type: 'object',
		additionalProperties: false,
		required: ['type', 'id', 'revision', 'kind', 'schemaVersion', 'definitionVersion', 'deadline'],
		properties: {
			type: { const: 'external-wait' },
			id: externalWaitIdentifier,
			revision: timestamp,
			kind: externalWaitIdentifier,
			schemaVersion: externalWaitIdentifier,
			definitionVersion: externalWaitIdentifier,
			deadline: timestamp,
		},
	})
}

function deepFreeze<T>(value: T): T {
	if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
		for (const child of Object.values(value)) deepFreeze(child)
		Object.freeze(value)
	}
	return value
}
