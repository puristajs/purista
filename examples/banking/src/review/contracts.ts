import { z } from 'zod'

export const feeAccountIdSchema = z.enum(['account-a', 'account-c'])
export const feeProposalIdSchema = z.string().regex(/^fee-change-[1-9][0-9]*$/)
export const feeAmountSchema = z.number().int().min(0).max(10_000)
export const proposalVersionSchema = z.number().int().positive()

export const feeChangeStatusSchema = z.enum(['pending', 'approved', 'rejected', 'applied'])

export const proposedFeeChangeSchema = z.object({
	accountId: feeAccountIdSchema,
	proposedFeeMinor: feeAmountSchema,
	reviewerId: z.enum(['alice', 'bob', 'carol', 'dana', 'erin']),
	/** A human review deadline, supplied as an ISO-8601 UTC timestamp. */
	expiresAt: z.string().datetime(),
})

export const reviseFeeChangeSchema = proposedFeeChangeSchema.omit({ accountId: true }).extend({
	expectedVersion: proposalVersionSchema,
})

export const reviewDecisionSchema = z.object({
	expectedVersion: proposalVersionSchema,
	decision: z.enum(['approved', 'rejected']),
})

export const applyFeeChangeSchema = z.object({
	expectedVersion: proposalVersionSchema,
})

export const feeChangeProposalSchema = z.object({
	proposalId: feeProposalIdSchema,
	accountId: feeAccountIdSchema,
	proposedFeeMinor: feeAmountSchema,
	expectedCurrentFeeMinor: feeAmountSchema,
	proposedBy: z.enum(['alice', 'bob', 'carol', 'dana', 'erin']),
	reviewerId: z.enum(['alice', 'bob', 'carol', 'dana', 'erin']),
	expiresAt: z.string().datetime(),
	version: proposalVersionSchema,
	status: feeChangeStatusSchema,
	approvedVersion: proposalVersionSchema.optional(),
	decisionBy: z.enum(['alice', 'bob', 'carol', 'dana', 'erin']).optional(),
	appliedAt: z.string().datetime().optional(),
})

export type FeeAccountId = z.infer<typeof feeAccountIdSchema>
export type FeeChangeProposal = z.infer<typeof feeChangeProposalSchema>
