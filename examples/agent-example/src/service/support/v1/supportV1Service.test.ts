import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DefaultEventBridge, getCommandMessageMock, initLogger } from '@purista/core'
import { localDurableExecution } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'

import { IncidentRepository } from '../../../resource/incidentRepository.js'
import { InMemoryRollbackReviewRepository } from '../../../resource/rollbackReviewRepository.js'
import { analyzeSignalsAgent } from './harness/agent/analyzeSignals/analyzeSignalsAgent.js'
import { supportHarness, supportHarnessPolicy } from './harness/supportHarness.js'
import { supportV1SignalAnalysisInputPayloadSchema, supportV1SignalAnalysisOutputPayloadSchema } from './schema.js'
import { supportV1Service } from './supportV1Service.js'

const analyzeSignalsForTestCommandBuilder = supportV1Service
	.getCommandBuilder('analyzeSignalsForTest', 'Exercises the mounted host-tool path')
	.addPayloadSchema(supportV1SignalAnalysisInputPayloadSchema)
	.addOutputSchema(supportV1SignalAnalysisOutputPayloadSchema)
	.canInvokeAgent('Support', '1', analyzeSignalsAgent.contract)
	.setCommandFunction(async function ({ agent }, payload) {
		const result = await agent.Support['1'][analyzeSignalsAgent.contract.id].run(payload, {
			sessionId: `incident:${payload.incidentId}`,
		})
		if (result.outcome.status !== 'completed') throw new Error('The signal analysis was interrupted unexpectedly.')
		return result.outcome.output
	})

supportV1Service.addCommandDefinition(analyzeSignalsForTestCommandBuilder.getDefinition())

describe('supportV1Service', () => {
	it('contains native commands without generated agent transports', async () => {
		const definitions = await supportV1Service.resolveDefinitions()
		const commandNames = definitions.commands.map(command => command.commandName)
		expect(Object.keys(supportHarness.contracts.agents)).toEqual(['triageTicket', 'analyzeSignals'])
		expect(Object.keys(supportHarness.contracts.workflows)).toEqual(['reviewRollback'])
		expect(supportHarnessPolicy.targets).toEqual({
			agents: { triageTicket: {}, analyzeSignals: {} },
			workflows: { reviewRollback: {} },
		})

		expect(commandNames).toEqual(
			expect.arrayContaining([
				'getIncidentSnapshot',
				'getRunbook',
				'createIncidentBrief',
				'runTriageTicket',
				'requestRollbackReview',
				'decideRollbackReview',
				'executeApprovedRollback',
			]),
		)
		expect(definitions.queues).toEqual([])
		expect(definitions.queueWorkers).toEqual([])
		expect(definitions.streams).toEqual([])
	})

	it('runs service-owned host tools only through the mounted Harness', async () => {
		const provider = new FakeModelProvider({ strict: true })
		const usage = { inputTokens: 8, outputTokens: 6, totalTokens: 14 }
		provider.enqueueObject({
			object: {
				rootCauseHypothesis: 'Awaiting evidence.',
				confidence: 'low',
				evidence: ['pending'],
				nextDiagnostics: ['pending'],
			},
			toolCalls: [
				{ id: 'snapshot-1', name: 'getIncidentSnapshot', arguments: { incidentId: 'INC-2026-042' } },
				{ id: 'runbook-1', name: 'getRunbook', arguments: { service: 'checkout-api' } },
			],
			usage,
			finishReason: 'tool_calls',
		})
		const expected = {
			rootCauseHypothesis: 'The gateway rollout broke retry idempotency validation.',
			confidence: 'high' as const,
			evidence: ['Error rate increased two minutes after CHG-8821.', 'The runbook calls for rollback above 5%.'],
			nextDiagnostics: ['Compare the gateway adapter with the previous production version.'],
		}
		provider.enqueueObject({ object: expected, usage, finishReason: 'stop' })

		const root = await mkdtemp(join(tmpdir(), 'purista-agent-example-mounted-'))
		const execution = localDurableExecution({ root, exec: false })
		const logger = initLogger('fatal')
		const eventBridge = new DefaultEventBridge({ logger })
		await eventBridge.start()
		let service: Awaited<ReturnType<typeof supportV1Service.getInstance>> | undefined

		try {
			service = await supportV1Service.getInstance(eventBridge, {
				logger,
				resources: {
					incidentRepository: new IncidentRepository(),
					rollbackReviewRepository: new InMemoryRollbackReviewRepository(),
					harnessStorage: execution.storage,
				},
				ai: { storage: execution.storage, model: { provider, model: 'fake' } },
			})
			await service.start()
			const request = getCommandMessageMock({
				receiver: { serviceName: 'Support', serviceVersion: '1', serviceTarget: 'analyzeSignalsForTest' },
				payload: { payload: { incidentId: 'INC-2026-042' }, parameter: {} },
			})
			const {
				id: _id,
				messageType: _messageType,
				timestamp: _timestamp,
				correlationId: _correlationId,
				...message
			} = request
			await expect(eventBridge.invoke(message)).resolves.toEqual(expected)
			const toolMessages = provider.requests[1]?.messages.filter(entry => entry.role === 'tool') ?? []
			expect(toolMessages).toHaveLength(2)
			expect(toolMessages.map(entry => entry.content).join('\n')).toContain('INC-2026-042')
			expect(toolMessages.map(entry => entry.content).join('\n')).toContain('Stabilize checkout first')
			provider.assertExhausted()
		} finally {
			await service?.destroy()
			await eventBridge.destroy()
			await execution.close()
			await rm(root, { recursive: true, force: true })
		}
	})
})
