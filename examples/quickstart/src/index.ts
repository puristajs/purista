import { serve } from '@hono/node-server'
import { DefaultEventBridge, DefaultQueueBridge } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'

import { pingV1Service } from './service/ping/v1/index.js'

export const main = async () => {
	// initiate the event bridge as first step
	const eventBridge = new DefaultEventBridge()
	await eventBridge.start()
	// queues run on a separate bridge so we can mix transports when needed
	const queueBridge = new DefaultQueueBridge()

	// add your service
	const pingService = await pingV1Service.getInstance(eventBridge, { queueBridge })
	await pingService.start()

	// initiate the webserver service as second step
	const honoService = await honoV1Service.getInstance(eventBridge, {
		serviceConfig: {
			services: [pingService],
		},
	})
	await honoService.start()

	serve({
		fetch: honoService.app.fetch,
		port: 3000,
	})
}

main()
