import { DefaultEventBridge, initLogger } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { httpConfig } from '../config/http.js'
import { bankingV1Service } from '../service/banking/v1/bankingV1Service.js'
import { TransactionRepository } from '../transactionRepository.js'

/** Start the real HTTP/service path with fresh storage, without opening a socket. */
export async function createTestBank() {
	const logger = initLogger('error')
	const eventBridge = new DefaultEventBridge({ logger })
	await eventBridge.start()
	const banking = await bankingV1Service.getInstance(eventBridge, {
		logger,
		resources: { transactions: new TransactionRepository() },
	})
	const http = await honoV1Service.getInstance(eventBridge, {
		logger,
		serviceConfig: httpConfig.serviceConfig,
	})
	await banking.start()
	http.registerService(banking)
	await http.start()

	return {
		request: (path: string, init?: RequestInit) => http.app.request(path, init),
		async destroy() {
			await http.destroy()
			await banking.destroy()
			await eventBridge.destroy()
		},
	}
}
