import { isDevelop } from '../core/helper/isDevelop.impl.js'
import type { LogLevelName } from '../core/types/LogLevelName.js'

export const getDefaultLogLevel = (): LogLevelName => {
	return isDevelop() ? 'debug' : 'info'
}
