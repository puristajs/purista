import { deskV1ServiceBuilder } from '../../deskV1ServiceBuilder.js'
import { getDeskMcpTools } from '../mcpTools.js'
import { getMcpToolsOutputSchema } from './schema.js'

export const getMcpToolsCommandBuilder = deskV1ServiceBuilder
	.getCommandBuilder('getMcpTools', 'Returns MCP-style tool descriptors exposed by this example app')
	.addOutputSchema(getMcpToolsOutputSchema)
	.exposeAsHttpEndpoint('GET', 'desk/mcp/tools')
	.makeEndpointPublic()
	.setCommandFunction(async function () {
		return {
			tools: await getDeskMcpTools(),
		}
	})
