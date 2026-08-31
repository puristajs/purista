import {
	HandledError,
	QueueWorkerBuilder,
	type QueueWorkerBuilderTypes,
	ServiceBuilder,
	type ServiceInfoType,
	StatusCode,
} from '@purista/core'
import type { Sandbox } from '@purista/harness'
import { isExecCapableSession } from '@purista/harness'
import { z } from 'zod'

import type { BankActor, BankingRepository } from '../repository.js'
import {
	type statementAnalysisAccountIdSchema,
	statementAnalysisJobSchema,
	statementUploadSchema,
} from './contracts.js'
import type { StatementAnalysisStore } from './repository.js'

const emptyParameterSchema = z.object({})
const workerPayloadSchema = statementUploadSchema.extend({
	jobId: z.string().uuid(),
	requestedBy: z.enum(['alice', 'bob', 'carol', 'dana', 'erin']),
})
const serviceInfo = {
	serviceName: 'bankingStatementAnalysis',
	serviceVersion: '1',
	serviceDescription: 'Analyzes a validated synthetic statement in an application-owned isolated sandbox',
} as const satisfies ServiceInfoType

const builder = new ServiceBuilder(serviceInfo)
	.defineResource<'bankingRepository', BankingRepository>()
	.defineResource<'statementAnalysisStore', StatementAnalysisStore>()
	.defineResource<'statementSandbox', Sandbox>()

type Resources = {
	bankingRepository: BankingRepository
	statementAnalysisStore: StatementAnalysisStore
	statementSandbox: Sandbox
}

const actorSchema = z.enum(['alice', 'bob', 'carol', 'dana', 'erin'])
const requireActor = (value: unknown): BankActor => {
	const parsed = actorSchema.safeParse(value)
	if (!parsed.success) throw new HandledError(StatusCode.Unauthorized, 'A verified tutorial actor is required')
	return parsed.data
}
const requireRead = (
	resources: Resources,
	actor: BankActor,
	accountId: z.infer<typeof statementAnalysisAccountIdSchema>,
) => {
	if (!resources.bankingRepository.canRead(actor, accountId))
		throw new HandledError(StatusCode.Forbidden, 'You may not analyze this account statement')
}
const parseStatement = (content: string) => {
	const lines = content.trim().split('\n')
	if (lines[0] !== 'amountMinor')
		throw new HandledError(StatusCode.BadRequest, 'The synthetic CSV must start with amountMinor')
	const amounts = lines.slice(1).map(value => Number(value.trim()))
	if (amounts.some(value => !Number.isSafeInteger(value)))
		throw new HandledError(StatusCode.BadRequest, 'Every statement amount must be an integer')
	return amounts
}

const analysisQueue = builder
	.getQueueBuilder(
		'banking.analyzeStatement',
		'Analyze a validated synthetic account statement in a private Docker sandbox',
	)
	.addPayloadSchema(workerPayloadSchema)
	.addParameterSchema(z.object({ tenantId: z.literal('tenant-north') }))
	.setLifecycleConfig({ maxAttempts: 1, visibilityTimeoutMs: 30_000 })

export const submitStatementAnalysis = builder
	.getCommandBuilder('submitStatementAnalysis', 'Queue one authorized synthetic CSV statement for isolated analysis')
	.addPayloadSchema(statementUploadSchema)
	.addParameterSchema(emptyParameterSchema)
	.addOutputSchema(statementAnalysisJobSchema)
	.canEnqueue('banking.analyzeStatement', workerPayloadSchema, z.object({ tenantId: z.literal('tenant-north') }))
	.exposeAsHttpEndpoint('POST', 'statement-analyses')
	.setBeforeGuardHooks({
		accountRead: async function (context, payload) {
			const actor = requireActor(context.message.principalId)
			requireRead(context.resources as Resources, actor, payload.accountId)
			parseStatement(payload.content)
		},
	})
	.setCommandFunction(async function (context, payload) {
		const actor = requireActor(context.message.principalId)
		const store = (context.resources as Resources).statementAnalysisStore
		const job = store.create({ accountId: payload.accountId, requestedBy: actor, requestKey: payload.requestKey })
		await context.queue.enqueue['banking.analyzeStatement'](
			{ ...payload, jobId: job.jobId, requestedBy: actor },
			{ tenantId: 'tenant-north' },
			{ idempotencyKey: `statement-analysis:${actor}:${payload.requestKey}` },
		)
		return job
	})

