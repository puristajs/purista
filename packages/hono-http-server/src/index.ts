/**
 * Package for using a Hono as webserver.
 *
 * Minimal example:
 *
 * @example
 * ```typescript
 * import { serve } from '@hono/node-server'
 * import { DefaultEventBridge } from '@purista/core'
 * import { honoV1Service } from '@purista/hono-http-server'
 *
 * // create and init our eventbridge
 * const eventBridge = new DefaultEventBridge()
 * await eventBridge.start()
 *
 * // add your service
 * const pingService = await pingV1Service.getInstance(eventBridge)
 * await pingService.start()
 *
 * const honoService = await honoV1Service.getInstance(eventBridge, {
 *   serviceConfig: {
 *     enableDynamicRoutes: false,
 *   }
 * })
 * honoService.registerService(pingService)
 * await honoService.start()
 *
 * const _serverInstance = serve({
 *   fetch: honoService.app.fetch,
 *   port: 3000,
 * })
 *
 * ```
 *
 * @module
 */

export type { ProblemDetails, ProblemTypeConfig } from './helper/problemDetails.js'
export { type AnyService, HonoServiceClass } from './service/hono/v1/HonoServiceClass.js'
export {
	type HonoServiceV1Config,
	type HonoServiceV1ConfigPartial,
	honoServiceV1ConfigSchema,
} from './service/hono/v1/honoServiceConfig.js'
export { honoV1Service } from './service/hono/v1/honoV1Service.js'
export type { BindingsBase } from './types/BindingsBase.js'
export type { EndpointProtectMiddleware } from './types/EndpointProtectMiddleware.js'
export type { HealthFunction } from './types/HealthFunction.js'
export type { VariablesBase } from './types/VariablesBase.js'
