import type { AgentInvocation, AgentProtocolPayload, AgentProtocolResponse } from '../types/agent/AgentProtocol.js'
import type { EBMessageAddress } from '../types/EBMessageAddress.js'
import type { EmptyObject } from '../types/EmptyObject.js'

export type AgentInvokeFunction = <
	InvokeResponseType = AgentProtocolResponse,
	PayloadType = AgentProtocolPayload,
	ParameterType extends EmptyObject = EmptyObject,
>(
	address: EBMessageAddress,
	payload: PayloadType,
	parameter: ParameterType,
) => AgentInvocation<InvokeResponseType>

const noop = () => {
	// noop
}

/**
 * Creates a proxy which allows to chain the agent invoke function.
 *
 * @param invokeOg the regular invoke function
 * @param address the receivers EBMessageAddress
 * @param lvl counter for recursive usage
 * @returns a proxy which allows to chain like agentName.serviceVersion.call(payload,parameter)
 */
export const createAgentInvokeFunctionProxy = <TFaux>(
	invokeOg: AgentInvokeFunction,
	address?: EBMessageAddress,
	lvl = 0,
): TFaux => {
	const adr: EBMessageAddress = {
		serviceName: '',
		serviceTarget: 'run',
		serviceVersion: '',
		...address,
	}

	return new Proxy(noop, {
		get(_obj: () => void, name) {
			if (typeof name !== 'string' || name === 'then' || name === 'catch' || name === 'finally') {
				return undefined
			}

			if (lvl === 0) {
				const na = {
					...adr,
					serviceName: name,
				}
				return createAgentInvokeFunctionProxy<TFaux>(invokeOg, na, lvl + 1)
			}
			if (lvl === 1) {
				const na = {
					...adr,
					serviceVersion: name,
				}
				return createAgentInvokeFunctionProxy<TFaux>(invokeOg, na, lvl + 1)
			}

			if (lvl === 2 && name === 'call') {
				return (payload: AgentProtocolPayload, parameter: EmptyObject = {}) => {
					return invokeOg<AgentProtocolResponse, AgentProtocolPayload, EmptyObject>(
						address as EBMessageAddress,
						payload,
						parameter,
					)
				}
			}
		},
	}) as TFaux
}
