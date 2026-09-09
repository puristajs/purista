import { runClassifySupportMessageCommandBuilder } from './command/runClassifySupportMessage/runClassifySupportMessageCommandBuilder.js'
import { supportHarness, supportHarnessPolicy } from './harness/supportHarness.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'

export const supportV1Service = supportV1ServiceBuilder
	.addCommandDefinition(runClassifySupportMessageCommandBuilder.getDefinition())
	.mountHarness(supportHarness, supportHarnessPolicy)
