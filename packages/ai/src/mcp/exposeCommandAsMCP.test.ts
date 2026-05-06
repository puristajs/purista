import { describe, expect, it } from 'vitest'
import type { AgentDefinition } from '../types/AgentDefinition.js'

import { exposeAgentAsMCP } from './exposeAgentAsMCP.js'
import { exposeCommandAsMCP, exposeCommandsAsMCP, exposeToolsAsMCP } from './exposeCommandAsMCP.js'

const agentDefinition: AgentDefinition = {
	info: {
		agentName: 'supportAgent',
		serviceVersion: '1',
	},
	manifest: {
		agentName: 'supportAgent',
		serviceVersion: '1',
		description: 'Support agent',
		eventBridge: 'default',
		allowedTools: [],
	},
	schemas: {},
	getManifest: () => agentDefinition.manifest,
	getExternalRuntimeMetadata: () => ({ commands: [], agents: [] }),
	getInstance: async () => {
		throw new Error('not implemented in test fixture')
	},
	getDefaultConfig: () => undefined,
}

describe('exposeCommandAsMCP', () => {
	it('maps a command descriptor to MCP shape', () => {
		expect(
			exposeCommandAsMCP({
				serviceName: 'support',
				serviceVersion: '1',
				commandName: 'lookupFaq',
				description: 'Lookup FAQ',
				payloadSchema: { type: 'object' },
			}),
		).toEqual({
			name: 'support.1.lookupFaq',
			description: 'Lookup FAQ',
			parameters: {
				inputSchema: { type: 'object' },
			},
		})
	})

	it('supports mixed agent and command exposure', () => {
		expect(
			exposeToolsAsMCP({
				agents: [agentDefinition],
				commands: [
					{
						serviceName: 'support',
						serviceVersion: '1',
						commandName: 'lookupFaq',
					},
				],
			}),
		).toEqual([
			exposeAgentAsMCP(agentDefinition),
			{
				name: 'support.1.lookupFaq',
				description: undefined,
				parameters: {
					inputSchema: undefined,
				},
			},
		])
	})

	it('throws on duplicate MCP tool names', () => {
		expect(() =>
			exposeToolsAsMCP({
				agents: [agentDefinition],
				commands: [
					{
						serviceName: 'support',
						serviceVersion: '1',
						commandName: 'lookupFaq',
						toolName: 'supportAgent',
					},
				],
			}),
		).toThrow('Duplicate MCP tool name "supportAgent"')
	})

	it('maps multiple commands in order', () => {
		expect(
			exposeCommandsAsMCP([
				{ serviceName: 'support', serviceVersion: '1', commandName: 'lookupFaq' },
				{ serviceName: 'support', serviceVersion: '1', commandName: 'calculate' },
			]),
		).toEqual([
			{ name: 'support.1.lookupFaq', description: undefined, parameters: { inputSchema: undefined } },
			{ name: 'support.1.calculate', description: undefined, parameters: { inputSchema: undefined } },
		])
	})
})
