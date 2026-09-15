import { DefaultSecretStore, initDefaultStateStore, type Logger, type SecretStore, type StateStore } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { getEventBridge } from './eventbridge.js'
import { HttpLegacyTransactionClient } from './resources/HttpLegacyTransactionClient.js'
import type { ManagedTransactionRepository } from './resources/ManagedTransactionRepository.js'
import { SqliteTransactionRepository } from './resources/SqliteTransactionRepository.js'
import { bankProfileV1Service } from './service/bankProfile/v1/bankProfileV1Service.js'
import {
	localIdentityProvider,
	type LocalIdentityProvider,
} from './service/identity/v1/LocalIdentityProvider.js'
import { identityV1Service } from './service/identity/v1/identityV1Service.js'
import {
	localAccountAccessPolicy,
	type AccountAccessPolicy,
} from './service/transaction/v1/AccountAccessPolicy.js'
import type { LegacyTransactionClient } from './service/transaction/v1/LegacyTransactionClient.js'
import { transactionV1Service } from './service/transaction/v1/transactionV1Service.js'
import { createSessionProtectMiddleware } from './sessionProtectMiddleware.js'
import { registerStaticWebsite } from './staticWebsite.js'

export async function createApplication(
	logger: Logger,
	transactionRepository: ManagedTransactionRepository = new SqliteTransactionRepository(':memory:'),
	identityProvider: LocalIdentityProvider = localIdentityProvider,
	identityStateStore: StateStore = initDefaultStateStore({ logger }),
	accountAccessPolicy: AccountAccessPolicy = localAccountAccessPolicy,
	legacyTransactionClient: LegacyTransactionClient = new HttpLegacyTransactionClient({
		baseUrl: process.env.LEGACY_PROVIDER_URL ?? 'http://127.0.0.1:4010',
		logger,
	}),
	secretStore: SecretStore = new DefaultSecretStore({
		logger,
		config: {
			legacyProviderToken: process.env.LEGACY_PROVIDER_TOKEN ?? 'example-bank-tutorial-token',
		},
	}),
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
		resources: { transactionRepository, accountAccessPolicy, legacyTransactionClient },
		secretStore,
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

	http.setProtectMiddleware(createSessionProtectMiddleware(http))
	await bankProfile.start()
	await identity.start()
	await transaction.start()
	http.registerService(bankProfile, identity, transaction)
	registerStaticWebsite(http)
	await http.start()

	return {
		eventBridge,
		bankProfile,
		identity,
		identityStateStore,
		transaction,
		transactionRepository,
		legacyTransactionClient,
		secretStore,
		http,
	}
}
