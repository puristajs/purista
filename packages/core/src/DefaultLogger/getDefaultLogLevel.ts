import { isDevelop } from '../core/helper'
import type { LogLevelName } from '../core/types'

export const getDefaultLogLevel = (): LogLevelName => {
  return isDevelop() ? 'debug' : 'info'
}
