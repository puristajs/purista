import type {
	AnyHarnessTargetContract,
	HarnessCatalogView,
	HarnessDefinition,
	HarnessExecutionCaller,
	HarnessIdentity,
	HarnessTargetInput,
	HarnessTargetOutput,
	HarnessTargetRunOutcome,
	HarnessTraceContext,
} from '@purista/harness'
import type { HarnessHostContextRequest, HostedHarnessInstanceConfig } from '@purista/harness/integrator'
import type { StandardSchemaV1 } from '@standard-schema/spec'
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
import type { HarnessTargetQueueBinding } from './queueBinding.js'
import type { HarnessTargetJsonSchema, SerializedHarnessTargetExportV1 } from './targetExport.js'

export type { JsonValue } from '@purista/harness'
export { harnessExecutionEventTypesV1 } from '@purista/harness'
export type { HarnessTargetQueueBinding } from './queueBinding.js'

export type {
	AnyQueuedRemoteHarnessTargetContract,
	AnyRemoteHarnessTargetContract,
	GeneratedHarnessSchema,
	HarnessTargetAddress,
	HarnessTargetQueueExport,
	QueuedRemoteHarnessTargetContract,
	QueuedRemoteHarnessTargetContractSourceV1,
	RemoteHarnessSerializedTargetV1,
	RemoteHarnessTargetContract,
	RemoteHarnessTargetContractSourceBaseV1,
	RemoteHarnessTargetContractSourceV1,
	UnqueuedRemoteHarnessTargetContract,
} from './remoteTargetContract.js'
export {
	createGeneratedHarnessSchema,
	createRemoteHarnessTargetContract,
} from './remoteTargetContract.js'
export type { HarnessTargetJsonSchema, SerializedHarnessTargetExportV1 } from './targetExport.js'
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

/** Named business guards evaluated for one explicit Harness root. */
type HarnessBeforeGuardMap<C extends AnyHarnessTargetContract, Resources extends Record<string, unknown>> = Readonly<
	Record<
		string,
		(context: HarnessBusinessGuardContext<Resources>, input: C['$infer']['validatedInput']) => void | Promise<void>
	>
>

type HarnessTargetPolicyBase<C extends AnyHarnessTargetContract, Resources extends Record<string, unknown>> = Readonly<{
	afterGuards?: Readonly<
		Record<
			string,
			(context: HarnessBusinessGuardContext<Resources>, outcome: HarnessTargetRunOutcome<C>) => void | Promise<void>
		>
	>
	/** Publish the completed terminal outcome as a business fact. */
	successEvent?: string
	/** Optional durable queue delivery for this root. */
	queue?: HarnessTargetQueueBinding<C>
	beforeGuards?: HarnessBeforeGuardMap<C, Resources>
}>

/** Business, delivery, and durable-resume policy for one explicit Harness root. */
export type HarnessTargetPolicy<
	C extends AnyHarnessTargetContract,
	Resources extends Record<string, unknown>,
> = HarnessTargetPolicyBase<C, Resources> &
	('tool-approval' extends C['interrupts'][number]
		? Readonly<
				| { durableResume?: never }
				| {
						durableResume: HarnessDurableResumePolicy
						beforeGuards: HarnessBeforeGuardMap<C, Resources>
				  }
			>
		: Readonly<{ durableResume?: never }>)

/** Deterministic root policy committed to a target's route revision. */
export type MountedHarnessTargetPolicyDescriptor = Readonly<{
	beforeGuardKeys: readonly string[]
	afterGuardKeys: readonly string[]
	durableResume: 'stored-run-owner' | null
	successEvent: string | null
	queueName: string | null
}>

/** Validation-only completed-result event metadata for one root target. */
export type MountedHarnessCompletedEvent<C extends AnyHarnessTargetContract> = Readonly<{
	name: string
	schema: StandardSchemaV1<
		Extract<HarnessTargetRunOutcome<C>, { status: 'completed' }>,
		Extract<HarnessTargetRunOutcome<C>, { status: 'completed' }>
	>
	jsonSchema: HarnessTargetJsonSchema
}>

/** Exact Core-owned transport projection of one authentic hosted target. */
export type MountedHarnessTargetProjection<C extends AnyHarnessTargetContract> = Readonly<{
	target: C
	standardSchemas: Readonly<{ input: C['input']; output: C['output'] }>
	visibility: 'root' | 'dependency'
	address: Readonly<{ serviceName: string; serviceVersion: string; serviceTarget: string }>
	policy: MountedHarnessTargetPolicyDescriptor | null
	jsonSchemas: Readonly<{
		input: HarnessTargetJsonSchema
		validatedInput: HarnessTargetJsonSchema
		output: HarnessTargetJsonSchema
		update: HarnessTargetJsonSchema
		interrupt: HarnessTargetJsonSchema
	}>
	targetExport: Omit<SerializedHarnessTargetExportV1, 'exportDigest'>
	exportDigest: `sha256:${string}`
	mountRevision: string
	routeBindingRevision: `sha256:${string}`
	routeBinding: import('./dispatcher.js').HarnessTargetRouteBinding<C>
	completedEvent?: MountedHarnessCompletedEvent<C>
}>

/** Target-name keyed policies inferred from one portable Harness definition. */
export type HarnessTargetPolicies<
	S extends HarnessCatalogView,
	Kind extends 'agents' | 'workflows',
	Resources extends Record<string, unknown>,
> = Partial<{
	[K in keyof NonNullable<S[Kind]> & string]: HarnessTargetPolicy<TargetContract<S, Kind, K>, Resources>
}>

/** Optional business and delivery policy for explicit Harness roots. */
export type HarnessMountPolicy<
	S extends HarnessCatalogView,
	Resources extends Record<string, unknown> = Record<string, unknown>,
> = Readonly<{
	targets?: Readonly<{
		agents?: HarnessTargetPolicies<S, 'agents', Resources>
		workflows?: HarnessTargetPolicies<S, 'workflows', Resources>
	}>
}>

/** Policy inferred directly from one definition's public root contracts. */
export type HarnessDefinitionMountPolicy<D, Resources extends Record<string, unknown>> = HarnessMountPolicy<
	HarnessState<D>,
	Resources
>

/** One immutable Harness definition mounted by a service builder. */
export type HarnessMount<
	D = HarnessDefinition<any, any, any>,
	Resources extends Record<string, unknown> = Record<string, unknown>,
> = Readonly<{
	definition: D
	policy?: HarnessDefinitionMountPolicy<D, Resources>
	projections: readonly MountedHarnessTargetProjection<AnyHarnessTargetContract>[]
}>

/** Builder state carried by a portable Harness definition. */
export type HarnessState<D> = D extends HarnessDefinition<infer S, infer _Name, infer _Graph> ? S : never

/** Inferred input/output catalog carried by a portable Harness definition. */
export type HarnessTypes<D> = D extends { readonly $infer: infer I } ? I : never

/**
 * Exact runtime AI configuration required by the service's mounted Harness definition.
 * Every model alias declared by an agent is inferred as a required key of `models`.
 */
export type MountedHarnessRuntimeConfig<D> =
	D extends HarnessDefinition<infer Catalog, infer _Name, infer _Graph>
		? HostedHarnessInstanceConfig<Catalog['requirements']>
		: never
