import { randomUUID } from 'node:crypto'
import { extendApi, HandledError, StatusCode } from '@purista/core'
import { z } from 'zod'
import {
	buildTaskArtifactId,
	PURISTA_AI_PLAN_ARTIFACT_ID,
	PURISTA_AI_PLAN_STATUS_ARTIFACT_ID,
	toPlanArtifactPayload,
	toPlanStatusArtifactPayload,
	toTaskArtifactPayload,
} from '../protocol/taskArtifacts.js'
import type { JsonValue } from '../protocol/types.js'
import type { AgentManifest } from '../types/AgentManifest.js'
import type { AgentInvocationIdentity } from './invocationIdentity.js'
import { resolveConversationId } from './invocationIdentity.js'

export type StateStoreHelpers = {
	getState: (...stateNames: string[]) => Promise<Record<string, unknown>>
	setState: (stateName: string, value: unknown) => Promise<void>
	removeState: (stateName: string) => Promise<void>
}

export type RunStateProtocolEmitter = {
	emitArtifact(input: {
		artifactId: string
		content: JsonValue
		mimeType?: string
		sequence?: number
		total?: number
		final?: boolean
	}): void
}

export type RunStateContext = {
	states: StateStoreHelpers
	protocol: RunStateProtocolEmitter
	manifest: AgentManifest
	payload: unknown
	identity?: AgentInvocationIdentity
	message: {
		id: string
		correlationId?: string
		traceId?: string
		principalId?: string
		tenantId?: string
	}
}

export const agentRunTaskStatusSchema = z.enum([
	'pending',
	'running',
	'blocked',
	'waiting-approval',
	'completed',
	'failed',
	'cancelled',
])
export type AgentRunTaskStatus = z.infer<typeof agentRunTaskStatusSchema>

export const agentRunStatusSchema = z.enum([
	'queued',
	'idle',
	'planning',
	'running',
	'recovering',
	'retrying',
	'summarizing',
	'completed',
	'failed',
	'cancelled',
])
export type AgentRunStatus = z.infer<typeof agentRunStatusSchema>

export const agentRunTaskKindSchema = z.enum([
	'tool',
	'agent',
	'model',
	'reasoning',
	'checkpoint',
	'approval',
	'custom',
])
export type AgentRunTaskKind = z.infer<typeof agentRunTaskKindSchema>

export const agentRunTaskExecutorSchema = extendApi(
	z.discriminatedUnion('type', [
		z.object({
			type: z.literal('local'),
			handler: z.string().min(1),
		}),
		z.object({
			type: z.literal('tool'),
			serviceName: z.string().min(1),
			serviceVersion: z.string().min(1),
			commandName: z.string().min(1),
		}),
		z.object({
			type: z.literal('agent'),
			agentName: z.string().min(1),
			serviceVersion: z.string().min(1),
			forwardToCurrentStream: z
				.union([
					z.boolean(),
					z.object({
						assistant: z.boolean().optional(),
						reasoning: z.boolean().optional(),
						artifacts: z
							.union([
								z.boolean(),
								z.object({
									workflow: z.boolean().optional(),
									output: z.boolean().optional(),
									sources: z.boolean().optional(),
									files: z.boolean().optional(),
									generic: z.boolean().optional(),
								}),
							])
							.optional(),
						errors: z.boolean().optional(),
						toolEvents: z.boolean().optional(),
					}),
				])
				.optional(),
		}),
		z.object({
			type: z.literal('approval'),
			checkpoint: z.string().min(1),
		}),
	]),
	{ title: 'Agent run task executor' },
)
export type AgentRunTaskExecutor = z.infer<typeof agentRunTaskExecutorSchema>

export const agentRunTaskHandoffSchema = extendApi(
	z
		.object({
			targetType: z.enum(['tool', 'agent']).optional(),
			targetName: z.string().min(1),
			targetVersion: z.string().min(1).optional(),
			description: z.string().optional(),
		})
		.optional(),
	{ title: 'Agent run task handoff' },
)
export type AgentRunTaskHandoff = z.infer<typeof agentRunTaskHandoffSchema>

export const agentRunTaskApprovalSchema = extendApi(
	z
		.object({
			required: z.boolean().default(false),
			checkpoint: z.string().min(1),
			timeoutMs: z.number().int().positive().optional(),
			onExpiry: z.enum(['fail', 'return-expired']).optional(),
		})
		.optional(),
	{ title: 'Agent run task approval config' },
)
export type AgentRunTaskApproval = z.infer<typeof agentRunTaskApprovalSchema>

