import { analyzeSignalsAgentBuilder } from './agent/analyzeSignals/analyzeSignalsAgentBuilder.js'
import { assessRollbackRiskAgentBuilder } from './agent/assessRollbackRisk/assessRollbackRiskAgentBuilder.js'
import { coordinateIncidentResponseAgentBuilder } from './agent/coordinateIncidentResponse/coordinateIncidentResponseAgentBuilder.js'
import { triageTicketAgentBuilder } from './agent/triageTicket/triageTicketAgentBuilder.js'
import { createIncidentBriefCommandBuilder } from './command/createIncidentBrief/createIncidentBriefCommandBuilder.js'
import { getIncidentSnapshotCommandBuilder } from './command/getIncidentSnapshot/getIncidentSnapshotCommandBuilder.js'
import { getRunbookCommandBuilder } from './command/getRunbook/getRunbookCommandBuilder.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'

type AgentDefinition = Parameters<typeof supportV1ServiceBuilder.addAgentDefinition>[number]
type CommandDefinition = Parameters<typeof supportV1ServiceBuilder.addCommandDefinition>[number]

const commandDefinitions: CommandDefinition[] = [
	getIncidentSnapshotCommandBuilder.getDefinition(),
	getRunbookCommandBuilder.getDefinition(),
	createIncidentBriefCommandBuilder.getDefinition(),
]

const agentDefinitions: AgentDefinition[] = [
	await triageTicketAgentBuilder.getDefinition(),
	await analyzeSignalsAgentBuilder.getDefinition(),
	await assessRollbackRiskAgentBuilder.getDefinition(),
	await coordinateIncidentResponseAgentBuilder.getDefinition(),
]

export const supportV1Service = supportV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addAgentDefinition(...agentDefinitions)
