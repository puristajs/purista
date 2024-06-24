import type { Logger } from '../core/index.js'
import { DefaultStateStore } from './DefaultStateStore.impl.js'

export const initDefaultStateStore = (options: { logger: Logger }): DefaultStateStore => {
	const store = new DefaultStateStore(options)
	return store
}
