import { ISettingsParam, Logger as TsLogger } from 'tslog'

import { Logger, LoggerOptions } from './types'

export class DefaultLogger extends Logger {
  constructor(private tslog: TsLogger) {
    super()
  }

  fatal(...args: any[]) {
    this.tslog.fatal(...args)
  }

  error(...args: any[]) {
    this.tslog.error(...args)
  }

  warn(...args: any[]) {
    this.tslog.warn(...args)
  }

  info(...args: any[]) {
    this.tslog.info(...args)
  }

  debug(...args: any[]) {
    this.tslog.debug(...args)
  }

  trace(...args: any[]) {
    this.tslog.trace(...args)
  }

  getChildLogger(options: LoggerOptions): Logger {
    const prefix = [options.serviceName, options.serviceVersion, options.serviceTarget].filter((entry) => !!entry)

    this.tslog.settings.prefix.length
    const params: ISettingsParam = {
      name: options.name || prefix.join('-'),
      requestId: options.traceId,
      // prefix,
    }

    const child = this.tslog.getChildLogger(params)
    return new DefaultLogger(child)
  }
}
