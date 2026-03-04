import type { Schema } from '../../../schema/index.js'
import type { AgentInvocation, AgentProtocolPayload, AgentProtocolResponse } from './AgentProtocol.js'

/**
 * The list of agents which can be invoked by a command, subscription or stream.
 *
 * @group Agent
 */
export type AgentInvokeList = Record<
	string,
	Record<
		string,
		{
			call?: (payload: AgentProtocolPayload, parameter?: any) => AgentInvocation<AgentProtocolResponse>
			payloadSchema?: Schema
			parameterSchema?: Schema
		}
	>
>
