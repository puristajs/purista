import type { AgentInvokeList, EmptyObject, Infer, InferIn, Schema } from '@purista/core'
import type {
	ModelProvider,
	ModelProviderCapability,
	ModelProviderForCapabilities,
} from '../providers/runtime/ModelProvider.js'
import type { AgentInvocationFinalResult } from '../types/AgentDefinition.js'
import type { defaultAgentModelCapabilities } from '../types/AgentManifest.js'

type SetNewTypeValue<T, K extends keyof T, V> = {
	[P in keyof T]: P extends K ? V : T[P]
}

export type AgentInvokeBinding<
	PayloadSchema extends Schema = Schema,
	ParameterSchema extends Schema = Schema,
	OutputSchema extends Schema = Schema,
> = {
	/**
	 * Invoke a child agent.
	 *
	 * `parameter` is optional so callers do not need to pass `undefined`
	 * when the target defines no input parameter schema.
	 */
	call: (
		payload: InferIn<PayloadSchema>,
		parameter?: InferIn<ParameterSchema>,
	) => {
		final(): Promise<AgentInvocationFinalResult<Infer<OutputSchema>>>
		[Symbol.asyncIterator](): AsyncIterator<unknown>
	}
	payloadSchema?: PayloadSchema
	parameterSchema?: ParameterSchema
	outputSchema?: OutputSchema
}

export type AgentQueueBuilderTypes<
	PayloadSchema extends Schema = Schema,
	ParameterSchema extends Schema = Schema,
	OutputSchema extends Schema = Schema,
	Resources extends Record<string, unknown> = EmptyObject,
	Models extends Record<string, ModelProvider> = EmptyObject,
	ToolInvokes extends Record<string, Record<string, Record<string, (...args: unknown[]) => Promise<unknown>>>> = Record<
		string,
		Record<string, Record<string, (...args: unknown[]) => Promise<unknown>>>
	>,
	AgentInvokes extends AgentInvokeList = AgentInvokeList,
	EmitPayloads extends Record<string, unknown> = EmptyObject,
> = {
	PayloadSchema: PayloadSchema
	ParameterSchema: ParameterSchema
	OutputSchema: OutputSchema
	Resources: Resources
	Models: Models
	ToolInvokes: ToolInvokes
	AgentInvokes: AgentInvokes
	EmitPayloads: EmitPayloads
}

export type SetPayloadSchema<T extends AgentQueueBuilderTypes, PayloadSchema extends Schema> = SetNewTypeValue<
	T,
	'PayloadSchema',
	PayloadSchema
>

export type SetParameterSchema<T extends AgentQueueBuilderTypes, ParameterSchema extends Schema> = SetNewTypeValue<
	T,
	'ParameterSchema',
	ParameterSchema
>

export type SetOutputSchema<T extends AgentQueueBuilderTypes, OutputSchema extends Schema> = SetNewTypeValue<
	T,
	'OutputSchema',
	OutputSchema
>

export type AddResource<T extends AgentQueueBuilderTypes, ResourceName extends string, Resource> = SetNewTypeValue<
	T,
	'Resources',
	T['Resources'] & Record<ResourceName, Resource>
>

export type AddModelAlias<
	T extends AgentQueueBuilderTypes,
	Alias extends string,
	Capabilities extends readonly ModelProviderCapability[] = typeof defaultAgentModelCapabilities,
> = SetNewTypeValue<T, 'Models', T['Models'] & Record<Alias, ModelProviderForCapabilities<Capabilities>>>

export type AddToolInvoke<
	T extends AgentQueueBuilderTypes,
	ServiceName extends string,
	ServiceVersion extends string,
	CommandName extends string,
	PayloadSchema extends Schema,
	ParameterSchema extends Schema,
	OutputSchema extends Schema,
> = SetNewTypeValue<
	T,
	'ToolInvokes',
	T['ToolInvokes'] &
		Record<
			ServiceName,
			Record<
				ServiceVersion,
				Record<
					CommandName,
					/**
					 * Tool invoke calls accept optional `parameter` for better DX
					 * when the invoked command has no parameter schema.
					 */
					(payload: InferIn<PayloadSchema>, parameter?: InferIn<ParameterSchema>) => Promise<Infer<OutputSchema>>
				>
			>
		>
>

export type AddAgentInvoke<
	T extends AgentQueueBuilderTypes,
	AgentName extends string,
	ServiceVersion extends string,
	PayloadSchema extends Schema,
	ParameterSchema extends Schema,
	OutputSchema extends Schema,
> = SetNewTypeValue<
	T,
	'AgentInvokes',
	T['AgentInvokes'] &
		Record<AgentName, Record<ServiceVersion, AgentInvokeBinding<PayloadSchema, ParameterSchema, OutputSchema>>>
>
