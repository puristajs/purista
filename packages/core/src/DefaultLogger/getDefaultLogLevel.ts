import { isDevelop } from '../core/helper'
import { LogLevelName } from '../core/types'

export const getDefaultLogLevel = (): LogLevelName => {
  return isDevelop() ? 'debug' : 'info'
}
