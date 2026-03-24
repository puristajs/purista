import { describe, expect, it } from 'vitest'
import {
	createArtifactFrame,
	createErrorFrame,
	createMessageFrame,
	createProtocolEnvelope,
	createToolEventFrame,
} from '../protocol/helpers.js'
import { evaluateTrajectory } from './trajectory.js'

const envelopes = [
	createProtocolEnvelope({
		conversationId: 'c1',
		actor: { service: 'svc', version: '1', agent: 'agent', instanceId: 'i1' },
		frame: createToolEventFrame({ toolName: 'support.1.lookupFaq', status: 'invoked' }),
	}),
	createProtocolEnvelope({
		conversationId: 'c1',
		actor: { service: 'svc', version: '1', agent: 'agent', instanceId: 'i1' },
		frame: createToolEventFrame({ toolName: 'support.1.lookupFaq', status: 'success' }),
	}),
	createProtocolEnvelope({
		conversationId: 'c1',
		actor: { service: 'svc', version: '1', agent: 'agent', instanceId: 'i1' },
		frame: createArtifactFrame({
			artifactId: 'reflection:answer:summary',
			content: { accepted: true, iterations: 2 },
			phase: 'final',
		}),
	}),
	createProtocolEnvelope({
		conversationId: 'c1',
		actor: { service: 'svc', version: '1', agent: 'agent', instanceId: 'i1' },
		frame: createArtifactFrame({
			artifactId: 'approval:publish-response',
			content: { status: 'approved' },
			phase: 'final',
		}),
	}),
	createProtocolEnvelope({
		conversationId: 'c1',
		actor: { service: 'svc', version: '1', agent: 'agent', instanceId: 'i1' },
		frame: createMessageFrame({ role: 'assistant', content: 'Resolved', final: true }),
	}),
]

describe('trajectory evaluation', () => {
	it('matches trajectories in exact, in-order, and any-order modes', () => {
		expect(
			evaluateTrajectory(envelopes, {
				mode: 'exact',
				tools: [{ name: 'support.1.lookupFaq', statuses: ['invoked', 'success'] }],
				artifacts: [
					{ id: 'reflection:answer:summary', phase: 'final' },
					{ id: 'approval:publish-response', phase: 'final' },
				],
				finalMessage: 'Resolved',
				requireReflectionSummary: true,
				requireApprovalArtifact: 'approval:publish-response',
				reflection: { name: 'answer', minIterations: 2 },
			}).success,
		).toBe(true)

		expect(
			evaluateTrajectory(envelopes, {
				mode: 'in-order',
				tools: ['support.1.lookupFaq'],
				artifacts: ['reflection:answer:summary'],
			}).success,
		).toBe(true)

		expect(
			evaluateTrajectory(envelopes, {
				mode: 'any-order',
				tools: ['support.1.lookupFaq'],
				artifacts: ['reflection:answer:summary'],
			}).success,
		).toBe(true)
	})

	it('reports mismatches clearly', () => {
		const result = evaluateTrajectory(envelopes, {
			mode: 'exact',
			tools: [{ name: 'support.1.calculate', statuses: ['success'] }],
			finalMessage: /Failed/,
		})

		expect(result.success).toBe(false)
		expect(result.failures).toEqual(
			expect.arrayContaining(['tool trajectory mismatch (exact)', 'final message did not match expected pattern']),
		)
	})

	it('supports explicit error expectations', () => {
		const errorEnvelopes = [
			...envelopes,
			createProtocolEnvelope({
				conversationId: 'c1',
				actor: { service: 'svc', version: '1', agent: 'agent', instanceId: 'i1' },
				frame: createErrorFrame({ code: '429', message: 'Agent toolCalls budget exceeded', handled: true }),
			}),
		]

		expect(
			evaluateTrajectory(errorEnvelopes, {
				errors: ['429', /budget exceeded/],
			}).success,
		).toBe(true)
	})

	it('supports approval status and artifact content expectations', () => {
		expect(
			evaluateTrajectory(envelopes, {
				approval: {
					checkpoint: 'publish-response',
					statuses: ['approved'],
				},
				artifacts: [{ id: 'approval:publish-response', phase: 'final', contentIncludes: 'approved' }],
			}).success,
		).toBe(true)
	})
})
