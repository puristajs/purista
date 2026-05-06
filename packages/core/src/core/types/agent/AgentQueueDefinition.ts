import type { Schema } from '../../../schema/index.js'
import type { QueueDefinition } from '../queue/QueueDefinition.js'
import type { QueueWorkerDefinition } from '../queue/QueueWorkerDefinition.js'

export type AgentDefinitionManifest = {
	agentName: string
	serviceVersion: string
	description?: string
	allowedTools: Array<{
		serviceName: string
		serviceVersion: string
		commandName: string
		description?: string
		payloadSchema?: Schema
		parameterSchema?: Schema
		outputSchema?: Schema
		toolName?: string
	}>
	allowedAgents?: Array<{
		agentName: string
		serviceVersion?: string
		description?: string
		payloadSchema?: Schema
		parameterSchema?: Schema
		outputSchema?: Schema
		toolName?: string
	}>
	payloadSchema?: Schema
	parameterSchema?: Schema
	outputSchema?: Schema
}

export type AgentQueueDefinition<
	Queue extends QueueDefinition = QueueDefinition,
	Worker extends QueueWorkerDefinition = QueueWorkerDefinition,
	Manifest extends AgentDefinitionManifest = AgentDefinitionManifest,
> = {
	queue: Queue
	worker: Worker
	manifest: Manifest
	__agentTypes?: unknown
}

export type AgentQueueDefinitionList = Promise<AgentQueueDefinition>[]

export type AgentQueueDefinitionListResolved = AgentQueueDefinition[]
