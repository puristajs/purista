import { runAnswerProcedureQuestionCommandBuilder } from './command/runAnswerProcedureQuestion/runAnswerProcedureQuestionCommandBuilder.js'
import { supportHarness, supportHarnessPolicy } from './harness/supportHarness.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'

export const supportV1Service = supportV1ServiceBuilder
	.addCommandDefinition(runAnswerProcedureQuestionCommandBuilder.getDefinition())
	.mountHarness(supportHarness, supportHarnessPolicy)
