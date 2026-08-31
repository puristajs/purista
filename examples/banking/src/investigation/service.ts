// biome-ignore-all lint/correctness/useHookAtTopLevel: PURISTA builder methods named useBuiltInTools are not React hooks.
import { HandledError, ServiceBuilder, type ServiceInfoType, StatusCode } from '@purista/core'
import { z } from 'zod'

import type { BankingRepository, RecordedTransaction } from '../repository.js'

const emptyParameterSchema = z.object({})
const caseIdSchema = z.enum(['case-account-a', 'case-account-a-missing-support', 'case-account-c'])
const accountIdSchema = z.enum(['account-a', 'account-c'])
const branchNameSchema = z.enum(['transactions', 'policy', 'support'])
const evidenceSchema = z.object({
	sourceId: z.string().min(1),
	summary: z.string().min(1),
})
const findingSchema = z.object({
	branch: branchNameSchema,
	status: z.literal('complete'),
	conclusion: z.string().min(1),
	evidence: z.array(evidenceSchema).min(1),
})
const unavailableFindingSchema = z.object({
	branch: branchNameSchema,
	status: z.literal('unavailable'),
	reason: z.literal('specialist-failed'),
	evidence: z.array(evidenceSchema).length(0),
})
const caseBriefSchema = z.object({
	caseId: caseIdSchema,
	accountId: accountIdSchema,
	status: z.enum(['complete', 'partial']),
	findings: z.array(z.union([findingSchema, unavailableFindingSchema])).length(3),
})

const specialistInputSchema = z.object({
	branch: branchNameSchema,
	accountId: accountIdSchema,
	question: z.string().min(1),
	// Every specialist gets only the short evidence excerpt for its own question.
	evidence: z.array(evidenceSchema).min(1),
})

type CaseFixture = {
	accountId: RecordedTransaction['accountId']
	branches: Array<z.infer<typeof specialistInputSchema>>
}

const fixtures: Record<z.infer<typeof caseIdSchema>, CaseFixture> = {
	'case-account-a': {
		accountId: 'account-a',
		branches: [
			{
				branch: 'transactions',
				accountId: 'account-a',
				question: 'What recorded transaction caused this training review case?',
				evidence: [{ sourceId: 'transaction-seed-a-1', summary: 'A EUR 42.50 credit was recorded on 2026-01-02.' }],
			},
			{
				branch: 'policy',
				accountId: 'account-a',
				question: 'Which training rule is relevant to the case?',
				evidence: [{ sourceId: 'policy-training-v1', summary: 'Only a review signal, never an automatic decision.' }],
			},
			{
				branch: 'support',
				accountId: 'account-a',
				question: 'What customer-support context is available for this case?',
				evidence: [
					{ sourceId: 'support-case-a', summary: 'No customer-support request is stored for this synthetic case.' },
				],
			},
		],
	},
	'case-account-a-missing-support': {
		accountId: 'account-a',
		branches: [
			{
				branch: 'transactions',
				accountId: 'account-a',
				question: 'What recorded transaction caused this training review case?',
				evidence: [{ sourceId: 'transaction-seed-a-1', summary: 'A EUR 42.50 credit was recorded on 2026-01-02.' }],
			},
			{
				branch: 'policy',
				accountId: 'account-a',
				question: 'Which training rule is relevant to the case?',
				evidence: [{ sourceId: 'policy-training-v1', summary: 'Only a review signal, never an automatic decision.' }],
			},
			{
				branch: 'support',
				accountId: 'account-a',
				question: 'What customer-support context is available for this case?',
				evidence: [
					{ sourceId: 'support-source-unavailable', summary: 'The support fixture cannot be read for this run.' },
				],
			},
		],
	},
	'case-account-c': {
		accountId: 'account-c',
		branches: [
			{
				branch: 'transactions',
				accountId: 'account-c',
				question: 'What recorded transaction caused this training review case?',
				evidence: [
					{ sourceId: 'transaction-case-c', summary: "This case is intentionally outside Erin's assignment." },
				],
			},
			{
				branch: 'policy',
				accountId: 'account-c',
				question: 'Which training rule is relevant to the case?',
				evidence: [{ sourceId: 'policy-training-v1', summary: 'Only a review signal, never an automatic decision.' }],
			},
			{
				branch: 'support',
				accountId: 'account-c',
				question: 'What customer-support context is available for this case?',
				evidence: [{ sourceId: 'support-case-c', summary: "This case is intentionally outside Erin's assignment." }],
			},
		],
	},
}

