import type { AllowedAgentDefinition } from '../AgentQueueBuilder/types.js'
import {
	getNamedHook,
	mergeNamedHooks,
	registerEmitSchema,
	registerInvokeCapability,
	registerStreamInvokeCapability,
} from '../core/helper/builderRegistry.impl.js'
import type { EmptyObject } from '../core/types/EmptyObject.js'
import type { QueueInvokeList } from '../core/types/queue/QueueInvokeList.js'
import type { QueueWorkerAfterGuardHook } from '../core/types/queue/QueueWorkerAfterGuardHook.js'
import type { QueueWorkerBeforeGuardHook } from '../core/types/queue/QueueWorkerBeforeGuardHook.js'
import type {
	QueueWorkerDefinition,
	QueueWorkerHandler,
	QueueWorkerMode,
} from '../core/types/queue/QueueWorkerDefinition.js'
import type { Infer, InferIn, Schema } from '../schema/index.js'
import type { QueueWorkerBuilderTypes } from './QueueWorkerBuilderTypes.js'

/**
 * Builds a queue worker definition for one queue.
 *
 * A worker owns execution behavior for queued jobs. The queue definition owns
 * durability and lifecycle policy; this builder owns handler concurrency,
 * worker mode, and guard hooks.
 *
 * @example
 * ```ts
 * const worker = service
 *   .getQueueWorkerBuilder('billing.monthlyClosing', 'close-month')
 *   .setMaxParallelHandlers(2)
 *   .setHandler(async (context, job) => ({ status: 'success', output: job.payload }))
 * ```
 */
export class QueueWorkerBuilder<S extends QueueWorkerBuilderTypes = QueueWorkerBuilderTypes> {
	private mode: QueueWorkerMode = 'continuous'
	private intervalMs?: number
	private maxParallelHandlers = 1
	private handler?: QueueWorkerHandler<
		InferIn<S['PayloadSchema']>,
		InferIn<S['ParamsSchema']>,
		S['Resources'],
		S['Invokes'],
		S['StreamInvokes'],
		S['EmitList'],
		S['QueueInvokes'],
		EmptyObject,
		S['AgentInvokes']
	>
	private beforeGuards: Record<string, QueueWorkerBeforeGuardHook> = {}
	private afterGuards: Record<string, QueueWorkerAfterGuardHook> = {}
	private invokes: S['Invokes'] = {}
	private streamInvokes: S['StreamInvokes'] = {}
	private emitList: S['EmitList'] = {}
	private queueInvokes: QueueInvokeList = {}
	private agentInvokes: AllowedAgentDefinition[] = []

	constructor(
		private readonly queueName: string,
		private readonly workerName: string,
	) {}

	/** Set whether the worker runs continuously or in a bridge-supported polling mode. */
	setMode(mode: QueueWorkerMode) {
		this.mode = mode
		return this
	}

	/** Set the polling interval for worker modes that use intervals. */
	setIntervalMs(intervalMs: number) {
		this.intervalMs = intervalMs
		return this
	}

	/** Set how many jobs this worker may process concurrently. */
	setMaxParallelHandlers(count: number) {
		this.maxParallelHandlers = count
		return this
	}

	/** Set the job handler implementation for this worker. */
	setHandler(
		handler: QueueWorkerHandler<
			InferIn<S['PayloadSchema']>,
			InferIn<S['ParamsSchema']>,
			S['Resources'],
			S['Invokes'],
			S['StreamInvokes'],
			S['EmitList'],
			S['QueueInvokes'],
			EmptyObject,
			S['AgentInvokes']
		>,
	) {
		this.handler = handler
		return this
	}

