import { supportV1ServiceBuilder } from '../../supportV1ServiceBuilder.js'
import { supportMcpTools } from '../mcpTools.js'
import { getMcpToolsOutputSchema } from './schema.js'

export const getMcpToolsCommandBuilder = supportV1ServiceBuilder
	.getCommandBuilder('getMcpTools', 'Returns MCP-style tool descriptors exposed by this example app')
	.addOutputSchema(getMcpToolsOutputSchema)
	.exposeAsHttpEndpoint('GET', 'support/mcp/tools')
	.makeEndpointPublic()
	.setCommandFunction(async function () {
		return {
			tools: supportMcpTools,
		}
	})
