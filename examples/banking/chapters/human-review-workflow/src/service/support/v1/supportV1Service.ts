import { decideCardFreezeCommandBuilder } from './command/decideCardFreeze/decideCardFreezeCommandBuilder.js'
import { requestCardFreezeCommandBuilder } from './command/requestCardFreeze/requestCardFreezeCommandBuilder.js'
import { supportHarness, supportHarnessPolicy } from './harness/supportHarnessMount.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'

export const supportV1Service = supportV1ServiceBuilder
	.addCommandDefinition(requestCardFreezeCommandBuilder.getDefinition())
	.addCommandDefinition(decideCardFreezeCommandBuilder.getDefinition())
	.mountHarness(supportHarness, supportHarnessPolicy)