	/**
	 * Declare a command this worker handler may invoke through `context.service`.
	 *
	 * @example
	 * ```ts
	 * worker.canInvoke('billing', '1', 'getInvoice', invoiceSchema, lookupSchema)
	 * ```
	 */
	canInvoke<
		Output extends Schema,
		Payload extends Schema,
		Parameter extends Schema,
		SName extends string = string,
		Version extends string = string,
		Fname extends string = string,
	>(
		serviceName: SName,
		serviceVersion: Version,
		serviceTarget: Fname,
		outputSchema?: Output,
		payloadSchema?: Payload,
		parameterSchema?: Parameter,
	) {
		this.invokes = registerInvokeCapability(
			this.invokes as Record<
				string,
				Record<string, Record<string, { outputSchema?: Schema; payloadSchema?: Schema; parameterSchema?: Schema }>>
			>,
			serviceName,
			serviceVersion,
			serviceTarget,
			{ outputSchema, payloadSchema, parameterSchema },
		) as S['Invokes']

		return this as unknown as QueueWorkerBuilder<
			QueueWorkerBuilderTypes<
				S['PayloadSchema'],
				S['ParamsSchema'],
				S['Resources'],
				S['Invokes'] &
					Record<
						SName,
						Record<
							Version,
							Record<Fname, (payload: InferIn<Payload>, parameter: InferIn<Parameter>) => Promise<Infer<Output>>>
						>
					>,
				S['StreamInvokes'],
				S['EmitList'],
				S['QueueInvokes'],
				S['AgentInvokes']
			>
		>
	}

	/**
	 * Declare a stream this worker handler may consume through `context.stream`.
	 */
	canConsumeStream<
		Chunk extends Schema,
		Final extends Schema,
		Payload extends Schema,
		Parameter extends Schema,
		SName extends string = string,
		Version extends string = string,
		Fname extends string = string,
	>(
		serviceName: SName,
		serviceVersion: Version,
		serviceTarget: Fname,
		chunkSchema?: Chunk,
		payloadSchema?: Payload,
		parameterSchema?: Parameter,
		finalSchema?: Final,
		validateChunk = true,
		validateFinal = true,
	) {
		this.streamInvokes = registerStreamInvokeCapability(
			this.streamInvokes as Record<
				string,
				Record<
					string,
					Record<
						string,
						{
							chunkSchema?: Schema
							finalSchema?: Schema
							payloadSchema?: Schema
							parameterSchema?: Schema
							validateChunk?: boolean
							validateFinal?: boolean
						}
					>
				>
			>,
			serviceName,
			serviceVersion,
			serviceTarget,
			{ chunkSchema, finalSchema, payloadSchema, parameterSchema, validateChunk, validateFinal },
		) as S['StreamInvokes']

		return this as unknown as QueueWorkerBuilder<
			QueueWorkerBuilderTypes<
				S['PayloadSchema'],
				S['ParamsSchema'],
				S['Resources'],
				S['Invokes'],
				S['StreamInvokes'] &
					Record<
						SName,
						Record<
							Version,
							Record<
								Fname,
								(
									payload: InferIn<Payload>,
									parameter: InferIn<Parameter>,
								) => Promise<{
									[Symbol.asyncIterator](): AsyncIterableIterator<Infer<Chunk>>
									final: Promise<Infer<Final>>
								}>
							>
						>
					>,
				S['EmitList'],
				S['QueueInvokes'],
				S['AgentInvokes']
			>
		>
	}

	/**
	 * Declare a queue this worker handler may enqueue through `context.queue`.
	 */
	canEnqueue<Payload extends Schema, Parameter extends Schema, QueueName extends string = string>(
		queueName: QueueName,
		payloadSchema?: Payload,
		parameterSchema?: Parameter,
	) {
		if (queueName.trim() === '') {
			throw new Error('canEnqueue requires non-empty queue name')
		}

		this.queueInvokes = {
			...this.queueInvokes,
			[queueName]: { payloadSchema, parameterSchema },
		}

		return this as unknown as QueueWorkerBuilder<
			QueueWorkerBuilderTypes<
				S['PayloadSchema'],
				S['ParamsSchema'],
				S['Resources'],
				S['Invokes'],
				S['StreamInvokes'],
				S['EmitList'],
				S['QueueInvokes'] & Record<QueueName, { payloadSchema: Payload; parameterSchema: Parameter }>,
				S['AgentInvokes']
			>
		>
	}

