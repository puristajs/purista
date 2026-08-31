import { analyzeSignalsAgentBuilder } from './agent/analyzeSignals/analyzeSignalsAgentBuilder.js'
import { assessRollbackRiskAgentBuilder } from './agent/assessRollbackRisk/assessRollbackRiskAgentBuilder.js'
import { coordinateIncidentResponseAgentBuilder } from './agent/coordinateIncidentResponse/coordinateIncidentResponseAgentBuilder.js'
import { triageTicketAgentBuilder } from './agent/triageTicket/triageTicketAgentBuilder.js'
import { reviewRollbackAgentBuilder } from './agent/reviewRollback/reviewRollbackAgentBuilder.js'
import { createIncidentBriefCommandBuilder } from './command/createIncidentBrief/createIncidentBriefCommandBuilder.js'
import { getIncidentSnapshotCommandBuilder } from './command/getIncidentSnapshot/getIncidentSnapshotCommandBuilder.js'
import { getRunbookCommandBuilder } from './command/getRunbook/getRunbookCommandBuilder.js'
import { decideRollbackReviewCommandBuilder } from './command/decideRollbackReview/decideRollbackReviewCommandBuilder.js'
import { executeApprovedRollbackCommandBuilder } from './command/executeApprovedRollback/executeApprovedRollbackCommandBuilder.js'
import { requestRollbackReviewCommandBuilder } from './command/requestRollbackReview/requestRollbackReviewCommandBuilder.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'

type AgentDefinition = Parameters<typeof supportV1ServiceBuilder.addAgentDefinition>[number]
type CommandDefinition = Parameters<typeof supportV1ServiceBuilder.addCommandDefinition>[number]

const commandDefinitions: CommandDefinition[] = [
	getIncidentSnapshotCommandBuilder.getDefinition(),
	getRunbookCommandBuilder.getDefinition(),
	createIncidentBriefCommandBuilder.getDefinition(),
	requestRollbackReviewCommandBuilder.getDefinition(),
	decideRollbackReviewCommandBuilder.getDefinition(),
	executeApprovedRollbackCommandBuilder.getDefinition(),
]

const agentDefinitions: AgentDefinition[] = [
	await triageTicketAgentBuilder.getDefinition(),
	await analyzeSignalsAgentBuilder.getDefinition(),
	await assessRollbackRiskAgentBuilder.getDefinition(),
	await coordinateIncidentResponseAgentBuilder.getDefinition(),
	await reviewRollbackAgentBuilder.getDefinition(),
]

export const supportV1Service = supportV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addAgentDefinition(...agentDefinitions)
