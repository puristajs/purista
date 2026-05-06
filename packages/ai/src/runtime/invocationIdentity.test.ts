import { describe, expect, it } from 'vitest'
import {
	createConversationStoreScope,
	resolveAgentInvocationIdentity,
	resolveConversationId,
	resolveTransportIdentity,
} from './invocationIdentity.js'

describe('invocation identity', () => {
	it('keeps transport identity separate from conversation identity', () => {
		const identity = resolveAgentInvocationIdentity({
			agentName: 'deskAgent',
			serviceVersion: '1',
			sessionId: 'chat-42',
			message: {
				id: 'msg-1',
				traceId: 'trace-1',
				otp: 'otp-1',
				correlationId: 'corr-1',
				tenantId: 'tenant-1',
				principalId: 'principal-1',
				payload: {
					payload: {
						sessionId: 'ignored-session',
					},
				},
			},
		})

		expect(identity.transportMessageId).toBe('msg-1')
		expect(identity.correlationId).toBe('corr-1')
		expect(identity.baseSessionId).toBe('chat-42')
		expect(identity.conversationId).toBe('chat-42')
		expect(identity.scopedSessionId).toBe('deskAgent:1:tenant-1:principal-1:chat-42')
	})

	it('falls back to payload session and then transport ids when needed', () => {
		expect(
			resolveConversationId({
				payload: {
					payload: {
						sessionId: 'chat-from-payload',
					},
				},
				transportMessageId: 'msg-2',
			}),
		).toBe('chat-from-payload')

		expect(
			resolveConversationId({
				payload: {
					payload: {},
				},
				transportMessageId: 'msg-3',
			}),
		).toBe('msg-3')
	})

	it('preserves transport trace fields and storage scope helpers', () => {
		const transport = resolveTransportIdentity({
			id: 'msg-4',
			traceId: 'trace-4',
			otp: 'otp-4',
			correlationId: 'corr-4',
			tenantId: 'tenant-4',
			principalId: 'principal-4',
		})

		expect(transport).toMatchObject({
			traceId: 'trace-4',
			otp: 'otp-4',
			correlationId: 'corr-4',
			transportMessageId: 'msg-4',
		})
		expect(
			createConversationStoreScope({
				agentName: 'deskAgent',
				serviceVersion: '1',
				tenantId: 'tenant-4',
				principalId: 'principal-4',
			}),
		).toEqual({
			agentName: 'deskAgent',
			serviceVersion: '1',
			tenantId: 'tenant-4',
			principalId: 'principal-4',
		})
	})
})