export const agentRunTaskRetryPolicySchema = extendApi(
	z
		.object({
			maxAttempts: z.number().int().positive().optional(),
			backoffMs: z.number().int().nonnegative().optional(),
		})
		.optional(),
	{ title: 'Agent run task retry policy' },
)
export type AgentRunTaskRetryPolicy = z.infer<typeof agentRunTaskRetryPolicySchema>

export const agentRunTaskSchema = extendApi(
	z.object({
		id: z.string().min(1),
		title: z.string().min(1),
		status: agentRunTaskStatusSchema,
		order: z.number().int().nonnegative(),
		kind: agentRunTaskKindSchema.optional(),
		instruction: z.string().optional(),
		delegate: z.string().optional(),
		detail: z.string().optional(),
		summary: z.string().optional(),
		input: z.unknown().optional(),
		output: z.unknown().optional(),
		executor: agentRunTaskExecutorSchema.optional(),
		handoff: agentRunTaskHandoffSchema,
		dependsOn: z.array(z.string().min(1)).optional(),
		approval: agentRunTaskApprovalSchema,
		retryPolicy: agentRunTaskRetryPolicySchema,
		timeoutMs: z.number().int().positive().optional(),
		startedAt: z.string().optional(),
		updatedAt: z.string().optional(),
		completedAt: z.string().optional(),
	}),
	{ title: 'Agent run task' },
)
export type AgentRunTask = z.infer<typeof agentRunTaskSchema>

export const agentRunLockSchema = extendApi(
	z.object({
		lockId: z.string().min(1),
		key: z.string().min(1),
		runId: z.string().min(1).optional(),
		scopeKey: z.string().min(1),
		acquiredAt: z.string().min(1),
		heartbeatAt: z.string().min(1),
		expiresAt: z.string().min(1),
	}),
	{ title: 'Agent run lock' },
)
export type AgentRunLock = z.infer<typeof agentRunLockSchema>

export const agentRunCheckpointSchema = extendApi(
	z.object({
		name: z.string().min(1),
		completed: z.boolean().default(false),
		value: z.unknown().optional(),
		updatedAt: z.string().min(1),
	}),
	{ title: 'Agent run checkpoint' },
)
export type AgentRunCheckpoint = z.infer<typeof agentRunCheckpointSchema>

export const agentRunOwnerSchema = extendApi(
	z.object({
		workerId: z.string().min(1),
		queueName: z.string().min(1).optional(),
		leaseId: z.string().min(1).optional(),
		attachedAt: z.string().min(1),
	}),
	{ title: 'Agent run owner' },
)
export type AgentRunOwner = z.infer<typeof agentRunOwnerSchema>

export const agentRunRecoverySchema = extendApi(
	z.object({
		status: z.enum(['fresh', 'resumed', 'retrying', 'recovered-stale']),
		reason: z.string().optional(),
		checkpoint: z.string().optional(),
		resumedAt: z.string().optional(),
	}),
	{ title: 'Agent run recovery' },
)
export type AgentRunRecovery = z.infer<typeof agentRunRecoverySchema>

export const agentRunRetentionSchema = extendApi(
	z.object({
		transientStateTtlMs: z.number().int().positive().optional(),
		keepFinalRunRecord: z.boolean().optional(),
		finalRunRecordTtlMs: z.number().int().positive().optional(),
	}),
	{ title: 'Agent run retention' },
)
export type AgentRunRetention = z.infer<typeof agentRunRetentionSchema>

export const agentRunErrorSchema = extendApi(
	z.object({
		code: z.string().min(1),
		message: z.string().min(1),
		handled: z.boolean().default(false),
	}),
	{ title: 'Agent run error' },
)
export type AgentRunError = z.infer<typeof agentRunErrorSchema>

export const agentRunStateScopeSchema = extendApi(
	z.object({
		tenantId: z.string().optional(),
		principalId: z.string().optional(),
		conversationId: z.string().optional(),
		agentName: z.string().min(1),
		serviceVersion: z.string().min(1),
		extra: z.record(z.string(), z.string()).default({}),
	}),
	{ title: 'Agent run scope' },
)
export type AgentRunStateScope = z.infer<typeof agentRunStateScopeSchema>

