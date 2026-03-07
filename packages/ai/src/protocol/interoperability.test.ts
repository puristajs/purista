import { describe, expect, it } from 'vitest'

import { createMessageFrame, createProtocolEnvelope } from './helpers.js'
import {
	fromAgent2AgentReferenceMessage,
	fromMcpReferenceToolCall,
	toAgent2AgentReferenceMessage,
	toMcpReferenceToolResult,
} from './interoperability.js'

describe('protocol interoperability helpers', () => {
	it('converts envelope to/from agent2agent reference shape', () => {
		const envelope = createProtocolEnvelope({
			conversationId: 'conversation-1',
			messageId: 'message-1',
			inReplyTo: 'message-0',
			timestamp: '2026-03-04T10:00:00.000Z',
			actor: {
				service: 'supportAgent',
				version: '1',
				agent: 'supportAgent',
				instanceId: 'instance-1',
			},
			frame: createMessageFrame({
				role: 'assistant',
				content: 'hello',
				final: true,
			}),
		})

		const reference = toAgent2AgentReferenceMessage(envelope)
		expect(reference.frameType).toBe('message')
		expect(reference.threadId).toBe('conversation-1')

		const reconstructed = fromAgent2AgentReferenceMessage(reference)
		expect(reconstructed).toEqual(envelope)
	})

	it('creates mcp-style tool result with final message and telemetry metadata', () => {
		const messageEnvelope = createProtocolEnvelope({
			conversationId: 'conversation-2',
			messageId: 'message-2',
			actor: {
				service: 'supportAgent',
			},
			frame: createMessageFrame({
				role: 'assistant',
				content: 'final answer',
				final: true,
			}),
		})

		const telemetryEnvelope = createProtocolEnvelope({
			conversationId: 'conversation-2',
			messageId: 'message-3',
			actor: {
				service: 'supportAgent',
			},
			frame: {
				kind: 'telemetry',
				durationMs: 42,
				waitTimeMs: 4,
				poolId: 'support',
				maxWorkersPerInstance: 2,
				activeWorkers: 1,
				waitingWorkers: 0,
				replicaCountHint: 3,
				effectiveMaxConcurrencyHint: 6,
				usage: {
					promptTokens: 10,
					completionTokens: 20,
					totalTokens: 30,
				},
			},
		})

		const result = toMcpReferenceToolResult([messageEnvelope, telemetryEnvelope])
		expect(result.isError).toBeUndefined()
		expect(result.content).toEqual([{ type: 'text', text: 'final answer' }])
		expect(result.metadata?.telemetry).toMatchObject({
			poolId: 'support',
			maxWorkersPerInstance: 2,
			effectiveMaxConcurrencyHint: 6,
		})
	})

	it('maps mcp-style tool call input to minimal invoke payload', () => {
		const invokePayload = fromMcpReferenceToolCall({
			name: 'support.ask',
			arguments: {
				prompt: 'reset password',
				context: 'tenant:acme',
			},
		})

		expect(invokePayload.message).toBe('reset password')
		expect(invokePayload.context).toBe('tenant:acme')
		expect(invokePayload.history).toEqual([])
		expect(invokePayload.attachments).toEqual([])
	})
})
