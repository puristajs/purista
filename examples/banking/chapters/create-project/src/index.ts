import { gracefulShutdown, initLogger } from '@purista/core'
import { getEventBridge } from './eventbridge.js'
import { bankProfileV1Service } from './service/bankProfile/v1/bankProfileV1Service.js'

async function main() {
	const logger = initLogger()
	const eventBridge = await getEventBridge(logger)
	const bankProfile = await bankProfileV1Service.getInstance(eventBridge, { logger })
	await bankProfile.start()
	gracefulShutdown(logger, [bankProfile, eventBridge])
	logger.info('BankProfile service started')
}

main().catch(() => {
	process.stderr.write('Example Bank could not start.\n')
	process.exit(1)
})
