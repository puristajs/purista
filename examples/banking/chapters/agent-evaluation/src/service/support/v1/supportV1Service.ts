import { classifySupportMessageCommandBuilder } from './command/classifySupportMessage/classifySupportMessageCommandBuilder.js'
import { classificationHarness, supportHarnessPolicy } from './harness/supportHarnessMount.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'

export const supportV1Service = supportV1ServiceBuilder
	.addCommandDefinition(classifySupportMessageCommandBuilder.getDefinition())
	.mountHarness(classificationHarness, supportHarnessPolicy)
