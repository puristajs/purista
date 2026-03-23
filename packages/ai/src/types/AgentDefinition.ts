import type { Tracer } from '@opentelemetry/api'
import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import type {
	Complete,
	ConfigStore,
	EmptyObject,
	EventBridge,
	Logger,
	QueueBridge,
	Schema,
	SecretStore,
	StateStore,
} from '@purista/core'
import type { ConversationStore } from '../memory/conversationStore.js'
import type { PoolManager } from '../pools/PoolManager.js'
import type { AgentProtocolEnvelope } from '../protocol/types.js'
import type { ModelProvider } from '../providers/runtime/ModelProvider.js'
import type { SkillResource, SkillSourceMap } from '../skills/fileSystem.js'
import type { AgentManifest, ExternalRuntimeMetadata } from './AgentManifest.js'

export type AgentInfo = {
	agentName: string
	agentVersion: string
	description?: string
	successEventName?: string
}

export type BaseAgentInstanceOptions<
	SkillNames extends string = string,
	Resources extends Record<string, unknown> = EmptyObject,
	ConfigInput extends Record<string, unknown> = EmptyObject,
> = {
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
	/**
	 * Provide the skill implementations for names declared via `builder.useSkills([...])`.
	 *
	 * The common paths are:
	 * - inline typed skill maps for tests and small agents
	 * - file-based skill resources for reusable application catalogs
	 */
	skills?: SkillResource | SkillSourceMap<SkillNames>
	resources?: keyof Resources extends never ? never : Resources
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
	config?: keyof ConfigInput extends never ? never : ConfigInput
}

export type AgentInstanceOptions<
	SkillNames extends string = string,
	Resources extends Record<string, unknown> = EmptyObject,
	ConfigInput extends Record<string, unknown> = EmptyObject,
> = BaseAgentInstanceOptions<SkillNames, Resources, ConfigInput>

export type AgentDefinition<
	SkillNames extends string = string,
	Resources extends Record<string, unknown> = EmptyObject,
	ConfigInput extends Record<string, unknown> = EmptyObject,
	Config extends Record<string, unknown> = ConfigInput,
> = {
	info: AgentInfo
	manifest: AgentManifest
	schemas: {
		payload?: Schema
		parameter?: Schema
		output?: Schema
		context?: Schema
	}
	getManifest(): AgentManifest
	getExternalRuntimeMetadata(): ExternalRuntimeMetadata
	getInstance(
		eventBridge: EventBridge,
		options?: AgentInstanceOptions<SkillNames, Resources, ConfigInput>,
	): Promise<AgentRuntimeInstance>
	getDefaultConfig(): Complete<Config> | undefined
}

export type AgentRuntimeInstance = {
	start(): Promise<void>
	stop(): Promise<void>
	invoke(request: AgentInvokeRequest, contextOverrides?: Partial<AgentInvokeContext>): Promise<AgentInvokeResult>
	getStatus(): AgentRuntimeStatus
	getExternalRuntimeMetadata(): ExternalRuntimeMetadata
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
