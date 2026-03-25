import { extractFinalAssistantText } from '../protocol/extract.js'
import type { AgentProtocolEnvelope } from '../protocol/types.js'
import type { AgentTerminalResult } from '../types/AgentDefinition.js'

const getFinalRunStateArtifact = (envelopes: AgentProtocolEnvelope[]) => {
	for (let index = envelopes.length - 1; index >= 0; index -= 1) {
		const frame = envelopes[index]?.frame
		if (
			frame?.kind === 'artifact' &&
			frame.artifactId === 'run-state' &&
			frame.content &&
			typeof frame.content === 'object'
		) {
			return frame.content as Record<string, unknown>
		}
	}
	return undefined
}

const getFinalAssistantSummary = (envelopes: AgentProtocolEnvelope[]) => {
	for (let index = envelopes.length - 1; index >= 0; index -= 1) {
		const frame = envelopes[index]?.frame
		if (
			frame?.kind === 'message' &&
			frame.role === 'assistant' &&
			frame.final === true &&
			typeof frame.summary === 'string' &&
			frame.summary.trim().length > 0
		) {
			return frame.summary
		}
	}
	return undefined
}

const getLastTelemetryUsage = (envelopes: AgentProtocolEnvelope[]) => {
	for (let index = envelopes.length - 1; index >= 0; index -= 1) {
		const frame = envelopes[index]?.frame
		if (frame?.kind === 'telemetry' && frame.usage) {
			return frame.usage
		}
	}
	return undefined
}

const getStatus = (envelopes: AgentProtocolEnvelope[], runState: Record<string, unknown> | undefined) => {
	const runStatus = runState?.status
	if (runStatus === 'completed' || runStatus === 'failed' || runStatus === 'cancelled') {
		return runStatus
	}
	return envelopes.some(envelope => envelope.frame.kind === 'error') ? 'failed' : 'completed'
}

export const createAgentTerminalResult = (input: {
	envelopes: AgentProtocolEnvelope[]
	agentName: string
	agentVersion: string
}): AgentTerminalResult => {
	const runState = getFinalRunStateArtifact(input.envelopes)
	const usage = getLastTelemetryUsage(input.envelopes)

	return {
		status: getStatus(input.envelopes, runState),
		finalMessage:
			typeof runState?.finalMessage === 'string'
				? runState.finalMessage
				: extractFinalAssistantText(input.envelopes) || undefined,
		summary:
			typeof runState?.summary === 'string'
				? runState.summary
				: typeof getFinalAssistantSummary(input.envelopes) === 'string'
					? getFinalAssistantSummary(input.envelopes)
					: undefined,
		usage: usage
			? {
					promptTokens: usage.promptTokens,
					completionTokens: usage.completionTokens,
					totalTokens: usage.totalTokens,
					costUsd: usage.costUsd,
				}
			: undefined,
		runId: typeof runState?.runId === 'string' ? runState.runId : undefined,
		conversationId: input.envelopes[0]?.conversationId,
		agentName: input.agentName,
		agentVersion: input.agentVersion,
	}
}
