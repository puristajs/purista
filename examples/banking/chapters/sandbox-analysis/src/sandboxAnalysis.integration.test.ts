import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { localDirectorySandbox } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { analysisV1Service } from './service/analysis/v1/analysisV1Service.js'
import { scriptedAnalysisProvider } from './testing/scriptedAnalysisProvider.js'

const roots: string[] = []
afterEach(async () => Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))))

describe('sandbox analysis over PURISTA', () => {
	it('exposes only the declared built-ins and completes the analysis in a private sandbox', async () => {
		const root = await mkdtemp(join(tmpdir(), 'purista-sandbox-analysis-'))
		roots.push(root)
		const provider = scriptedAnalysisProvider()
		const policy = { canRun: vi.fn(async () => true) }
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const service = await analysisV1Service.getInstance(eventBridge, {
			logger: initLogger('fatal'),
			resources: { analysisPolicy: policy },
			ai: {
				models: { analysis_model: { provider, model: 'analysis-fake' } },
				sandbox: localDirectorySandbox({ root, exec: { allowCommands: ['python3'], timeoutMs: 5_000 } }),
			},
		})
		await service.start()

		try {
			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-analyst',
						receiver: { serviceName: 'Analysis', serviceVersion: '1', serviceTarget: 'analyzeTransactions' },
						payload: {
							payload: {
								analysisId: 'analysis-1',
								transactions: [{ id: 'tx-1', amount: 1_250, country: 'DE' }],
							},
							parameter: {},
						},
					}),
				),
			).resolves.toEqual({
				analysisId: 'analysis-1',
				flaggedTransactionIds: ['tx-1'],
				summary: 'One high-value transaction was flagged for human review.',
			})
			expect(policy.canRun).toHaveBeenCalledTimes(2)
			expect(provider.requests).toHaveLength(4)
			const firstRequest = provider.requests[0]
			expect(
				firstRequest && 'tools' in firstRequest ? firstRequest.tools?.map((tool) => tool.name).sort() : [],
			).toEqual(['bash', 'read', 'write'])
			provider.assertExhausted()
		} finally {
			await service.destroy()
			await eventBridge.destroy()
		}
	})

	it('rejects a direct agent invocation before opening the model loop when business access is denied', async () => {
		const root = await mkdtemp(join(tmpdir(), 'purista-sandbox-analysis-denied-'))
		roots.push(root)
		const provider = new FakeModelProvider({ strict: true })
		const eventBridge = new DefaultEventBridge()
		await eventBridge.start()
		const service = await analysisV1Service.getInstance(eventBridge, {
			resources: { analysisPolicy: { canRun: vi.fn(async () => false) } },
			ai: {
				models: { analysis_model: { provider, model: 'analysis-fake' } },
				sandbox: localDirectorySandbox({ root, exec: { allowCommands: ['python3'], timeoutMs: 5_000 } }),
			},
		})
		await service.start()

		try {
			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-denied',
						receiver: { serviceName: 'Analysis', serviceVersion: '1', serviceTarget: 'analyze_transactions' },
						payload: {
							payload: {
								analysisId: 'analysis-denied',
								transactions: [{ id: 'tx-1', amount: 1_250, country: 'DE' }],
							},
							parameter: {},
						},
					}),
				),
			).rejects.toMatchObject({ errorCode: 403 })
			expect(provider.requests).toHaveLength(0)
		} finally {
			await service.destroy()
			await eventBridge.destroy()
		}
	})
})
