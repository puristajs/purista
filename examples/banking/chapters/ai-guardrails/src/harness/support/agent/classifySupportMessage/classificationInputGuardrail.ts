import { defineGuardrailAction } from '@purista/harness-guardrails'
import { classifySupportMessageInputSchema } from './schema.js'

export const blockInstructionOverride = defineGuardrailAction({
	phase: 'input',
	valueSchema: classifySupportMessageInputSchema,
	mayTransform: false,
	evaluate: ({ value }) =>
		/ignore (all )?previous instructions/i.test(value.text)
			? { decision: 'block', reasonCode: 'instruction_override' }
			: { decision: 'allow' },
})
