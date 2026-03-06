import { randomUUID } from 'node:crypto'

import {
	type AgentProtocolEnvelope,
	type AgentProtocolFrame,
	agentProtocolEnvelopeSchema,
	type ProtocolActor,
	protocolActorSchema,
	protocolVersion,
	type TokenUsage,
} from './types.js'

export type CreateEnvelopeInput = {
	conversationId: string
	frame: AgentProtocolFrame
	actor: ProtocolActor
	messageId?: string
	inReplyTo?: string
	timestamp?: string
	metadata?: Record<string, unknown>
	role?: AgentProtocolEnvelope['role']
	userId?: string
	tenantId?: string
}

/**
 * Creates a protocol-compliant envelope. Input is validated via zod, so invalid metadata throws with helpful errors.
 */
export const createProtocolEnvelope = (input: CreateEnvelopeInput): AgentProtocolEnvelope => {
	const candidate: AgentProtocolEnvelope = {
		version: protocolVersion,
		messageId: input.messageId ?? randomUUID(),
		conversationId: input.conversationId,
		inReplyTo: input.inReplyTo,
		timestamp: input.timestamp ?? new Date().toISOString(),
		actor: input.actor,
		role: input.role,
		userId: input.userId,
		tenantId: input.tenantId,
		metadata: input.metadata,
		frame: input.frame,
	}
	return agentProtocolEnvelopeSchema.parse(candidate)
}

export const createActor = (actor: ProtocolActor): ProtocolActor => {
	return protocolActorSchema.parse(actor)
}

export const createMessageFrame = (input: {
	role: AgentProtocolEnvelope['role']
	content: string
	summary?: string
	partial?: boolean
	final?: boolean
}) =>
	({
		kind: 'message',
		role: input.role ?? 'assistant',
		content: input.content,
		summary: input.summary,
		partial: input.partial,
		final: input.final,
	}) as const satisfies AgentProtocolFrame

export const createArtifactFrame = (input: {
	artifactId: string
	phase?: 'chunk' | 'final'
	content: string | Record<string, unknown>
	sequence?: number
	total?: number
	mimeType?: string
	lastChunk?: boolean
}) =>
	({
		kind: 'artifact',
		artifactId: input.artifactId,
		phase: input.phase ?? 'chunk',
		sequence: input.sequence,
		total: input.total,
		content: input.content,
		mimeType: input.mimeType,
		lastChunk: input.lastChunk,
	}) as const satisfies AgentProtocolFrame

export const createToolEventFrame = (input: {
	toolName: string
	status: 'invoked' | 'success' | 'error'
	args?: unknown
	result?: unknown
	message?: string
	errorCode?: string
}) =>
	({
		kind: 'tool',
		toolName: input.toolName,
		status: input.status,
		input: input.args,
		output: input.result,
		message: input.message,
		errorCode: input.errorCode,
	}) as const satisfies AgentProtocolFrame

export const createTelemetryFrame = (input: {
	usage?: TokenUsage
	durationMs?: number
	waitTimeMs?: number
	poolId?: string
	maxWorkersPerInstance?: number
	activeWorkers?: number
	waitingWorkers?: number
	replicaCountHint?: number
	effectiveMaxConcurrencyHint?: number
	provider?: string
}) =>
	({
		kind: 'telemetry',
		usage: input.usage,
		durationMs: input.durationMs,
		waitTimeMs: input.waitTimeMs,
		poolId: input.poolId,
		maxWorkersPerInstance: input.maxWorkersPerInstance,
		activeWorkers: input.activeWorkers,
		waitingWorkers: input.waitingWorkers,
		replicaCountHint: input.replicaCountHint,
		effectiveMaxConcurrencyHint: input.effectiveMaxConcurrencyHint,
		provider: input.provider,
	}) as const satisfies AgentProtocolFrame

export const createErrorFrame = (input: { code: string; message: string; handled?: boolean; details?: unknown }) =>
	({
		kind: 'error',
		code: input.code,
		message: input.message,
		handled: input.handled ?? false,
		details: input.details,
	}) as const satisfies AgentProtocolFrame

export const createTokenUsage = (input: {
	promptTokens?: number
	completionTokens?: number
	totalTokens?: number
	costUsd?: number
}): TokenUsage => ({
	promptTokens: input.promptTokens,
	completionTokens: input.completionTokens,
	totalTokens: input.totalTokens,
	costUsd: input.costUsd,
})
