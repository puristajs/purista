import { extendApi } from '@purista/core'
import { z } from 'zod'

export const protocolVersion = 'purista.ai/1.0' as const

export const agentRoleSchema = z.enum(['user', 'assistant', 'tool', 'system', 'developer'])
export type AgentRole = z.infer<typeof agentRoleSchema>

export const tokenUsageSchema = z
	.object({
		promptTokens: z.number().int().nonnegative().optional(),
		completionTokens: z.number().int().nonnegative().optional(),
		totalTokens: z.number().int().nonnegative().optional(),
		costUsd: z.number().nonnegative().optional(),
	})
	.optional()

export type TokenUsage = z.infer<NonNullable<typeof tokenUsageSchema>>

export const protocolActorSchema = z.object({
	service: z.string().min(1),
	version: z.string().min(1).optional(),
	agent: z.string().min(1).optional(),
	instanceId: z.string().min(1).optional(),
})
export type ProtocolActor = z.infer<typeof protocolActorSchema>

export const messageFrameSchema = extendApi(
	z.object({
		kind: z.literal('message'),
		role: agentRoleSchema,
		content: z.string(),
		summary: z.string().optional(),
		partial: z.boolean().optional(),
		final: z.boolean().optional(),
	}),
	{ title: 'Agent message frame' },
)

export const artifactFrameSchema = extendApi(
	z.object({
		kind: z.literal('artifact'),
		artifactId: z.string().min(1),
		phase: z.enum(['chunk', 'final']),
		sequence: z.number().int().nonnegative().optional(),
		total: z.number().int().positive().optional(),
		content: z.union([z.string(), z.record(z.string(), z.unknown())]),
		mimeType: z.string().optional(),
		lastChunk: z.boolean().optional(),
	}),
	{ title: 'Artifact frame' },
)

export const toolEventFrameSchema = extendApi(
	z.object({
		kind: z.literal('tool'),
		toolName: z.string().min(1),
		status: z.enum(['invoked', 'success', 'error']),
		input: z.unknown().optional(),
		output: z.unknown().optional(),
		message: z.string().optional(),
		errorCode: z.string().optional(),
	}),
	{ title: 'Tool event frame' },
)

export const telemetryFrameSchema = extendApi(
	z.object({
		kind: z.literal('telemetry'),
		usage: tokenUsageSchema,
		durationMs: z.number().nonnegative().optional(),
		waitTimeMs: z.number().nonnegative().optional(),
		poolId: z.string().optional(),
		maxConcurrencyPerInstance: z.number().int().positive().optional(),
		activeWorkers: z.number().int().nonnegative().optional(),
		waitingWorkers: z.number().int().nonnegative().optional(),
		replicaCountHint: z.number().int().positive().optional(),
		effectiveMaxConcurrencyHint: z.number().int().positive().optional(),
		provider: z.string().optional(),
	}),
	{ title: 'Telemetry frame' },
)

export const errorFrameSchema = extendApi(
	z.object({
		kind: z.literal('error'),
		code: z.string().min(1),
		message: z.string().min(1),
		handled: z.boolean().default(false),
		details: z.unknown().optional(),
	}),
	{ title: 'Error frame' },
)

export const agentProtocolFrameSchema = z.discriminatedUnion('kind', [
	messageFrameSchema,
	artifactFrameSchema,
	toolEventFrameSchema,
	telemetryFrameSchema,
	errorFrameSchema,
])
export type AgentProtocolFrame = z.infer<typeof agentProtocolFrameSchema>

export const agentProtocolEnvelopeSchema = extendApi(
	z.object({
		version: z.literal(protocolVersion),
		messageId: z.string().min(1),
		conversationId: z.string().min(1),
		inReplyTo: z.string().optional(),
		timestamp: z.string().min(1),
		actor: protocolActorSchema,
		role: agentRoleSchema.optional(),
		userId: z.string().optional(),
		tenantId: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
		frame: agentProtocolFrameSchema,
	}),
	{ title: 'Agent protocol envelope' },
)
export type AgentProtocolEnvelope = z.infer<typeof agentProtocolEnvelopeSchema>
