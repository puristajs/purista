/**
 * Package for using a Hono as webserver.
 *
 * Minimal example:
 *
 * @example ```typescript
 * import { serve } from '@hono/node-server'
 * import { DefaultEventBridge } from '@purista/core'
 * import { honoV1Service } from '@purista/hono-http-server'
 *
 * // create and init our eventbridge
 * const eventBridge = new DefaultEventBridge()
 * await eventBridge.start()
 *
 * // add your service
 * const pingService = pingV1Service.getInstance(eventBridge)
 * await pingService.start()
 *
 * const honoService = honoV1Service.getInstance(eventBridge, {
 *   serviceConfig: {
 *     services: [pingService]
 *   }
 * })
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
export * from './service/hono/v1/honoV1Service.js'
export * from './service/ServiceEvent.enum.js'
export * from './types/index.js'
