import type { QueueJobContext, QueueMessage } from '@purista/core'
import type { AgentProtocolEnvelope } from '../protocol/types.js'
import type { ProtocolContext } from './context.js'

export type AttachedAgentExecutor = {
	execute(
		jobContext: QueueJobContext,
		message: QueueMessage,
		onEnvelope?: (envelope: AgentProtocolEnvelope) => Promise<void>,
	): Promise<{
		envelopes: AgentProtocolEnvelope[]
	}>
	executeWithProtocolContext(
		protocolContext: ProtocolContext,
		payload: unknown,
		parameter: unknown,
		onEnvelope?: (envelope: AgentProtocolEnvelope) => Promise<void>,
	): Promise<{
		envelopes: AgentProtocolEnvelope[]
	}>
}

const attachedAgentExecutorKey = Symbol.for('@purista/ai/attachedAgentExecutor')

type ResourceBag = Record<string | symbol, unknown>

export const attachAgentExecutor = (resources: Record<string, unknown>, executor: AttachedAgentExecutor) => {
	;(resources as ResourceBag)[attachedAgentExecutorKey] = executor
}

export const getAttachedAgentExecutor = (resources: Record<string, unknown> | undefined): AttachedAgentExecutor => {
	const executor = (resources as ResourceBag | undefined)?.[attachedAgentExecutorKey]
	if (!executor || typeof executor !== 'object' || typeof (executor as AttachedAgentExecutor).execute !== 'function') {
		throw new Error('Attached agent executor is not configured')
	}
	return executor as AttachedAgentExecutor
}
