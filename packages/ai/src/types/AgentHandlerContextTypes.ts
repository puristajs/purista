import type { Infer } from '@purista/core'
import type { AgentQueueBuilderTypes } from '../builder/AgentQueueBuilderTypes.js'
import type { AgentHandlerContext } from '../runtime/context.js'

export type AgentHandlerContextFromBuilder<T extends AgentQueueBuilderTypes> = AgentHandlerContext<
	Infer<T['PayloadSchema']>,
	Infer<T['ParameterSchema']>,
	T['Resources'],
	T['Models'],
	T['AgentInvokes'],
	T['EmitPayloads'],
	T['ToolInvokes']
>
