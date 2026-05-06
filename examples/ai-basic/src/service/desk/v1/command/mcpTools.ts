import { exposeToolsAsMCP, type MCPCommandDescriptorInput } from '@purista/ai'
import { architectureReviewAgentBuilder } from '../agent/architectureReviewAgent/architectureReviewAgentBuilder.js'
import { researchAgentBuilder } from '../agent/researchAgent/researchAgentBuilder.js'
import { calculateInputSchema } from './calculate/schema.js'
import { fetchWebsiteInputSchema } from './fetchWebsite/schema.js'
import { lookupFaqInputSchema } from './lookupFaq/schema.js'

const commandTools: MCPCommandDescriptorInput[] = [
	{
		serviceName: 'desk',
		serviceVersion: '1',
		commandName: 'lookupFaq',
		description: 'Looks up Developer Desk FAQ entries by question',
		payloadSchema: lookupFaqInputSchema,
	},
	{
		serviceName: 'desk',
		serviceVersion: '1',
		commandName: 'calculate',
		description: 'Evaluates a math expression',
		payloadSchema: calculateInputSchema,
	},
	{
		serviceName: 'desk',
		serviceVersion: '1',
		commandName: 'fetchWebsite',
		description: 'Fetches and extracts readable content from a public website',
		payloadSchema: fetchWebsiteInputSchema,
	},
]

export const getDeskMcpTools = async () => {
	const researchAgentManifest = await researchAgentBuilder.getManifest()
	const architectureReviewAgentManifest = await architectureReviewAgentBuilder.getManifest()

	return exposeToolsAsMCP({
		agents: [{ manifest: researchAgentManifest }, { manifest: architectureReviewAgentManifest }],
		commands: commandTools,
	})
}

export const deskMcpToolTargets = {
	researchAgent: { kind: 'agent', agentName: 'researchAgent' },
	architectureReviewAgent: { kind: 'agent', agentName: 'architectureReviewAgent' },
	'desk.1.lookupFaq': { kind: 'command', commandName: 'lookupFaq' },
	'desk.1.calculate': { kind: 'command', commandName: 'calculate' },
	'desk.1.fetchWebsite': { kind: 'command', commandName: 'fetchWebsite' },
} as const

export type DeskMcpToolName = keyof typeof deskMcpToolTargets
