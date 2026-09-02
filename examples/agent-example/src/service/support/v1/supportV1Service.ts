import { analyzeSignalsAgentBuilder } from './agent/analyzeSignals/analyzeSignalsAgentBuilder.js'
import { assessRollbackRiskAgentBuilder } from './agent/assessRollbackRisk/assessRollbackRiskAgentBuilder.js'
import { coordinateIncidentResponseAgentBuilder } from './agent/coordinateIncidentResponse/coordinateIncidentResponseAgentBuilder.js'
import { reviewRollbackAgentBuilder } from './agent/reviewRollback/reviewRollbackAgentBuilder.js'
import { triageTicketAgentBuilder } from './agent/triageTicket/triageTicketAgentBuilder.js'
import { createIncidentBriefCommandBuilder } from './command/createIncidentBrief/createIncidentBriefCommandBuilder.js'
import { decideRollbackReviewCommandBuilder } from './command/decideRollbackReview/decideRollbackReviewCommandBuilder.js'
import { executeApprovedRollbackCommandBuilder } from './command/executeApprovedRollback/executeApprovedRollbackCommandBuilder.js'
import { getIncidentSnapshotCommandBuilder } from './command/getIncidentSnapshot/getIncidentSnapshotCommandBuilder.js'
import { getRunbookCommandBuilder } from './command/getRunbook/getRunbookCommandBuilder.js'
import { requestRollbackReviewCommandBuilder } from './command/requestRollbackReview/requestRollbackReviewCommandBuilder.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'

type PendingAgentDefinition = Parameters<typeof supportV1ServiceBuilder.addAgentDefinition>[number]
type CommandDefinition = Parameters<typeof supportV1ServiceBuilder.addCommandDefinition>[number]

const commandDefinitions: CommandDefinition[] = [
	getIncidentSnapshotCommandBuilder.getDefinition(),
	getRunbookCommandBuilder.getDefinition(),
	createIncidentBriefCommandBuilder.getDefinition(),
	requestRollbackReviewCommandBuilder.getDefinition(),
	decideRollbackReviewCommandBuilder.getDefinition(),
	executeApprovedRollbackCommandBuilder.getDefinition(),
]

const agentDefinitions: PendingAgentDefinition[] = [
	triageTicketAgentBuilder.getDefinition(),
	analyzeSignalsAgentBuilder.getDefinition(),
	assessRollbackRiskAgentBuilder.getDefinition(),
	coordinateIncidentResponseAgentBuilder.getDefinition(),
	reviewRollbackAgentBuilder.getDefinition(),
]

export const supportV1Service = supportV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.addAgentDefinition(...agentDefinitions)
