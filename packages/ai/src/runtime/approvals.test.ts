import { HandledError } from '@purista/core'
import { describe, expect, it } from 'vitest'
import { createAgentContextMock } from '../testing/createAgentContextMock.js'
import { getApprovalStateKey, writeApprovalDecision } from './approvals.js'

describe('approval helpers', () => {
	it('returns approved decisions and exposes a canonical decision key', async () => {
		const mock = createAgentContextMock({
			payload: { prompt: 'hello' },
			manifest: {
				agentName: 'approvalAgent',
				serviceVersion: '1',
			},
		})

		setTimeout(() => {
			void writeApprovalDecision(mock.stubs.states, 'approvalAgent', '1', 'publish', {
				status: 'approved',
				decisionBy: 'ops-user',
				updatedAt: new Date().toISOString(),
			})
		}, 10)

		const approved = await mock.context.runtime.approvals.wait({
			checkpoint: 'publish',
			timeoutMs: 250,
			pollIntervalMs: 5,
		})

		expect(approved.status).toBe('approved')
		expect(approved.decision?.decisionBy).toBe('ops-user')
		expect(mock.context.runtime.approvals.stateKey('publish')).toBe(
			getApprovalStateKey('approvalAgent', '1', 'publish'),
		)
		expect(mock.stubs.startActiveSpan.calls.some(([name]) => name === 'ai.approval.wait')).toBe(true)
	})

	it('throws when a checkpoint is rejected', async () => {
		const mock = createAgentContextMock({
			payload: { prompt: 'hello' },
			manifest: {
				agentName: 'approvalAgent',
				serviceVersion: '1',
			},
		})

		setTimeout(() => {
			void mock.context.runtime.approvals.decide({
				checkpoint: 'delete',
				status: 'rejected',
				decisionBy: 'reviewer',
				reason: 'manual review failed',
				updatedAt: new Date().toISOString(),
			})
		}, 10)

		await expect(
			mock.context.runtime.approvals.wait({
				checkpoint: 'delete',
				timeoutMs: 250,
				pollIntervalMs: 5,
			}),
		).rejects.toBeInstanceOf(HandledError)
	})

	it('fails on expiry by default and can return expired when explicitly requested', async () => {
		const mock = createAgentContextMock({
			payload: { prompt: 'hello' },
			manifest: {
				agentName: 'approvalAgent',
				serviceVersion: '1',
			},
		})

		await expect(
			mock.context.runtime.approvals.wait({
				checkpoint: 'slow-path',
				timeoutMs: 20,
				pollIntervalMs: 5,
			}),
		).rejects.toBeInstanceOf(HandledError)

		const expired = await mock.context.runtime.approvals.wait({
			checkpoint: 'optional-path',
			timeoutMs: 20,
			pollIntervalMs: 5,
			onExpiry: 'return-expired',
		})

		expect(expired.status).toBe('expired')
	})
})
