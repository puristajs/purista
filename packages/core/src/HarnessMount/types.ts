import type {
	AgentInput,
	AgentOutput,
	BuilderState,
	HarnessDefinition,
	HarnessHostToolBindings,
	HarnessInstanceConfig,
	HarnessTargetContract,
	HostToolHandlerContext,
	InferTypes,
	RunOutcome,
	WorkflowInput,
	WorkflowOutput,
} from '@purista/harness'
import type { Command } from '../core/types/commandType/Command.js'
import type { EmitCustomMessageFunction } from '../core/types/EmitCustomMessageFunction.js'
import type { EmptyObject } from '../core/types/EmptyObject.js'
import type { InvokeList } from '../core/types/InvokeList.js'
import type { Logger } from '../core/types/Logger.js'
import type { QueueContext } from '../core/types/queue/QueueContext.js'
import type { QueueInvokeList } from '../core/types/queue/QueueInvokeList.js'
import type { StreamInvokeList } from '../core/types/StreamInvokeList.js'
import type { StreamOpenRequest } from '../core/types/stream/StreamOpenRequest.js'
import type { Schema } from '../schema/index.js'
import type { HarnessInvocationClients } from './invocation.js'

/** Trusted PURISTA values available to a bound host tool for one run. */
export type HarnessHostContext<Resources extends Record<string, unknown> = Record<string, unknown>> = Readonly<{
	identity: Readonly<{ tenantId?: string; principalId?: string }>
	request: Readonly<{ traceId?: string; correlationId: string }>
	/** Service-owned dependencies supplied through `ServiceBuilder.getInstance(...)`. */
	resources: Resources
	logger: Logger
}>

/** Tool-call context available while mapping a Harness tool into a command. */
export type HarnessCommandToolContext<Resources extends Record<string, unknown> = Record<string, unknown>> = Readonly<
	Pick<
		HostToolHandlerContext<HarnessHostContext<Resources>>,
		'runId' | 'sessionId' | 'agentId' | 'toolId' | 'callId' | 'idempotencyKey'
	> & {
		host: HarnessHostContext<Resources>
	}
>

/** Address-first adapter that exposes a PURISTA command as a Harness host tool. */
export type HarnessCommandToolAdapter<Resources extends Record<string, unknown> = Record<string, unknown>> = Readonly<{
	kind: 'purista-command'
	serviceName: string
	serviceVersion: string
	serviceTarget: string
	/**
	 * Map model input into the command contract. Side-effecting commands should
	 * include `context.idempotencyKey` in a typed command parameter and enforce
	 * it at the resource or downstream boundary.
	 */
	mapInput?: (
		input: unknown,
		context: HarnessCommandToolContext<Resources>,
	) => Readonly<{ payload: unknown; parameter?: unknown }>
	mapOutput?: (output: unknown) => unknown
}>

/** Typed context supplied to a PURISTA-implemented native Harness host tool. */
export type HarnessHostToolFunctionContext<
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	QueueInvokes extends QueueInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
> = HarnessCommandToolContext<Resources> &
	Readonly<{
		resources: Resources
		service: Invokes
		stream: StreamInvokes
		agent: HarnessInvocationClients<Invokes, 'agent'>
		workflow: HarnessInvocationClients<Invokes, 'workflow'>
		queue: QueueContext<QueueInvokes>
		emit: EmitCustomMessageFunction<EmitList>
	}>

/** Immutable PURISTA binding for a provider-neutral Harness host-tool contract. */
export type HarnessHostToolFunctionDefinition<
	Input = unknown,
	Output = unknown,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	QueueInvokes extends QueueInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
> = Readonly<{
	kind: 'purista-host-tool'
	invokes: Invokes
	streamInvokes: StreamInvokes
	queueInvokes: QueueInvokes
	emitList: EmitList
	handler: (
		context: HarnessHostToolFunctionContext<Resources, Invokes, StreamInvokes, QueueInvokes, EmitList>,
		input: Input,
	) => Promise<Output>
}>

type HostToolFunctionDefinition<Binding, Resources extends Record<string, unknown>> = Binding extends (
	context: any,
	input: infer Input,
) => Promise<infer Output>
	? HarnessHostToolFunctionDefinition<Input, Output, Resources, any, any, any, any>
	: never

type MountHostToolBindings<S extends BuilderState, Resources extends Record<string, unknown>> = {
	[K in keyof HarnessHostToolBindings<S, HarnessHostContext<Resources>>]:
		| HarnessHostToolBindings<S, HarnessHostContext<Resources>>[K]
		| HarnessCommandToolAdapter<Resources>
		| HostToolFunctionDefinition<HarnessHostToolBindings<S, HarnessHostContext<Resources>>[K], Resources>
}

