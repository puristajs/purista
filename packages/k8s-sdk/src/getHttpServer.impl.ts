import { StatusCode, UnhandledError } from '@purista/core'
import { Hono } from 'hono'
import { compress } from 'hono/compress'
import type { StatusCode as HonoStatusCode } from 'hono/utils/http-status'

import { addServiceEndpoints } from './addServiceEndpoints.impl.js'
import type { GetHttpServerConfig } from './types.js'
import { puristaVersion } from './version.js'

/**
 * Create a Hono web server.
 * It adds per default the /healthz endpoint
 * If services is set in options, all commands, which have defined http endpoints, will also be added as endpoints
 *
 * The returned server is not started. You need to do it manually.
 
 *
 * @param input the config
 * @returns a object with server, router, start and destroy functions and name var
 */
export const getHttpServer = (input: GetHttpServerConfig, name = 'K8sHttpHelperServer') => {
  const { healthFn, services, hostname, apiMountPath } = input

  const hostnameWithFallback = hostname || process.env.HOSTNAME

  const logger = input.logger.getChildLogger({ name, puristaVersion, hostname: hostnameWithFallback })
  const app = new Hono()

  if (input.enableHttpCompression || input.enableHttpCompression === undefined) {
    app.use('*', compress())
  }

  app.onError((error, c) => {
    const err = UnhandledError.fromError(error)
    logger.error(`${err}`)
    return c.json(err.getErrorResponse(), err.errorCode as HonoStatusCode)
  })

  app.notFound(async (c) => {
    const err = new UnhandledError(StatusCode.NotFound, 'endpoint not found')
    logger.error(`${err}`)
    return c.json(err.getErrorResponse(), err.errorCode as HonoStatusCode)
  })

  let isShuttingDown = false

  process.once('SIGTERM', () => {
    isShuttingDown = true
  })

  process.on('uncaughtException', (error, origin) => {
    const err = UnhandledError.fromError(error)
    logger.error({ err, origin }, `unhandled error: ${err.message}`)
  })

  process.on('unhandledRejection', (error, origin) => {
    const err = UnhandledError.fromError(error)
    logger.error({ err, origin }, `unhandled rejection: ${err.message}`)
  })

  if (!input.disableEndpointExposing) {
    addServiceEndpoints(services, app, logger, apiMountPath)
  }

  app.get('/healthz', async (c) => {
    const isHealthy = await healthFn()
    if (isShuttingDown) {
      const err = new UnhandledError(StatusCode.ServiceUnavailable, 'shut down in progress')
      return c.json(err.getErrorResponse(), err.errorCode as HonoStatusCode)
    }

    if (isHealthy) {
      const err = new UnhandledError(StatusCode.OK, 'ok')
      return c.json(err.getErrorResponse(), err.errorCode as HonoStatusCode)
    }
    logger.error('health not ok')

    const err = new UnhandledError(StatusCode.InternalServerError, 'not ok')
    return c.json(err.getErrorResponse(), err.errorCode as HonoStatusCode)
  })

  return app
}
