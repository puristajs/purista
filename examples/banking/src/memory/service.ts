// biome-ignore-all lint/correctness/useHookAtTopLevel: PURISTA builder methods named useBuiltInTools are not React hooks.
import { HandledError, ServiceBuilder, type ServiceInfoType, StatusCode } from '@purista/core'
import { z } from 'zod'

import type { BankingRepository, RecordedTransaction } from '../repository.js'

const accountIdSchema = z.enum(['account-a', 'account-c'])
const languageSchema = z.enum(['en', 'de'])
const conversationIdSchema = z.string().uuid()
const preferenceInputSchema = z.object({
	accountId: accountIdSchema,
	/** A client can name a conversation, but cannot use its id as authority. */
	conversationId: conversationIdSchema,
})
const savePreferenceInputSchema = preferenceInputSchema.extend({ language: languageSchema })
const preferenceOutputSchema = preferenceInputSchema.extend({
	language: languageSchema.nullable(),
	retention: z.literal('24-hours'),
})

const serviceInfo = {
	serviceName: 'bankingSupportMemory',
	serviceVersion: '1',
	serviceDescription: 'Stores a narrowly scoped support-language preference in Harness memory',
} as const satisfies ServiceInfoType

const builder = new ServiceBuilder(serviceInfo).defineResource<'bankingRepository', BankingRepository>()

const requirePreferenceScope = async function (
	context: {
		message: { tenantId?: string; principalId?: string }
		resources: { bankingRepository: BankingRepository }
	},
	payload: { accountId: RecordedTransaction['accountId'] },
) {
	if (context.message.tenantId !== 'tenant-north') {
		throw new HandledError(StatusCode.Forbidden, 'This support preference is outside the tutorial tenant')
	}
	if (!context.resources.bankingRepository.canRead(context.message.principalId, payload.accountId)) {
		throw new HandledError(StatusCode.Forbidden, 'You may not retain a support preference for this account')
	}
}

const memoryKey = (conversationId: string) => `support-preference:${conversationId}:language`
const retention = '24-hours' as const
const retentionMs = 24 * 60 * 60 * 1_000

/**
 * The conversation id helps a user organize preferences, while Harness scopes
 * the actual record by the trusted tenant and principal. A copied id therefore
 * selects only the caller's own namespace; it never grants access to another
 * person's preference.
 */
export const saveSupportPreferenceAgentBuilder = builder
	.getAgentQueueBuilder('saveSupportPreference', 'Saves one consented support-language preference')
	.addPayloadSchema(savePreferenceInputSchema)
	.addOutputSchema(preferenceOutputSchema)
	// Harness requires a model catalog even though this deterministic workflow never calls a model.
	.addModel('memory-runtime', { capabilities: ['object'] as const })
	.setSessionPolicy({ mode: 'conversation', payloadPath: ['conversationId'] })
	.useBuiltInTools(false)
	.exposeAsHttpEndpoint('POST', 'support/preferences', { streamingMode: 'aggregate' })
	.setBeforeGuardHooks({ preferenceScope: requirePreferenceScope })
	.setHarnessWorkflow({
		input: savePreferenceInputSchema,
		output: preferenceOutputSchema,
		handler: async context => {
			await context.memory.principal().write(memoryKey(context.input.conversationId), context.input.language, {
				ttlMs: retentionMs,
				tags: ['support-preference'],
			})
			return { ...context.input, retention }
		},
	})

export const readSupportPreferenceAgentBuilder = builder
	.getAgentQueueBuilder('readSupportPreference', 'Reads one caller-owned support-language preference')
	.addPayloadSchema(preferenceInputSchema)
	.addOutputSchema(preferenceOutputSchema)
	.addModel('memory-runtime', { capabilities: ['object'] as const })
	.setSessionPolicy({ mode: 'conversation', payloadPath: ['conversationId'] })
	.useBuiltInTools(false)
	.exposeAsHttpEndpoint('POST', 'support/preferences/read', { streamingMode: 'aggregate' })
	.setBeforeGuardHooks({ preferenceScope: requirePreferenceScope })
	.setHarnessWorkflow({
		input: preferenceInputSchema,
		output: preferenceOutputSchema,
		handler: async context => ({
			...context.input,
			language:
				(await context.memory
					.principal()
					.read<z.infer<typeof languageSchema>>(memoryKey(context.input.conversationId))) ?? null,
			retention,
		}),
	})

export const forgetSupportPreferenceAgentBuilder = builder
	.getAgentQueueBuilder('forgetSupportPreference', 'Deletes one caller-owned support-language preference')
	.addPayloadSchema(preferenceInputSchema)
	.addOutputSchema(preferenceOutputSchema)
	.addModel('memory-runtime', { capabilities: ['object'] as const })
	.setSessionPolicy({ mode: 'conversation', payloadPath: ['conversationId'] })
	.useBuiltInTools(false)
	.exposeAsHttpEndpoint('POST', 'support/preferences/forget', { streamingMode: 'aggregate' })
	.setBeforeGuardHooks({ preferenceScope: requirePreferenceScope })
	.setHarnessWorkflow({
		input: preferenceInputSchema,
		output: preferenceOutputSchema,
		handler: async context => {
			await context.memory.principal().delete(memoryKey(context.input.conversationId))
			return { ...context.input, language: null, retention }
		},
	})

export const bankingSupportMemoryService = builder
	.addAgentDefinition(await saveSupportPreferenceAgentBuilder.getDefinition())
	.addAgentDefinition(await readSupportPreferenceAgentBuilder.getDefinition())
	.addAgentDefinition(await forgetSupportPreferenceAgentBuilder.getDefinition())
