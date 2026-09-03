import { type BuilderState, defineHarnessModule, type ModelAlias } from '@purista/harness'
import { analyzeTransactionsInputSchema, analyzeTransactionsOutputSchema } from '../../analysisSchemas.js'

type AnalysisModelState = BuilderState & { models: { analysis_model: ModelAlias } }

export const analyzeTransactionsAgent = defineHarnessModule<AnalysisModelState>()(
	'analysis.agent.analyze_transactions',
	{
		version: '1.0.0',
		register(builder) {
			return builder.agent('analyze_transactions', {
				model: 'analysis_model',
				input: analyzeTransactionsInputSchema,
				output: analyzeTransactionsOutputSchema,
				builtinTools: ['write', 'bash', 'read'],
				permissions: {
					write: { mode: 'allow', allow: ['/workspace/**'] },
					bash: { mode: 'allow', allow: ['python3'] },
				},
				instructions: [
					'Analyze the supplied transaction rows inside the sandbox.',
					'Write only under /workspace, run only python3, and read the produced result before answering.',
					'Return only the structured analysis. Never claim a transaction was blocked.',
				].join(' '),
				maxSteps: 6,
			})
		},
	},
)
