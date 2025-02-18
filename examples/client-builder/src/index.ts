import { type Service, gracefulShutdown, initLogger } from '@purista/core'
import { getEventBridge } from './eventbridge.js'
import { getHttpServer } from './http.js'

export const main = async () => {
	const logger = initLogger()

	const eventBridge = await getEventBridge(logger)

	const services: Service[] = []

	const { honoService, serverInstance } = await getHttpServer({
		logger,
		eventBridge,
		services,
	})

	// try to shut down as clean as possible
	gracefulShutdown(logger, [
		honoService.prepareDestroy(),
		eventBridge,
		...services,
		{
			name: `${honoService.serviceInfo.serviceName} ${honoService.serviceInfo.serviceVersion} close socket`,
			destroy: async () => {
				serverInstance.close()
			},
		},
		honoService,
	])
}

main()
