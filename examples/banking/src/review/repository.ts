import { HandledError, StatusCode } from '@purista/core'

import type { BankActor } from '../repository.js'
import type { FeeAccountId, FeeChangeProposal } from './contracts.js'

type CreateFeeChangeProposal = {
	accountId: FeeAccountId
	proposedFeeMinor: number
	proposerId: BankActor
	reviewerId: BankActor
	expiresAt: string
}

type ReviseFeeChangeProposal = Omit<CreateFeeChangeProposal, 'accountId' | 'proposerId'> & {
	proposalId: string
	expectedVersion: number
	proposerId: BankActor
}

type FeeReviewDecision = {
	proposalId: string
	expectedVersion: number
	reviewerId: BankActor
	decision: 'approved' | 'rejected'
}

type ApplyFeeChange = {
	proposalId: string
	expectedVersion: number
	proposerId: BankActor
}

/**
 * Application-owned state for the Chapter 16 synthetic fee-change checkpoint.
 *
 * The in-memory implementation is deliberately small for a runnable tutorial.
 * A production implementation must make `apply` one database transaction with
 * a conditional version/state update around the real fee write.
 */
export class FeeChangeReviewStore {
	private readonly proposals = new Map<string, FeeChangeProposal>()
	private readonly currentFees: Record<FeeAccountId, number> = {
		'account-a': 35,
		'account-c': 20,
	}
	private nextProposalNumber = 1

	constructor(private readonly now: () => Date = () => new Date()) {}

	getCurrentFee(accountId: FeeAccountId) {
		return this.currentFees[accountId]
	}

	get(proposalId: string) {
		return this.proposals.get(proposalId)
	}

	propose(input: CreateFeeChangeProposal) {
		this.assertFutureExpiry(input.expiresAt)
		if (input.proposerId === input.reviewerId) {
			throw new HandledError(StatusCode.Forbidden, 'A proposer cannot be assigned as their own reviewer')
		}
		const proposal: FeeChangeProposal = {
			proposalId: `fee-change-${this.nextProposalNumber++}`,
			accountId: input.accountId,
			proposedFeeMinor: input.proposedFeeMinor,
			expectedCurrentFeeMinor: this.currentFees[input.accountId],
			proposedBy: input.proposerId,
			reviewerId: input.reviewerId,
			expiresAt: input.expiresAt,
			version: 1,
			status: 'pending',
		}
		this.proposals.set(proposal.proposalId, proposal)
		return proposal
	}

	/** A material change invalidates any earlier decision and requires a fresh review. */
	revise(input: ReviseFeeChangeProposal) {
		const current = this.requireProposal(input.proposalId)
		this.assertExpectedVersion(current, input.expectedVersion)
		if (current.proposedBy !== input.proposerId) {
			throw new HandledError(StatusCode.Forbidden, 'Only the original proposer may revise this fee change')
		}
		if (current.status === 'applied') {
			throw new HandledError(StatusCode.Conflict, 'An applied fee change cannot be revised')
		}
		if (input.proposerId === input.reviewerId) {
			throw new HandledError(StatusCode.Forbidden, 'A proposer cannot be assigned as their own reviewer')
		}
		this.assertFutureExpiry(input.expiresAt)

		const next: FeeChangeProposal = {
			...current,
			proposedFeeMinor: input.proposedFeeMinor,
			reviewerId: input.reviewerId,
			expiresAt: input.expiresAt,
			expectedCurrentFeeMinor: this.currentFees[current.accountId],
			version: current.version + 1,
			status: 'pending',
		}
		this.proposals.set(next.proposalId, next)
		return next
	}

	decide(input: FeeReviewDecision) {
		const current = this.requireProposal(input.proposalId)
		this.assertExpectedVersion(current, input.expectedVersion)
		if (current.status !== 'pending') {
			throw new HandledError(StatusCode.Conflict, 'This fee change already has a review decision')
		}
		if (current.proposedBy === input.reviewerId) {
			throw new HandledError(StatusCode.Forbidden, 'A proposer cannot approve their own fee change')
		}
		if (current.reviewerId !== input.reviewerId) {
			throw new HandledError(StatusCode.Forbidden, 'This fee change is assigned to a different reviewer')
		}
		this.assertNotExpired(current)
		const next: FeeChangeProposal = {
			...current,
			status: input.decision,
			approvedVersion: input.decision === 'approved' ? current.version : undefined,
			decisionBy: input.reviewerId,
		}
		this.proposals.set(next.proposalId, next)
		return next
	}

	/**
	 * Claims and applies the synthetic fee in one state transition. That makes a
	 * duplicate command harmless: only the first matching approval can change it.
	 */
	apply(input: ApplyFeeChange) {
		const current = this.requireProposal(input.proposalId)
		this.assertExpectedVersion(current, input.expectedVersion)
		if (current.proposedBy !== input.proposerId) {
			throw new HandledError(StatusCode.Forbidden, 'Only the original proposer may apply this approved fee change')
		}
		if (current.status !== 'approved' || current.approvedVersion !== current.version) {
			throw new HandledError(StatusCode.Conflict, 'The current fee change is not approved for this exact version')
		}
		this.assertNotExpired(current)
		if (this.currentFees[current.accountId] !== current.expectedCurrentFeeMinor) {
			throw new HandledError(StatusCode.Conflict, 'The account fee changed after this proposal was reviewed')
		}

		this.currentFees[current.accountId] = current.proposedFeeMinor
		const next: FeeChangeProposal = {
			...current,
			status: 'applied',
			appliedAt: this.now().toISOString(),
		}
		this.proposals.set(next.proposalId, next)
		return next
	}

	private requireProposal(proposalId: string) {
		const proposal = this.proposals.get(proposalId)
		if (!proposal) throw new HandledError(StatusCode.NotFound, 'The fee change proposal does not exist')
		return proposal
	}

	private assertExpectedVersion(proposal: FeeChangeProposal, expectedVersion: number) {
		if (proposal.version !== expectedVersion) {
			throw new HandledError(StatusCode.Conflict, 'The fee change proposal has changed; reload it before continuing')
		}
	}

	private assertFutureExpiry(expiresAt: string) {
		if (Date.parse(expiresAt) <= this.now().getTime()) {
			throw new HandledError(StatusCode.Gone, 'The fee change review deadline must be in the future')
		}
	}

	private assertNotExpired(proposal: FeeChangeProposal) {
		if (Date.parse(proposal.expiresAt) <= this.now().getTime()) {
			throw new HandledError(StatusCode.Gone, 'This fee change proposal has expired')
		}
	}
}
