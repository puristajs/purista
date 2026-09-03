import { answerProcedureQuestionCommandBuilder } from './command/answerProcedureQuestion/answerProcedureQuestionCommandBuilder.js'
import { supportHarness, supportHarnessPolicy } from './harness/supportHarnessMount.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'

export const supportV1Service = supportV1ServiceBuilder
	.addCommandDefinition(answerProcedureQuestionCommandBuilder.getDefinition())
	.mountHarness(supportHarness, supportHarnessPolicy)
