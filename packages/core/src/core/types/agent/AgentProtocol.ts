import { z } from 'zod'

/**
 * The payload for an agent protocol request.
 *
 * @group Agent
 */
export const agentProtocolPayloadSchema = z
	.object({
		message: z.string().describe('The message to send to the agent'),
		conversationId: z.string().optional().describe('The ID of the conversation'),
		history: z.array(z.any()).optional().default([]).describe('The conversation history'),
		attachments: z.array(z.any()).optional().default([]).describe('The attachments'),
	})
	.passthrough()

/**
 * The payload for an agent protocol request.
 *
 * @group Agent
 */
export type AgentProtocolPayload = z.infer<typeof agentProtocolPayloadSchema>

/**
 * The payload for an agent protocol response.
 *
 * @group Agent
 */
export const agentProtocolResponseSchema = z.object({
	message: z.any().describe('The response message from the agent'),
	history: z.array(z.any()).describe('The updated conversation history'),
})

/**
 * The payload for an agent protocol response.
 *
 * @group Agent
 */
export type AgentProtocolResponse = z.infer<typeof agentProtocolResponseSchema>

/**
 * The agent invocation interface.
 *
 * @group Agent
 */
export interface AgentInvocation<T = AgentProtocolResponse> extends AsyncIterable<any> {
	/**
	 * Returns a promise that resolves to the full, final response.
	 */
	final(): Promise<T>
}
