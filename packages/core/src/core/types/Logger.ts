import type { InstanceId } from './InstanceId'
import type { PrincipalId } from './PrincipalId'
import type { TenantId } from './TenantId'
import type { TraceId } from './TraceId'

export type LoggerOptions = {
  puristaVersion?: string
  name?: string
  module?: string
  serviceVersion?: string
  serviceName?: string
  serviceTarget?: string
  traceId?: TraceId
  instanceId?: InstanceId
  principalId?: PrincipalId
  tenantId?: TenantId
  hostname?: string
}

export type LogFnParamType = [unknown, string?, ...any] | [string, ...any]

export abstract class Logger {
  abstract info(...args: LogFnParamType): void
  abstract fatal(...args: LogFnParamType): void
  abstract error(...args: LogFnParamType): void
  abstract warn(...args: LogFnParamType): void
  abstract debug(...args: LogFnParamType): void
  abstract trace(...args: LogFnParamType): void
  abstract getChildLogger(options: LoggerOptions): Logger
}

export interface ILogger {
  info(...args: LogFnParamType): void
  fatal(...args: LogFnParamType): void
  error(...args: LogFnParamType): void
  warn(...args: LogFnParamType): void
  debug(...args: LogFnParamType): void
  trace(...args: LogFnParamType): void
}
