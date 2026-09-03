import { freezeCardCommandBuilder } from './command/freezeCard/freezeCardCommandBuilder.js'
import { transactionV1ServiceBuilder } from './transactionV1ServiceBuilder.js'

export const transactionV1Service = transactionV1ServiceBuilder.addCommandDefinition(
	freezeCardCommandBuilder.getDefinition(),
)