export const getStatementAnalysis = builder
	.getCommandBuilder('getStatementAnalysis', 'Read the status or approved report for one authorized analysis job')
	.addPayloadSchema(z.undefined())
	.addParameterSchema(z.object({ jobId: z.string().uuid() }))
	.addOutputSchema(statementAnalysisJobSchema)
	.exposeAsHttpEndpoint('GET', 'statement-analyses/:jobId')
	.setBeforeGuardHooks({
		jobOwner: async function (context, _payload, parameter) {
			const resources = context.resources as Resources
			const job = resources.statementAnalysisStore.get(parameter.jobId)
			if (!job) throw new HandledError(StatusCode.NotFound, 'The statement analysis job does not exist')
			requireRead(resources, requireActor(context.message.principalId), job.accountId)
		},
	})
	.setCommandFunction(async function (context, _payload, parameter) {
		const job = (context.resources as Resources).statementAnalysisStore.get(parameter.jobId)
		if (!job) throw new HandledError(StatusCode.NotFound, 'The statement analysis job does not exist')
		return job
	})

export const analyzeStatementWorker = new QueueWorkerBuilder<QueueWorkerBuilderTypes<any, any, Resources>>(
	'banking.analyzeStatement',
	'analyzeStatementInSandbox',
)
	.setMode('continuous')
	.setHandler(async function (context) {
		const payload = context.message.payload as z.infer<typeof workerPayloadSchema>
		const resources = context.resources
		requireRead(resources, payload.requestedBy, payload.accountId)
		const amounts = parseStatement(payload.content)
		resources.statementAnalysisStore.start(payload.jobId)
		const owner = {
			namespace: 'example-bank.statement-analysis',
			id: payload.jobId,
			instanceId: '01JQ7Z9Q69STZ33MGH6V5ASR7J',
			identity: { tenantId: 'tenant-north', principalId: payload.requestedBy },
		} as const
		const scope = { owner, partition: { kind: 'shared' as const }, lifetime: 'run' as const, runId: payload.jobId }
		try {
			await resources.statementSandbox.registerOwner({ owner, mode: 'create', signal: context.signal })
			const opened = await resources.statementSandbox.open({
				scope,
				mode: 'create',
				identity: owner.identity,
				signal: context.signal,
			})
			try {
				if (!isExecCapableSession(opened.session)) throw new Error('The configured sandbox cannot execute the analysis')
				await opened.session.write('/workspace/statement.csv', payload.content)
				const execution = await opened.session.exec(
					'awk \'NR > 1 { count += 1; total += $1 } END { printf "%d,%d\\n", count, total }\' /workspace/statement.csv > /workspace/statement-analysis.csv',
					{ timeoutMs: 5_000, signal: context.signal },
				)
				if (execution.exitCode !== 0) throw new Error('The sandbox analysis command failed')
				const report = await opened.session.readText('/workspace/statement-analysis.csv')
				const [count, total] = report.trim().split(',').map(Number)
				if (!Number.isSafeInteger(count) || !Number.isSafeInteger(total) || count !== amounts.length)
					throw new Error('The sandbox returned an invalid report')
				resources.statementAnalysisStore.complete(payload.jobId, {
					transactionCount: count,
					totalMinor: total,
					artifactName: 'statement-analysis.json',
				})
				await context.job.complete({ jobId: payload.jobId })
				return { status: 'success' as const }
			} finally {
				await opened.session.close()
				await resources.statementSandbox.terminate({ scope, reason: 'run_disposed', signal: context.signal })
			}
		} catch (error) {
			resources.statementAnalysisStore.fail(
				payload.jobId,
				error instanceof HandledError ? 'invalid-statement' : 'analysis-failed',
			)
			throw error
		}
	})

export const bankingStatementAnalysisService = builder
	.addQueueDefinition(analysisQueue.getDefinition())
	.addQueueWorkerDefinition(analyzeStatementWorker.getDefinition())
	.addCommandDefinition(submitStatementAnalysis.getDefinition(), getStatementAnalysis.getDefinition())
