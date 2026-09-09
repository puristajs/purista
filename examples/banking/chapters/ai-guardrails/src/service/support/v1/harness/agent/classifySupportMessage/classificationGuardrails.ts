import { defineGuardrails } from '@purista/harness-guardrails'
import { blockInstructionOverride } from './classificationInputGuardrail.js'
import { redactCardLikeDigits } from './classificationOutputGuardrail.js'

export const classificationGuardrails = defineGuardrails({
	config: {
		rails: {
			input: { flows: ['block instruction override'] },
			output: { flows: ['redact card-like digits'] },
		},
	},
	actions: {
		'block instruction override': blockInstructionOverride,
		'redact card-like digits': redactCardLikeDigits,
	},
	actionTimeoutMs: 2_000,
})
