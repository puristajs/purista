export const AGENT_RUN_TARGET = 'run' as const

export const getAgentReceiverAddress = (agentName: string, agentVersion: string) =>
	({
		serviceName: agentName,
		serviceVersion: agentVersion,
		serviceTarget: AGENT_RUN_TARGET,
	}) as const