	/**
	 * Declare a custom event this worker handler may emit through `context.emit`.
	 */
	canEmit<EventName extends string, T extends Schema>(eventName: EventName, schema: T) {
		this.emitList = registerEmitSchema(this.emitList, eventName, schema) as S['EmitList']

		return this as unknown as QueueWorkerBuilder<
			QueueWorkerBuilderTypes<
				S['PayloadSchema'],
				S['ParamsSchema'],
				S['Resources'],
				S['Invokes'],
				S['StreamInvokes'],
				S['EmitList'] & Record<EventName, InferIn<T>>,
				S['QueueInvokes'],
				S['AgentInvokes']
			>
		>
	}

	/**
	 * Declare a same-service agent this worker handler may invoke through `context.agent`.
	 */
	canInvokeAgent<
		Output extends Schema,
		Payload extends Schema,
		Parameter extends Schema,
		AgentName extends string,
		Version extends string,
	>(
		agentName: AgentName,
		serviceVersion: Version,
		schemas?: { outputSchema?: Output; payloadSchema?: Payload; parameterSchema?: Parameter },
	) {
		this.agentInvokes.push({
			agentName,
			serviceVersion,
			outputSchema: schemas?.outputSchema,
			payloadSchema: schemas?.payloadSchema,
			parameterSchema: schemas?.parameterSchema,
		})

		return this as unknown as QueueWorkerBuilder<
			QueueWorkerBuilderTypes<
				S['PayloadSchema'],
				S['ParamsSchema'],
				S['Resources'],
				S['Invokes'],
				S['StreamInvokes'],
				S['EmitList'],
				S['QueueInvokes'],
				S['AgentInvokes'] & Record<`${AgentName}.${Version}`, AllowedAgentDefinition<Output, Payload, Parameter>>
			>
		>
	}

	/** Register named guard hooks that run before the worker handler. */
	setBeforeGuardHooks(hooks: Record<string, QueueWorkerBeforeGuardHook>) {
		this.beforeGuards = mergeNamedHooks(this.beforeGuards, hooks, 'setBeforeGuardHooks')
		return this
	}

	/**
	 * Return a previously registered before-guard hook by name.
	 */
	getBeforeGuardHook(name: keyof typeof this.beforeGuards) {
		return getNamedHook(this.beforeGuards, name)
	}

	/** Register named guard hooks that run after the worker handler. */
	setAfterGuardHooks(hooks: Record<string, QueueWorkerAfterGuardHook>) {
		this.afterGuards = mergeNamedHooks(this.afterGuards, hooks, 'setAfterGuardHooks')
		return this
	}

	/**
	 * Return a previously registered after-guard hook by name.
	 */
	getAfterGuardHook(name: keyof typeof this.afterGuards) {
		return getNamedHook(this.afterGuards, name)
	}

	/** Resolve this builder into the queue worker definition consumed by a service. */
	async getDefinition(): Promise<
		QueueWorkerDefinition<
			S['PayloadSchema'],
			S['ParamsSchema'],
			S['Resources'],
			S['Invokes'],
			S['StreamInvokes'],
			S['EmitList'],
			S['QueueInvokes'],
			EmptyObject,
			S['AgentInvokes']
		>
	> {
		if (!this.handler) {
			throw new Error('QueueWorkerBuilder: missing handler implementation')
		}

		return {
			name: this.workerName,
			queueName: this.queueName,
			mode: this.mode,
			intervalMs: this.intervalMs,
			maxParallelHandlers: this.maxParallelHandlers,
			handler: this.handler,
			beforeGuards: this.beforeGuards,
			afterGuards: this.afterGuards,
			invokes: this.invokes,
			streamInvokes: this.streamInvokes,
			emitList: this.emitList,
			queueInvokes: this.queueInvokes,
			agentInvokes: this.agentInvokes,
		}
	}
}
