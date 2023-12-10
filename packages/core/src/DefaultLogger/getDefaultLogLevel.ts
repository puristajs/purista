import { isDevelop } from '../core/helper/index.js'
import type { LogLevelName } from '../core/types/index.js'

export const getDefaultLogLevel = (): LogLevelName => {
  return isDevelop() ? 'debug' : 'info'
}
