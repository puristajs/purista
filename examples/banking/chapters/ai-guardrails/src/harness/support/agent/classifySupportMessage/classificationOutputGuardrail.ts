import { defineGuardrailAction } from '@purista/harness-guardrails'
import { classifySupportMessageOutputSchema } from './schema.js'

const cardLikeDigits = /\b\d{13,19}\b/g

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
