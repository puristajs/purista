import { Logger as PinoLogger } from 'pino'

import { Logger, LoggerOptions } from './types'

export class DefaultLogger extends Logger {
  constructor(private log: PinoLogger) {
    super()
  }

  fatal(message?: string, ...args: any[]) {
    this.log.fatal(message, ...args)
  }

  error(message?: string, ...args: any[]) {
    this.log.error(message, ...args)
  }

  warn(message?: string, ...args: any[]) {
    this.log.warn(message, ...args)
  }

  info(message?: string, ...args: any[]) {
    this.log.info(message, ...args)
  }

  debug(message?: string, ...args: any[]) {
    this.log.debug(message, ...args)
  }

  trace(message?: string, ...args: any[]) {
    this.log.trace(message, ...args)
  }

  getChildLogger(options: LoggerOptions): Logger {
    const prefix = [options.serviceName, options.serviceVersion, options.serviceTarget].filter((entry) => !!entry)

    const params: LoggerOptions = {
      ...options,
      name: options.name || prefix.join('-'),
    }

    const child = this.log.child(params)
    return new DefaultLogger(child)
  }
}
