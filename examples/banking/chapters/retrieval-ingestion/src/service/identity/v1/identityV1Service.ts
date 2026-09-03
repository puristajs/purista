import { loginCommandBuilder } from './command/login/loginCommandBuilder.js'
import { resolveSessionCommandBuilder } from './command/resolveSession/resolveSessionCommandBuilder.js'
import { identityV1ServiceBuilder } from './identityV1ServiceBuilder.js'

export const identityV1Service = identityV1ServiceBuilder.addCommandDefinition(
	loginCommandBuilder.getDefinition(),
	resolveSessionCommandBuilder.getDefinition(),
)
