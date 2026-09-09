import { createIncidentBriefCommandBuilder } from './command/createIncidentBrief/createIncidentBriefCommandBuilder.js'
import { decideRollbackReviewCommandBuilder } from './command/decideRollbackReview/decideRollbackReviewCommandBuilder.js'
import { executeApprovedRollbackCommandBuilder } from './command/executeApprovedRollback/executeApprovedRollbackCommandBuilder.js'
import { getIncidentSnapshotCommandBuilder } from './command/getIncidentSnapshot/getIncidentSnapshotCommandBuilder.js'
import { getRunbookCommandBuilder } from './command/getRunbook/getRunbookCommandBuilder.js'
import { requestRollbackReviewCommandBuilder } from './command/requestRollbackReview/requestRollbackReviewCommandBuilder.js'
import { runTriageTicketCommandBuilder } from './command/runTriageTicket/runTriageTicketCommandBuilder.js'
import { supportHarness, supportHarnessPolicy } from './harness/supportHarness.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'

type CommandDefinition = Parameters<typeof supportV1ServiceBuilder.addCommandDefinition>[number]

const commandDefinitions: CommandDefinition[] = [
	getIncidentSnapshotCommandBuilder.getDefinition(),
	getRunbookCommandBuilder.getDefinition(),
	createIncidentBriefCommandBuilder.getDefinition(),
	requestRollbackReviewCommandBuilder.getDefinition(),
	decideRollbackReviewCommandBuilder.getDefinition(),
	executeApprovedRollbackCommandBuilder.getDefinition(),
	runTriageTicketCommandBuilder.getDefinition(),
]

export const supportV1Service = supportV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.mountHarness(supportHarness, supportHarnessPolicy)