const serviceInfo = {
	serviceName: 'bankingCaseInvestigation',
	serviceVersion: '1',
	serviceDescription: 'A bounded, parallel evidence investigation for synthetic banking review cases',
} as const satisfies ServiceInfoType

const builder = new ServiceBuilder(serviceInfo).defineResource<'bankingRepository', BankingRepository>()

const requireCaseAssignment = async function (
	context: { message: { principalId?: string }; resources: { bankingRepository: BankingRepository } },
	payload: { caseId: z.infer<typeof caseIdSchema> },
) {
	const fixture = fixtures[payload.caseId]
	if (!context.resources.bankingRepository.canReviewCase(context.message.principalId, fixture.accountId)) {
		throw new HandledError(StatusCode.Forbidden, 'You are not assigned to investigate this review case')
	}
}

const specialist = (instructions: string) => ({
	model: 'primary' as const,
	input: specialistInputSchema,
	output: findingSchema,
	instructions,
	builtinTools: false as const,
	handler: async (context: { input: z.infer<typeof specialistInputSchema>; signal: AbortSignal }) => {
		context.signal.throwIfAborted()
		if (context.input.evidence[0]?.sourceId === 'support-source-unavailable') {
			throw new Error('Synthetic support source is unavailable')
		}
		return findingSchema.parse({
			branch: context.input.branch,
			status: 'complete',
			conclusion: `The ${context.input.branch} specialist answered its assigned question.`,
			evidence: context.input.evidence,
		})
	},
})

const transactionSpecialist = specialist(
	'Answer only the transaction evidence question. Cite only the supplied transaction evidence.',
)
const policySpecialist = specialist('Answer only the policy evidence question. Cite only the supplied policy evidence.')
const supportSpecialist = specialist(
	'Answer only the support evidence question. Cite only the supplied support evidence.',
)

/**
 * Runs exactly three independently-scoped specialists. `fanOut` honours the
 * declared delegation limit, forwards cancellation, and preserves fixture order.
 * A failed specialist becomes a named missing branch instead of invented text.
 */
export const investigateCaseAgentBuilder = builder
	.getAgentQueueBuilder('investigateCase', 'Collects bounded evidence for one assigned banking review case')
	.addPayloadSchema(z.object({ caseId: caseIdSchema }))
	.addParameterSchema(emptyParameterSchema)
	.addOutputSchema(caseBriefSchema)
	.addModel('primary', { capabilities: ['object'] as const, defaults: { temperature: 0 } })
	.useBuiltInTools(false)
	.exposeAsHttpEndpoint('POST', 'case-investigations', { streamingMode: 'aggregate' })
	.setBeforeGuardHooks({ caseAssignment: requireCaseAssignment })
	.setHarnessWorkflow(
		{
			input: z.object({ caseId: caseIdSchema }),
			output: caseBriefSchema,
			delegation: {
				agents: ['transactionSpecialist', 'policySpecialist', 'supportSpecialist'],
				modelAliases: ['primary'],
				maxChildAgentCalls: 3,
				maxParallelChildAgentCalls: 3,
			},
			handler: async context => {
				const fixture = fixtures[context.input.caseId as z.infer<typeof caseIdSchema>]
				const findings = await context.fanOut<
					z.infer<typeof specialistInputSchema>,
					z.infer<typeof findingSchema> | z.infer<typeof unavailableFindingSchema>
				>(
					fixture.branches,
					async branch => {
						try {
							const finding =
								branch.branch === 'transactions'
									? await context.agents.transactionSpecialist(branch)
									: branch.branch === 'policy'
										? await context.agents.policySpecialist(branch)
										: await context.agents.supportSpecialist(branch)
							return findingSchema.parse(finding)
						} catch {
							return unavailableFindingSchema.parse({
								branch: branch.branch,
								status: 'unavailable',
								reason: 'specialist-failed',
								evidence: [],
							})
						}
					},
					{ concurrency: 3 },
				)
				return caseBriefSchema.parse({
					caseId: context.input.caseId,
					accountId: fixture.accountId,
					status: findings.some(finding => finding.status === 'unavailable') ? 'partial' : 'complete',
					findings,
				})
			},
		},
		{
			agents: { transactionSpecialist, policySpecialist, supportSpecialist },
		},
	)

export const bankingCaseInvestigationService = builder.addAgentDefinition(
	await investigateCaseAgentBuilder.getDefinition(),
)
