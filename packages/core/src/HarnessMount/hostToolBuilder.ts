import type { HarnessTargetContract } from '@purista/harness'
import {
	registerEmitSchema,
	registerInvokeCapability,
	registerStreamInvokeCapability,
} from '../core/helper/builderRegistry.impl.js'
import type { EmptyObject } from '../core/types/EmptyObject.js'
import type { InvokeList } from '../core/types/InvokeList.js'
import type { QueueInvokeList } from '../core/types/queue/QueueInvokeList.js'
import type { StreamInvokeList } from '../core/types/StreamInvokeList.js'
import type { StreamHandle } from '../core/types/stream/StreamHandle.js'
import type { Infer, InferIn, Schema } from '../schema/index.js'
import {
	type HarnessInvokeDeclaration,
	type HarnessStreamDeclaration,
	registerHarnessInvocation,
} from './invocation.js'
import type { HarnessHostToolFunctionContext, HarnessHostToolFunctionDefinition } from './types.js'

/**
 * Declares the PURISTA capabilities available to one native Harness host tool.
 * The resulting binding remains private to the mount and creates no command,
 * stream, queue, or HTTP endpoint of its own.
 */
export class HarnessHostToolBuilder<
	Input,
	Output,
	Resources extends Record<string, unknown> = EmptyObject,
	Invokes extends InvokeList = EmptyObject,
	StreamInvokes extends StreamInvokeList = EmptyObject,
	QueueInvokes extends QueueInvokeList = EmptyObject,
	EmitList extends Record<string, Schema> = EmptyObject,
