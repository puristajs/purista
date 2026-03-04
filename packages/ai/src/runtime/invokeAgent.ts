import type { Command, EventBridge } from '@purista/core'
import { EBMessageType, getNewEBMessageId, getNewTraceId } from '@purista/core'

import type { AgentProtocolEnvelope } from '../protocol/types.js'
import type { AgentStreamResponder } from '../types/AgentDefinition.js'
import { withSessionIdInPayload } from './sessionPayload.js'

export type InvokeAgentOptions = {
	eventBridge: EventBridge
	agentName: string
	agentVersion: string
	payload: unknown
	parameter?: unknown
	principalId?: string
	tenantId?: string
	timeoutMs?: number
	correlationId?: string
	sessionId?: string
	stream?: AgentStreamResponder
}

/**
 * Convenience helper for invoking an agent command via an EventBridge.
 */
export const invokeAgent = async (options: InvokeAgentOptions) => {
	const receiver = {
		serviceName: options.agentName,
		serviceVersion: options.agentVersion,
		serviceTarget: 'run',
	} as const

	const payload = withSessionIdInPayload(options.payload, options.sessionId)

	const message: Command = {
		id: getNewEBMessageId(),
		timestamp: Date.now(),
		messageType: EBMessageType.Command,
		traceId: getNewTraceId(),
		correlationId: options.correlationId ?? getNewEBMessageId(),
		contentType: 'application/json',
		contentEncoding: 'utf-8',
		principalId: options.principalId,
		tenantId: options.tenantId,
		sender: {
			serviceName: 'agent.invoke',
			serviceVersion: 'v1',
			serviceTarget: options.agentName,
			instanceId: options.eventBridge.instanceId,
		},
		receiver,
		payload: {
			payload,
			parameter: options.parameter ?? {},
		},
	}

	const envelopes = (await options.eventBridge.invoke(message, options.timeoutMs)) as AgentProtocolEnvelope[]
	if (options.stream) {
		try {
			for (const envelope of envelopes) {
				options.stream.onFrame(envelope)
			}
			options.stream.onComplete()
		} catch (error) {
			options.stream.onError(error)
		}
	}
	return envelopes
}
