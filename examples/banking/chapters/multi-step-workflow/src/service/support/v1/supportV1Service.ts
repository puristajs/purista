import { runResolveSupportCaseCommandBuilder } from './command/runResolveSupportCase/runResolveSupportCaseCommandBuilder.js'
import { supportHarness, supportHarnessPolicy } from './harness/supportHarness.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'

export const supportV1Service = supportV1ServiceBuilder
	.addCommandDefinition(runResolveSupportCaseCommandBuilder.getDefinition())
	.mountHarness(supportHarness, supportHarnessPolicy)
