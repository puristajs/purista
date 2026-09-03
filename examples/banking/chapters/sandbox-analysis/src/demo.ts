import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { localDirectorySandbox } from '@purista/harness'
import { createAnalysisService } from './createAnalysisService.js'
import { scriptedAnalysisProvider } from './testing/scriptedAnalysisProvider.js'

async function main() {
	const root = await mkdtemp(join(tmpdir(), 'purista-sandbox-demo-'))
	const provider = scriptedAnalysisProvider()
	const logger = initLogger('fatal')
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const service = await createAnalysisService(eventBridge, logger, {
		analysisPolicy: { canRun: async () => true },
		analysisModel: { provider, model: 'analysis-fake' },
		sandbox: localDirectorySandbox({ root, exec: { allowCommands: ['python3'], timeoutMs: 5_000 } }),
	})
	await service.start()

	try {
		const result = await eventBridge.invoke(
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
		)
		process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
		provider.assertExhausted()
	} finally {
		await service.destroy()
		await eventBridge.destroy()
		await rm(root, { recursive: true, force: true })
	}
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'The sandbox tool-loop demo failed.'}\n`)
	process.exit(1)
})
