import { describe, expect, it } from 'vitest'

import {
	createActor,
	createArtifactFrame,
	createErrorFrame,
	createMessageFrame,
	createProtocolEnvelope,
	createTelemetryFrame,
	createTokenUsage,
	createToolEventFrame,
} from './helpers.js'

describe('protocol helpers', () => {
	it('creates valid actor and envelope objects', () => {
		const actor = createActor({
			service: 'support',
			version: '1',
			agent: 'supportAgent',
			instanceId: 'instance-1',
		})

		const envelope = createProtocolEnvelope({
			conversationId: 'conversation-1',
			inReplyTo: 'message-1',
			actor,
			frame: createMessageFrame({
				role: 'assistant',
				content: 'hello',
				final: true,
			}),
		})

		expect(envelope.conversationId).toBe('conversation-1')
		expect(envelope.frame.kind).toBe('message')
	})

	it('accepts developer role in message frames', () => {
		const frame = createMessageFrame({
			role: 'developer',
			content: 'always ask for persistence constraints',
			final: false,
		})

		expect(frame.role).toBe('developer')
	})

	it('creates all supported frame kinds', () => {
		const usage = createTokenUsage({ promptTokens: 1, completionTokens: 2, totalTokens: 3, costUsd: 0.01 })
		const artifact = createArtifactFrame({
			artifactId: 'a1',
			content: { text: 'chunk' },
			phase: 'final',
			lastChunk: true,
		})
		const telemetry = createTelemetryFrame({
			usage,
			durationMs: 100,
			waitTimeMs: 3,
			poolId: 'support',
			maxConcurrencyPerInstance: 4,
			activeWorkers: 2,
			waitingWorkers: 1,
			replicaCountHint: 3,
			effectiveMaxConcurrencyHint: 12,
			provider: 'echo',
		})
		const tool = createToolEventFrame({
			toolName: 'svc.v1.cmd',
			status: 'success',
			args: { q: 1 },
			result: { ok: true },
		})
		const error = createErrorFrame({ code: 'E_TEST', message: 'boom', handled: true })

		expect(artifact.kind).toBe('artifact')
		expect(telemetry.kind).toBe('telemetry')
		expect(tool.kind).toBe('tool')
		expect(error.kind).toBe('error')
		expect(telemetry.usage?.totalTokens).toBe(3)
		expect(telemetry.maxConcurrencyPerInstance).toBe(4)
		expect(telemetry.effectiveMaxConcurrencyHint).toBe(12)
	})
})
