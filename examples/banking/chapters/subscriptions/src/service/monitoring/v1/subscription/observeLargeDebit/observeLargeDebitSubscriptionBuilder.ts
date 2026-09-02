import { EBMessageType } from '@purista/core'
import { ServiceEvent } from '../../../../serviceEvent.enum.js'
import {
	largeDebitSignalSchema,
	largeDebitThresholdCents,
	latestLargeDebitSignalKey,
} from '../../monitoringSignal.js'
import { monitoringV1ServiceBuilder } from '../../monitoringV1ServiceBuilder.js'
import {
	monitoringV1ObserveLargeDebitInputParameterSchema,
	monitoringV1ObserveLargeDebitInputPayloadSchema,
} from './schema.js'

export const observeLargeDebitSubscriptionBuilder = monitoringV1ServiceBuilder
	.getSubscriptionBuilder('observeLargeDebit', 'Observe large recorded debit transactions')
	.subscribeToEvent(ServiceEvent.TransactionRecordedV1)
	.filterForMessageType(EBMessageType.CommandSuccessResponse)
	.filterSentFrom('Transaction', '1', 'recordTransaction', undefined)
	.filterTenantId('tenant-example')
	.addPayloadSchema(monitoringV1ObserveLargeDebitInputPayloadSchema)
	.addParameterSchema(monitoringV1ObserveLargeDebitInputParameterSchema)
	.setSubscriptionFunction(async function (context, payload, _parameter) {
		if (payload.direction !== 'debit' || payload.amountCents < largeDebitThresholdCents) return

		const signal = largeDebitSignalSchema.parse({
			transactionId: payload.transactionId,
			accountId: payload.accountId,
			amountCents: payload.amountCents,
		})
		await context.states.setState(latestLargeDebitSignalKey, signal)
	})
