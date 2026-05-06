import type { AgentInvokeList, CommandFunctionContext, EmptyObject, StreamFunctionContext } from '@purista/core'
import type { ModelProvider } from '../providers/runtime/ModelProvider.js'
import type { AgentHandlerContext, ToolInvokeMap } from '../runtime/context.js'

export type AgentBeforeGuardHook<Payload = unknown, Parameter = unknown> = (
	context: CommandFunctionContext | StreamFunctionContext,
	payload: Payload,
	parameter: Parameter,
) => Promise<void> | void

export type AgentAfterGuardHook<Payload = unknown, Parameter = unknown> = (
	context: CommandFunctionContext | StreamFunctionContext,
	payload: Payload,
	parameter: Parameter,
	result: AgentHandlerResult,
) => Promise<void> | void

export type AgentModelCallKind =
	| 'rerank'
	| 'generateText'
	| 'streamText'
	| 'generateObject'
	| 'streamObject'
	| 'embed'
	| 'embedMany'

export type AgentModelCallOptions = {
	metadata?: Record<string, unknown>
	aiSdk?: Record<string, unknown>
}

export type AgentModelCallPrepareInput = {
	alias: string
	callKind: AgentModelCallKind
	step: number
	stepByAliasAndKind: number
	requestMetadata?: Record<string, unknown>
}

export type AgentPrepareCallHook = (
	input: AgentModelCallPrepareInput,
) => Promise<AgentModelCallOptions | undefined> | AgentModelCallOptions | undefined

export type AgentPrepareStepHook = AgentPrepareCallHook

export type AgentHandlerResultObject = {
	message: string
	output?: unknown
	summary?: string
	usage?: {
		promptTokens?: number
		completionTokens?: number
		totalTokens?: number
		costUsd?: number
	}
}

export type AgentHandlerResult = string | AgentHandlerResultObject | undefined

export type AgentHandler<
	Payload = unknown,
	Parameter = unknown,
	Resources extends Record<string, unknown> = Record<string, unknown>,
	Models extends Record<string, ModelProvider> = Record<string, ModelProvider>,
	AgentInvokes extends AgentInvokeList = AgentInvokeList,
	EmitPayloads extends Record<string, unknown> = EmptyObject,
	ToolInvokes extends ToolInvokeMap = ToolInvokeMap,
> = (
	context: AgentHandlerContext<Payload, Parameter, Resources, Models, AgentInvokes, EmitPayloads, ToolInvokes>,
	payload: Payload,
	parameter: Parameter,
) => Promise<AgentHandlerResult> | AgentHandlerResult
