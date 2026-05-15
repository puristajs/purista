import { triageTicketAgentBuilder } from './agent/triageTicket/triageTicketAgentBuilder.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'

type AgentDefinition = Parameters<typeof supportV1ServiceBuilder.addAgentDefinition>[number]

const agentDefinitions: AgentDefinition[] = [await triageTicketAgentBuilder.getDefinition()]

export const supportV1Service = supportV1ServiceBuilder.addAgentDefinition(...agentDefinitions)
