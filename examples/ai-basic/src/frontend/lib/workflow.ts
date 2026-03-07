import type { AgentProtocolEnvelope, WorkflowStep } from './types'

const actorLabel = (envelope: AgentProtocolEnvelope): string => {
	const actor = envelope.actor
	if (!actor) {
		return 'unknown'
	}
	return [actor.service, actor.version, actor.agent].filter(Boolean).join(':')
}

const toStep = (envelope: AgentProtocolEnvelope, depth: number): WorkflowStep => {
	const frame = envelope.frame
	if (frame.kind === 'message') {
		const content = String(frame.content ?? '')
		const isFinal = frame.final === true
		return {
			id: envelope.messageId,
			type: 'message',
			status: isFinal ? 'success' : 'running',
			category: content.toLowerCase().includes('generating') ? 'ai' : 'stream',
			label: content,
			actor: actorLabel(envelope),
			timestamp: envelope.timestamp,
			details: frame,
			depth,
		}
	}
	if (frame.kind === 'tool') {
		const status = String(frame.status ?? 'idle')
		return {
			id: envelope.messageId,
			type: 'tool',
			status:
				status === 'success' ? 'success' : status === 'error' ? 'error' : status === 'invoked' ? 'running' : 'idle',
			category: String(frame.toolName ?? '').includes('support.1.') ? 'command' : 'ai',
			label: `${String(frame.status ?? 'unknown')}: ${String(frame.toolName ?? 'tool')}`,
			actor: actorLabel(envelope),
			timestamp: envelope.timestamp,
			details: frame,
			depth,
		}
	}
	if (frame.kind === 'telemetry') {
		return {
			id: envelope.messageId,
			type: 'telemetry',
			status: 'success',
			category: 'telemetry',
			label: `tokens=${String((frame.usage as { totalTokens?: number } | undefined)?.totalTokens ?? '-')}, duration=${String(frame.durationMs ?? '-')}ms`,
			actor: actorLabel(envelope),
			timestamp: envelope.timestamp,
			details: frame,
			depth,
		}
	}
	if (frame.kind === 'artifact') {
		return {
			id: envelope.messageId,
			type: 'artifact',
			status: frame.lastChunk === true ? 'success' : 'running',
			category: 'ai',
			label: `artifact: ${String(frame.artifactId ?? 'artifact')}`,
			actor: actorLabel(envelope),
			timestamp: envelope.timestamp,
			details: frame,
			depth,
		}
	}
	return {
		id: envelope.messageId,
		type: 'error',
		status: 'error',
		category: 'error',
		label: String((frame as { message?: string }).message ?? 'error'),
		actor: actorLabel(envelope),
		timestamp: envelope.timestamp,
		details: frame,
		depth,
	}
}

const extractNestedEnvelopes = (envelope: AgentProtocolEnvelope): AgentProtocolEnvelope[] => {
	const frame = envelope.frame
	if (frame.kind !== 'tool') {
		return []
	}
	const output = frame.output
	if (!Array.isArray(output)) {
		return []
	}
	return output.filter(item => typeof item === 'object' && item !== null) as AgentProtocolEnvelope[]
}

const isGrowingMessage = (previous: WorkflowStep, incoming: WorkflowStep): boolean => {
	if (previous.type !== 'message' || incoming.type !== 'message') {
		return false
	}
	if (previous.actor !== incoming.actor || previous.depth !== incoming.depth) {
		return false
	}
	const previousFinal = (previous.details as { final?: boolean } | undefined)?.final === true
	if (previousFinal) {
		return false
	}
	return true
}

const messageStepKey = (step: WorkflowStep): string => `${step.actor}|${step.depth}`

const toolStepKey = (step: WorkflowStep): string => {
	if (step.type !== 'tool') {
		return ''
	}
	const details = (step.details ?? {}) as { toolName?: string; input?: unknown }
	return `${step.actor}|${step.depth}|${String(details.toolName ?? '')}|${JSON.stringify(details.input ?? null)}`
}

const mergeSteps = (steps: WorkflowStep[], incoming: WorkflowStep): WorkflowStep[] => {
	const last = steps.at(-1)
	if (last && isGrowingMessage(last, incoming)) {
		return [...steps.slice(0, -1), incoming]
	}

	if (incoming.type === 'message') {
		const incomingFinal = (incoming.details as { final?: boolean } | undefined)?.final === true
		const key = messageStepKey(incoming)
		const existingIndex = steps.findIndex(step => {
			if (step.type !== 'message') {
				return false
			}
			const stepFinal = (step.details as { final?: boolean } | undefined)?.final === true
			return messageStepKey(step) === key && (stepFinal === false || incomingFinal)
		})
		if (existingIndex >= 0) {
			const next = [...steps]
			next[existingIndex] = incoming
			return next
		}
	}

	if (incoming.type === 'tool') {
		const incomingKey = toolStepKey(incoming)
		const existingIndex = steps.findIndex(step => step.type === 'tool' && toolStepKey(step) === incomingKey)
		if (existingIndex >= 0) {
			const next = [...steps]
			next[existingIndex] = incoming
			return next
		}
	}

	return [...steps, incoming]
}

export const mapToWorkflow = (envelopes: AgentProtocolEnvelope[]): WorkflowStep[] => {
	let steps: WorkflowStep[] = []
	for (const envelope of envelopes) {
		steps = mergeSteps(steps, toStep(envelope, 0))
		for (const nested of extractNestedEnvelopes(envelope)) {
			steps = mergeSteps(steps, toStep(nested, 1))
		}
	}
	return steps
}
