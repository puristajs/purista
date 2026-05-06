import type { QueueWorkerAfterGuardHook, QueueWorkerBeforeGuardHook, QueueWorkerDefinition } from '@purista/core'
import { QueueWorkerBuilder } from '@purista/core'

import type { AgentExecutionPolicy } from '../types/AgentManifest.js'

export type AgentWorkerContext = {
	agentName: string
	serviceVersion: string
	manifest: unknown
	executionPolicy: AgentExecutionPolicy
	models: Record<string, unknown>
	resources: Record<string, unknown>
	skills?: Record<string, unknown>
}

export class AgentWorkerBuilder extends QueueWorkerBuilder {
	private agentContext?: AgentWorkerContext

	setAgentContext(context: AgentWorkerContext): this {
		this.agentContext = context
		return this
	}

	getAgentContext(): AgentWorkerContext | undefined {
		return this.agentContext
	}

	async getAgentDefinition(): Promise<QueueWorkerDefinition> {
		return this.getDefinition()
	}
}

export type AgentWorkerDefinition = {
	name: string
	queueName: string
	mode: 'continuous' | 'interval' | 'sequential'
	intervalMs?: number
	maxParallelHandlers: number
	handler: (context: unknown, message: unknown) => Promise<unknown>
	beforeGuards: Record<string, QueueWorkerBeforeGuardHook>
	afterGuards: Record<string, QueueWorkerAfterGuardHook>
	agentContext?: AgentWorkerContext
}