export const agentRunStateSchema = extendApi(
	z.object({
		runId: z.string().min(1),
		agentName: z.string().min(1),
		serviceVersion: z.string().min(1),
		scope: agentRunStateScopeSchema,
		status: agentRunStatusSchema,
		phase: z.string().min(1),
		title: z.string().min(1),
		attempt: z.number().int().positive().default(1),
		tasks: z.array(agentRunTaskSchema).default([]),
		checkpoints: z.record(z.string(), agentRunCheckpointSchema).default({}),
		summary: z.string().optional(),
		finalMessage: z.string().optional(),
		owner: agentRunOwnerSchema.optional(),
		recovery: agentRunRecoverySchema.optional(),
		retention: agentRunRetentionSchema.optional(),
		error: agentRunErrorSchema.optional(),
		lock: agentRunLockSchema.optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
		startedAt: z.string().min(1),
		updatedAt: z.string().min(1),
		heartbeatAt: z.string().optional(),
		completedAt: z.string().optional(),
	}),
	{ title: 'Agent run state' },
)
export type AgentRunState = z.infer<typeof agentRunStateSchema>

export type AgentRunTaskInput = {
	id: string
	title: string
	status?: AgentRunTaskStatus
	order?: number
	kind?: AgentRunTaskKind
	instruction?: string
	delegate?: string
	detail?: string
	summary?: string
	input?: unknown
	output?: unknown
	executor?: AgentRunTaskExecutor
	handoff?: AgentRunTaskHandoff
	dependsOn?: string[]
	approval?: AgentRunTaskApproval
	retryPolicy?: AgentRunTaskRetryPolicy
	timeoutMs?: number
}

export type AgentRunStartInput = {
	runId?: string
	title: string
	phase?: string
	status?: Exclude<AgentRunStatus, 'completed' | 'failed' | 'cancelled'>
	metadata?: Record<string, unknown>
	scope?: Record<string, string>
	lock?: boolean | AgentRunLockInput
	owner?: AgentRunOwner
	retention?: AgentRunRetention
	recovery?: AgentRunRecovery
}

export type AgentRunUpdateInput = {
	phase?: string
	status?: AgentRunStatus
	summary?: string
	finalMessage?: string
	metadata?: Record<string, unknown>
	owner?: AgentRunOwner
	recovery?: AgentRunRecovery
	retention?: AgentRunRetention
	error?: AgentRunError
	attempt?: number
	heartbeat?: boolean
}

export type AgentRunGetInput = {
	runId?: string
	scope?: Record<string, string>
}

export type AgentRunLockInput = {
	key?: string
	ttlMs?: number
	scope?: Record<string, string>
	runId?: string
}

export type AgentRunLockHandle = {
	lock: AgentRunLock
	heartbeat(ttlMs?: number): Promise<AgentRunLock>
	release(): Promise<void>
}

export type AgentRunHandle = {
	readonly state: AgentRunState
	emit(): Promise<AgentRunState>
	update(patch: AgentRunUpdateInput): Promise<AgentRunState>
	phase(phase: string, status?: AgentRunStatus): Promise<AgentRunState>
	summary(summary: string): Promise<AgentRunState>
	setFinalMessage(message: string): Promise<AgentRunState>
	updateTask(taskId: string, patch: Partial<Omit<AgentRunTask, 'id' | 'order' | 'title'>>): Promise<AgentRunState>
	replaceTasks(tasks: AgentRunTaskInput[]): Promise<AgentRunState>
	plan(tasks: AgentRunTaskInput[]): Promise<AgentRunState>
	startTask(taskId: string, detail?: string): Promise<AgentRunState>
	completeTask(taskId: string, detail?: string): Promise<AgentRunState>
	failTask(taskId: string, detail?: string): Promise<AgentRunState>
	checkpoint<T = unknown>(name: string, value?: T, options?: { completed?: boolean }): Promise<AgentRunState>
	getCheckpoint<T = unknown>(name: string): Promise<T | undefined>
	step<T>(id: string, fn: () => Promise<T>, options?: { detail?: string; checkpoint?: string }): Promise<T>
	task<T>(taskId: string, fn: () => Promise<T>, detail?: string): Promise<T>
	finish(input: {
		summary?: string
		status: Extract<AgentRunStatus, 'completed' | 'failed' | 'cancelled'>
		finalMessage?: string
		error?: AgentRunError
	}): Promise<AgentRunState>
	finishSuccess(summary?: string): Promise<AgentRunState>
	finishFailure(summary?: string, error?: AgentRunError): Promise<AgentRunState>
	release(): Promise<void>
}

