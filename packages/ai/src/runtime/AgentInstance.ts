import type { SpanProcessor } from '@opentelemetry/sdk-trace-node'
import {
	type Command,
	type ConfigStore,
	EBMessageType,
	type EventBridge,
	getNewEBMessageId,
	getNewTraceId,
	type Logger,
	type QueueBridge,
	type SecretStore,
	type StateStore,
} from '@purista/core'
import type { AgentHandler } from '../builder/AgentBuilder.js'
import type { KnowledgeAdapter } from '../knowledge/adapters/inMemoryAdapter.js'
import { InMemoryKnowledgeAdapter } from '../knowledge/adapters/inMemoryAdapter.js'
import type { SessionStore } from '../memory/sessionStore.js'
import { InMemorySessionStore } from '../memory/sessionStore.js'
import { PoolManager } from '../pools/PoolManager.js'
import type { AgentProtocolEnvelope } from '../protocol/types.js'
import type {
	AgentInfo,
	AgentRuntimeInstance as AgentInstanceContract,
	AgentInvokeContext,
	AgentInvokeRequest,
	AgentInvokeResult,
	AgentStreamResponder,
} from '../types/AgentDefinition.js'
import type { AgentManifest } from '../types/AgentManifest.js'

export type AgentInstanceDependencies = {
	info: AgentInfo
	manifest: AgentManifest
	serviceBuilder: any
	handler: AgentHandler
}

export type AgentRuntimeDependencies = {
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

type ResolvedAgentRuntimeDependencies = {
	eventBridge: EventBridge
	logger?: Logger
	spanProcessor?: SpanProcessor
	secretStore?: SecretStore
	configStore?: ConfigStore
	stateStore?: StateStore
	queueBridge?: QueueBridge
	sessionStore: SessionStore
	knowledgeAdapters: Record<string, KnowledgeAdapter>
	poolManager: PoolManager
	resources: Record<string, unknown>
	config?: Record<string, unknown>
}

type AgentServiceConfig = {
	runtime: {
		handler: AgentHandler
		manifest: AgentManifest
		sessionStore: SessionStore
		knowledgeAdapters: Record<string, KnowledgeAdapter>
		poolManager: PoolManager
		resources: Record<string, unknown>
	}
}

export class AgentInstance implements AgentInstanceContract {
	private service: any
	private readonly dependencies: AgentInstanceDependencies
	private readonly runtime: ResolvedAgentRuntimeDependencies

	constructor(deps: AgentInstanceDependencies, runtime: AgentRuntimeDependencies) {
		this.dependencies = deps
		if (!runtime.eventBridge) {
			throw new Error('AgentInstance requires an event bridge')
		}
		this.runtime = {
			eventBridge: runtime.eventBridge,
			logger: runtime.logger,
			spanProcessor: runtime.spanProcessor,
			secretStore: runtime.secretStore,
			configStore: runtime.configStore,
			stateStore: runtime.stateStore,
			queueBridge: runtime.queueBridge,
			config: runtime.config,
			sessionStore: runtime.sessionStore ?? new InMemorySessionStore(),
			knowledgeAdapters: runtime.knowledgeAdapters ?? {
				default: new InMemoryKnowledgeAdapter(),
			},
			poolManager: runtime.poolManager ?? new PoolManager(),
			resources: runtime.resources ?? {},
		}

		const poolId = deps.manifest.concurrency?.poolId ?? `agent:${deps.info.agentName}`
		const maxWorkers = deps.manifest.concurrency?.maxWorkers ?? 1
		this.runtime.poolManager.registerPool(poolId, maxWorkers)
	}

	async start() {
		if (this.service) {
			return
		}

		const serviceConfig: AgentServiceConfig = {
			runtime: {
				handler: this.dependencies.handler,
				manifest: this.dependencies.manifest,
				sessionStore: this.runtime.sessionStore,
				knowledgeAdapters: this.runtime.knowledgeAdapters,
				poolManager: this.runtime.poolManager,
				resources: this.runtime.resources,
			},
		}

		this.service = await this.dependencies.serviceBuilder.getInstance(this.runtime.eventBridge, {
			logger: this.runtime.logger,
			spanProcessor: this.runtime.spanProcessor,
			secretStore: this.runtime.secretStore,
			configStore: this.runtime.configStore,
			stateStore: this.runtime.stateStore,
			queueBridge: this.runtime.queueBridge,
			serviceConfig,
		})

		await this.service.start()
	}

	async stop() {
		if (!this.service) {
			return
		}
		await this.service.destroy()
		this.service = undefined
	}

	private notifyStream(stream: AgentStreamResponder | undefined, envelopes: AgentProtocolEnvelope[]) {
		if (!stream) {
			return
		}
		try {
			for (const envelope of envelopes) {
				stream.onFrame(envelope)
			}
			stream.onComplete()
		} catch (error) {
			stream.onError(error)
		}
	}

	async invoke(
		request: AgentInvokeRequest,
		contextOverrides?: Partial<AgentInvokeContext>,
	): Promise<AgentInvokeResult> {
		if (!this.service) {
			await this.start()
		}

		const receiver = {
			serviceName: this.dependencies.serviceBuilder.info.serviceName,
			serviceVersion: this.dependencies.serviceBuilder.info.serviceVersion,
			serviceTarget: 'run',
		} as const

		const commandMessage: Command = {
			id: getNewEBMessageId(),
			timestamp: Date.now(),
			messageType: EBMessageType.Command,
			traceId: getNewTraceId(),
			correlationId: request.correlationId ?? getNewEBMessageId(),
			contentType: 'application/json',
			contentEncoding: 'utf-8',
			principalId: request.principalId,
			tenantId: request.tenantId,
			sender: {
				serviceName: 'agent.runtime',
				serviceVersion: 'v1',
				serviceTarget: this.dependencies.info.agentName,
				instanceId: this.runtime.eventBridge.instanceId,
			},
			receiver,
			payload: {
				payload: request.payload,
				parameter: request.parameter ?? {},
			},
		}

		try {
			const result = (await this.runtime.eventBridge.invoke(
				commandMessage,
				request.timeoutMs,
			)) as AgentProtocolEnvelope[]
			this.notifyStream(contextOverrides?.stream, result)
			this.notifyStream(request.stream, result)
			return { envelopes: result }
		} catch (error) {
			contextOverrides?.stream?.onError(error)
			request.stream?.onError(error)
			throw error
		}
	}
}
