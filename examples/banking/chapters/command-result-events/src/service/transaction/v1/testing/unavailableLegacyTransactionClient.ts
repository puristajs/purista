import type { LegacyTransactionClient } from '../LegacyTransactionClient.js'

export const unavailableLegacyTransactionClient: LegacyTransactionClient = {
	async fetchTransaction() {
		throw new Error('This test did not provide a legacy transaction client')
	},
}
