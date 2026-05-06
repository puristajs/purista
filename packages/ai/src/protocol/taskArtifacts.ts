import { extendApi } from '@purista/core'
import { z } from 'zod'
import type { AgentRunState, AgentRunTask } from '../runtime/runState.js'
import type { JsonValue } from './types.js'

export const PURISTA_AI_PLAN_ARTIFACT_ID = 'purista-ai:plan' as const
export const PURISTA_AI_PLAN_STATUS_ARTIFACT_ID = 'purista-ai:plan-status' as const
export const PURISTA_AI_WORKFLOW_STAGE_ARTIFACT_ID = 'purista-ai:workflow-stage' as const
export const PURISTA_AI_TASK_ARTIFACT_PREFIX = 'purista-ai:task:' as const
export const PURISTA_AI_TASK_CHUNK_ARTIFACT_PREFIX = 'purista-ai:task-chunk:' as const

export const buildTaskArtifactId = (taskId: string) => `${PURISTA_AI_TASK_ARTIFACT_PREFIX}${taskId}`
export const buildTaskChunkArtifactId = (taskId: string) => `${PURISTA_AI_TASK_CHUNK_ARTIFACT_PREFIX}${taskId}`
export const isPuristaAiTaskArtifactId = (artifactId: string) => artifactId.startsWith(PURISTA_AI_TASK_ARTIFACT_PREFIX)
export const isPuristaAiTaskChunkArtifactId = (artifactId: string) =>
	artifactId.startsWith(PURISTA_AI_TASK_CHUNK_ARTIFACT_PREFIX)
export const isPuristaAiWorkflowArtifactId = (artifactId: string) =>
	artifactId === 'run-state' ||
	artifactId === PURISTA_AI_PLAN_ARTIFACT_ID ||
	artifactId === PURISTA_AI_PLAN_STATUS_ARTIFACT_ID ||
	artifactId === PURISTA_AI_WORKFLOW_STAGE_ARTIFACT_ID ||
	isPuristaAiTaskArtifactId(artifactId) ||
	isPuristaAiTaskChunkArtifactId(artifactId)
export const parseTaskIdFromArtifactId = (artifactId: string): string | undefined => {
	if (isPuristaAiTaskArtifactId(artifactId)) {
		return artifactId.slice(PURISTA_AI_TASK_ARTIFACT_PREFIX.length) || undefined
	}
	if (isPuristaAiTaskChunkArtifactId(artifactId)) {
		return artifactId.slice(PURISTA_AI_TASK_CHUNK_ARTIFACT_PREFIX.length) || undefined
	}
	return undefined
}

const taskStatusSchema = z.enum([
	'pending',
	'running',
	'blocked',
	'waiting-approval',
	'completed',
	'failed',
	'cancelled',
])
const planStatusSchema = z.enum([
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
const workflowStageStatusSchema = z.enum(['running', 'completed', 'failed'])

const taskSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	status: taskStatusSchema,
	order: z.number().int().nonnegative(),
	kind: z.enum(['tool', 'agent', 'model', 'reasoning', 'checkpoint', 'approval', 'custom']).optional(),
	instruction: z.string().optional(),
	delegate: z.string().optional(),
	detail: z.string().optional(),
	summary: z.string().optional(),
	input: z.unknown().optional(),
	output: z.unknown().optional(),
	executor: z.unknown().optional(),
	handoff: z.unknown().optional(),
	dependsOn: z.array(z.string().min(1)).optional(),
	approval: z.unknown().optional(),
	retryPolicy: z.unknown().optional(),
	timeoutMs: z.number().int().positive().optional(),
	startedAt: z.string().optional(),
	updatedAt: z.string().optional(),
	completedAt: z.string().optional(),
})

export const puristaAiPlanArtifactSchema = extendApi(
	z.object({
		type: z.literal('purista-ai-plan'),
		runId: z.string().min(1),
		title: z.string().min(1),
		phase: z.string().min(1),
		status: planStatusSchema,
		tasks: z.array(taskSchema),
	}),
	{ title: 'PURISTA AI plan artifact payload' },
)
export type PuristaAiPlanArtifact = z.infer<typeof puristaAiPlanArtifactSchema>

export const puristaAiTaskArtifactSchema = extendApi(
	z.object({
		type: z.literal('purista-ai-task'),
		runId: z.string().min(1),
		taskId: z.string().min(1),
		title: z.string().min(1),
		status: taskStatusSchema,
		order: z.number().int().nonnegative(),
		kind: z.enum(['tool', 'agent', 'model', 'reasoning', 'checkpoint', 'approval', 'custom']).optional(),
		instruction: z.string().optional(),
		delegate: z.string().optional(),
		detail: z.string().optional(),
		startedAt: z.string().optional(),
		updatedAt: z.string().optional(),
		completedAt: z.string().optional(),
		summary: z.string().optional(),
		input: z.unknown().optional(),
		output: z.unknown().optional(),
		executor: z.unknown().optional(),
		handoff: z.unknown().optional(),
		dependsOn: z.array(z.string().min(1)).optional(),
		approval: z.unknown().optional(),
		retryPolicy: z.unknown().optional(),
		timeoutMs: z.number().int().positive().optional(),
	}),
	{ title: 'PURISTA AI task artifact payload' },
)
export type PuristaAiTaskArtifact = z.infer<typeof puristaAiTaskArtifactSchema>

