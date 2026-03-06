import { exposeToolsAsMCP, type MCPCommandDescriptorInput } from '@purista/ai'

import { supportAgent } from '../../../../agents/supportAgent/v1/supportAgent.js'
import { triageAgent } from '../../../../agents/triageAgent/v1/triageAgent.js'
import { calculateInputSchema } from './calculate/schema.js'
import { fetchWebsiteInputSchema } from './fetchWebsite/schema.js'
import { lookupFaqInputSchema } from './lookupFaq/schema.js'

const commandTools: MCPCommandDescriptorInput[] = [
	{
		serviceName: 'support',
		serviceVersion: '1',
		commandName: 'lookupFaq',
		description: 'Looks up support FAQ entries by question',
		payloadSchema: lookupFaqInputSchema,
	},
	{
		serviceName: 'support',
		serviceVersion: '1',
		commandName: 'calculate',
		description: 'Evaluates a math expression',
		payloadSchema: calculateInputSchema,
	},
	{
		serviceName: 'support',
		serviceVersion: '1',
		commandName: 'fetchWebsite',
		description: 'Fetches and extracts readable content from a public website',
		payloadSchema: fetchWebsiteInputSchema,
	},
]

export const supportMcpTools = exposeToolsAsMCP({
	agents: [supportAgent, triageAgent],
	commands: commandTools,
})

export const supportMcpToolTargets = {
	supportAgent: { kind: 'agent', agentName: 'supportAgent' },
	triageAgent: { kind: 'agent', agentName: 'triageAgent' },
	'support.1.lookupFaq': { kind: 'command', commandName: 'lookupFaq' },
	'support.1.calculate': { kind: 'command', commandName: 'calculate' },
	'support.1.fetchWebsite': { kind: 'command', commandName: 'fetchWebsite' },
} as const

export type SupportMcpToolName = keyof typeof supportMcpToolTargets
