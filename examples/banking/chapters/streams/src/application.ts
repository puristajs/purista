import { initDefaultStateStore, type Logger, type StateStore } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { getEventBridge } from './eventbridge.js'
import { SqliteTransactionAnalysisReader } from './resources/SqliteTransactionAnalysisReader.js'
import type { ManagedTransactionRepository } from './resources/ManagedTransactionRepository.js'
import { SqliteTransactionRepository } from './resources/SqliteTransactionRepository.js'
import { analysisV1Service } from './service/analysis/v1/analysisV1Service.js'
import type { TransactionAnalysisReader } from './service/analysis/v1/TransactionAnalysisReader.js'
import { bankProfileV1Service } from './service/bankProfile/v1/bankProfileV1Service.js'
import { localIdentityProvider, type LocalIdentityProvider } from './service/identity/v1/LocalIdentityProvider.js'
import { identityV1Service } from './service/identity/v1/identityV1Service.js'
import { transactionV1Service } from './service/transaction/v1/transactionV1Service.js'
import { createSessionProtectMiddleware } from './sessionProtectMiddleware.js'
import { registerStaticWebsite } from './staticWebsite.js'

export async function createApplication(
	logger: Logger,
	transactionRepository: ManagedTransactionRepository = new SqliteTransactionRepository(':memory:'),
	identityProvider: LocalIdentityProvider = localIdentityProvider,
	identityStateStore: StateStore = initDefaultStateStore({ logger }),
	transactionAnalysisReader: TransactionAnalysisReader = new SqliteTransactionAnalysisReader(':memory:'),
) {
	const eventBridge = await getEventBridge(logger)
	const bankProfile = await bankProfileV1Service.getInstance(eventBridge, { logger })
	const identity = await identityV1Service.getInstance(eventBridge, {
		logger,
		serviceConfig: { sessionTtlMs: 15 * 60 * 1000 },
		resources: { identityProvider },
		stateStore: identityStateStore,
	})
	const transaction = await transactionV1Service.getInstance(eventBridge, {
		logger,
		resources: { transactionRepository },
	})
	const analysis = await analysisV1Service.getInstance(eventBridge, {
		logger,
		resources: { transactionAnalysisReader },
	})
	const http = await honoV1Service.getInstance(eventBridge, {
		logger,
		serviceConfig: {
			apiMountPath: '/api', enableHealth: true, healthPath: '/health',
			openApi: {
				enabled: true,
				info: { title: 'Example Bank API', version: '1.0.0' },
				components: { securitySchemes: { demoBearer: { type: 'http', scheme: 'bearer' } } },
			},
		},
	})

	http.setProtectMiddleware(createSessionProtectMiddleware(http))
	await bankProfile.start()
	await identity.start()
	await transaction.start()
	await analysis.start()
	http.registerService(bankProfile, identity, transaction, analysis)
	registerStaticWebsite(http)
	await http.start()

	return {
		eventBridge, bankProfile, identity, identityStateStore,
		transaction, transactionRepository, analysis, transactionAnalysisReader, http,
	}
}
