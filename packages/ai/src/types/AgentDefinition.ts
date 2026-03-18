import type { Tracer } from '@opentelemetry/api'
import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import type { ConfigStore, EventBridge, Logger, QueueBridge, Schema, SecretStore, StateStore } from '@purista/core'

import type { KnowledgeAdapter } from '../knowledge/adapters/inMemoryAdapter.js'
import type { ConversationStore } from '../memory/conversationStore.js'
import type { PoolManager } from '../pools/PoolManager.js'
import type { AgentProtocolEnvelope } from '../protocol/types.js'
import type { ModelProvider } from '../providers/runtime/ModelProvider.js'
import type { AgentManifest } from './AgentManifest.js'

export type AgentInfo = {
	agentName: string
	agentVersion: string
	description?: string
	successEventName?: string
}

type BaseAgentInstanceOptions = {
	logger?: Logger
	spanProcessor?: SpanProcessor
	tracer?: Tracer
	secretStore?: SecretStore
	configStore?: ConfigStore
	stateStore?: StateStore
	queueBridge?: QueueBridge
	conversationStore?: ConversationStore
	poolManager?: PoolManager
	models?: Record<string, ModelProvider>
	/** @deprecated use `models` */
	resources?: Record<string, unknown>
	poolConfig?: {
		poolId?: string
		/**
		 * Maximum number of concurrent agent runs per process/instance.
		 * Total system throughput is derived by deployment replicas:
		 * `effectiveMaxConcurrency = replicas * maxConcurrencyPerInstance`.
		 */
		maxConcurrencyPerInstance?: number
	}
	/**
	 * Optional host-provided hints for dashboards and alerts.
	 * These values are informational only and never used for runtime admission control.
	 */
	concurrencyHints?: {
		replicaCountHint?: number
	}
	config?: Record<string, unknown>
}

export type AgentInstanceOptions<KnowledgeAliases extends string = never> = BaseAgentInstanceOptions &
	([KnowledgeAliases] extends [never]
		? {
				knowledgeAdapters?: Record<string, KnowledgeAdapter>
			}
		: {
				knowledgeAdapters: Record<KnowledgeAliases, KnowledgeAdapter> & Record<string, KnowledgeAdapter>
			})

export type AgentDefinition<KnowledgeAliases extends string = never> = {
	info: AgentInfo
	manifest: AgentManifest
	schemas: {
		payload?: Schema
		parameter?: Schema
		output?: Schema
		context?: Schema
	}
	getManifest(): AgentManifest
	getInstance(
		eventBridge: EventBridge,
		...options: [KnowledgeAliases] extends [never]
			? [options?: AgentInstanceOptions<KnowledgeAliases>]
			: [options: AgentInstanceOptions<KnowledgeAliases>]
	): Promise<AgentRuntimeInstance>
}

export type AgentRuntimeInstance = {
	start(): Promise<void>
	stop(): Promise<void>
	invoke(request: AgentInvokeRequest, contextOverrides?: Partial<AgentInvokeContext>): Promise<AgentInvokeResult>
	getStatus(): AgentRuntimeStatus
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
	onFrame(frame: AgentProtocolEnvelope): void | Promise<void>
	onComplete(): void | Promise<void>
	onError(error: unknown): void | Promise<void>
}

export type AgentInvokeResult = {
	envelopes: AgentProtocolEnvelope[]
}

export type AgentRuntimeStatus = {
	agentName: string
	agentVersion: string
	poolId: string
	/** Per-process/per-replica execution cap for this pool. */
	maxConcurrencyPerInstance: number
	/** Current number of running agent executions in this process/replica. */
	activeWorkers: number
	/** Current number of queued executions waiting for a local pool slot. */
	waitingWorkers: number
	concurrencyHints?: {
		/** Optional host-provided replica count hint for observability only. */
		replicaCountHint?: number
		/** Optional estimated global concurrency: replicaCountHint * maxConcurrencyPerInstance. */
		effectiveMaxConcurrencyHint?: number
	}
}
