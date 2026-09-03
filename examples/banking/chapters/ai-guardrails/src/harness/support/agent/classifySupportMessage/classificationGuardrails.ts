import { defineGuardrailAction, defineGuardrails } from '@purista/harness-guardrails'
import { classifySupportMessageInputSchema, classifySupportMessageOutputSchema } from './schema.js'

const cardLikeDigits = /\b\d{13,19}\b/g

export const blockInstructionOverride = defineGuardrailAction({
	phase: 'input',
	valueSchema: classifySupportMessageInputSchema,
	mayTransform: false,
	evaluate: ({ value }) =>
		/ignore (all )?previous instructions/i.test(value.text)
			? { decision: 'block', reasonCode: 'instruction_override' }
			: { decision: 'allow' },
})

export const redactCardLikeDigits = defineGuardrailAction({
	phase: 'output',
	valueSchema: classifySupportMessageOutputSchema,
	evaluate: ({ value }) => {
		const reason = value.reason.replace(cardLikeDigits, '[redacted]')
		return reason === value.reason
			? { decision: 'allow' }
			: {
					decision: 'transform',
					target: 'bot_message',
					value: { ...value, reason },
					reasonCode: 'card_digits_redacted',
				}
	},
})

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
