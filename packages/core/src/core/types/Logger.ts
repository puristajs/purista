import { Logger as TsLogger } from 'tslog'

export type Logger = Pick<TsLogger, 'info' | 'error' | 'warn' | 'debug' | 'trace' | 'getChildLogger'>
