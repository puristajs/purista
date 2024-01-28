import type { Logger } from '../core/index.js'
import type { ShutdownEntry } from './types/index.js'

/**
 * Helps to gracefully shut down your application.
 * Provide in list objects. The objects contains a name and a promise function which should be executed.
 *
 * The execution of array list functions is done sequential.
 *
 * @example
 * ```typescript
 * const shutDownList = [
 *  {
 *    name: `${serviceA.info.serviceName} version ${serviceA.info.serviceVersion}`,
 *    fn: serviceA.destroy
 *  },
 *  {
 *    name: `${serviceB.info.serviceName} version ${serviceB.info.serviceVersion}`,
 *    fn: serviceB.destroy
 *  },
 * {
 *    name: eventbridge.name,
 *    fn: eventbridge.destroy
 *  }
 * ]
 * gracefulShutdown(logger, shutDownList)
 *
 * // will shutdown ServiceA, then ServiceB, then the event bridge
 * ```
 *
 * @param logger the logger object
 * @param list a object containing name and function
 * @param timeoutMs in ms to shut @default 30000 milliseconds
 *
 * @group Helper
 */
export const gracefulShutdown = (logger: Logger, list: ShutdownEntry[], timeoutMs = 30000) => {
  process.once('SIGTERM', async () => shutDown('SIGTERM'))
  process.once('SIGINT', async () => shutDown('SIGINT'))
  process.once('SIGQUIT', async () => shutDown('SIGQUIT'))

  const shutDown = async (signal = 'SIGTERM') => {
    logger.info(`start graceful shut down because of kill signal (${signal})`)

    const timer = setTimeout(() => {
      logger.error(`shutdown timeout - force kill`)
      process.exit(1)
    }, timeoutMs)

    let hasError = false

    for (const entry of list) {
      try {
        await entry.destroy()
        await new Promise((resolve) =>
          setTimeout(() => {
            resolve(undefined)
          }, 0),
        )
        logger.info(`${entry.name} shutdown successfully`)
      } catch (err) {
        logger.error({ err }, `error on shutdown ${entry.name}`)
        hasError = true
      }
    }

    clearTimeout(timer)

    if (hasError) {
      logger.info('shut down finished with errors')
      process.exit(1)
    }

    logger.info('graceful shut down finished successfully')
    process.kill(process.pid, signal)
  }
}
