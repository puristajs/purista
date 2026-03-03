import type { Schema } from '@purista/core'

export type AgentHttpExposure = {
	method: string
	path: string
	streamingMode?: 'sse' | 'chunked' | 'buffered'
	requestContentType?: string
	requestEncoding?: string
	responseContentType?: string
	responseEncoding?: string
	public?: boolean
	queryParameters?: Array<{ name: string; required: boolean }>
}

export type AllowedToolDefinition = {
	serviceName: string
	serviceVersion: string
	commandName: string
	description?: string
}

export type AgentSessionConfig = {
	storeName: string
	strategy?: 'full' | 'summary'
	maxFrames?: number
}

export type KnowledgeAdapterConfig = {
	adapterName: string
	options?: Record<string, unknown>
}

export type ConcurrencyConfig = {
	poolId?: string
	maxWorkers: number
}

export type RetryPolicy = {
	strategy?: 'fixed' | 'exponential'
	maxAttempts: number
	delayMs?: number
}

export type AgentManifest = {
	agentName: string
	agentVersion: string
	description?: string
	eventBridge: string
	models?: string[]
	modelResource?: { resourceName: string; variant?: string }
	session?: AgentSessionConfig
	knowledge?: KnowledgeAdapterConfig[]
	concurrency?: ConcurrencyConfig
	retryPolicy?: RetryPolicy
	telemetry?: { attributes?: Record<string, string | number | boolean> }
	allowedTools: AllowedToolDefinition[]
	resources?: Record<string, { resourceName: string }>
	payloadSchema?: Schema
	parameterSchema?: Schema
	outputSchema?: Schema
	contextSchema?: Schema
	httpExposure?: AgentHttpExposure
	metadata?: Record<string, unknown>
}
