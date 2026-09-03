import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { localDirectorySandbox } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import { scriptedAnalysisProvider } from '../../../../testing/scriptedAnalysisProvider.js'
import { analysisHarness } from '../../analysisHarness.js'

describe('analyzeTransactionsAgent', () => {
	it('runs the declared write, bash, and read loop', async () => {
		const root = await mkdtemp(join(tmpdir(), 'purista-native-sandbox-'))
		const provider = scriptedAnalysisProvider()
		const runtime = await analysisHarness.getInstance({
			models: { analysis_model: { provider, model: 'analysis-fake' } },
			sandbox: localDirectorySandbox({ root, exec: { allowCommands: ['python3'], timeoutMs: 5_000 } }),
		})

		try {
			const session = await runtime.getSession('analysis-1')
			await expect(
				session.agents.analyze_transactions.run({
					analysisId: 'analysis-1',
					transactions: [{ id: 'tx-1', amount: 1_250, country: 'DE' }],
				}),
			).resolves.toMatchObject({
				status: 'completed',
				output: { analysisId: 'analysis-1', flaggedTransactionIds: ['tx-1'] },
			})
			provider.assertExhausted()
		} finally {
			await runtime.shutdown()
			await rm(root, { recursive: true, force: true })
		}
	})

	it('returns a denied tool result for a write outside the workspace', async () => {
		const root = await mkdtemp(join(tmpdir(), 'purista-native-sandbox-denied-'))
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueObject({
			object: {},
			toolCalls: [{ id: 'write-denied', name: 'write', arguments: { path: '/outside.txt', content: 'denied' } }],
			usage: { inputTokens: 2, outputTokens: 1, totalTokens: 3 },
			finishReason: 'tool_calls',
		})
		provider.enqueueObject({
			object: {
				analysisId: 'analysis-denied',
				flaggedTransactionIds: [],
				summary: 'The requested file operation was denied.',
			},
			usage: { inputTokens: 3, outputTokens: 2, totalTokens: 5 },
			finishReason: 'stop',
		})
		const runtime = await analysisHarness.getInstance({
			models: { analysis_model: { provider, model: 'analysis-fake' } },
			sandbox: localDirectorySandbox({ root, exec: { allowCommands: ['python3'], timeoutMs: 5_000 } }),
		})

		try {
			const session = await runtime.getSession('analysis-denied')
			await expect(
				session.agents.analyze_transactions.run({
					analysisId: 'analysis-denied',
					transactions: [{ id: 'tx-1', amount: 10, country: 'DE' }],
				}),
			).resolves.toMatchObject({
				status: 'completed',
				output: { analysisId: 'analysis-denied', flaggedTransactionIds: [] },
			})
			const secondRequest = provider.requests[1]
			const toolMessage =
				secondRequest && 'messages' in secondRequest
					? secondRequest.messages.find((message) => message.role === 'tool')
					: undefined
			expect(JSON.parse(toolMessage?.content ?? '{}')).toMatchObject({ code: 'PERMISSION_DENIED' })
			provider.assertExhausted()
		} finally {
			await runtime.shutdown()
			await rm(root, { recursive: true, force: true })
		}
	})
})
