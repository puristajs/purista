import { createServer, IncomingMessage, ServerResponse } from 'node:http'

import { HandledError, StatusCode, UnhandledError } from '@purista/core'
import Trouter, { Methods } from 'trouter'

import { addServiceEndpoints } from './addServiceEndpoints.impl'
import { GetHttpServerConfig } from './types'
import { puristaVersion } from './version'

export type RouterFunction = (
  request: IncomingMessage,
  response: ServerResponse,
  parameter: Record<string, unknown>,
) => Promise<void>

/**
 * Create a basic http web server.
 * It adds per default the /healthz endpoint
 * If services is set in options, all commands, which have defined http endpoints, will also be added as endpoints
 *
 * The returned server is not started. You need to do it manually.
 *
 * @param input the config
 * @returns a object with server, router, start and destroy functions and name var
 */
export const getHttpServer = (input: GetHttpServerConfig, name = 'K8sHttpHelperServer') => {
  const { httpServerOptions, healthFn, services, apiMountPath } = input

  const hostname = process.env.HOSTNAME

  const logger = input.logger.getChildLogger({ name, puristaVersion, hostname })
  const router = new Trouter<RouterFunction>()

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

  addServiceEndpoints(services, router, logger, apiMountPath)

  router.add('GET', '/healthz', async (body: unknown, response: ServerResponse) => {
    const isHealthy = await healthFn()
    if (isShuttingDown) {
      response.statusCode = 503
      response.setHeader('content-type', 'application/json; charset=utf-8')

      response.write(JSON.stringify({ message: 'shut down in progress', status: 503 }), (err) => {
        if (err) {
          logger.error({ err }, err.message)
        }
      })
      response.end()
      return
    }

    if (isHealthy) {
      response.statusCode = 200
      response.setHeader('content-type', 'application/json; charset=utf-8')

      response.write(JSON.stringify({ message: 'ok', status: 200 }), (err) => {
        if (err) {
          logger.error({ err }, err.message)
        }
      })
      response.end()
      return
    }
    logger.error('health not ok')
    response.statusCode = 500
    response.setHeader('content-type', 'application/json; charset=utf-8')

    response.write(JSON.stringify({ status: 500, message: 'not ok' }), (err) => {
      if (err) {
        logger.error({ err }, err.message)
      }
    })

    response.end()
  })

  const server = createServer(httpServerOptions || {}, async (request, response) => {
    if (isShuttingDown) {
      response.statusCode = 503
      response.setHeader('content-type', 'application/json; charset=utf-8')

      response.write(JSON.stringify({ message: 'shut down in progress', status: 503 }), (err) => {
        if (err) {
          logger.error({ err }, err.message)
        }
      })
      response.end()
      return
    }

    const route = router.find(request.method as Methods, request.url as string)

    if (!route?.handlers.length) {
      const err = new HandledError(StatusCode.NotFound, 'route not found')
      logger.error({ err }, err.message)
      response.statusCode = err.errorCode
      response.setHeader('content-type', 'application/json; charset=utf-8')
      response.write(JSON.stringify(err.getErrorResponse()), (err) => {
        if (err) {
          logger.error({ err }, err.message)
        }
      })
      response.end()
      return
    }

    try {
      await route.handlers[0](request, response, route.params)
    } catch (error) {
      const err = new HandledError(StatusCode.InternalServerError, (error as Error).message)
      logger.error({ err }, err.message)

      response.statusCode = err.errorCode
      response.setHeader('content-type', 'application/json; charset=utf-8')
      response.write(JSON.stringify(err.getErrorResponse()), (err) => {
        if (err) {
          logger.error({ err }, err.message)
        }
      })
      response.end()
    }
  })

  const destroy = async () =>
    new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) {
          logger.error({ err }, 'failed to close http server')
          reject(err)
          return
        }
        resolve()
      })
    })

  const start = async (port = 8080) => {
    server.listen(port)
    logger.info(`http server is listening on port ${port}`)
  }

  return {
    /**
     * Start the http server
     * @param port the http port @default 8080
     */
    start,
    /** the TRouter instance to be optional used to add more endpoints manually */
    router,
    /** the node http server instance itself */
    server,
    /** the name of the http server for logging */
    name,
    /**
     * Try to shutdown the http server gracefully
     */
    destroy,
  }
}
