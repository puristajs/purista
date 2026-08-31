// biome-ignore-all lint/correctness/useHookAtTopLevel: PURISTA builder methods named useBuiltInTools are not React hooks.
import { HandledError, ServiceBuilder, type ServiceInfoType, StatusCode } from '@purista/core'
import { z } from 'zod'

import type { BankingRepository, RecordedTransaction } from '../repository.js'

const accountIdSchema = z.enum(['account-a', 'account-c'])
const supportCategorySchema = z.enum(['account-access', 'card-payment', 'other'])

/** The only categories for which a later, application-owned workflow may be considered. */
export const customerSupportRoutingMap = {
	'account-access': 'account-access-team',
	'card-payment': 'card-payment-team',
} as const

const classificationCandidateSchema = z.object({
	category: supportCategorySchema,
	reason: z.string().min(1).max(240),
	confidence: z.number().min(0).max(1),
	needsReview: z.boolean(),
})

const routingDecisionSchema = z.discriminatedUnion('status', [
	z.object({
		status: z.literal('no-action'),
		reason: z.enum(['needs-review', 'low-confidence', 'unsupported-category']),
	}),
	z.object({
		status: z.literal('eligible-for-application-routing'),
		destination: z.enum(['account-access-team', 'card-payment-team']),
	}),
])

export const customerSupportClassificationInputSchema = z.object({
	accountId: accountIdSchema,
	requestId: z.string().min(1).max(80),
	text: z.string().min(1).max(2_000),
})

export const customerSupportClassificationOutputSchema = classificationCandidateSchema.extend({
	routing: routingDecisionSchema,
})

export const customerSupportClassificationJsonSchema = {
	type: 'object',
	properties: {
		category: { enum: ['account-access', 'card-payment', 'other'] as string[] },
		reason: { type: 'string' },
		confidence: { type: 'number', minimum: 0, maximum: 1 },
		needsReview: { type: 'boolean' },
	},
	required: ['category', 'reason', 'confidence', 'needsReview'],
	additionalProperties: false,
}

const classificationConfidenceThreshold = 0.8

/**
 * The model only classifies. This map is the application boundary that decides
 * whether a later workflow may act; no command, queue job, or tool is invoked
 * from this attached agent.
 */
export const decideCustomerSupportRouting = (candidate: z.infer<typeof classificationCandidateSchema>) => {
	if (candidate.needsReview) return { status: 'no-action' as const, reason: 'needs-review' as const }
	if (candidate.confidence < classificationConfidenceThreshold) {
		return { status: 'no-action' as const, reason: 'low-confidence' as const }
	}
	const destination = customerSupportRoutingMap[candidate.category as keyof typeof customerSupportRoutingMap]
	if (!destination) return { status: 'no-action' as const, reason: 'unsupported-category' as const }
	return { status: 'eligible-for-application-routing' as const, destination }
}

const serviceInfo = {
	serviceName: 'bankingCustomerSupport',
	serviceVersion: '1',
	serviceDescription: 'Classifies a bank customer support request inside its authorized account scope',
} as const satisfies ServiceInfoType

const builder = new ServiceBuilder(serviceInfo).defineResource<'bankingRepository', BankingRepository>()

const requireCustomerSupportScope = (
	context: { message: unknown; resources: { bankingRepository: BankingRepository } },
	accountId: RecordedTransaction['accountId'],
) => {
	const message = context.message as { principalId?: string; tenantId?: string }
	if (message.tenantId !== 'tenant-north') {
		throw new HandledError(StatusCode.Forbidden, 'The customer support request is outside this tenant')
	}
	if (!context.resources.bankingRepository.canRead(message.principalId, accountId)) {
		throw new HandledError(StatusCode.Forbidden, 'You may not classify support requests for this account')
	}
}

/**
 * A service-attached, queue-backed PURISTA agent. The HTTP command is generated
 * from this definition; it is not a standalone Harness runtime.
 */
export const classifyCustomerSupportAgentBuilder = builder
	.getAgentQueueBuilder('classifyCustomerSupport', 'Classifies one authorized customer support request')
	.addPayloadSchema(customerSupportClassificationInputSchema)
	.addOutputSchema(customerSupportClassificationOutputSchema)
	.addModel('primary', {
		capabilities: ['object'] as const,
		defaults: { temperature: 0 },
	})
	.useBuiltInTools(false)
	.exposeAsHttpEndpoint('POST', 'customer-support/classifications', { streamingMode: 'aggregate' })
	.setRunFunction(async context => {
		// Scope is checked before the request text is added to the model request.
		requireCustomerSupportScope(context, context.payload.accountId)

		const result = await context.harness.models.primary.object(
			{
				messages: [
					{
						role: 'user',
						content: [
							'Classify this banking customer support request.',
							`Request id: ${context.payload.requestId}`,
							`Authorized account: ${context.payload.accountId}`,
							`Customer request: ${context.payload.text}`,
						].join('\n'),
					},
				],
				schema: customerSupportClassificationJsonSchema,
			},
			context.signal,
		)

		const candidate = classificationCandidateSchema.parse(result.object)
		return customerSupportClassificationOutputSchema.parse({
			...candidate,
			routing: decideCustomerSupportRouting(candidate),
		})
	})

export const bankingCustomerSupportService = builder.addAgentDefinition(
	await classifyCustomerSupportAgentBuilder.getDefinition(),
)
