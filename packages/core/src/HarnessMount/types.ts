import type {
	AnyHarnessTargetContract,
	HarnessCatalogView,
	HarnessDefinition,
	HarnessExecutionCaller,
	HarnessIdentity,
	HarnessInstanceConfig,
	HarnessTargetContract,
	HarnessTargetInput,
	HarnessTargetOutput,
	HarnessTraceContext,
	RunOutcome,
} from '@purista/harness'
import type { HarnessHostContextRequest } from '@purista/harness/integrator'
import type {
	Command,
	HarnessDispatchContext,
	HarnessInvocationContractEnvelope,
	HarnessRootInvocationContext,
	HarnessTransportEnvelope,
} from '../core/types/commandType/Command.js'
import type { EmitCustomMessageFunction } from '../core/types/EmitCustomMessageFunction.js'
import type { EmptyObject } from '../core/types/EmptyObject.js'
import type { InvokeList } from '../core/types/InvokeList.js'
import type { Logger } from '../core/types/Logger.js'
import type { PuristaMetricContext, PuristaMetricDefinitions } from '../core/types/PuristaMetrics.js'
import type { QueueContext } from '../core/types/queue/QueueContext.js'
import type { QueueInvokeList } from '../core/types/queue/QueueInvokeList.js'
import type { StreamInvokeList } from '../core/types/StreamInvokeList.js'
import type { StreamOpenRequest } from '../core/types/stream/StreamOpenRequest.js'
import type { Infer, InferIn, Schema } from '../schema/index.js'

export type {
	GeneratedHarnessSchema,
	HarnessTargetAddress,
	HarnessTargetExport,
	HarnessTargetQueueExport,
	RemoteHarnessTargetContract,
	RemoteHarnessTargetContractSource,
} from './remoteTargetContract.js'
export { createRemoteHarnessTargetContract } from './remoteTargetContract.js'
export type {
	HarnessDispatchContext,
	HarnessInvocationContractEnvelope,
	HarnessRootInvocationContext,
	HarnessTransportEnvelope,
}

/** Opaque service-owned data retained by Harness for one hosted invocation. */
export type PuristaHostInvocation = Readonly<{
	message: Readonly<Command | StreamOpenRequest>
	identity: HarnessIdentity
	trace?: HarnessTraceContext
	idempotencyKey?: string
}>

/** Address-first target declarations retained privately by a host-tool builder. */
export type HarnessNestedTargetDeclarations = Readonly<
	Record<string, Readonly<Record<string, Readonly<Record<string, AnyHarnessTargetContract>>>>>
>

/** Aggregate-only nested target clients exposed to a host tool. */
export type HarnessNestedTargetClients<Declarations extends HarnessNestedTargetDeclarations> = {
	readonly [ServiceName in keyof Declarations]: {
		readonly [Version in keyof Declarations[ServiceName]]: {
			readonly [Target in keyof Declarations[ServiceName][Version]]: Declarations[ServiceName][Version][Target] extends infer Contract extends
				AnyHarnessTargetContract
				? Readonly<{
						run(
							input: HarnessTargetInput<Contract>,
							options: Readonly<{ callId: string }>,
						): Promise<HarnessTargetOutput<Contract>>
					}>
				: never
		}
	}
}

type HarnessJsonSchemaValue =
	| null
	| boolean
	| number
	| string
	| undefined
	| readonly HarnessJsonSchemaValue[]
	| { readonly [key: string]: HarnessJsonSchemaValue }

/** Schema boundary accepted by model-visible host tools. */
export type HarnessHostToolSchemaBoundary<Value extends Schema> =
	undefined extends InferIn<Value>
		? never
		: undefined extends Infer<Value>
			? never
			: InferIn<Value> extends HarnessJsonSchemaValue
				? Infer<Value> extends HarnessJsonSchemaValue
					? Value
					: never
				: never

/** Exact service-owned context supplied to a PURISTA Harness host tool. */
export type PuristaToolContext<
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	QueueInvokes extends QueueInvokeList = EmptyObject,
	EmitList extends Record<string, unknown> = EmptyObject,
	Agents extends HarnessNestedTargetDeclarations = EmptyObject,
	Workflows extends HarnessNestedTargetDeclarations = EmptyObject,
	Metrics extends PuristaMetricDefinitions = EmptyObject,
> = Readonly<{
	message: PuristaHostInvocation['message']
	identity: HarnessIdentity
	resources: Resources
	service: Invokes
	stream: StreamInvokes
	queue: QueueContext<QueueInvokes>
	emit: EmitCustomMessageFunction<EmitList>
	agent: HarnessNestedTargetClients<Agents>
	workflow: HarnessNestedTargetClients<Workflows>
	step: HarnessCheckpointStep
	logger: Logger
	metrics: PuristaMetricContext<Metrics>
	signal: AbortSignal
	trace?: HarnessTraceContext
	tool: Readonly<{
		sessionId: string
		runId: string
		toolId: string
		callId: string
		idempotencyKey?: string
		caller: HarnessExecutionCaller
	}>
}>

