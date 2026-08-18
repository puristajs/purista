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