export type AgentRunStateHelpers = {
	start(input: AgentRunStartInput): Promise<AgentRunHandle>
	get(input?: AgentRunGetInput): Promise<AgentRunState | undefined>
	update(input: AgentRunUpdateInput & AgentRunGetInput): Promise<AgentRunState>
	updateTask(
		taskId: string,
		patch: Partial<Omit<AgentRunTask, 'id' | 'order' | 'title'>>,
		input?: AgentRunGetInput,
	): Promise<AgentRunState>
	replaceTasks(tasks: AgentRunTaskInput[], input?: AgentRunGetInput): Promise<AgentRunState>
	startTask(taskId: string, input?: AgentRunGetInput & { detail?: string }): Promise<AgentRunState>
	completeTask(taskId: string, input?: AgentRunGetInput & { detail?: string }): Promise<AgentRunState>
	failTask(taskId: string, input?: AgentRunGetInput & { detail?: string }): Promise<AgentRunState>
	checkpoint<T = unknown>(
		name: string,
		value?: T,
		input?: AgentRunGetInput & { completed?: boolean },
	): Promise<AgentRunState>
	getCheckpoint<T = unknown>(name: string, input?: AgentRunGetInput): Promise<T | undefined>
	finish(
		input: AgentRunGetInput & {
			summary?: string
			status: Extract<AgentRunStatus, 'completed' | 'failed' | 'cancelled'>
			finalMessage?: string
			error?: AgentRunError
		},
	): Promise<AgentRunState>
	emit(input?: AgentRunGetInput): Promise<AgentRunState | undefined>
	lock(input?: AgentRunLockInput): Promise<AgentRunLockHandle>
}

const RUN_STATE_ARTIFACT_ID = 'run-state'
const DEFAULT_LOCK_TTL_MS = 10 * 60 * 1000
const FINAL_STATUSES: AgentRunStatus[] = ['completed', 'failed', 'cancelled']

const encodeKey = (value: string) =>
	value
		.trim()
		.replaceAll(/[^a-zA-Z0-9._:-]+/g, '-')
		.replaceAll(/-+/g, '-')
		.replace(/^-|-$/g, '') || 'value'

const nowIso = () => new Date().toISOString()

const derivePayloadScope = (context: RunStateContext) => {
	const keys = context.manifest.executionPolicy?.scopeFromPayload ?? []
	if (!context.payload || typeof context.payload !== 'object' || keys.length === 0) {
		return {}
	}
	return Object.fromEntries(
		keys
			.map(key => {
				const value = (context.payload as Record<string, unknown>)[key]
				return typeof value === 'string' && value.trim().length > 0 ? [key, value.trim()] : undefined
			})
			.filter((entry): entry is [string, string] => Array.isArray(entry)),
	)
}

const defaultScope = (context: RunStateContext, scope?: Record<string, string>): AgentRunStateScope => ({
	tenantId: context.identity?.tenantId ?? context.message.tenantId,
	principalId: context.identity?.principalId ?? context.message.principalId,
	conversationId:
		context.identity?.conversationId ??
		resolveConversationId({
			payload: context.payload,
			transportMessageId: context.message.id,
		}),
	agentName: context.identity?.agentName ?? context.manifest.agentName,
	serviceVersion: context.identity?.serviceVersion ?? context.manifest.serviceVersion,
	extra: Object.fromEntries(
		Object.entries({
			...derivePayloadScope(context),
			...(scope ?? {}),
		})
			.filter(([, value]) => typeof value === 'string' && value.trim().length > 0)
			.map(([key, value]) => [key, value.trim()]),
	),
})

const scopeKey = (scope: AgentRunStateScope) => {
	const fixed = [
		`agent=${encodeKey(scope.agentName)}`,
		`version=${encodeKey(scope.serviceVersion)}`,
		`tenant=${encodeKey(scope.tenantId ?? 'global')}`,
		`principal=${encodeKey(scope.principalId ?? 'anonymous')}`,
		`conversation=${encodeKey(scope.conversationId ?? 'default')}`,
	]
	const extras = Object.entries(scope.extra)
		.sort(([left], [right]) => left.localeCompare(right))
		.map(([key, value]) => `${encodeKey(key)}=${encodeKey(value)}`)
	return [...fixed, ...extras].join(':')
}

const baseStateKey = (scope: AgentRunStateScope) => `purista:ai:run-state:${scopeKey(scope)}`
const currentRunKey = (scope: AgentRunStateScope) => `${baseStateKey(scope)}:current`
const runRecordKey = (scope: AgentRunStateScope, runId: string) => `${baseStateKey(scope)}:run:${encodeKey(runId)}`
const lockRecordKey = (scope: AgentRunStateScope, key = 'default') => `${baseStateKey(scope)}:lock:${encodeKey(key)}`

