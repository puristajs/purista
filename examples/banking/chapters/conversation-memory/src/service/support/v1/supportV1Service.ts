import { clearConversationHistoryCommandBuilder } from './command/clearConversationHistory/clearConversationHistoryCommandBuilder.js'
import { continueSupportConversationCommandBuilder } from './command/continueSupportConversation/continueSupportConversationCommandBuilder.js'
import { getConversationHistoryCommandBuilder } from './command/getConversationHistory/getConversationHistoryCommandBuilder.js'
import { supportHarness, supportHarnessPolicy } from './harness/supportHarnessMount.js'
import { supportV1ServiceBuilder } from './supportV1ServiceBuilder.js'

export const supportV1Service = supportV1ServiceBuilder
	.addCommandDefinition(continueSupportConversationCommandBuilder.getDefinition())
	.addCommandDefinition(getConversationHistoryCommandBuilder.getDefinition())
	.addCommandDefinition(clearConversationHistoryCommandBuilder.getDefinition())
	.mountHarness(supportHarness, supportHarnessPolicy)
