import { type BuilderState, defineHarnessModule, type ModelAlias } from '@purista/harness'
import { riskAssessmentSchema, supportCaseInputSchema } from '../../supportCaseSchemas.js'

type RiskModelState = BuilderState & { models: { risk_model: ModelAlias } }

export const assessSupportRiskAgent = defineHarnessModule<RiskModelState>()('support.agent.assess_support_risk', {
	version: '1.0.0',
	register(builder) {
		return builder.agent('assess_support_risk', {
			model: 'risk_model',
			input: supportCaseInputSchema,
			output: riskAssessmentSchema,
			instructions: [
				'Assess security and financial risk in one Example Bank support message.',
				'Use only facts present in the message and list short evidence statements.',
			].join(' '),
		})
	},
})
