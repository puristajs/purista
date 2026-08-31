import { HandledError, ServiceBuilder, type ServiceInfoType, StatusCode } from '@purista/core'
import { z } from 'zod'

import type { PolicyWikiStore } from './repository.js'

const emptyParameterSchema = z.object({})
const revisionSchema = z.number().int().positive()
const pageSchema = z.object({ pageId: z.literal('fee-notices'), revision: revisionSchema, text: z.string().min(1) })
const proposalSchema = z.object({
	proposalId: z.string(),
	pageId: z.literal('fee-notices'),
	sourceRevision: revisionSchema,
	targetRevision: revisionSchema,
	proposedText: z.string().min(1),
	status: z.enum(['proposed', 'approved', 'rejected', 'published']),
	indexedRevision: revisionSchema.nullable(),
})

const serviceInfo = {
	serviceName: 'bankingPolicyWiki',
	serviceVersion: '1',
	serviceDescription: 'Proposes, reviews, publishes, and indexes synthetic banking policy wiki revisions',
} as const satisfies ServiceInfoType

const builder = new ServiceBuilder(serviceInfo).defineResource<'policyWikiStore', PolicyWikiStore>()

const requireActor = (context: { message: { principalId?: string; tenantId?: string } }, actor: 'dana' | 'erin') => {
	if (context.message.tenantId !== 'tenant-north' || context.message.principalId !== actor) {
		throw new HandledError(StatusCode.Forbidden, `Only ${actor} may perform this synthetic wiki action`)
	}
}

export const getPolicyWikiPage = builder
	.getCommandBuilder('getPolicyWikiPage', 'Returns the current published synthetic policy wiki page')
	.addPayloadSchema(z.undefined())
	.addParameterSchema(emptyParameterSchema)
	.addOutputSchema(pageSchema)
	.exposeAsHttpEndpoint('GET', 'policy-wiki/fee-notices')
	.setCommandFunction(async function (context) {
		return context.resources.policyWikiStore.getPage()
	})

export const ingestPolicySourceChange = builder
	.getCommandBuilder('ingestPolicySourceChange', 'Records one curated policy-source revision')
	.addPayloadSchema(z.undefined())
	.addParameterSchema(emptyParameterSchema)
	.addOutputSchema(z.object({ sourceRevision: revisionSchema }))
	.exposeAsHttpEndpoint('POST', 'policy-wiki/sources/fee-notices')
	.setBeforeGuardHooks({
		curator: async function (context) {
			requireActor(context, 'dana')
		},
	})
	.setCommandFunction(async function (context) {
		return { sourceRevision: context.resources.policyWikiStore.ingestSourceChange() }
	})

export const proposePolicyWikiEdit = builder
	.getCommandBuilder(
		'proposePolicyWikiEdit',
		'Creates a source-backed edit proposal without changing the published wiki',
	)
	.addPayloadSchema(z.undefined())
	.addParameterSchema(emptyParameterSchema)
	.addOutputSchema(proposalSchema)
	.exposeAsHttpEndpoint('POST', 'policy-wiki/fee-notices/proposals')
	.setBeforeGuardHooks({
		curator: async function (context) {
			requireActor(context, 'dana')
		},
	})
	.setCommandFunction(async function (context) {
		return context.resources.policyWikiStore.propose()
	})

export const decidePolicyWikiEdit = builder
	.getCommandBuilder('decidePolicyWikiEdit', 'Records Erin’s approval or rejection of one proposed wiki revision')
	.addPayloadSchema(z.object({ decision: z.enum(['approved', 'rejected']) }))
	.addParameterSchema(emptyParameterSchema)
	.addOutputSchema(proposalSchema)
	.exposeAsHttpEndpoint('POST', 'policy-wiki/fee-notices/proposals/decision')
	.setBeforeGuardHooks({
		reviewer: async function (context) {
			requireActor(context, 'erin')
		},
	})
	.setCommandFunction(async function (context, payload) {
		return context.resources.policyWikiStore.decide(payload.decision)
	})

export const publishPolicyWikiEdit = builder
	.getCommandBuilder('publishPolicyWikiEdit', 'Publishes only the exact approved source and page revision')
	.addPayloadSchema(z.object({ expectedSourceRevision: revisionSchema, expectedTargetRevision: revisionSchema }))
	.addParameterSchema(emptyParameterSchema)
	.addOutputSchema(proposalSchema)
	.exposeAsHttpEndpoint('POST', 'policy-wiki/fee-notices/publish')
	.setBeforeGuardHooks({
		curator: async function (context) {
			requireActor(context, 'dana')
		},
	})
	.setCommandFunction(async function (context, payload) {
		return context.resources.policyWikiStore.publish(payload.expectedSourceRevision, payload.expectedTargetRevision)
	})

export const indexPolicyWikiEdit = builder
	.getCommandBuilder('indexPolicyWikiEdit', 'Marks the exact current published policy wiki revision as indexed')
	.addPayloadSchema(z.object({ revision: revisionSchema }))
	.addParameterSchema(emptyParameterSchema)
	.addOutputSchema(proposalSchema)
	.exposeAsHttpEndpoint('POST', 'policy-wiki/fee-notices/index')
	.setBeforeGuardHooks({
		curator: async function (context) {
			requireActor(context, 'dana')
		},
	})
	.setCommandFunction(async function (context, payload) {
		return context.resources.policyWikiStore.markIndexed(payload.revision)
	})

export const bankingPolicyWikiService = builder.addCommandDefinition(
	getPolicyWikiPage.getDefinition(),
	ingestPolicySourceChange.getDefinition(),
	proposePolicyWikiEdit.getDefinition(),
	decidePolicyWikiEdit.getDefinition(),
	publishPolicyWikiEdit.getDefinition(),
	indexPolicyWikiEdit.getDefinition(),
)
