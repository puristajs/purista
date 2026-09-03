import { gracefulShutdown, initLogger, type Service } from '@purista/core'
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
		{
			name: `${honoService.serviceInfo.serviceName} ${honoService.serviceInfo.serviceVersion} close socket`,
			destroy: () =>
				new Promise<void>((resolve, reject) => {
					serverInstance.close(error => (error ? reject(error) : resolve()))
				}),
		},
		...services.map(service => ({
			name: `${service.serviceInfo.serviceName} ${service.serviceInfo.serviceVersion}`,
			destroy: () => service.destroy(),
		})),
		{
			name: `${honoService.serviceInfo.serviceName} ${honoService.serviceInfo.serviceVersion}`,
			destroy: () => honoService.destroy(),
		},
		{
			name: eventBridge.name,
			destroy: () => eventBridge.destroy(),
		},
	])
}

main()
