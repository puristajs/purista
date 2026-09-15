import type { Logger } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { demoProtectMiddleware } from './demoProtectMiddleware.js'
import { getEventBridge } from './eventbridge.js'
import type { ManagedTransactionRepository } from './resources/ManagedTransactionRepository.js'
import { SqliteTransactionRepository } from './resources/SqliteTransactionRepository.js'
import { bankProfileV1Service } from './service/bankProfile/v1/bankProfileV1Service.js'
import { transactionV1Service } from './service/transaction/v1/transactionV1Service.js'
import { registerStaticWebsite } from './staticWebsite.js'

export async function createApplication(
	logger: Logger,
	transactionRepository: ManagedTransactionRepository = new SqliteTransactionRepository(':memory:'),
) {
	const eventBridge = await getEventBridge(logger)
	const bankProfile = await bankProfileV1Service.getInstance(eventBridge, { logger })
	const transaction = await transactionV1Service.getInstance(eventBridge, {
		logger,
		resources: { transactionRepository },
	})
	const http = await honoV1Service.getInstance(eventBridge, {
		logger,
		serviceConfig: {
			apiMountPath: '/api',
			enableHealth: true,
			healthPath: '/health',
			openApi: {
				enabled: true,
				info: { title: 'Example Bank API', version: '1.0.0' },
				components: {
					securitySchemes: {
						demoBearer: { type: 'http', scheme: 'bearer' },
					},
				},
			},
		},
	})

	http.setProtectMiddleware(demoProtectMiddleware)
	await bankProfile.start()
	await transaction.start()
	http.registerService(bankProfile, transaction)
	registerStaticWebsite(http)
	await http.start()

	return { eventBridge, bankProfile, transaction, transactionRepository, http }
}
