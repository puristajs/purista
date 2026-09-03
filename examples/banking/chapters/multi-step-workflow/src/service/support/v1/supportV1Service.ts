import { resolveSupportCaseCommandBuilder } from './command/resolveSupportCase/resolveSupportCaseCommandBuilder.js'
import { supportHarness, supportHarnessPolicy } from './harness/supportHarnessMount.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'

export const supportV1Service = supportV1ServiceBuilder
	.addCommandDefinition(resolveSupportCaseCommandBuilder.getDefinition())
	.mountHarness(supportHarness, supportHarnessPolicy)