export const puristaAiTaskChunkArtifactSchema = extendApi(
	z.object({
		type: z.literal('purista-ai-task-chunk'),
		runId: z.string().optional(),
		taskId: z.string().min(1),
		kind: z.string().min(1).default('update'),
		content: z.unknown(),
		sequence: z.number().int().nonnegative().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	}),
	{ title: 'PURISTA AI task chunk artifact payload' },
)
export type PuristaAiTaskChunkArtifact = z.infer<typeof puristaAiTaskChunkArtifactSchema>

export const puristaAiPlanStatusArtifactSchema = extendApi(
	z.object({
		type: z.literal('purista-ai-plan-status'),
		runId: z.string().min(1),
		title: z.string().min(1),
		phase: z.string().min(1),
		status: planStatusSchema,
		activeTaskId: z.string().optional(),
		summary: z.string().optional(),
		finalMessage: z.string().optional(),
	}),
	{ title: 'PURISTA AI plan status artifact payload' },
)
export type PuristaAiPlanStatusArtifact = z.infer<typeof puristaAiPlanStatusArtifactSchema>

export const puristaAiWorkflowStageArtifactSchema = extendApi(
	z.object({
		type: z.literal('purista-ai-workflow-stage'),
		runId: z.string().min(1).optional(),
		name: z.string().min(1),
		status: workflowStageStatusSchema,
		summary: z.string().optional(),
		finalMessage: z.string().optional(),
		updatedAt: z.string().optional(),
	}),
	{ title: 'PURISTA AI workflow stage artifact payload' },
)
export type PuristaAiWorkflowStageArtifact = z.infer<typeof puristaAiWorkflowStageArtifactSchema>

export const toPlanArtifactPayload = (state: AgentRunState): PuristaAiPlanArtifact => ({
	type: 'purista-ai-plan',
	runId: state.runId,
	title: state.title,
	phase: state.phase,
	status: state.status,
	tasks: state.tasks,
})

const resolveActiveTaskId = (tasks: AgentRunTask[]): string | undefined =>
	tasks.find(task => task.status === 'running')?.id ?? tasks.find(task => task.status === 'pending')?.id

export const toPlanStatusArtifactPayload = (state: AgentRunState): PuristaAiPlanStatusArtifact => ({
	type: 'purista-ai-plan-status',
	runId: state.runId,
	title: state.title,
	phase: state.phase,
	status: state.status,
	activeTaskId: resolveActiveTaskId(state.tasks),
	summary: state.summary,
	finalMessage: state.finalMessage,
})

export const toTaskArtifactPayload = (
	state: AgentRunState,
	task: AgentRunTask,
	options?: { summary?: string },
): PuristaAiTaskArtifact => ({
	type: 'purista-ai-task',
	runId: state.runId,
	taskId: task.id,
	title: task.title,
	status: task.status,
	order: task.order,
	kind: task.kind,
	instruction: task.instruction,
	delegate: task.delegate,
	detail: task.detail,
	startedAt: task.startedAt,
	updatedAt: task.updatedAt,
	completedAt: task.completedAt,
	summary: options?.summary ?? task.summary,
	input: task.input,
	output: task.output,
	executor: task.executor,
	handoff: task.handoff,
	dependsOn: task.dependsOn,
	approval: task.approval,
	retryPolicy: task.retryPolicy,
	timeoutMs: task.timeoutMs,
})

export const toTaskChunkArtifactPayload = (input: {
	runId?: string
	taskId: string
	kind?: string
	content: JsonValue
	sequence?: number
	metadata?: Record<string, unknown>
}): PuristaAiTaskChunkArtifact => ({
	type: 'purista-ai-task-chunk',
	runId: input.runId,
	taskId: input.taskId,
	kind: input.kind ?? 'update',
	content: input.content,
	sequence: input.sequence,
	metadata: input.metadata,
})

export const toWorkflowStageArtifactPayload = (input: {
	runId?: string
	name: string
	status: PuristaAiWorkflowStageArtifact['status']
	summary?: string
	finalMessage?: string
	updatedAt?: string
}): PuristaAiWorkflowStageArtifact => ({
	type: 'purista-ai-workflow-stage',
	runId: input.runId,
	name: input.name,
	status: input.status,
	summary: input.summary,
	finalMessage: input.finalMessage,
	updatedAt: input.updatedAt,
})
