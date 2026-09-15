import { builtInTools, defineAgent } from '@purista/harness'
import { analyzeTransactionsInputSchema, analyzeTransactionsOutputSchema } from '../../analysisSchemas.js'

export const analyzeTransactionsAgent = defineAgent('analyzeTransactions', {
	model: 'analysis',
	input: analyzeTransactionsInputSchema,
	output: analyzeTransactionsOutputSchema,
	tools: [builtInTools.write, builtInTools.bash, builtInTools.read],
	sandbox: 'private',
	permissions: {
		write: { mode: 'allow', allow: ['/workspace/**'] },
		bash: 'allow',
	},
	loop: { maxSteps: 6 },
	instructions:
		'Analyze the supplied transaction rows inside the private sandbox. Write only under /workspace, run only python3, read the produced result, and return only the structured analysis.',
	prompt: (input) => ({
		role: 'user',
		content: `Analysis ${input.analysisId}: ${JSON.stringify(input.transactions)}`,
	}),
})
