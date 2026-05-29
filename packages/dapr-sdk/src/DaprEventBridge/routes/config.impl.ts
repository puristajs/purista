import type { RouterFunction } from '@purista/base-http-bridge'

/**
 * Dapr actor configuration endpoint.
 *
 * PURISTA does not use Dapr actors here, so the route returns an empty entity
 * list while satisfying Dapr's app configuration discovery request.
 */
export const configRoute: RouterFunction = async function (c) {
	const payload = {
		entities: [],
	}

	this.logger.debug('config requested')

	return c.json(payload)
}
