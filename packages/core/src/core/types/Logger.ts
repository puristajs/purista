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
  abstract info(message?: string, ...args: any[]): void
  abstract fatal(message?: string, ...args: any[]): void
  abstract error(message?: string, ...args: any[]): void
  abstract warn(message?: string, ...args: any[]): void
  abstract debug(message?: string, ...args: any[]): void
  abstract trace(message?: string, ...args: any[]): void
  abstract getChildLogger(options: LoggerOptions): Logger
}
