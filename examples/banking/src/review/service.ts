import { HandledError, ServiceBuilder, type ServiceInfoType, StatusCode } from '@purista/core'
import { z } from 'zod'

import type { BankActor, BankingRepository } from '../repository.js'
import {
	applyFeeChangeSchema,
	feeChangeProposalSchema,
	feeProposalIdSchema,
	proposedFeeChangeSchema,
	reviewDecisionSchema,
	reviseFeeChangeSchema,
} from './contracts.js'
import type { FeeChangeReviewStore } from './repository.js'

const emptyParameterSchema = z.object({})
const proposalParameterSchema = z.object({ proposalId: feeProposalIdSchema })
const actorSchema = z.enum(['alice', 'bob', 'carol', 'dana', 'erin'])

const serviceInfo = {
	serviceName: 'bankingFeeChangeReview',
	serviceVersion: '1',
	serviceDescription: 'A human-review checkpoint for synthetic account fee changes',
} as const satisfies ServiceInfoType

const builder = new ServiceBuilder(serviceInfo)
	.defineResource<'bankingRepository', BankingRepository>()
	.defineResource<'feeChangeReviewStore', FeeChangeReviewStore>()

type ReviewResources = {
	bankingRepository: BankingRepository
	feeChangeReviewStore: FeeChangeReviewStore
}

type ReviewContext = {
	message: { principalId?: string }
	resources: ReviewResources
}

const requireActor = (context: ReviewContext): BankActor => {
	const result = actorSchema.safeParse(context.message.principalId)
	if (!result.success) throw new HandledError(StatusCode.Unauthorized, 'A verified tutorial actor is required')
	return result.data
}

/** Dana is the synthetic operations proposer for this teaching account. */
const requireFeeChangeProposer = (context: ReviewContext, accountId: 'account-a' | 'account-c') => {
	const actor = requireActor(context)
	if (actor !== 'dana' || accountId !== 'account-a') {
		throw new HandledError(StatusCode.Forbidden, 'Only synthetic operations may propose account-a fee changes')
	}
	return actor
}

const requireAssignedDistinctReviewer = (
	context: ReviewContext,
	proposal: { accountId: 'account-a' | 'account-c'; proposedBy: BankActor; reviewerId: BankActor },
) => {
	const actor = requireActor(context)
	if (actor !== proposal.reviewerId) {
		throw new HandledError(StatusCode.Forbidden, 'This fee change is assigned to a different reviewer')
	}
	if (actor === proposal.proposedBy) {
		throw new HandledError(StatusCode.Forbidden, 'A proposer cannot approve their own fee change')
	}
	if (!context.resources.bankingRepository.canReviewCase(actor, proposal.accountId)) {
		throw new HandledError(StatusCode.Forbidden, 'The reviewer is not assigned to this account')
	}
	return actor
}

export const proposeFeeChange = builder
	.getCommandBuilder('proposeFeeChange', 'Proposes a synthetic account fee change for one assigned human reviewer')
	.addPayloadSchema(proposedFeeChangeSchema)
	.addParameterSchema(emptyParameterSchema)
	.addOutputSchema(feeChangeProposalSchema)
	.exposeAsHttpEndpoint('POST', 'fee-changes')
	.setBeforeGuardHooks({
		proposerAuthority: async function (context, payload) {
			const proposerId = requireFeeChangeProposer(context, payload.accountId)
			if (payload.reviewerId === proposerId) {
				throw new HandledError(StatusCode.Forbidden, 'A proposer cannot be the assigned reviewer')
			}
			if (!context.resources.bankingRepository.canReviewCase(payload.reviewerId, payload.accountId)) {
				throw new HandledError(StatusCode.Forbidden, 'The selected reviewer is not assigned to this account')
			}
		},
	})
	.setCommandFunction(async function (context, payload) {
		return context.resources.feeChangeReviewStore.propose({
			...payload,
			proposerId: requireFeeChangeProposer(context, payload.accountId),
		})
	})

