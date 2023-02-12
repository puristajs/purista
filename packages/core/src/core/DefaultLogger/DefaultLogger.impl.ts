import { Logger as PinoLogger } from 'pino'

import { ILogger, LogFnParamType, Logger, LoggerOptions } from '../types'

export class DefaultLogger extends Logger implements ILogger {
  constructor(private log: PinoLogger) {
    super()
  }

  fatal(...args: LogFnParamType) {
    if (args.length === 1) {
      this.log.fatal(args[0])
      return
    }
    this.log.fatal(args[0], ...args.slice(1))
  }

  error(...args: LogFnParamType) {
    if (args.length === 1) {
      this.log.error(args[0])
      return
    }
    this.log.error(args[0], ...args.slice(1))
  }

  warn(...args: LogFnParamType) {
    if (args.length === 1) {
      this.log.warn(args[0])
      return
    }
    this.log.warn(args[0], ...args.slice(1))
  }

  info(...args: LogFnParamType) {
    if (args.length === 1) {
      this.log.info(args[0])
      return
    }
    this.log.info(args[0], ...args.slice(1))
  }

  debug(...args: LogFnParamType) {
    if (args.length === 1) {
      this.log.debug(args[0])
      return
    }
    this.log.debug(args[0], ...args.slice(1))
  }

  trace(...args: LogFnParamType) {
    if (args.length === 1) {
      this.log.trace(args[0])
      return
    }
    this.log.trace(args[0], ...args.slice(1))
  }

  getChildLogger(options: LoggerOptions): Logger {
    const prefix = [options.serviceName, options.serviceVersion, options.serviceTarget].filter((entry) => !!entry)

    const parameter: LoggerOptions = {
      ...options,
      name: options.name || prefix.join('-'),
    }

    const child = this.log.child(parameter)
    return new DefaultLogger(child)
  }
}
