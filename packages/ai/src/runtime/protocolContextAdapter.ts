import type { EventBridge } from '@purista/core'
import {
	type AgentInvokeList,
	type Command,
	type CommandFunctionContext,
	EBMessageType,
	type EmitCustomMessageFunction,
	type QueueJobContext,
	type Schema,
	type StreamFunctionContext,
} from '@purista/core'
import type { AgentManifest } from '../types/AgentManifest.js'
import type { ProtocolContext } from './context.js'

const queueHeaderKeys = {
	principalId: 'purista.principalId',
	tenantId: 'purista.tenantId',
	otp: 'purista.otp',
	senderServiceName: 'purista.sender.serviceName',
	senderServiceVersion: 'purista.sender.serviceVersion',
	senderServiceTarget: 'purista.sender.serviceTarget',
	senderInstanceId: 'purista.sender.instanceId',
	receiverServiceName: 'purista.receiver.serviceName',
	receiverServiceVersion: 'purista.receiver.serviceVersion',
	receiverServiceTarget: 'purista.receiver.serviceTarget',
	receiverInstanceId: 'purista.receiver.instanceId',
} as const

const getHeader = (headers: Record<string, string>, key: string) => {
	const value = headers[key]
	return typeof value === 'string' && value.length > 0 ? value : undefined
}

function assertQueueMessageShape(message: unknown): asserts message is QueueJobContext['message'] {
	if (typeof message !== 'object' || message === null) {
		throw new Error('Invalid queue context: missing message object')
	}
	const candidate = message as Record<string, unknown>
	if (typeof candidate.id !== 'string' || candidate.id.length === 0) {
		throw new Error('Invalid queue context: message.id must be a non-empty string')
	}
	if (typeof candidate.createdAt !== 'number') {
		throw new Error('Invalid queue context: message.createdAt must be a number')
	}
	if (!('payload' in candidate)) {
		throw new Error('Invalid queue context: message.payload is required')
	}
	if (typeof candidate.headers !== 'object' || candidate.headers === null) {
		throw new Error('Invalid queue context: message.headers must be an object')
	}
}

export const adaptQueueJobContextToProtocolContext = <
	Payload,
	Parameter,
	Resources extends Record<string, unknown>,
	AgentInvokes extends AgentInvokeList,
>(
	jobContext: QueueJobContext,
	manifest: Pick<AgentManifest, 'agentName' | 'serviceVersion'>,
	eventBridge: Pick<EventBridge, 'instanceId'>,
): ProtocolContext<Payload, Parameter, Resources, AgentInvokes, Record<string, Schema>> => {
	assertQueueMessageShape(jobContext.message)
	const headers = jobContext.message.headers
	const sender = {
		serviceName: getHeader(headers, queueHeaderKeys.senderServiceName) ?? manifest.agentName,
		serviceVersion: getHeader(headers, queueHeaderKeys.senderServiceVersion) ?? manifest.serviceVersion,
		serviceTarget: getHeader(headers, queueHeaderKeys.senderServiceTarget) ?? manifest.agentName,
		instanceId: getHeader(headers, queueHeaderKeys.senderInstanceId) ?? eventBridge.instanceId,
	}
	const receiver = {
		serviceName: getHeader(headers, queueHeaderKeys.receiverServiceName) ?? manifest.agentName,
		serviceVersion: getHeader(headers, queueHeaderKeys.receiverServiceVersion) ?? manifest.serviceVersion,
		serviceTarget: getHeader(headers, queueHeaderKeys.receiverServiceTarget) ?? manifest.agentName,
		...(getHeader(headers, queueHeaderKeys.receiverInstanceId)
			? { instanceId: getHeader(headers, queueHeaderKeys.receiverInstanceId) }
			: {}),
	}

	const commandMessage: Command<Payload, Parameter> = {
		messageType: EBMessageType.Command,
		id: jobContext.message.id,
		timestamp: jobContext.message.createdAt,
		contentType: 'application/json',
		contentEncoding: 'utf-8',
		traceId: jobContext.message.traceId,
		otp: getHeader(headers, queueHeaderKeys.otp),
		principalId: getHeader(headers, queueHeaderKeys.principalId),
		tenantId: getHeader(headers, queueHeaderKeys.tenantId),
		correlationId: jobContext.message.correlationId ?? jobContext.message.id,
		sender,
		receiver,
		payload: {
			payload: jobContext.message.payload as Payload,
			parameter: (jobContext.message.parameter ?? ({} as Parameter)) as Parameter,
		},
	}

	const protocolContext = {
		...jobContext,
		message: commandMessage,
		emit: jobContext.emit as EmitCustomMessageFunction<Record<string, Schema>>,
		invokeAgent: {} as AgentInvokes,
	}

	return protocolContext as unknown as ProtocolContext<
		Payload,
		Parameter,
		Resources,
		AgentInvokes,
		Record<string, Schema>
	>
}

export const adaptInvocationContextToProtocolContext = <
	Payload,
	Parameter,
	Resources extends Record<string, unknown>,
	AgentInvokes extends AgentInvokeList,
	EmitList extends Record<string, Schema>,
>(
	context: CommandFunctionContext | StreamFunctionContext,
	manifest: Pick<AgentManifest, 'agentName' | 'serviceVersion'>,
	eventBridge: Pick<EventBridge, 'instanceId'>,
): ProtocolContext<Payload, Parameter, Resources, AgentInvokes, EmitList> => {
	const commandMessage: Command<Payload, Parameter> = {
		messageType: EBMessageType.Command,
		id: context.message.id,
		timestamp: context.message.timestamp,
		contentType: context.message.contentType,
		contentEncoding: context.message.contentEncoding,
		traceId: context.message.traceId,
		otp: context.message.otp,
		principalId: context.message.principalId,
		tenantId: context.message.tenantId,
		correlationId: context.message.correlationId ?? context.message.id,
		sender: {
			serviceName: manifest.agentName,
			serviceVersion: manifest.serviceVersion,
			serviceTarget: 'run',
			instanceId: eventBridge.instanceId,
		},
		receiver: {
			...context.message.sender,
		},
		payload: {
			payload: context.message.payload.payload as Payload,
			parameter: (context.message.payload.parameter ?? ({} as Parameter)) as Parameter,
		},
	}

	return {
		...context,
		message: commandMessage,
		invokeAgent: (context as ProtocolContext).invokeAgent as AgentInvokes,
		emit: context.emit as EmitCustomMessageFunction<EmitList>,
	} as unknown as ProtocolContext<Payload, Parameter, Resources, AgentInvokes, EmitList>
}

export { queueHeaderKeys }
