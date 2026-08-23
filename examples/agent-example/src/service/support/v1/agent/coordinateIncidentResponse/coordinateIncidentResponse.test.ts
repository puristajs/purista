import { describe, expect, it } from 'vitest'

import { assessRollbackRiskAgentBuilder } from '../assessRollbackRisk/assessRollbackRiskAgentBuilder.js'
import { coordinateIncidentResponseAgentBuilder } from './coordinateIncidentResponseAgentBuilder.js'

describe('coordinateIncidentResponseAgentBuilder', () => {
	it('declares command tools, child agents, skills, and workflow definitions', async () => {
		const definition = await coordinateIncidentResponseAgentBuilder.getDefinition()

		expect(definition.manifest.allowedCommands.map(command => command.commandName)).toEqual([
			'getIncidentSnapshot',
			'getRunbook',
			'createIncidentBrief',
		])
		expect(definition.manifest.allowedAgents.map(agent => agent.agentName)).toEqual([
			'analyzeSignals',
			'assessRollbackRisk',
		])
		expect(definition.manifest.usedSkills).toEqual([
			{
				names: ['incident-command', 'customer-communication', 'rollback-decisioning'],
				resourceName: 'incident-response-skills',
			},
		])
		expect(definition.manifest.response).toBeUndefined()
		expect(definition.manifest.session).toEqual({
			mode: 'conversation',
			payloadPath: ['incidentId'],
			retention: {
				idleTtlMs: 30 * 24 * 60 * 60_000,
				history: { maxTurns: 50, maxBytes: 256_000 },
				runs: { maxPerSession: 20 },
				events: { maxPerRun: 500 },
			},
		})
		expect(definition.command.commandName).toBe('coordinateIncidentResponse')
		expect(definition.queue.queueName).toBe('agent:Support:1:coordinateIncidentResponse')
	})

	it('uses the application-wired sandbox for rollback risk assessment', async () => {
		const definition = await assessRollbackRiskAgentBuilder.getDefinition()

		expect(definition.manifest.sandbox).toEqual({ enabled: true })
		expect(definition.manifest.usedSkills).toEqual([
			{
				names: ['rollback-safety-review', 'change-impact-analysis'],
				resourceName: 'incident-response-skills',
			},
		])
	})
})
