import { InstanceId } from './InstanceId'
import { PrincipalId } from './PrincipalId'
import { TraceId } from './TraceId'

export type LoggerOptions = {
  name?: string
  serviceVersion?: string
  serviceName?: string
  serviceTarget?: string
  traceId?: TraceId
  instanceId?: InstanceId
  principalId?: PrincipalId
}

export abstract class Logger {
  abstract info(...args: any): void
  abstract fatal(...args: any): void
  abstract error(...args: any): void
  abstract warn(...args: any): void
  abstract debug(...args: any): void
  abstract trace(...args: any): void
  abstract getChildLogger(options: LoggerOptions): Logger
}
