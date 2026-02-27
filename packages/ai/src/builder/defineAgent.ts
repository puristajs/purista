import { AgentBuilder } from './AgentBuilder.js'

type LegacyAgentInfo = {
	name: string
	description?: string
	version?: string
}

/**
 * @deprecated use `AgentBuilder.create` instead.
 */
export const defineAgent = (info: LegacyAgentInfo) => {
	return AgentBuilder.create({
		agentName: info.name,
		agentVersion: info.version ?? '1',
		description: info.description,
	})
}
