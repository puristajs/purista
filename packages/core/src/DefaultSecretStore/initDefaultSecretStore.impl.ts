import type { Logger } from '../core/types/Logger.js'
import { DefaultSecretStore } from './DefaultSecretStore.impl.js'

export const initDefaultSecretStore = (options: { logger: Logger }): DefaultSecretStore => {
	const store = new DefaultSecretStore(options)
	return store
}
