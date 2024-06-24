import type { Logger } from '../core/index.js'
import { DefaultSecretStore } from './DefaultSecretStore.impl.js'

export const initDefaultSecretStore = (options: { logger: Logger }): DefaultSecretStore => {
	const store = new DefaultSecretStore(options)
	return store
}
