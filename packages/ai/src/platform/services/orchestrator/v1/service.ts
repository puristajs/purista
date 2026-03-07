import { enqueueRunCommandBuilder } from './command/enqueueRun.js'
import { planWorkloadCommandBuilder } from './command/planWorkload.js'
import { aiOrchestratorServiceBuilder } from './info.js'

const commandDefinitions: Parameters<typeof aiOrchestratorServiceBuilder.addCommandDefinition>[number][] = [
	planWorkloadCommandBuilder.getDefinition(),
	enqueueRunCommandBuilder.getDefinition(),
]

export const aiOrchestratorService = aiOrchestratorServiceBuilder.addCommandDefinition(...commandDefinitions)
