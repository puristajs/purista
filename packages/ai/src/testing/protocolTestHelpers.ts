import type { AgentProtocolEnvelope, AgentProtocolFrame } from '../protocol/types.js'

export const getFrames = (envelopes: AgentProtocolEnvelope[]) => envelopes.map(envelope => envelope.frame)

export const getMessageFrames = (envelopes: AgentProtocolEnvelope[]) =>
	getFrames(envelopes).filter(
		(frame): frame is Extract<AgentProtocolFrame, { kind: 'message' }> => frame.kind === 'message',
	)

export const getFinalAssistantText = (envelopes: AgentProtocolEnvelope[]) =>
	getMessageFrames(envelopes)
		.filter(frame => frame.role === 'assistant')
		.map(frame => frame.content)
		.filter(Boolean)
		.at(-1) ?? ''

export const getToolFrames = (envelopes: AgentProtocolEnvelope[]) =>
	getFrames(envelopes).filter((frame): frame is Extract<AgentProtocolFrame, { kind: 'tool' }> => frame.kind === 'tool')

export const getArtifactFrames = (envelopes: AgentProtocolEnvelope[]) =>
	getFrames(envelopes).filter(
		(frame): frame is Extract<AgentProtocolFrame, { kind: 'artifact' }> => frame.kind === 'artifact',
	)

export const getErrorFrames = (envelopes: AgentProtocolEnvelope[]) =>
	getFrames(envelopes).filter(
		(frame): frame is Extract<AgentProtocolFrame, { kind: 'error' }> => frame.kind === 'error',
	)

export const getTelemetryFrames = (envelopes: AgentProtocolEnvelope[]) =>
	getFrames(envelopes).filter(
		(frame): frame is Extract<AgentProtocolFrame, { kind: 'telemetry' }> => frame.kind === 'telemetry',
	)

export const getRunStateArtifacts = (envelopes: AgentProtocolEnvelope[]) =>
	getArtifactFrames(envelopes).filter(frame => frame.artifactId === 'run-state')

export const getToolOutputs = (envelopes: AgentProtocolEnvelope[], toolName: string) =>
	getToolFrames(envelopes).filter(frame => frame.toolName === toolName)

export const getArtifactIds = (envelopes: AgentProtocolEnvelope[]) =>
	getArtifactFrames(envelopes).map(frame => frame.artifactId)

export const getToolNames = (envelopes: AgentProtocolEnvelope[]) =>
	getToolFrames(envelopes).map(frame => frame.toolName)
