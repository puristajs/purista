import type { AnyHarnessTargetContract, HostToolDefinition, ModelSchema, Schema } from '@purista/harness'
import { defineHostTool, type HostOwnerToken, isHarnessTargetContract } from '@purista/harness/integrator'
import {
	registerEmitSchema,
	registerInvokeCapability,
	registerStreamInvokeCapability,
} from '../core/helper/builderRegistry.impl.js'
import type { EmptyObject } from '../core/types/EmptyObject.js'
import type { InvokeList } from '../core/types/InvokeList.js'
import type { PuristaMetricDefinitions } from '../core/types/PuristaMetrics.js'
import type { QueueInvokeList } from '../core/types/queue/QueueInvokeList.js'
import type { StreamInvokeList } from '../core/types/StreamInvokeList.js'
import type { StreamHandle } from '../core/types/stream/StreamHandle.js'
import type { Infer, InferIn } from '../schema/index.js'
import type {
	HarnessHostToolSchemaBoundary,
	HarnessNestedTargetDeclarations,
	PuristaHostToolRuntimeDefinition,
	PuristaToolContext,
} from './types.js'

type ToolRegistration = (definition: PuristaHostToolRuntimeDefinition) => void

/**
 * Declares the exact service capabilities available to one native Harness host tool.
 * `setHandler(...)` returns the final owner-branded Harness definition.
 */
export class HarnessHostToolBuilder<
	Id extends string,
	Input extends ModelSchema,
	Output extends Schema,
	Resources extends Record<string, unknown> = EmptyObject,
	Metrics extends PuristaMetricDefinitions = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	QueueInvokes extends QueueInvokeList = EmptyObject,
	EmitList extends Record<string, unknown> = EmptyObject,
	Agents extends HarnessNestedTargetDeclarations = EmptyObject,
	Workflows extends HarnessNestedTargetDeclarations = EmptyObject,
