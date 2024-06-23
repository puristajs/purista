import type { Logger } from '../core/index.js'
import { DefaultConfigStore } from './DefaultConfigStore.impl.js'

export const initDefaultConfigStore = (options: { logger: Logger }): DefaultConfigStore => {
	const store = new DefaultConfigStore(options)
	return store
}
