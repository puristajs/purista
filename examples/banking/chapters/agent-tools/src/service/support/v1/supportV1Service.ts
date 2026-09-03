import { answerTransactionQuestionCommandBuilder } from './command/answerTransactionQuestion/answerTransactionQuestionCommandBuilder.js'
import { supportHarness, supportHarnessPolicy } from './harness/supportHarnessMount.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'

export const supportV1Service = supportV1ServiceBuilder
	.addCommandDefinition(answerTransactionQuestionCommandBuilder.getDefinition())
	.mountHarness(supportHarness, supportHarnessPolicy)