/** Trusted execution context passed to mounted-target business guards. */
export type HarnessBusinessGuardContext<Resources extends Record<string, unknown>> = Readonly<{
	kind: 'agent' | 'workflow'
	target: string
	message: Readonly<Command | StreamOpenRequest>
	identity: Readonly<{ tenantId?: string; principalId?: string }>
	resources: Resources
	logger: Logger
}>

type TargetContract<
	S extends BuilderState,
	Kind extends 'agents' | 'workflows',
	K extends string,
> = Kind extends 'agents'
	? K extends keyof NonNullable<S['agents']>
		? HarnessTargetContract<'agent', any, any, AgentInput<S, K>, AgentOutput<S, K>>
		: never
	: K extends keyof NonNullable<S['workflows']>
		? HarnessTargetContract<'workflow', any, any, WorkflowInput<S, K>, WorkflowOutput<S, K>>
		: never

type HarnessTargetPolicy<
	C extends HarnessTargetContract<any, any, any, any, any>,
	Resources extends Record<string, unknown>,
> = Readonly<{
	beforeGuards?: Readonly<
		Record<
			string,
			(context: HarnessBusinessGuardContext<Resources>, input: C['$infer']['input']) => void | Promise<void>
		>
	>
	afterGuards?: Readonly<
		Record<
			string,
			(
				context: HarnessBusinessGuardContext<Resources>,
				outcome: RunOutcome<C['$infer']['output']>,
			) => void | Promise<void>
		>
	>
	/** Publish the completed terminal outcome as a business fact. */
	successEvent?: string
	/** Optional durable queue delivery for this published target. */
	queue?: HarnessTargetQueueBinding<C>
}>

/** Harness target contract marked as supporting native PURISTA queue delivery. */
export type QueuedHarnessTargetContract<C extends HarnessTargetContract<any, any, any, any, any>> = C &
	Readonly<{ queue: Readonly<{ name: string }> }>

/** Opaque native queue and worker binding dedicated to one mounted Harness target. */
export type HarnessTargetQueueBinding<
	C extends HarnessTargetContract<any, any, any, any, any>,
	Queue = unknown,
	Worker = unknown,
> = Readonly<{
	contract: QueuedHarnessTargetContract<C>
	targetContract: C
	queue: Queue
	worker: Worker
}>

type HarnessTargetPolicies<
	S extends BuilderState,
	Kind extends 'agents' | 'workflows',
	Resources extends Record<string, unknown>,
> = Partial<{
	[K in keyof NonNullable<S[Kind]> & string]: HarnessTargetPolicy<TargetContract<S, Kind, K>, Resources>
}>

/** Agent or workflow names explicitly published at a PURISTA service address. */
export type HarnessPublishPolicy<
	S extends BuilderState,
	Resources extends Record<string, unknown> = Record<string, unknown>,
> = Readonly<{
	publish: Readonly<{
		agents?: readonly (keyof NonNullable<S['agents']> & string)[]
		workflows?: readonly (keyof NonNullable<S['workflows']> & string)[]
	}>
	targets?: Readonly<{
		agents?: HarnessTargetPolicies<S, 'agents', Resources>
		workflows?: HarnessTargetPolicies<S, 'workflows', Resources>
	}>
}> &
	(keyof MountHostToolBindings<S, Resources> extends never
		? { readonly hostTools?: never }
		: { readonly hostTools: MountHostToolBindings<S, Resources> })

/** One immutable Harness definition mounted by a service builder. */
export type HarnessMount<D extends HarnessDefinition<any> = HarnessDefinition<any>> = Readonly<{
	definition: D
	policy: HarnessPublishPolicy<HarnessState<D>>
}>

/** Builder state carried by a portable Harness definition. */
export type HarnessState<D extends HarnessDefinition<any>> = D extends HarnessDefinition<infer S> ? S : never

/** Inferred input/output catalog carried by a portable Harness definition. */
export type HarnessTypes<D extends HarnessDefinition<any>> = D extends {
	readonly $infer: infer I extends InferTypes<any>
}
	? I
	: never

/** Runtime AI configuration required by the service's mounted Harness definition. */
export type MountedHarnessRuntimeConfig<D extends HarnessDefinition<any>> = Omit<
	HarnessInstanceConfig<HarnessState<D>, HarnessHostContext>,
	'hostTools'
>

/** Create an address-first command adapter for a Harness host tool. */
export function commandAsHarnessTool<Resources extends Record<string, unknown> = Record<string, unknown>>(
	serviceName: string,
	serviceVersion: string,
	serviceTarget: string,
	options: Pick<HarnessCommandToolAdapter<Resources>, 'mapInput' | 'mapOutput'> = {},
): HarnessCommandToolAdapter<Resources> {
	return Object.freeze({ kind: 'purista-command', serviceName, serviceVersion, serviceTarget, ...options })
}
