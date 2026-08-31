import { z } from 'zod'

export const memoTopicSchema = z.enum(['fee-notice', 'unsupported-training-claim'])
export const memoSourceSetSchema = z.literal('fee-policy-training')
export const memoRequestKeySchema = z.string().regex(/^memo-[a-z0-9-]{3,64}$/)

export const memoRequestSchema = z.object({
	topic: memoTopicSchema,
	sourceSet: memoSourceSetSchema,
	requestKey: memoRequestKeySchema,
})

export const memoCitationSchema = z.object({ sourceId: z.string().min(1), summary: z.string().min(1) })
export const memoIssueSchema = z.object({
	code: z.enum(['unsupported-claim', 'incomplete-evidence']),
	message: z.string().min(1),
})

/** A reviewable artifact, never hidden model reasoning or a publishing decision. */
export const decisionMemoSchema = z.object({
	memoId: z.string().regex(/^memo-[1-9][0-9]*$/),
	requestKey: memoRequestKeySchema,
	topic: memoTopicSchema,
	requestedBy: z.literal('dana'),
	plan: z.array(z.string().min(1)).min(1).max(3),
	citations: z.array(memoCitationSchema).min(1),
	claims: z.array(z.object({ text: z.string().min(1), sourceIds: z.array(z.string().min(1)).min(1) })).min(1),
	issues: z.array(memoIssueSchema),
	revisionsUsed: z.number().int().min(0).max(2),
	status: z.enum(['ready-for-human-review', 'unresolved']),
})

export type DecisionMemo = z.infer<typeof decisionMemoSchema>