> {
	#invokes: InvokeList = {}
	#streamInvokes: StreamInvokeList = {}
	#queueInvokes: QueueInvokeList = {}
	#emitSchemas: Record<string, import('../schema/index.js').Schema> = {}
	#agents: HarnessNestedTargetDeclarations = {}
	#workflows: HarnessNestedTargetDeclarations = {}
	readonly #owner: HostOwnerToken<unknown>
	readonly #id: Id
	readonly #options: Readonly<{
		description: string
		input: HarnessHostToolSchemaBoundary<Input>
		output: HarnessHostToolSchemaBoundary<Output>
	}>
	readonly #register: ToolRegistration

	/** @internal ServiceBuilder owns construction and registration. */
	constructor(
		owner: HostOwnerToken<unknown>,
		id: Id,
		options: Readonly<{
			description: string
			input: HarnessHostToolSchemaBoundary<Input>
			output: HarnessHostToolSchemaBoundary<Output>
		}>,
		register: ToolRegistration,
	) {
		this.#owner = owner
		this.#id = id
		this.#options = options
		this.#register = register
	}

	/** Declare one address-first PURISTA command available to the tool handler. */
	canInvoke<
		OutputSchema extends import('../schema/index.js').Schema,
		PayloadSchema extends import('../schema/index.js').Schema,
		ParameterSchema extends import('../schema/index.js').Schema,
		ServiceName extends string,
		ServiceVersion extends string,
		ServiceTarget extends string,
	>(
		serviceName: ServiceName,
		serviceVersion: ServiceVersion,
		serviceTarget: ServiceTarget,
		outputSchema?: OutputSchema,
		payloadSchema?: PayloadSchema,
		parameterSchema?: ParameterSchema,
	) {
		this.#invokes = registerInvokeCapability(this.#invokes, serviceName, serviceVersion, serviceTarget, {
			outputSchema,
			payloadSchema,
			parameterSchema,
		})
		return this as unknown as HarnessHostToolBuilder<
			Id,
			Input,
			Output,
			Resources,
			Metrics,
			Invokes &
				Record<
					ServiceName,
					Record<
						ServiceVersion,
						Record<
							ServiceTarget,
							(payload: InferIn<PayloadSchema>, parameter: InferIn<ParameterSchema>) => Promise<Infer<OutputSchema>>
						>
					>
				>,
			StreamInvokes,
			QueueInvokes,
			EmitList,
			Agents,
			Workflows
		>
	}

	/** Declare one mounted Harness agent available through the run-only nested boundary. */
	canInvokeAgent<
		Contract extends AnyHarnessTargetContract & Readonly<{ kind: 'agent' }>,
		ServiceName extends string,
		ServiceVersion extends string,
	>(serviceName: ServiceName, serviceVersion: ServiceVersion, contract: Contract) {
		assertTargetContract(contract, 'agent')
		this.#agents = registerTarget(this.#agents, serviceName, serviceVersion, contract.id, contract)
		return this as unknown as HarnessHostToolBuilder<
			Id,
			Input,
			Output,
			Resources,
			Metrics,
			Invokes,
			StreamInvokes,
			QueueInvokes,
			EmitList,
			Agents & Record<ServiceName, Record<ServiceVersion, Record<Contract['id'], Contract>>>,
			Workflows
		>
	}

	/** Declare one mounted Harness workflow available through the run-only nested boundary. */
	canInvokeWorkflow<
		Contract extends AnyHarnessTargetContract & Readonly<{ kind: 'workflow' }>,
		ServiceName extends string,
		ServiceVersion extends string,
	>(serviceName: ServiceName, serviceVersion: ServiceVersion, contract: Contract) {
		assertTargetContract(contract, 'workflow')
		this.#workflows = registerTarget(this.#workflows, serviceName, serviceVersion, contract.id, contract)
		return this as unknown as HarnessHostToolBuilder<
			Id,
			Input,
			Output,
			Resources,
			Metrics,
			Invokes,
			StreamInvokes,
			QueueInvokes,
			EmitList,
			Agents,
			Workflows & Record<ServiceName, Record<ServiceVersion, Record<Contract['id'], Contract>>>
		>
	}

	/** Declare one PURISTA stream available to the tool handler. */
	canConsumeStream<
		ChunkSchema extends import('../schema/index.js').Schema,
		FinalSchema extends import('../schema/index.js').Schema,
		PayloadSchema extends import('../schema/index.js').Schema,
		ParameterSchema extends import('../schema/index.js').Schema,
		ServiceName extends string,
		ServiceVersion extends string,
		ServiceTarget extends string,
	>(
		serviceName: ServiceName,
		serviceVersion: ServiceVersion,
		serviceTarget: ServiceTarget,
		chunkSchema?: ChunkSchema,
		payloadSchema?: PayloadSchema,
		parameterSchema?: ParameterSchema,
		finalSchema?: FinalSchema,
		validateChunk = true,
		validateFinal = true,
	) {
		this.#streamInvokes = registerStreamInvokeCapability(
			this.#streamInvokes,
			serviceName,
			serviceVersion,
			serviceTarget,
			{ chunkSchema, finalSchema, payloadSchema, parameterSchema, validateChunk, validateFinal },
		)
		return this as unknown as HarnessHostToolBuilder<
			Id,
			Input,
			Output,
			Resources,
			Metrics,
			Invokes,
			StreamInvokes &
				Record<
					ServiceName,
					Record<
						ServiceVersion,
						Record<
							ServiceTarget,
							(
								payload: InferIn<PayloadSchema>,
								parameter: InferIn<ParameterSchema>,
							) => Promise<StreamHandle<Infer<ChunkSchema>, Infer<FinalSchema>>>
						>
					>
				>,
			QueueInvokes,
			EmitList,
			Agents,
			Workflows
		>
	}

	/** Declare one PURISTA queue available to the tool handler. */
	canEnqueue<
		PayloadSchema extends import('../schema/index.js').Schema,
		ParameterSchema extends import('../schema/index.js').Schema,
		QueueName extends string,
	>(queueName: QueueName, payloadSchema?: PayloadSchema, parameterSchema?: ParameterSchema) {
		if (queueName.trim() === '') throw new TypeError('canEnqueue requires a non-empty queue name.')
		this.#queueInvokes = { ...this.#queueInvokes, [queueName]: { payloadSchema, parameterSchema } }
		return this as unknown as HarnessHostToolBuilder<
			Id,
			Input,
			Output,
			Resources,
			Metrics,
			Invokes,
			StreamInvokes,
			QueueInvokes & Record<QueueName, { payloadSchema: PayloadSchema; parameterSchema: ParameterSchema }>,
			EmitList,
			Agents,
			Workflows
		>
	}

	/** Declare one validated custom event available to the tool handler. */
	canEmit<EventName extends string, EventSchema extends import('../schema/index.js').Schema>(
		eventName: EventName,
		schema: EventSchema,
	) {
		this.#emitSchemas = registerEmitSchema(this.#emitSchemas, eventName, schema)
		return this as unknown as HarnessHostToolBuilder<
			Id,
			Input,
			Output,
			Resources,
			Metrics,
			Invokes,
			StreamInvokes,
			QueueInvokes,
			EmitList & Record<EventName, InferIn<EventSchema>>,
			Agents,
			Workflows
		>
	}

	/** Set the implementation and return the final frozen owner-branded Harness tool. */
	setHandler(
		handler: (
			context: PuristaToolContext<
				Resources,
				Invokes,
				StreamInvokes,
				QueueInvokes,
				EmitList,
				Agents,
				Workflows,
				Metrics
			>,
			input: import('@purista/harness').Infer<Input>,
		) => Promise<import('@purista/harness').InferIn<Output>>,
	): HostToolDefinition<
		Id,
		Input,
		Output,
		PuristaToolContext<Resources, Invokes, StreamInvokes, QueueInvokes, EmitList, Agents, Workflows, Metrics>
	> {
		type Context = PuristaToolContext<
			Resources,
			Invokes,
			StreamInvokes,
			QueueInvokes,
			EmitList,
			Agents,
			Workflows,
			Metrics
		>
		const hostOptions = {
			...this.#options,
			handler,
		} as unknown as Parameters<typeof defineHostTool<Id, Input, Output, Context>>[2]
		const definition = defineHostTool<Id, Input, Output, Context>(
			this.#owner as HostOwnerToken<Context>,
			this.#id,
			hostOptions,
		)
		this.#register(
			Object.freeze({
				definition,
				invokes: freezeAddressRegistry(this.#invokes),
				streamInvokes: freezeAddressRegistry(this.#streamInvokes),
				queueInvokes: freezeNamedRegistry(this.#queueInvokes),
				emitSchemas: Object.freeze({ ...this.#emitSchemas }),
				agents: freezeTargetRegistry(this.#agents),
				workflows: freezeTargetRegistry(this.#workflows),
			}),
		)
		return definition
	}
}

function assertTargetContract(
	contract: unknown,
	kind: 'agent' | 'workflow',
): asserts contract is AnyHarnessTargetContract {
	if (!isHarnessTargetContract(contract)) {
		throw new TypeError(
			`canInvoke${kind === 'agent' ? 'Agent' : 'Workflow'} requires an authentic Harness target contract.`,
		)
	}
	if (contract.kind !== kind) {
		throw new TypeError(
			`canInvoke${kind === 'agent' ? 'Agent' : 'Workflow'} requires ${kind === 'agent' ? 'an' : 'a'} ${kind} contract.`,
		)
	}
}

function registerTarget<Contract extends AnyHarnessTargetContract>(
	registry: HarnessNestedTargetDeclarations,
	serviceName: string,
	serviceVersion: string,
	serviceTarget: string,
	contract: Contract,
): HarnessNestedTargetDeclarations {
	if (!serviceName.trim() || !serviceVersion.trim() || !serviceTarget.trim()) {
		throw new TypeError('Harness target addresses require non-empty service, version, and target values.')
	}
	return {
		...registry,
		[serviceName]: {
			...registry[serviceName],
			[serviceVersion]: {
				...registry[serviceName]?.[serviceVersion],
				[serviceTarget]: contract,
			},
		},
	}
}

function freezeAddressRegistry<T extends Record<string, Record<string, Record<string, object>>>>(registry: T): T {
	return Object.freeze(
		Object.fromEntries(
			Object.entries(registry).map(([serviceName, versions]) => [
				serviceName,
				Object.freeze(
					Object.fromEntries(
						Object.entries(versions).map(([version, targets]) => [
							version,
							Object.freeze(
								Object.fromEntries(
									Object.entries(targets).map(([target, declaration]) => [target, Object.freeze({ ...declaration })]),
								),
							),
						]),
					),
				),
			]),
		),
	) as T
}

function freezeNamedRegistry<T extends Record<string, object>>(registry: T): T {
	return Object.freeze(
		Object.fromEntries(
			Object.entries(registry).map(([name, declaration]) => [name, Object.freeze({ ...declaration })]),
		),
	) as T
}

function freezeTargetRegistry(registry: HarnessNestedTargetDeclarations): HarnessNestedTargetDeclarations {
	return Object.freeze(
		Object.fromEntries(
			Object.entries(registry).map(([serviceName, versions]) => [
				serviceName,
				Object.freeze(
					Object.fromEntries(
						Object.entries(versions).map(([version, targets]) => [version, Object.freeze({ ...targets })]),
					),
				),
			]),
		),
	)
}
