export const AGENT_RUN_TARGET = 'run' as const

export const getAgentReceiverAddress = (agentName: string, serviceVersion: string) =>
	({
		serviceName: agentName,
		serviceVersion: serviceVersion,
		serviceTarget: AGENT_RUN_TARGET,
	}) as const
