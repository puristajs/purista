import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import type { ConfigStore, EventBridge, Logger, QueueBridge, Schema, SecretStore, StateStore } from '@purista/core'

import type { KnowledgeAdapter } from '../knowledge/adapters/inMemoryAdapter.js'
import type { SessionStore } from '../memory/sessionStore.js'
import type { PoolManager } from '../pools/PoolManager.js'
import type { AgentProtocolEnvelope } from '../protocol/types.js'
import type { AgentManifest } from './AgentManifest.js'

export type AgentInfo = {
	agentName: string
	agentVersion: string
	description?: string
}

export type AgentDefinition = {
	info: AgentInfo
	manifest: AgentManifest
	schemas: {
		payload?: Schema
		parameter?: Schema
		output?: Schema
		context?: Schema
	}
	getManifest(): AgentManifest
	getInstance(options: AgentInstanceOptions): Promise<AgentRuntimeInstance>
}

export type AgentRuntimeInstance = {
	start(): Promise<void>
	stop(): Promise<void>
	invoke(request: AgentInvokeRequest, contextOverrides?: Partial<AgentInvokeContext>): Promise<AgentInvokeResult>
}

export type AgentInstanceOptions = {
	eventBridge: EventBridge
	logger?: Logger
	spanProcessor?: SpanProcessor
	secretStore?: SecretStore
	configStore?: ConfigStore
	stateStore?: StateStore
	queueBridge?: QueueBridge
	sessionStore?: SessionStore
	knowledgeAdapters?: Record<string, KnowledgeAdapter>
	poolManager?: PoolManager
	resources?: Record<string, unknown>
	config?: Record<string, unknown>
}

export type AgentInvokeRequest = {
	payload: unknown
	parameter?: unknown
	correlationId?: string
	sessionId?: string
	stream?: AgentStreamResponder
	timeoutMs?: number
	principalId?: string
	tenantId?: string
}

export type AgentInvokeContext = {
	stream?: AgentStreamResponder
}

export type AgentStreamResponder = {
	onFrame(frame: AgentProtocolEnvelope): void
	onComplete(): void
	onError(error: unknown): void
}

export type AgentInvokeResult = {
	envelopes: AgentProtocolEnvelope[]
}
