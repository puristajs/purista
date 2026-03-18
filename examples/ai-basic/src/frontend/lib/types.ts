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
	raw: string
	parsed?: StreamFrameEvent
}

export type AgentRunTask = {
	id: string
	title: string
	status: 'pending' | 'running' | 'completed' | 'failed'
	order: number
	detail?: string
}

export type AgentRunState = {
	runId: string
	title: string
	status: 'idle' | 'planning' | 'running' | 'summarizing' | 'completed' | 'failed' | 'cancelled'
	phase: string
	tasks: AgentRunTask[]
	summary?: string
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
