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
import type { Logger } from '../core/types/Logger.js'
import type { StreamOpenRequest } from '../core/types/stream/StreamOpenRequest.js'

/** Trusted PURISTA values available to a bound host tool for one run. */
export type HarnessHostContext = Readonly<{
	identity: Readonly<{ tenantId?: string; principalId?: string }>
	request: Readonly<{ traceId?: string; correlationId: string }>
	logger: Logger
}>

/** Tool-call context available while mapping a Harness tool into a command. */
export type HarnessCommandToolContext = Readonly<
	Pick<
		HostToolHandlerContext<HarnessHostContext>,
		'runId' | 'sessionId' | 'agentId' | 'toolId' | 'callId' | 'idempotencyKey'
	> & {
		host: HarnessHostContext
	}
>

/** Address-first adapter that exposes a PURISTA command as a Harness host tool. */
export type HarnessCommandToolAdapter = Readonly<{
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
		context: HarnessCommandToolContext,
	) => Readonly<{ payload: unknown; parameter?: unknown }>
	mapOutput?: (output: unknown) => unknown
}>

type MountHostToolBindings<S extends BuilderState> = {
	[K in keyof HarnessHostToolBindings<S, HarnessHostContext>]:
		| HarnessHostToolBindings<S, HarnessHostContext>[K]
		| HarnessCommandToolAdapter
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
	(keyof MountHostToolBindings<S> extends never
		? { readonly hostTools?: never }
		: { readonly hostTools: MountHostToolBindings<S> })

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

type UnionToIntersection<U> = (U extends unknown ? (value: U) => void : never) extends (value: infer I) => void
	? I
	: never

/** Runtime AI configuration accumulated from every mounted Harness definition. */
export type MountedHarnessRuntimeConfig<H extends readonly HarnessDefinition<any>[]> = UnionToIntersection<
	H[number] extends infer D extends HarnessDefinition<any>
		? Omit<HarnessInstanceConfig<HarnessState<D>, HarnessHostContext>, 'hostTools'>
		: never
>

/** Create an address-first command adapter for a Harness host tool. */
export function commandAsHarnessTool(
	serviceName: string,
	serviceVersion: string,
	serviceTarget: string,
	options: Pick<HarnessCommandToolAdapter, 'mapInput' | 'mapOutput'> = {},
): HarnessCommandToolAdapter {
	return Object.freeze({ kind: 'purista-command', serviceName, serviceVersion, serviceTarget, ...options })
}