const normalizeTask = (task: AgentRunTaskInput, index: number, existing?: AgentRunTask): AgentRunTask => {
	const timestamp = nowIso()
	const status = task.status ?? existing?.status ?? 'pending'
	return {
		id: task.id,
		title: task.title,
		status,
		order: task.order ?? existing?.order ?? index,
		kind: task.kind ?? existing?.kind,
		detail: task.detail ?? existing?.detail,
		summary: task.summary ?? existing?.summary,
		input: task.input === undefined ? existing?.input : task.input,
		output: task.output === undefined ? existing?.output : task.output,
		executor: task.executor ?? existing?.executor,
		handoff: task.handoff ?? existing?.handoff,
		dependsOn: task.dependsOn ?? existing?.dependsOn,
		approval: task.approval ?? existing?.approval,
		retryPolicy: task.retryPolicy ?? existing?.retryPolicy,
		timeoutMs: task.timeoutMs ?? existing?.timeoutMs,
		startedAt: status === 'running' ? (existing?.startedAt ?? timestamp) : existing?.startedAt,
		updatedAt: timestamp,
		completedAt:
			status === 'completed' || status === 'failed' || status === 'cancelled'
				? (existing?.completedAt ?? timestamp)
				: existing?.completedAt,
	}
}

const parseRunState = (value: unknown) => {
	const parsed = agentRunStateSchema.safeParse(value)
	return parsed.success ? parsed.data : undefined
}

const parseLockState = (value: unknown) => {
	const parsed = agentRunLockSchema.safeParse(value)
	return parsed.success ? parsed.data : undefined
}

const normalizeError = (error: AgentRunError | undefined) => {
	if (!error) {
		return undefined
	}
	return agentRunErrorSchema.parse(error)
}

const getStoredValue = async <T>(states: StateStoreHelpers, key: string, parser: (value: unknown) => T | undefined) => {
	const result = (await states.getState(key)) ?? {}
	return parser(result[key])
}

const getStoredString = async (states: StateStoreHelpers, key: string) => {
	const result = (await states.getState(key)) ?? {}
	return typeof result[key] === 'string' ? result[key] : undefined
}

const emitRunState = (protocol: RunStateProtocolEmitter, state: AgentRunState) => {
	protocol.emitArtifact({
		artifactId: RUN_STATE_ARTIFACT_ID,
		content: state,
		mimeType: 'application/json',
		final: FINAL_STATUSES.includes(state.status),
	})
}

const emitPlanArtifact = (protocol: RunStateProtocolEmitter, state: AgentRunState) => {
	protocol.emitArtifact({
		artifactId: PURISTA_AI_PLAN_ARTIFACT_ID,
		content: toPlanArtifactPayload(state) as JsonValue,
		mimeType: 'application/json',
		final: FINAL_STATUSES.includes(state.status),
	})
}

const emitPlanStatusArtifact = (protocol: RunStateProtocolEmitter, state: AgentRunState) => {
	protocol.emitArtifact({
		artifactId: PURISTA_AI_PLAN_STATUS_ARTIFACT_ID,
		content: toPlanStatusArtifactPayload(state) as JsonValue,
		mimeType: 'application/json',
		final: FINAL_STATUSES.includes(state.status),
	})
}

const emitTaskArtifact = (
	protocol: RunStateProtocolEmitter,
	state: AgentRunState,
	taskId: string,
	options?: { summary?: string },
) => {
	const task = state.tasks.find(entry => entry.id === taskId)
	if (!task) {
		return
	}
	protocol.emitArtifact({
		artifactId: buildTaskArtifactId(taskId),
		content: toTaskArtifactPayload(state, task, options) as JsonValue,
		mimeType: 'application/json',
		final: task.status === 'completed' || task.status === 'failed' || task.status === 'cancelled',
	})
}

const isActiveStatus = (status: AgentRunStatus) => !FINAL_STATUSES.includes(status)
const isExpired = (lock: AgentRunLock) => new Date(lock.expiresAt).getTime() <= Date.now()

