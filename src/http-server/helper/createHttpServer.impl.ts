import { createSecureServer, Http2SecureServer } from 'http2'

import { Logger } from '../../core'
import { ServiceInfo } from '../config'
import { HttpServerConfig } from '../types'

/**
 * CreateHttpServer creates a secure HTTP server using the given configuration
 * @param {HttpServerConfig} config - HttpServerConfig
 * @param {Logger} baseLogger - The logger that will be used to log all events.
 * @returns The server is returned.
 */
export const createHttpServer = async (config: HttpServerConfig, baseLogger: Logger): Promise<Http2SecureServer> => {
  const log = baseLogger.getChildLogger({
    name: `${ServiceInfo.serviceName} V${ServiceInfo.serviceVersion}`,
    minLevel: config.logLevel,
  })
  log.debug('init http server')

  const server = createSecureServer(config.options)

  server.on('error', (error: Error) => log.error(error))
  server.on('listening', () => log.info('http server is listening on port', config.port))

  const runningServer = await new Promise<Http2SecureServer>((resolve, reject) => {
    const onError = function (error: Error) {
      reject(error)
    }

    const onSuccess = function () {
      server.removeListener('error', onError)
      resolve(server)
    }

    server.once('listening', onSuccess)
    server.once('error', onError)

    server.listen(config.port, '')
  })

  server.on('unknownProtocol', () => log.error('unknown protocol'))

  server.on('sessionError', (error) => log.error('http session error', error))

  server.on('timeout', () => log.error('http session timeout'))

  return runningServer
}
