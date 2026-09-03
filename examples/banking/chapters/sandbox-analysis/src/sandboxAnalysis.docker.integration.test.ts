import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { dockerSandbox } from '@purista/harness-sandbox-docker'
import { describe, expect, it } from 'vitest'
import { createAnalysisService } from './createAnalysisService.js'
import { scriptedAnalysisProvider } from './testing/scriptedAnalysisProvider.js'

const image = process.env.PURISTA_DOCKER_SANDBOX_IMAGE?.trim()

describe.skipIf(!image)('Docker sandbox analysis over PURISTA', () => {
	it('runs the model-selected Python program in the prepared non-root image', async () => {
		if (!image) throw new Error('PURISTA_DOCKER_SANDBOX_IMAGE is required for this integration test.')
		const root = await mkdtemp(join(tmpdir(), 'purista-docker-sandbox-'))
		const provider = scriptedAnalysisProvider()
		const logger = initLogger('fatal')
		const eventBridge = new DefaultEventBridge({ logger })
		await eventBridge.start()
		const sandbox = dockerSandbox({ root, image, user: '10001:10001' })
		const service = await createAnalysisService(eventBridge, logger, {
			analysisPolicy: { canRun: async () => true },
			analysisModel: { provider, model: 'analysis-fake' },
			sandbox,
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
			).resolves.toMatchObject({ analysisId: 'analysis-1', flaggedTransactionIds: ['tx-1'] })
			provider.assertExhausted()
		} finally {
			await service.destroy()
			await sandbox.administration.purge({
				selector: { kind: 'tenant', namespace: 'transaction-analysis', tenantId: 'tenant-example' },
				idempotencyKey: 'sandbox-analysis-test-cleanup',
				limit: 100,
			})
			await eventBridge.destroy()
			await rm(root, { recursive: true, force: true })
		}
	})
})