export const createAgentRunStateHelpers = (context: RunStateContext): AgentRunStateHelpers => {
	const get = async (input?: AgentRunGetInput) => {
		const scope = defaultScope(context, input?.scope)
		const runId = input?.runId ?? (await getStoredString(context.states, currentRunKey(scope)))
		if (!runId) {
			return undefined
		}
		return await getStoredValue(context.states, runRecordKey(scope, runId), parseRunState)
	}

	const save = async (state: AgentRunState) => {
		await context.states.setState(runRecordKey(state.scope, state.runId), state)
		if (isActiveStatus(state.status)) {
			await context.states.setState(currentRunKey(state.scope), state.runId)
		}
		emitRunState(context.protocol, state)
		emitPlanStatusArtifact(context.protocol, state)
		return state
	}

	const releaseLock = async (scope: AgentRunStateScope, key = 'default', lockId?: string) => {
		const existing = await getStoredValue(context.states, lockRecordKey(scope, key), parseLockState)
		if (!existing) {
			return
		}
		if (lockId && existing.lockId !== lockId) {
			return
		}
		await context.states.removeState(lockRecordKey(scope, key))
	}

	const lock = async (input?: AgentRunLockInput): Promise<AgentRunLockHandle> => {
		const scope = defaultScope(context, input?.scope)
		const key = input?.key ?? 'default'
		const ttlMs = input?.ttlMs ?? DEFAULT_LOCK_TTL_MS
		const existing = await getStoredValue(context.states, lockRecordKey(scope, key), parseLockState)
		if (existing && !isExpired(existing)) {
			throw new HandledError(StatusCode.Conflict, 'Agent run lock is already held for this scope', {
				lock: existing,
			})
		}
		const acquiredAt = nowIso()
		const lockState: AgentRunLock = {
			lockId: randomUUID(),
			key,
			runId: input?.runId,
			scopeKey: scopeKey(scope),
			acquiredAt,
			heartbeatAt: acquiredAt,
			expiresAt: new Date(Date.now() + ttlMs).toISOString(),
		}
		await context.states.setState(lockRecordKey(scope, key), lockState)
		const confirmed = await getStoredValue(context.states, lockRecordKey(scope, key), parseLockState)
		if (!confirmed || confirmed.lockId !== lockState.lockId) {
			throw new HandledError(StatusCode.Conflict, 'Failed to acquire durable agent run lock', {
				scope: scopeKey(scope),
				key,
			})
		}
		return {
			lock: confirmed,
			async heartbeat(nextTtlMs = ttlMs) {
				const latest = await getStoredValue(context.states, lockRecordKey(scope, key), parseLockState)
				if (!latest || latest.lockId !== confirmed.lockId) {
					throw new HandledError(StatusCode.Conflict, 'Agent run lock heartbeat failed because ownership changed', {
						lock: latest,
					})
				}
				const next: AgentRunLock = {
					...latest,
					heartbeatAt: nowIso(),
					expiresAt: new Date(Date.now() + nextTtlMs).toISOString(),
				}
				await context.states.setState(lockRecordKey(scope, key), next)
				return next
			},
			async release() {
				await releaseLock(scope, key, confirmed.lockId)
			},
		}
	}

	const updateInternal = async (
		resolver: AgentRunGetInput,
		updater: (current: AgentRunState) => AgentRunState | Promise<AgentRunState>,
	) => {
		const current = await get(resolver)
		if (!current) {
			throw new HandledError(StatusCode.NotFound, 'Agent run state not found', resolver)
		}
		const next = agentRunStateSchema.parse(await updater(current))
		return await save(next)
	}

	const update = async (input: AgentRunUpdateInput & AgentRunGetInput) =>
		await updateInternal(input, current => ({
			...current,
			phase: input.phase ?? current.phase,
			status: input.status ?? current.status,
			summary: input.summary ?? current.summary,
			finalMessage: input.finalMessage ?? current.finalMessage,
			metadata: input.metadata === undefined ? current.metadata : input.metadata,
			owner: input.owner === undefined ? current.owner : input.owner,
			recovery: input.recovery === undefined ? current.recovery : input.recovery,
			retention: input.retention === undefined ? current.retention : input.retention,
			error: input.error === undefined ? current.error : normalizeError(input.error),
			attempt: input.attempt ?? current.attempt,
			updatedAt: nowIso(),
			heartbeatAt: input.heartbeat ? nowIso() : current.heartbeatAt,
			completedAt:
				input.status && FINAL_STATUSES.includes(input.status) ? (current.completedAt ?? nowIso()) : current.completedAt,
		}))

	const replaceTasks = async (tasks: AgentRunTaskInput[], input?: AgentRunGetInput) =>
		await updateInternal(input ?? {}, current => {
			const existingById = new Map(current.tasks.map(task => [task.id, task]))
			return {
				...current,
				tasks: tasks.map((task, index) => normalizeTask(task, index, existingById.get(task.id))),
				updatedAt: nowIso(),
			}
		})

	const updateTask = async (
		taskId: string,
		patch: Partial<Omit<AgentRunTask, 'id' | 'order' | 'title'>>,
		input?: AgentRunGetInput,
	) =>
		await updateInternal(input ?? {}, current => ({
			...current,
			tasks: current.tasks.map(task => (task.id === taskId ? { ...task, ...patch, updatedAt: nowIso() } : task)),
			updatedAt: nowIso(),
		}))

	const updateTaskStatus = async (
		taskId: string,
		status: AgentRunTaskStatus,
		input?: AgentRunGetInput & { detail?: string },
	) =>
		await updateInternal(input ?? {}, current => {
			const timestamp = nowIso()
			return {
				...current,
				tasks: current.tasks.map(task =>
					task.id !== taskId
						? task
						: {
								...task,
								status,
								detail: input?.detail ?? task.detail,
								startedAt:
									status === 'running'
										? task.status === 'completed' || task.status === 'failed'
											? timestamp
											: (task.startedAt ?? timestamp)
										: task.startedAt,
								updatedAt: timestamp,
								completedAt:
									status === 'completed' || status === 'failed'
										? (task.completedAt ?? timestamp)
										: status === 'running' || status === 'pending'
											? undefined
											: task.completedAt,
							},
				),
				updatedAt: timestamp,
			}
		})

	const finish = async (
		input: AgentRunGetInput & {
			summary?: string
			status: Extract<AgentRunStatus, 'completed' | 'failed' | 'cancelled'>
			finalMessage?: string
			error?: AgentRunError
		},
	) => {
		const state = await updateInternal(input, current => ({
			...current,
			status: input.status,
			phase: input.status,
			summary: input.summary ?? current.summary,
			finalMessage: input.finalMessage ?? current.finalMessage,
			error: input.error === undefined ? current.error : normalizeError(input.error),
			updatedAt: nowIso(),
			heartbeatAt: nowIso(),
			completedAt: current.completedAt ?? nowIso(),
		}))
		const currentKey = currentRunKey(state.scope)
		const activeRunId = await getStoredString(context.states, currentKey)
		if (activeRunId === state.runId) {
			await context.states.removeState(currentKey)
		}
		if (state.lock) {
			await releaseLock(state.scope, state.lock.key, state.lock.lockId)
		}
		return state
	}

	const emit = async (input?: AgentRunGetInput) => {
		const state = await get(input)
		if (state) {
			emitRunState(context.protocol, state)
		}
		return state
	}

	const checkpoint = async <T = unknown>(name: string, value?: T, input?: AgentRunGetInput & { completed?: boolean }) =>
		await updateInternal(input ?? {}, current => ({
			...current,
			checkpoints: {
				...current.checkpoints,
				[name]: {
					name,
					value,
					completed: input?.completed ?? false,
					updatedAt: nowIso(),
				},
			},
			updatedAt: nowIso(),
		}))

	const getCheckpoint = async <T = unknown>(name: string, input?: AgentRunGetInput) => {
		const state = await get(input)
		return state?.checkpoints[name]?.value as T | undefined
	}

	const start = async (input: AgentRunStartInput): Promise<AgentRunHandle> => {
		const scope = defaultScope(context, input.scope)
		const lockHandle = input.lock
			? await lock({
					...(typeof input.lock === 'object' ? input.lock : {}),
					scope: input.scope,
					runId: input.runId,
				})
			: undefined
		const timestamp = nowIso()
		const runId = input.runId ?? randomUUID()
		const existing = input.runId ? await get({ runId, scope: input.scope }) : undefined
		const state = agentRunStateSchema.parse(
			existing ?? {
				runId,
				agentName: context.manifest.agentName,
				serviceVersion: context.manifest.serviceVersion,
				scope,
				status: input.status ?? 'planning',
				phase: input.phase ?? 'planning',
				title: input.title,
				attempt: 1,
				tasks: [],
				checkpoints: {},
				summary: undefined,
				finalMessage: undefined,
				owner: input.owner,
				recovery: input.recovery ?? { status: 'fresh' },
				retention: input.retention,
				error: undefined,
				lock: lockHandle?.lock,
				metadata: input.metadata,
				startedAt: timestamp,
				updatedAt: timestamp,
				heartbeatAt: timestamp,
			},
		)
		let currentState = await save(state)
		const resolver = { runId: currentState.runId, scope: input.scope }
		const handle: AgentRunHandle = {
			get state() {
				return currentState
			},
			emit: async () => {
				currentState = (await emit(resolver)) as AgentRunState
				return currentState
			},
			update: async patch => {
				currentState = await update({ ...patch, ...resolver })
				return currentState
			},
			phase: async (phase, status) => {
				currentState = await update({ phase, status, ...resolver })
				return currentState
			},
			summary: async summary => {
				currentState = await update({ summary, ...resolver })
				return currentState
			},
			setFinalMessage: async finalMessage => {
				currentState = await update({ finalMessage, ...resolver })
				return currentState
			},
			updateTask: async (taskId, patch) => {
				currentState = await updateTask(taskId, patch, resolver)
				emitTaskArtifact(context.protocol, currentState, taskId)
				return currentState
			},
			replaceTasks: async tasks => {
				currentState = await replaceTasks(tasks, resolver)
				emitPlanArtifact(context.protocol, currentState)
				return currentState
			},
			plan: async tasks => {
				currentState = await update({ phase: 'planning', status: 'planning', ...resolver })
				currentState = await replaceTasks(tasks, resolver)
				emitPlanArtifact(context.protocol, currentState)
				return currentState
			},
			startTask: async (taskId, detail) => {
				currentState = await updateTaskStatus(taskId, 'running', { ...resolver, detail })
				emitTaskArtifact(context.protocol, currentState, taskId)
				return currentState
			},
			completeTask: async (taskId, detail) => {
				currentState = await updateTaskStatus(taskId, 'completed', { ...resolver, detail })
				emitTaskArtifact(context.protocol, currentState, taskId)
				return currentState
			},
			failTask: async (taskId, detail) => {
				currentState = await updateTaskStatus(taskId, 'failed', { ...resolver, detail })
				emitTaskArtifact(context.protocol, currentState, taskId)
				return currentState
			},
			checkpoint: async (name, value, options) => {
				currentState = await checkpoint(name, value, { ...resolver, completed: options?.completed })
				return currentState
			},
			getCheckpoint: async name => await getCheckpoint(name, resolver),
			step: async <T>(id: string, fn: () => Promise<T>, options?: { detail?: string; checkpoint?: string }) => {
				const checkpointName = options?.checkpoint ?? id
				if (currentState.checkpoints[checkpointName]?.completed) {
					return currentState.checkpoints[checkpointName]?.value as T | undefined as T
				}
				currentState = await updateTaskStatus(id, 'running', { ...resolver, detail: options?.detail })
				emitTaskArtifact(context.protocol, currentState, id)
				try {
					const result = await fn()
					currentState = await checkpoint(checkpointName, result, { ...resolver, completed: true })
					currentState = await updateTaskStatus(id, 'completed', { ...resolver })
					emitTaskArtifact(context.protocol, currentState, id)
					return result
				} catch (error) {
					currentState = await updateTaskStatus(id, 'failed', {
						...resolver,
						detail: error instanceof Error ? error.message : String(error),
					})
					emitTaskArtifact(context.protocol, currentState, id)
					throw error
				}
			},
			task: async <T>(taskId: string, fn: () => Promise<T>, detail?: string) => {
				currentState = await updateTaskStatus(taskId, 'running', { ...resolver, detail })
				emitTaskArtifact(context.protocol, currentState, taskId)
				try {
					const result = await fn()
					currentState = await updateTaskStatus(taskId, 'completed', { ...resolver })
					emitTaskArtifact(context.protocol, currentState, taskId)
					return result
				} catch (error) {
					currentState = await updateTaskStatus(taskId, 'failed', {
						...resolver,
						detail: error instanceof Error ? error.message : String(error),
					})
					emitTaskArtifact(context.protocol, currentState, taskId)
					throw error
				}
			},
			finish: async result => {
				currentState = await finish({ ...result, ...resolver })
				return currentState
			},
			finishSuccess: async summary => {
				currentState = await finish({ status: 'completed', summary, ...resolver })
				return currentState
			},
			finishFailure: async (summary, error) => {
				currentState = await finish({ status: 'failed', summary, error, ...resolver })
				return currentState
			},
			release: async () => {
				if (lockHandle) {
					await lockHandle.release()
				}
			},
		}
		return handle
	}

	return {
		start,
		get,
		update,
		updateTask: async (taskId, patch, input) => {
			const state = await updateTask(taskId, patch, input)
			emitTaskArtifact(context.protocol, state, taskId)
			return state
		},
		replaceTasks: async (tasks, input) => {
			const state = await replaceTasks(tasks, input)
			emitPlanArtifact(context.protocol, state)
			return state
		},
		startTask: async (taskId, input) => {
			const state = await updateTaskStatus(taskId, 'running', input)
			emitTaskArtifact(context.protocol, state, taskId)
			return state
		},
		completeTask: async (taskId, input) => {
			const state = await updateTaskStatus(taskId, 'completed', input)
			emitTaskArtifact(context.protocol, state, taskId)
			return state
		},
		failTask: async (taskId, input) => {
			const state = await updateTaskStatus(taskId, 'failed', input)
			emitTaskArtifact(context.protocol, state, taskId)
			return state
		},
		checkpoint,
		getCheckpoint,
		finish,
		emit,
		lock,
	}
}
