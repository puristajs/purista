import { DefaultEventBridge, gracefulShutdown, initLogger } from '@purista/core'
import { createSupportApplication } from './createSupportApplication.js'

async function main() {
	const logger = initLogger()
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const { support, transaction } = await createSupportApplication(eventBridge, logger, {
		accountReadPolicy: {
			canRead: async ({ tenantId, principalId, accountId }) =>
				tenantId === 'tenant-example' && principalId === 'principal-alex' && accountId === 'account-operating',
		},
		transactionSummaryReader: {
			getById: async (transactionId) =>
				transactionId === 'tx-100'
					? {
							transactionId,
							accountId: 'account-operating',
							tenantId: 'tenant-example',
							status: 'pending',
							amount: 42,
							currency: 'EUR',
						}
					: undefined,
		},
	})
	gracefulShutdown(logger, [support, transaction, eventBridge])
	logger.info('Support agent and Transaction tool service started')
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : 'Agent tool services could not start.'}\n`)
	process.exit(1)
})
