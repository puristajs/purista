import type { Schema } from '@purista/core'

export type AgentHttpExposure = {
	method: string
	path: string
	streamingMode?: 'stream' | 'aggregate'
	sseProtocol?: AgentSseProtocol
	requestContentType?: string
	requestEncoding?: string
	responseContentType?: string
	responseEncoding?: string
	public?: boolean
	queryParameters?: Array<{ name: string; required: boolean }>
}

export type AgentExecutionMode = 'inline' | 'queued'

export type AgentExecutionRecoveryPolicy = 'resume-from-checkpoints' | 'retry-from-start' | 'fail-stale'

export type AgentExecutionHttpBehavior = 'attach-and-stream' | 'accept'

export type AgentExecutionCleanupPolicy = {
	transientStateTtlMs?: number
	keepFinalRunRecord?: boolean
	finalRunRecordTtlMs?: number
}

export type AgentExecutionPolicy = {
	leaseTtlMs?: number
	heartbeatIntervalMs?: number
	maxLeaseExtensions?: number
	maxAttempts?: number
	maxDurationMs?: number
	maxModelSteps?: number
	maxToolCalls?: number
	maxNoopPersistenceCycles?: number
	maxRepeatedFailures?: number
	recovery?: AgentExecutionRecoveryPolicy
	httpBehavior?: AgentExecutionHttpBehavior
	cleanup?: AgentExecutionCleanupPolicy
	scopeFromPayload?: string[]
}

export type ReflectionStopReason = 'accepted' | 'max-iterations' | 'stagnation'

export type ReflectionArtifactPolicy = {
	emitArtifacts?: boolean
	artifactPrefix?: string
}

export type ReflectionPreset = {
	maxIterations?: number
	stopOnStagnation?: boolean
	artifacts?: ReflectionArtifactPolicy
}

export type ReflectionPolicy = {
	enabledByDefault?: boolean
	presets?: Record<string, ReflectionPreset>
}

export type AgentQualityProfile = {
	reflection?: {
		enabled?: boolean
		preset?: string
		maxIterations?: number
		stopOnStagnation?: boolean
	}
	verification?: {
		required?: boolean
	}
	execution?: {
		maxModelSteps?: number
		maxToolCalls?: number
	}
}

export type AgentQualityPolicy = {
	defaultProfile?: string
	profiles?: Record<string, AgentQualityProfile>
}

export type AgentApprovalCheckpointPolicy = {
	required?: boolean
	when?: string
	timeoutMs?: number
	onExpiry?: 'fail' | 'return-expired'
}

export type AgentApprovalPolicy = {
	checkpoints?: Record<string, AgentApprovalCheckpointPolicy>
}

export type AgentResourcePolicy = {
	objective?: 'quality' | 'latency' | 'cost'
	budgetUsd?: number
	maxDurationMs?: number
}

export type AgentPolicy = {
	quality?: AgentQualityPolicy
	approvals?: AgentApprovalPolicy
	resources?: AgentResourcePolicy
}

/**
 * Controls how agent stream chunks should be serialized when the endpoint uses SSE.
 * - `purista`: native PURISTA stream frames (canonical source protocol)
 * - `ai-sdk-responses`: OpenAI Responses-style stream events
 * - `ai-sdk-ui-message`: Vercel AI SDK UI message stream protocol
 * - `ai-sdk-data`: alias for AI SDK UI message data stream protocol
 * - `ai-sdk-json-render`: AI SDK UI message stream with `data-spec` parts for json-render
 * - `agent2agent`: reference Agent-to-Agent message events
 * - `mcp`: reference MCP tool-result events
 */
export type AgentSseProtocol =
	| 'purista'
	| 'ai-sdk-responses'
	| 'ai-sdk-ui-message'
	| 'ai-sdk-data'
	| 'ai-sdk-json-render'
	| 'agent2agent'
	| 'mcp'

export type AllowedToolDefinition = {
	serviceName: string
	serviceVersion: string
	commandName: string
	description?: string
	payloadSchema?: Schema
	parameterSchema?: Schema
	outputSchema?: Schema
	toolName?: string
}

export type AllowedAgentDefinition = {
	agentName: string
	agentVersion: string
	description?: string
	payloadSchema?: Schema
	parameterSchema?: Schema
	outputSchema?: Schema
	toolName?: string
}

export type ExternalRuntimeMetadata = {
	commands: AllowedToolDefinition[]
	agents: AllowedAgentDefinition[]
}

export type AgentSessionConfig = {
	storeName: string
	strategy?: 'full' | 'summary'
	maxFrames?: number
}

export type AgentHistoryPreset = 'user' | 'agent'

export type RetryPolicy = {
	strategy?: 'fixed' | 'exponential'
	maxAttempts: number
	delayMs?: number
}

export type AgentModelCapability = 'text' | 'stream' | 'embedding' | 'rerank' | 'json'

export type AgentModelBinding = {
	alias: string
	capabilities?: AgentModelCapability[]
}

export type AgentSkillConfig = {
	resourceName?: string
	names: string[]
}

export type AgentManifest = {
	agentName: string
	agentVersion: string
	description?: string
	deprecated?: boolean
	eventBridge: string
	executionMode?: AgentExecutionMode
	executionPolicy?: AgentExecutionPolicy
	reflection?: ReflectionPolicy
	agentPolicy?: AgentPolicy
	models?: AgentModelBinding[]
	modelResource?: { resourceName: string; variant?: string }
	skills?: AgentSkillConfig
	session?: AgentSessionConfig
	retryPolicy?: RetryPolicy
	telemetry?: { attributes?: Record<string, string | number | boolean> }
	allowedTools: AllowedToolDefinition[]
	allowedAgents?: AllowedAgentDefinition[]
	resources?: Record<string, { resourceName: string }>
	payloadSchema?: Schema
	parameterSchema?: Schema
	outputSchema?: Schema
	contextSchema?: Schema
	httpExposure?: AgentHttpExposure
	metadata?: Record<string, unknown>
}