> {
	private invokes: InvokeList = {}
	private streamInvokes: StreamInvokeList = {}
	private queueInvokes: QueueInvokeList = {}
	private emitList: Record<string, Schema> = {}
	private handler?: (
		context: HarnessHostToolFunctionContext<Resources, Invokes, StreamInvokes, QueueInvokes, EmitList>,
		input: Input,
	) => Promise<Output>

	/** Declare an address-first PURISTA command available to the tool handler. */
	canInvoke<
		OutputSchema extends Schema,
		PayloadSchema extends Schema,
		ParameterSchema extends Schema,
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
		this.invokes = registerInvokeCapability(this.invokes, serviceName, serviceVersion, serviceTarget, {
			outputSchema,
			payloadSchema,
			parameterSchema,
		})
		return this as unknown as HarnessHostToolBuilder<
			Input,
			Output,
			Resources,
			Invokes &
				Record<
					ServiceName,
					Record<
						ServiceVersion,
						Record<
							ServiceTarget,
							(
								payload: import('../schema/index.js').InferIn<PayloadSchema>,
								parameter: import('../schema/index.js').InferIn<ParameterSchema>,
							) => Promise<import('../schema/index.js').Infer<OutputSchema>>
						>
					>
				>,
			StreamInvokes,
			QueueInvokes,
			EmitList
		>
	}

	/** Declare an address-first mounted Harness agent available to the tool handler. */
	canInvokeAgent<
		Contract extends HarnessTargetContract<'agent', any, any>,
		ServiceName extends string,
		ServiceVersion extends string,
		ServiceTarget extends string,
	>(serviceName: ServiceName, serviceVersion: ServiceVersion, serviceTarget: ServiceTarget, contract: Contract) {
		const registered = registerHarnessInvocation(
			this.invokes,
			this.streamInvokes,
			serviceName,
			serviceVersion,
			serviceTarget,
			contract,
		)
		this.invokes = registered.invokes
		this.streamInvokes = registered.streamInvokes
		return this as unknown as HarnessHostToolBuilder<
			Input,
			Output,
			Resources,
			Invokes & Record<ServiceName, Record<ServiceVersion, Record<ServiceTarget, HarnessInvokeDeclaration<Contract>>>>,
			StreamInvokes &
				Record<ServiceName, Record<ServiceVersion, Record<ServiceTarget, HarnessStreamDeclaration<Contract>>>>,
			QueueInvokes,
			EmitList
		>
	}

	/** Declare an address-first mounted Harness workflow available to the tool handler. */
	canInvokeWorkflow<
		Contract extends HarnessTargetContract<'workflow', any, any>,
		ServiceName extends string,
		ServiceVersion extends string,
		ServiceTarget extends string,
	>(serviceName: ServiceName, serviceVersion: ServiceVersion, serviceTarget: ServiceTarget, contract: Contract) {
		const registered = registerHarnessInvocation(
			this.invokes,
			this.streamInvokes,
			serviceName,
			serviceVersion,
			serviceTarget,
			contract,
		)
		this.invokes = registered.invokes
		this.streamInvokes = registered.streamInvokes
		return this as unknown as HarnessHostToolBuilder<
			Input,
			Output,
			Resources,
			Invokes & Record<ServiceName, Record<ServiceVersion, Record<ServiceTarget, HarnessInvokeDeclaration<Contract>>>>,
			StreamInvokes &
				Record<ServiceName, Record<ServiceVersion, Record<ServiceTarget, HarnessStreamDeclaration<Contract>>>>,
			QueueInvokes,
			EmitList
		>
	}

	/** Declare a PURISTA stream available to the tool handler. */
	canConsumeStream<
		ChunkSchema extends Schema,
		FinalSchema extends Schema,
		PayloadSchema extends Schema,
		ParameterSchema extends Schema,
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
		this.streamInvokes = registerStreamInvokeCapability(
			this.streamInvokes,
			serviceName,
			serviceVersion,
			serviceTarget,
			{ chunkSchema, finalSchema, payloadSchema, parameterSchema, validateChunk, validateFinal },
		)
		return this as unknown as HarnessHostToolBuilder<
			Input,
			Output,
			Resources,
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
			EmitList
		>
	}

	/** Declare a native PURISTA queue available to the tool handler. */
	canEnqueue<PayloadSchema extends Schema, ParameterSchema extends Schema, QueueName extends string>(
		queueName: QueueName,
		payloadSchema?: PayloadSchema,
		parameterSchema?: ParameterSchema,
	) {
		if (queueName.trim() === '') throw new Error('canEnqueue requires non-empty queue name')
		this.queueInvokes = { ...this.queueInvokes, [queueName]: { payloadSchema, parameterSchema } }
		return this as unknown as HarnessHostToolBuilder<
			Input,
			Output,
			Resources,
			Invokes,
			StreamInvokes,
			QueueInvokes & Record<QueueName, { payloadSchema: PayloadSchema; parameterSchema: ParameterSchema }>,
			EmitList
		>
	}

	/** Declare a validated custom event available to the tool handler. */
	canEmit<EventName extends string, EventSchema extends Schema>(eventName: EventName, schema: EventSchema) {
		this.emitList = registerEmitSchema(this.emitList, eventName, schema)
		return this as unknown as HarnessHostToolBuilder<
			Input,
			Output,
			Resources,
			Invokes,
			StreamInvokes,
			QueueInvokes,
			EmitList & Record<EventName, EventSchema>
		>
	}

	/** Set the function that implements the native Harness host-tool contract. */
	setHandler(
		handler: (
			context: HarnessHostToolFunctionContext<Resources, Invokes, StreamInvokes, QueueInvokes, EmitList>,
			input: Input,
		) => Promise<Output>,
	) {
		this.handler = handler
		return this
	}

	/** Return the synchronous, immutable binding consumed by `mountHarness(...)`. */
	getDefinition(): HarnessHostToolFunctionDefinition<
		Input,
		Output,
		Resources,
		Invokes,
		StreamInvokes,
		QueueInvokes,
		EmitList
	> {
		if (!this.handler) throw new Error('A Harness host tool requires setHandler(...) before getDefinition().')
		return Object.freeze({
			kind: 'purista-host-tool',
			invokes: freezeAddressRegistry(this.invokes) as Invokes,
			streamInvokes: freezeAddressRegistry(this.streamInvokes) as StreamInvokes,
			queueInvokes: freezeNamedRegistry(this.queueInvokes) as QueueInvokes,
			emitList: Object.freeze({ ...this.emitList }) as EmitList,
			handler: this.handler,
		})
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
