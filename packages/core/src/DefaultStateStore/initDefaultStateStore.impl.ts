import type { Logger } from '../core/types/Logger.js'
import { DefaultStateStore } from './DefaultStateStore.impl.js'

export const initDefaultStateStore = (options: { logger: Logger }): DefaultStateStore => {
	const store = new DefaultStateStore(options)
	return store
}