/** @internal Private declaration used to build one tool call's scoped context. */
export type PuristaHostToolRuntimeDefinition = Readonly<{
	definition: object
	invokes: InvokeList
	streamInvokes: StreamInvokeList
	queueInvokes: QueueInvokeList
	emitSchemas: Readonly<Record<string, Schema>>
	agents: HarnessNestedTargetDeclarations
	workflows: HarnessNestedTargetDeclarations
}>

/** @internal Host-tool context factory input bound by the mounted Harness runtime. */
export type PuristaHostContextRequest =
	import('@purista/harness/integrator').HarnessHostContextRequest<PuristaHostInvocation>

/** @internal Builds aggregate-only clients from the Harness-owned nested target boundary. */
export type PuristaNestedTargetInvoker = PuristaHostContextRequest['nestedTargets']

type HarnessCheckpointStep = HarnessHostContextRequest<PuristaHostInvocation>['checkpointStep']

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
	S extends HarnessCatalogView,
	Kind extends 'agents' | 'workflows',
	K extends string,
> = K extends keyof S['contracts'][Kind] ? S['contracts'][Kind][K] : never

/**
 * Controls which immutable identity reopens an existing durable Harness run.
 *
 * `run-owner` is intended for explicitly guarded review flows in which the
 * current reviewer differs from the principal that started the run. PURISTA
 * keeps the current caller in guard and host-tool context and rejects a
 * cross-tenant resume.
 */
export type HarnessDurableResumePolicy = Readonly<{ identity: 'run-owner' }>

/** Business, delivery, and durable-resume policy for one published Harness target. */
export type HarnessTargetPolicy<
	C extends AnyHarnessTargetContract,
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
	/**
	 * Reopen a durable run with the immutable identity of the session that
	 * started it. Use this for explicitly guarded human-review commands where
	 * an authorized reviewer may differ from the initiating principal.
	 *
	 * The current caller remains available to PURISTA guards and host tools.
	 * Cross-tenant resume is always rejected. An explicit Harness storage
	 * adapter and `sessionId` are required so the prior owner can be verified.
	 */
	durableResume?: HarnessDurableResumePolicy
}>

/** Harness target contract marked as supporting native PURISTA queue delivery. */
export type QueuedHarnessTargetContract<C extends AnyHarnessTargetContract> = C &
	Readonly<{ queue: Readonly<{ name: string }> }>

/** Opaque native queue and worker binding dedicated to one mounted Harness target. */
export type HarnessTargetQueueBinding<
	C extends AnyHarnessTargetContract,
	Queue = unknown,
	Worker = unknown,
> = Readonly<{
	contract: QueuedHarnessTargetContract<C>
	targetContract: C
	queue: Queue
	worker: Worker
}>

/** Target-name keyed policies inferred from one portable Harness definition. */
export type HarnessTargetPolicies<
	S extends HarnessCatalogView,
	Kind extends 'agents' | 'workflows',
	Resources extends Record<string, unknown>,
> = Partial<{
	[K in keyof NonNullable<S[Kind]> & string]: HarnessTargetPolicy<TargetContract<S, Kind, K>, Resources>
}>

/** Agent or workflow names explicitly published at a PURISTA service address. */
export type HarnessPublishPolicy<
	S extends HarnessCatalogView,
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
}>

/** Minimal executable definition surface used while declaring a service mount. */
export type HarnessMountableDefinition = Readonly<{
	kind: 'harness'
	requirements: Readonly<{ hostTools: readonly string[] }>
	contracts: Readonly<{
		agents: Readonly<Record<string, HarnessTargetContract<any, any, any, any, any, any>>>
		workflows: Readonly<Record<string, HarnessTargetContract<any, any, any, any, any, any>>>
	}>
}>

/** Policy inferred directly from one definition's public root contracts. */
export type HarnessDefinitionPublishPolicy<
	D extends HarnessMountableDefinition,
	Resources extends Record<string, unknown>,
> = Readonly<{
	publish: Readonly<{
		agents?: readonly (keyof D['contracts']['agents'] & string)[]
		workflows?: readonly (keyof D['contracts']['workflows'] & string)[]
	}>
	targets?: Readonly<{
		agents?: Partial<{
			[K in keyof D['contracts']['agents'] & string]: HarnessTargetPolicy<D['contracts']['agents'][K], Resources>
		}>
		workflows?: Partial<{
			[K in keyof D['contracts']['workflows'] & string]: HarnessTargetPolicy<D['contracts']['workflows'][K], Resources>
		}>
	}>
}>

/** One immutable Harness definition mounted by a service builder. */
export type HarnessMount<D extends HarnessDefinition<any, any, any> = HarnessDefinition<any, any, any>> = Readonly<{
	definition: D
	policy: HarnessPublishPolicy<HarnessState<D>>
}>

/** Builder state carried by a portable Harness definition. */
export type HarnessState<D extends HarnessDefinition<any, any, any>> =
	D extends HarnessDefinition<infer S, any, any> ? S : never

/** Inferred input/output catalog carried by a portable Harness definition. */
export type HarnessTypes<D extends HarnessDefinition<any, any, any>> = D extends { readonly $infer: infer I }
	? I
	: never

/** Runtime AI configuration required by the service's mounted Harness definition. */
export type MountedHarnessRuntimeConfig<D extends HarnessDefinition<any, any, any>> = Omit<
	HarnessInstanceConfig<D['requirements']>,
	'hostTools'
>
