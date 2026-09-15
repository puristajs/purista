import { runAnswerTransactionQuestionCommandBuilder } from './command/runAnswerTransactionQuestion/runAnswerTransactionQuestionCommandBuilder.js'
import { supportHarness, supportHarnessPolicy } from './harness/supportHarness.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'
export const supportV1Service = supportV1ServiceBuilder
	.addCommandDefinition(runAnswerTransactionQuestionCommandBuilder.getDefinition())
	.mountHarness(supportHarness, supportHarnessPolicy)
