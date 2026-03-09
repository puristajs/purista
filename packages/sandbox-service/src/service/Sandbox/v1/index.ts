import { createSandboxCommandBuilder } from './command/createSandbox/createSandboxCommandBuilder.js'
import { destroySandboxCommandBuilder } from './command/destroySandbox/destroySandboxCommandBuilder.js'
import { executeBashCommandBuilder } from './command/executeBash/executeBashCommandBuilder.js'
import { readFileCommandBuilder } from './command/readFile/readFileCommandBuilder.js'
import { writeFilesCommandBuilder } from './command/writeFiles/writeFilesCommandBuilder.js'
import { sandboxServiceBuilder } from './SandboxServiceBuilder.js'
import { reconcileOnStartupSubscriptionBuilder } from './subscription/reconcileOnStartup/reconcileOnStartupSubscriptionBuilder.js'

// Register all commands
sandboxServiceBuilder
	.addCommandDefinition(createSandboxCommandBuilder.getDefinition())
	.addCommandDefinition(destroySandboxCommandBuilder.getDefinition())
	.addCommandDefinition(readFileCommandBuilder.getDefinition())
	.addCommandDefinition(writeFilesCommandBuilder.getDefinition())
	.addCommandDefinition(executeBashCommandBuilder.getDefinition())

// Register subscriptions
sandboxServiceBuilder.addSubscriptionDefinition(reconcileOnStartupSubscriptionBuilder.getDefinition())

export * from './resources/SandboxRegistry.js'
// Export all components
export * from './SandboxServiceBuilder.js'
export * from './SandboxServiceConfig.js'
