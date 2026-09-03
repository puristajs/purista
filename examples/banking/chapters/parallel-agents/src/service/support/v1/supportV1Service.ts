import { analyzeSupportCaseCommandBuilder } from './command/analyzeSupportCase/analyzeSupportCaseCommandBuilder.js'
import { supportHarness, supportHarnessPolicy } from './harness/supportHarnessMount.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'

export const supportV1Service = supportV1ServiceBuilder
	.addCommandDefinition(analyzeSupportCaseCommandBuilder.getDefinition())
	.mountHarness(supportHarness, supportHarnessPolicy)