export const reviseFeeChange = builder
	.getCommandBuilder('reviseFeeChange', 'Changes a proposal and invalidates any earlier review decision')
	.addPayloadSchema(reviseFeeChangeSchema)
	.addParameterSchema(proposalParameterSchema)
	.addOutputSchema(feeChangeProposalSchema)
	.exposeAsHttpEndpoint('PUT', 'fee-changes/:proposalId')
	.setBeforeGuardHooks({
		proposerAndReviewerAuthority: async function (context, payload, parameter) {
			const proposal = context.resources.feeChangeReviewStore.get(parameter.proposalId)
			if (!proposal) throw new HandledError(StatusCode.NotFound, 'The fee change proposal does not exist')
			const proposerId = requireFeeChangeProposer(context, proposal.accountId)
			if (proposal.proposedBy !== proposerId) {
				throw new HandledError(StatusCode.Forbidden, 'Only the original proposer may revise this fee change')
			}
			if (payload.reviewerId === proposerId) {
				throw new HandledError(StatusCode.Forbidden, 'A proposer cannot be the assigned reviewer')
			}
			if (!context.resources.bankingRepository.canReviewCase(payload.reviewerId, proposal.accountId)) {
				throw new HandledError(StatusCode.Forbidden, 'The selected reviewer is not assigned to this account')
			}
		},
	})
	.setCommandFunction(async function (context, payload, parameter) {
		const proposal = context.resources.feeChangeReviewStore.get(parameter.proposalId)
		if (!proposal) throw new HandledError(StatusCode.NotFound, 'The fee change proposal does not exist')
		return context.resources.feeChangeReviewStore.revise({
			...payload,
			proposalId: parameter.proposalId,
			proposerId: requireFeeChangeProposer(context, proposal.accountId),
		})
	})

export const decideFeeChange = builder
	.getCommandBuilder(
		'decideFeeChange',
		'Records the assigned reviewer approval or rejection for one exact proposal version',
	)
	.addPayloadSchema(reviewDecisionSchema)
	.addParameterSchema(proposalParameterSchema)
	.addOutputSchema(feeChangeProposalSchema)
	.exposeAsHttpEndpoint('POST', 'fee-changes/:proposalId/decisions')
	.setBeforeGuardHooks({
		assignedReviewer: async function (context, _payload, parameter) {
			const proposal = context.resources.feeChangeReviewStore.get(parameter.proposalId)
			if (!proposal) throw new HandledError(StatusCode.NotFound, 'The fee change proposal does not exist')
			requireAssignedDistinctReviewer(context, proposal)
		},
	})
	.setCommandFunction(async function (context, payload, parameter) {
		const proposal = context.resources.feeChangeReviewStore.get(parameter.proposalId)
		if (!proposal) throw new HandledError(StatusCode.NotFound, 'The fee change proposal does not exist')
		return context.resources.feeChangeReviewStore.decide({
			...payload,
			proposalId: parameter.proposalId,
			reviewerId: requireAssignedDistinctReviewer(context, proposal),
		})
	})

export const applyApprovedFeeChange = builder
	.getCommandBuilder('applyApprovedFeeChange', 'Applies one current approved fee change exactly once')
	.addPayloadSchema(applyFeeChangeSchema)
	.addParameterSchema(proposalParameterSchema)
	.addOutputSchema(feeChangeProposalSchema)
	.exposeAsHttpEndpoint('POST', 'fee-changes/:proposalId/apply')
	.setBeforeGuardHooks({
		originalProposer: async function (context, _payload, parameter) {
			const proposal = context.resources.feeChangeReviewStore.get(parameter.proposalId)
			if (!proposal) throw new HandledError(StatusCode.NotFound, 'The fee change proposal does not exist')
			if (requireActor(context) !== proposal.proposedBy) {
				throw new HandledError(StatusCode.Forbidden, 'Only the original proposer may apply this approved fee change')
			}
		},
	})
	.setCommandFunction(async function (context, payload, parameter) {
		const proposal = context.resources.feeChangeReviewStore.get(parameter.proposalId)
		if (!proposal) throw new HandledError(StatusCode.NotFound, 'The fee change proposal does not exist')
		return context.resources.feeChangeReviewStore.apply({
			...payload,
			proposalId: parameter.proposalId,
			proposerId: requireActor(context),
		})
	})

export const bankingFeeChangeReviewService = builder.addCommandDefinition(
	proposeFeeChange.getDefinition(),
	reviseFeeChange.getDefinition(),
	decideFeeChange.getDefinition(),
	applyApprovedFeeChange.getDefinition(),
)
