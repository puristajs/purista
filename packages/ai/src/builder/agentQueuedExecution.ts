import { extendApi } from '@purista/core'
import { z } from 'zod'
import type { AgentTerminalResult } from '../types/AgentDefinition.js'

export type DurableAgentQueuePayload = {
	runId: string
	sessionId?: string
	payload: unknown
	parameter: unknown
	correlationId?: string
	principalId?: string
	tenantId?: string
	scope?: Record<string, string>
}

export type DurableAgentQueueResult = AgentTerminalResult & {
	runId: string
}

export const durableAgentQueuePayloadSchema = extendApi(
	z.object({
		runId: z.string().min(1),
		sessionId: z.string().optional(),
		payload: z.unknown(),
		parameter: z.unknown().optional(),
		correlationId: z.string().optional(),
		principalId: z.string().optional(),
		tenantId: z.string().optional(),
		scope: z.record(z.string(), z.string()).optional(),
	}),
	{ title: 'DurableAgentQueuePayload' },
)
