import { ServiceBuilder } from '@purista/core'

export interface CardFreezeExecutor {
	freeze(
		input: Readonly<{
			cardId: string
			tenantId: string
			principalId: string
			idempotencyKey: string
		}>,
	): Promise<{ status: 'frozen'; cardId: string }>
}

export const transactionV1ServiceBuilder = new ServiceBuilder({
	serviceName: 'Transaction',
	serviceVersion: '1',
	serviceDescription: 'Owns transaction and card business actions',
}).defineResource<'cardFreezeExecutor', CardFreezeExecutor>()
