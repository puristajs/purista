import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { dockerSandbox } from '@purista/harness-sandbox-docker'
import { describe, expect, it } from 'vitest'
import { createAnalysisService } from './createAnalysisService.js'
import { purgeTransactionAnalysisSandbox } from './dockerSandboxCleanup.js'
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

		let operationError: unknown
		try {
			await expect(
				eventBridge.invoke(
					getCommandMessageMock({
						tenantId: 'tenant-example',
						principalId: 'principal-analyst',
						receiver: { serviceName: 'Analysis', serviceVersion: '1', serviceTarget: 'runAnalyzeTransactions' },
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
		} catch (error) {
			operationError = error
		}
		const cleanupErrors: unknown[] = []
		for (const cleanup of [
			() => service.destroy(),
			() => purgeTransactionAnalysisSandbox(sandbox.administration, () => rm(root, { recursive: true, force: true })),
			() => eventBridge.destroy(),
		]) {
			try {
				await cleanup()
			} catch (error) {
				cleanupErrors.push(error)
			}
		}
		if (operationError || cleanupErrors.length > 0) {
			throw new AggregateError(
				[...(operationError ? [operationError] : []), ...cleanupErrors],
				'Sandbox analysis operation or cleanup failed.',
			)
		}
	})
})

describe('Docker sandbox image validation', () => {
	it.each([`sha256:${'a'.repeat(64)}`, `registry.example/tools@sha256:${'b'.repeat(64)}`])(
		'accepts immutable image %s',
		(image) => {
			expect(() => dockerSandbox({ root: '/private/tmp/purista-sandbox-test', image })).not.toThrow()
		},
	)

	it.each([
		'python:3.12',
		`sha256:${'A'.repeat(64)}`,
		`sha256:${'c'.repeat(63)}`,
		` sha256:${'d'.repeat(64)}`,
		`sha256:${'e'.repeat(64)}\0`,
	])('rejects mutable or malformed image %s', (image) => {
		expect(() => dockerSandbox({ root: '/private/tmp/purista-sandbox-test', image })).toThrow()
	})
})
