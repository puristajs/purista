// biome-ignore-all lint/correctness/useHookAtTopLevel: PURISTA builder methods named useBuiltInTools are not React hooks.
import { HandledError, ServiceBuilder, type ServiceInfoType, StatusCode } from '@purista/core'
import { z } from 'zod'

import type { BankingRepository, RecordedTransaction } from '../repository.js'
import { accountIdSchema } from '../service.js'

export const bankingSupportPlaybookSkillName = 'banking-support-playbook'

const supportPlaybookInputSchema = z.object({
	accountId: accountIdSchema,
	text: z.string().min(1).max(2_000),
})

const supportPlaybookOutputSchema = z.object({
	status: z.literal('guided'),
	answer: z.string().min(1).max(500),
})

const serviceInfo = {
	serviceName: 'bankingSupportPlaybook',
	serviceVersion: '1',
	serviceDescription: 'Provides reviewed, read-only support guidance for an authorized bank account',
} as const satisfies ServiceInfoType

const builder = new ServiceBuilder(serviceInfo).defineResource<'bankingRepository', BankingRepository>()

const requireSupportAccountScope = (
	context: { message: unknown; resources: { bankingRepository: BankingRepository } },
	accountId: RecordedTransaction['accountId'],
) => {
	const message = context.message as { principalId?: string; tenantId?: string }
	if (message.tenantId !== 'tenant-north') {
		throw new HandledError(StatusCode.Forbidden, 'The support request is outside this tenant')
	}
	if (!context.resources.bankingRepository.canRead(message.principalId, accountId)) {
		throw new HandledError(StatusCode.Forbidden, 'You may not request support guidance for this account')
	}
}

/**
 * A default-loop Harness agent attached to a PURISTA service. The reviewed
 * playbook is advertised by name and its body is available only through the
 * built-in read tool. Reading a Skill gives instructions, never permissions.
 */
const supportPlaybookAgentBuilder = builder
	.getAgentQueueBuilder('guideAccountSupport', 'Guides an authorized read-only account support request')
	.addPayloadSchema(supportPlaybookInputSchema)
	.addOutputSchema(supportPlaybookOutputSchema)
	.addModel('primary', { capabilities: ['object', 'tool_use'] as const, defaults: { temperature: 0 } })
	.useSkills([bankingSupportPlaybookSkillName])
	.useBuiltInTools(['read'])
	.exposeAsHttpEndpoint('POST', 'customer-support/playbook', { streamingMode: 'aggregate' })
	.setBeforeGuardHooks({
		supportAccountScope: async function (context, payload) {
			requireSupportAccountScope(context, payload.accountId)
		},
	})
	.setHarnessAgent({
		model: 'primary',
		input: supportPlaybookInputSchema,
		output: supportPlaybookOutputSchema,
		instructions:
			'Provide read-only bank support. Read the banking-support-playbook Skill before answering. Follow it exactly.',
	})

export const bankingSupportPlaybookService = builder.addAgentDefinition(
	await supportPlaybookAgentBuilder.getDefinition(),
)
