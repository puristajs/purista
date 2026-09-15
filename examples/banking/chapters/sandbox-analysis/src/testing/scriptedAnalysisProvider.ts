import { FakeModelProvider, objectReply } from '@purista/harness/testing'

const usage = { inputTokens: 5, outputTokens: 3, totalTokens: 8 }

export function scriptedAnalysisProvider() {
	const provider = new FakeModelProvider({ strict: true })
	provider.enqueueObject(
		objectReply(
			{},
			{
				toolCalls: [
					{
						id: 'write-1',
						name: 'write',
						arguments: { path: '/workspace/transactions.csv', content: 'id,amount,country\ntx-1,1250,DE\n' },
					},
				],
				usage,
				finishReason: 'tool_calls',
			},
		),
	)
	provider.enqueueObject(
		objectReply(
			{},
			{
				toolCalls: [
					{
						id: 'bash-1',
						name: 'bash',
						arguments: {
							command: `python3 -c "import json; json.dump({'flagged':['tx-1']},open('summary.json','w'))"`,
							cwd: '/workspace',
						},
					},
				],
				usage,
				finishReason: 'tool_calls',
			},
		),
	)
	provider.enqueueObject(
		objectReply(
			{},
			{
				toolCalls: [{ id: 'read-1', name: 'read', arguments: { path: '/workspace/summary.json' } }],
				usage,
				finishReason: 'tool_calls',
			},
		),
	)
	provider.enqueueObject(
		objectReply(
			{
				analysisId: 'analysis-1',
				flaggedTransactionIds: ['tx-1'],
				summary: 'One high-value transaction was flagged for human review.',
			},
			{ usage, finishReason: 'stop' },
		),
	)
	return provider
}
