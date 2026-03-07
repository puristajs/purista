import { PuristaSpanName } from '@purista/core'
import { describe, expect, it, vi } from 'vitest'

import { createMessageFrame } from './helpers.js'
import { createEnvelopeFromContext, createErrorEnvelopeFromContext, recordProtocolFrameAsSpan } from './purista.js'

const baseContext = {
	logger: { error: vi.fn() },
	startActiveSpan: vi.fn(async (_name, _opts, _spanCtx, fn) => {
		return await fn({
			setAttribute: vi.fn(),
			setAttributes: vi.fn(),
			recordException: vi.fn(),
			setStatus: vi.fn(),
			spanContext: () => ({ traceId: 'trace', spanId: 'span', traceFlags: 1 }),
			end: vi.fn(),
		})
	}),
	message: {
		id: 'msg-1',
		correlationId: 'corr-1',
		sender: {
			serviceName: 'support',
			serviceVersion: '1',
			serviceTarget: 'supportAgent',
			instanceId: 'instance-1',
		},
		principalId: 'principal-1',
		tenantId: 'tenant-1',
	},
} as any

describe('purista protocol helpers', () => {
	it('derives envelope metadata from PURISTA context', () => {
		const envelope = createEnvelopeFromContext(
			baseContext,
			createMessageFrame({ role: 'assistant', content: 'hello', final: true }),
		)

		expect(envelope.conversationId).toBe('corr-1')
		expect(envelope.inReplyTo).toBe('msg-1')
		expect(envelope.actor.service).toBe('support')
		expect(envelope.userId).toBe('principal-1')
		expect(envelope.tenantId).toBe('tenant-1')
	})

	it('creates structured error envelopes', () => {
		const envelope = createErrorEnvelopeFromContext(baseContext, new Error('boom'), { handled: true })
		expect(envelope.frame.kind).toBe('error')
		if (envelope.frame.kind === 'error') {
			expect(envelope.frame.handled).toBe(true)
			expect(envelope.frame.message).toBe('boom')
		}
	})

	it('records protocol frames in spans', async () => {
		const envelope = await recordProtocolFrameAsSpan(
			baseContext,
			PuristaSpanName.EventBridgeInvokeCommand,
			createMessageFrame({ role: 'assistant', content: 'payload' }),
			async () => createEnvelopeFromContext(baseContext, createMessageFrame({ role: 'assistant', content: 'payload' })),
		)

		expect(envelope.frame.kind).toBe('message')
		expect(baseContext.startActiveSpan).toHaveBeenCalledTimes(1)
	})
})
