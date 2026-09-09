import { runAnalyzeSupportCaseCommandBuilder } from './command/runAnalyzeSupportCase/runAnalyzeSupportCaseCommandBuilder.js'
import { supportHarness, supportHarnessPolicy } from './harness/supportHarness.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'

export const supportV1Service = supportV1ServiceBuilder
	.addCommandDefinition(runAnalyzeSupportCaseCommandBuilder.getDefinition())
	.mountHarness(supportHarness, supportHarnessPolicy)
