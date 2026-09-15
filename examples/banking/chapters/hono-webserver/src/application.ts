import type { Logger } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { getEventBridge } from './eventbridge.js'
import { bankProfileV1Service } from './service/bankProfile/v1/bankProfileV1Service.js'

export async function createApplication(logger: Logger) {
	const eventBridge = await getEventBridge(logger)
	const bankProfile = await bankProfileV1Service.getInstance(eventBridge, { logger })
	const http = await honoV1Service.getInstance(eventBridge, {
		logger,
		serviceConfig: {
			apiMountPath: '/api',
			enableHealth: true,
			healthPath: '/health',
			openApi: {
				enabled: true,
				info: { title: 'Example Bank API', version: '1.0.0' },
			},
		},
	})

	await bankProfile.start()
	http.registerService(bankProfile)
	await http.start()

	return { eventBridge, bankProfile, http }
}
