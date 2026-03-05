import { exposeAgentAsMCP } from '@purista/ai'

import { supportAgent } from '../../../../../agents/supportAgent/v1/supportAgent.js'
import { triageAgent } from '../../../../../agents/triageAgent/v1/triageAgent.js'
import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'
import { getMcpToolsOutputSchema } from './schema.js'

export const getMcpToolsCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('getMcpTools', 'Returns MCP-style tool descriptors exposed by this example app')
	.addOutputSchema(getMcpToolsOutputSchema)
	.exposeAsHttpEndpoint('GET', 'support/mcp/tools')
	.makeEndpointPublic()
	.setCommandFunction(async function () {
		return {
			tools: [exposeAgentAsMCP(supportAgent), exposeAgentAsMCP(triageAgent)],
		}
	})
