import { gracefulShutdown, initLogger } from '@purista/core'
import { getEventBridge } from './eventbridge.js'
import { startHttpServer } from './http.js'
import { pingV1Service } from './service/ping/v1/pingV1Service.js'

async function main() {
	const logger = initLogger()
	const eventBridge = await getEventBridge(logger)
	const ping = await pingV1Service.getInstance(eventBridge, { logger })
	await ping.start()

	const { honoService, closeSocket } = await startHttpServer({
		eventBridge,
		logger,
		services: [ping],
	})

	gracefulShutdown(logger, [honoService.prepareDestroy(), eventBridge, ping, closeSocket, honoService])
	logger.info('Example Bank is listening on http://127.0.0.1:3000')
}

main().catch(error => {
	process.stderr.write(`${error}\n`)
	process.exit(1)
})
