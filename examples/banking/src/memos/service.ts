import {
	HandledError,
	QueueWorkerBuilder,
	type QueueWorkerBuilderTypes,
	ServiceBuilder,
	type ServiceInfoType,
	StatusCode,
} from '@purista/core'
import { z } from 'zod'

import { type DecisionMemo, decisionMemoSchema, memoRequestKeySchema, memoRequestSchema } from './contracts.js'
import type { DecisionMemoStore } from './repository.js'

const emptyParameterSchema = z.object({})
const workerParameterSchema = z.object({ initiatorPrincipalId: z.literal('dana') })
const queueName = 'banking.createDecisionMemo' as const

const serviceInfo = {
	serviceName: 'bankingDecisionMemos',
	serviceVersion: '1',
	serviceDescription: 'Creates bounded, source-backed training decision memos for human review',
} as const satisfies ServiceInfoType

const builder = new ServiceBuilder(serviceInfo).defineResource<'memoStore', DecisionMemoStore>()

const requireMemoAuthor = (context: { message: { principalId?: string; tenantId?: string } }) => {
	if (context.message.tenantId !== 'tenant-north' || context.message.principalId !== 'dana') {
		throw new HandledError(StatusCode.Forbidden, 'Only synthetic policy operations may request these training memos')
	}
}

const createMemo = (request: z.infer<typeof memoRequestSchema>): Omit<DecisionMemo, 'memoId'> => {
	const citations = [
		{ sourceId: 'fee-policy-v1', summary: 'Fee notices require a human-approved policy change and customer review.' },
		{ sourceId: 'customer-notice-v1', summary: 'A notice proposal must name its source and unresolved risks.' },
	]
	const unsupported = request.topic === 'unsupported-training-claim'
	const claims = unsupported
		? [{ text: 'The bank may publish every fee change automatically.', sourceIds: ['invented-source'] }]
		: [{ text: 'A fee-notice proposal requires human review before publication.', sourceIds: ['fee-policy-v1'] }]
	const issues = unsupported
		? [
				{
					code: 'unsupported-claim' as const,
					message: 'The draft cites a source that is not in the approved evidence set.',
				},
			]
		: []
	return decisionMemoSchema.omit({ memoId: true }).parse({
		requestKey: request.requestKey,
		topic: request.topic,
		requestedBy: 'dana',
		plan: ['Collect approved sources', 'Draft a short proposal', 'Validate claims against citations'],
		citations,
		claims,
		issues,
		revisionsUsed: unsupported ? 2 : 0,
		status: unsupported ? 'unresolved' : 'ready-for-human-review',
	})
}

const memoQueue = builder
	.getQueueBuilder(queueName, 'Create one source-backed training decision memo')
	.addPayloadSchema(memoRequestSchema)
	.addParameterSchema(workerParameterSchema)
	.setLifecycleConfig({ maxAttempts: 2, visibilityTimeoutMs: 30_000 })

export const createDecisionMemoWorker = new QueueWorkerBuilder<
	QueueWorkerBuilderTypes<any, any, { memoStore: DecisionMemoStore }>
>(queueName, 'createDecisionMemo')
	.setMode('continuous')
	.setBeforeGuardHooks({
		memoAuthor: async function (_context, message) {
			const payload = message.payload as z.infer<typeof memoRequestSchema>
			const parameter = message.parameter as z.infer<typeof workerParameterSchema>
			if (parameter.initiatorPrincipalId !== 'dana' || payload.sourceSet !== 'fee-policy-training') {
				throw new HandledError(StatusCode.Forbidden, 'This memo job is outside the approved source and author scope')
			}
		},
	})
	.setHandler(async function (context) {
		const request = memoRequestSchema.parse(context.message.payload)
		const memo = context.resources.memoStore.save(createMemo(request))
		await context.job.complete({ memoId: memo.memoId, requestKey: memo.requestKey, status: memo.status })
		return { status: 'success' as const }
	})

export const requestDecisionMemo = builder
	.getCommandBuilder('requestDecisionMemo', 'Queue one authorized source-backed decision memo')
	.addPayloadSchema(memoRequestSchema)
	.addParameterSchema(emptyParameterSchema)
	.addOutputSchema(z.object({ jobId: z.string(), queueName: z.literal(queueName) }))
	.canEnqueue(queueName, memoRequestSchema, workerParameterSchema)
	.exposeAsHttpEndpoint('POST', 'decision-memos')
	.setBeforeGuardHooks({
		memoAuthor: async function (context) {
			requireMemoAuthor(context)
		},
	})
	.setCommandFunction(async function (context, payload) {
		const job = await context.queue.enqueue[queueName](
			payload,
			{ initiatorPrincipalId: 'dana' },
			{ idempotencyKey: payload.requestKey },
		)
		return { jobId: job.jobId, queueName }
	})

export const getDecisionMemo = builder
	.getCommandBuilder('getDecisionMemo', 'Read a memo only as the authorized training requester')
	.addPayloadSchema(z.undefined())
	.addParameterSchema(z.object({ requestKey: memoRequestKeySchema }))
	.addOutputSchema(decisionMemoSchema)
	.exposeAsHttpEndpoint('GET', 'decision-memos/:requestKey')
	.setBeforeGuardHooks({
		memoAuthor: async function (context) {
			requireMemoAuthor(context)
		},
	})
	.setCommandFunction(async function (context, _payload, parameter) {
		const memo = context.resources.memoStore.get(parameter.requestKey)
		if (!memo) throw new HandledError(StatusCode.NotFound, 'The decision memo is not ready')
		return memo
	})

export const bankingDecisionMemoService = builder
	.addQueueDefinition(memoQueue.getDefinition())
	.addQueueWorkerDefinition(createDecisionMemoWorker.getDefinition())
	.addCommandDefinition(requestDecisionMemo.getDefinition(), getDecisionMemo.getDefinition())
