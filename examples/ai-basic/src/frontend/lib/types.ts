export type AgentProtocolEnvelope = {
	version: string
	messageId: string
	conversationId?: string
	inReplyTo?: string
	timestamp: string
	actor?: {
		service?: string
		version?: string
		agent?: string
		instanceId?: string
	}
	role?: string
	frame: {
		kind: 'message' | 'tool' | 'telemetry' | 'artifact' | 'error' | string
		[key: string]: unknown
	}
}

export type StreamFrameStart = {
	frameType: 'start'
	sequence?: number
}

export type StreamFrameChunk = {
	frameType: 'chunk'
	sequence?: number
	chunk?: AgentProtocolEnvelope | AgentProtocolEnvelope[]
}

export type StreamFrameComplete = {
	frameType: 'complete'
	sequence?: number
	final?: {
		message?: string
		envelopes?: AgentProtocolEnvelope[]
	}
}

export type StreamFrameError = {
	frameType: 'error'
	sequence?: number
	error?: unknown
}

export type StreamFrameEvent = StreamFrameStart | StreamFrameChunk | StreamFrameComplete | StreamFrameError

export type StreamPayload = {
	event: string
	raw?: string
	parsed?: unknown
}

export type AgentRunTask = {
	id: string
	title: string
	status: 'pending' | 'running' | 'blocked' | 'waiting-approval' | 'completed' | 'failed' | 'cancelled'
	order: number
	kind?: 'tool' | 'agent' | 'model' | 'reasoning' | 'checkpoint' | 'approval' | 'custom'
	detail?: string
	summary?: string
	input?: unknown
	output?: unknown
	executor?: unknown
	handoff?: unknown
	dependsOn?: string[]
	approval?: unknown
	retryPolicy?: unknown
	timeoutMs?: number
	startedAt?: string
	updatedAt?: string
	completedAt?: string
}

export type PuristaAiPlan = {
	type: 'purista-ai-plan'
	runId: string
	title: string
	phase: string
	status: AgentRunState['status']
	tasks: AgentRunTask[]
}

export type PuristaAiTask = {
	type: 'purista-ai-task'
	runId: string
	taskId: string
	title: string
	status: AgentRunTask['status']
	order: number
	kind?: AgentRunTask['kind']
	detail?: string
	startedAt?: string
	updatedAt?: string
	completedAt?: string
	summary?: string
	input?: unknown
	output?: unknown
	executor?: unknown
	handoff?: unknown
	dependsOn?: string[]
	approval?: unknown
	retryPolicy?: unknown
	timeoutMs?: number
}

export type PuristaAiTaskChunk = {
	type: 'purista-ai-task-chunk'
	runId?: string
	taskId: string
	kind: string
	content: unknown
	sequence?: number
	metadata?: Record<string, unknown>
}

export type PuristaAiPlanStatus = {
	type: 'purista-ai-plan-status'
	runId: string
	title: string
	phase: string
	status: AgentRunState['status']
	activeTaskId?: string
	summary?: string
	finalMessage?: string
}

export type PuristaAiWorkflowStage = {
	type: 'purista-ai-workflow-stage'
	runId?: string
	name: string
	status: 'running' | 'completed' | 'failed'
	summary?: string
	finalMessage?: string
	updatedAt?: string
}

export type AgentRunState = {
	runId: string
	title: string
	status: 'queued' | 'idle' | 'planning' | 'running' | 'recovering' | 'retrying' | 'summarizing' | 'completed' | 'failed' | 'cancelled'
	phase: string
	tasks: AgentRunTask[]
	summary?: string
	finalMessage?: string
	checkpoints?: Record<string, {
		name: string
		completed: boolean
		value?: unknown
		updatedAt: string
	}>
	attempt?: number
	owner?: {
		workerId: string
		queueName?: string
		leaseId?: string
		attachedAt: string
	}
	recovery?: {
		status: 'fresh' | 'resumed' | 'retrying' | 'recovered-stale'
		reason?: string
		checkpoint?: string
		resumedAt?: string
	}
	lock?: {
		lockId: string
		key: string
		runId?: string
		scopeKey: string
		acquiredAt: string
		heartbeatAt: string
		expiresAt: string
	}
	heartbeatAt?: string
	startedAt?: string
	updatedAt?: string
	completedAt?: string
}

export type WorkflowStep = {
	id: string
	type: 'message' | 'tool' | 'telemetry' | 'artifact' | 'error'
	status: 'idle' | 'running' | 'success' | 'error'
	category: 'purista' | 'stream' | 'command' | 'ai' | 'telemetry' | 'error'
	label: string
	actor: string
	timestamp: string
	details?: unknown
	depth: number
}

export type ConversationHistoryMessage = {
	id: string
	role: 'system' | 'developer' | 'user' | 'assistant' | 'tool' | 'tool_result'
	content: string
	createdAt: number
	toolName?: string
	toolCallId?: string
	metadata?: Record<string, unknown>
}
