import { HandledError, StatusCode } from '@purista/core'
import { freezeCardInputSchema, freezeCardOutputSchema, freezeCardParameterSchema } from '../../schema.js'
import { transactionV1ServiceBuilder } from '../../transactionV1ServiceBuilder.js'

export const freezeCardCommandBuilder = transactionV1ServiceBuilder
	.getCommandBuilder('freezeCard', 'Freeze a card after an approved review')
	.addPayloadSchema(freezeCardInputSchema)
	.addParameterSchema(freezeCardParameterSchema)
	.addOutputSchema(freezeCardOutputSchema)
	.setBeforeGuardHooks({
		approvedCardFreeze: async function (context, payload, parameter) {
			const { tenantId, principalId } = context.message
			if (!tenantId || !principalId) throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
			if (
				!(await context.resources.cardFreezePolicy.canFreeze({
					tenantId,
					principalId,
					cardId: payload.cardId,
					approvalId: parameter.approvalId,
				}))
			) {
				throw new HandledError(StatusCode.Forbidden, 'This card freeze is not approved')
			}
		},
	})
	.setCommandFunction(async function (context, payload, parameter) {
		const { tenantId, principalId } = context.message
		if (!tenantId || !principalId) throw new HandledError(StatusCode.Unauthorized, 'A valid session is required')
		return context.resources.cardFreezeExecutor.freeze({
			...payload,
			tenantId,
			principalId,
			idempotencyKey: parameter.approvalId,
		})
	})
