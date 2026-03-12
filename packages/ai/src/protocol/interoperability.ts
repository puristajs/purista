import { createActor, createProtocolEnvelope } from './helpers.js'
import { type AgentProtocolEnvelope, type AgentProtocolFrame, protocolVersion } from './types.js'

/**
 * Reference shape that can be used as a bridge model for Agent-to-Agent style integrations.
 * It is intentionally minimal and designed for easy conversion.
 */
export type Agent2AgentReferenceMessage = {
	id: string
	threadId: string
	parentId?: string
	timestamp: string
	sender: {
		service: string
		version?: string
		agent?: string
		instanceId?: string
	}
	frameType: AgentProtocolFrame['kind']
	payload: AgentProtocolFrame
	metadata?: Record<string, unknown>
}

/**
 * Converts a PURISTA AI protocol envelope into an Agent-to-Agent reference message.
 * This is a reference adapter and not a claim of full compliance with any external standard.
 */
export const toAgent2AgentReferenceMessage = (envelope: AgentProtocolEnvelope): Agent2AgentReferenceMessage => ({
	id: envelope.messageId,
	threadId: envelope.conversationId,
	parentId: envelope.inReplyTo,
	timestamp: envelope.timestamp,
	sender: {
		service: envelope.actor.service,
		version: envelope.actor.version,
		agent: envelope.actor.agent,
		instanceId: envelope.actor.instanceId,
	},
	frameType: envelope.frame.kind,
	payload: envelope.frame,
	metadata: envelope.metadata,
})

/**
 * Converts an Agent-to-Agent reference message into a PURISTA AI protocol envelope.
 */
export const fromAgent2AgentReferenceMessage = (message: Agent2AgentReferenceMessage): AgentProtocolEnvelope =>
	createProtocolEnvelope({
		messageId: message.id,
		conversationId: message.threadId,
		inReplyTo: message.parentId,
		timestamp: message.timestamp,
		actor: createActor(message.sender),
		frame: message.payload,
		metadata: message.metadata,
	})

/**
 * Reference MCP-style content chunk.
 */
export type McpReferenceContent =
	| {
			type: 'text'
			text: string
	  }
	| {
			type: 'json'
			json: Record<string, unknown>
	  }

/**
 * Reference MCP-style tool result.
 * This follows common MCP response semantics but remains transport-agnostic.
 */
export type McpReferenceToolResult = {
	content: McpReferenceContent[]
	isError?: boolean
	metadata?: Record<string, unknown>
}

/**
 * Converts protocol envelopes into an MCP-style tool result.
 * - final assistant message -> `text` content
 * - artifact frames -> `json` content
 * - error frame -> `isError: true`
 */
export const toMcpReferenceToolResult = (envelopes: AgentProtocolEnvelope[]): McpReferenceToolResult => {
	const content: McpReferenceContent[] = []
	let isError = false
	const metadata: Record<string, unknown> = {
		protocolVersion,
	}

	for (const envelope of envelopes) {
		const frame = envelope.frame
		if (frame.kind === 'message' && frame.final) {
			content.push({ type: 'text', text: frame.content })
		}

		if (frame.kind === 'artifact' && typeof frame.content === 'object' && frame.content !== null) {
			content.push({ type: 'json', json: frame.content as Record<string, unknown> })
		}

		if (frame.kind === 'error') {
			isError = true
			content.push({ type: 'text', text: frame.message })
		}

		if (frame.kind === 'telemetry') {
			metadata.telemetry = {
				durationMs: frame.durationMs,
				waitTimeMs: frame.waitTimeMs,
				usage: frame.usage,
				provider: frame.provider,
				poolId: frame.poolId,
				maxConcurrencyPerInstance: frame.maxConcurrencyPerInstance,
				activeWorkers: frame.activeWorkers,
				waitingWorkers: frame.waitingWorkers,
				replicaCountHint: frame.replicaCountHint,
				effectiveMaxConcurrencyHint: frame.effectiveMaxConcurrencyHint,
			}
		}
	}

	if (content.length === 0) {
		content.push({ type: 'text', text: '' })
	}

	return {
		content,
		isError: isError || undefined,
		metadata,
	}
}

/**
 * Converts an MCP-style tool call input to a minimal agent invoke payload.
 * Consumers can extend this shape with domain-specific fields.
 */
export const fromMcpReferenceToolCall = (input: {
	name: string
	arguments?: Record<string, unknown>
}): {
	message: string
	history: unknown[]
	attachments: unknown[]
	context?: string
} => ({
	message: typeof input.arguments?.prompt === 'string' ? input.arguments.prompt : '',
	history: [],
	attachments: [],
	context: typeof input.arguments?.context === 'string' ? input.arguments.context : undefined,
})
