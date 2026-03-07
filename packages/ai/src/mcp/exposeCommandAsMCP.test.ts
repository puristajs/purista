import { describe, expect, it } from 'vitest'

import { exposeAgentAsMCP } from './exposeAgentAsMCP.js'
import { exposeCommandAsMCP, exposeCommandsAsMCP, exposeToolsAsMCP } from './exposeCommandAsMCP.js'

const agentDefinition = {
	info: {
		agentName: 'supportAgent',
		agentVersion: '1',
	},
	manifest: {
		agentName: 'supportAgent',
		agentVersion: '1',
		description: 'Support agent',
		eventBridge: 'default',
		allowedTools: [],
	},
} as const as any

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
