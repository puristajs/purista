import type { HarnessDefinition, HarnessTargetContract } from '@purista/harness'
import { UnhandledError } from '../core/Error/UnhandledError.impl.js'
import type { HttpExposedServiceMeta } from '../core/HttpServer/types/HttpExposedServiceMeta.js'
import type { QueryParameter } from '../core/HttpServer/types/QueryParameter.js'
import type { SupportedHttpMethod } from '../core/HttpServer/types/SupportedHttpMethod.js'
import { assertNonArrowFunction } from '../core/helper/assertNonArrowFunction.impl.js'
import {
	getNamedHook,
	mergeNamedHooks,
	registerEmitSchema,
	registerInvokeCapability,
	registerStreamInvokeCapability,
} from '../core/helper/builderRegistry.impl.js'
import type { Service } from '../core/Service/Service.impl.js'
import type { Complete } from '../core/types/Complete.js'
import type { ContentType } from '../core/types/ContentType.js'
import type { DefinitionEventBridgeConfig } from '../core/types/DefinitionEventBridgeConfig.js'
import type { QueueInvokeList } from '../core/types/queue/QueueInvokeList.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import type { StreamAfterGuardHook } from '../core/types/stream/StreamAfterGuardHook.js'
import type { StreamBeforeGuardHook } from '../core/types/stream/StreamBeforeGuardHook.js'
import type { StreamDefinition } from '../core/types/stream/StreamDefinition.js'
import type { StreamDefinitionMetadataBase } from '../core/types/stream/StreamDefinitionMetadataBase.js'
import type { StreamFunction } from '../core/types/stream/StreamFunction.js'
import {
	type HarnessInvokeDeclaration,
	type HarnessStreamDeclaration,
	registerHarnessInvocation,
} from '../HarnessMount/invocation.js'
import { type HarnessModelDeclaration, registerHarnessModel } from '../HarnessMount/model.js'
import type { NonEmptyString } from '../helper/types/NonEmptyString.js'
import type { Infer, InferIn, Schema } from '../schema/index.js'
import { validationToSchema } from '../zodOpenApi/validationToSchema.js'
import type { StreamDefinitionBuilderTypes } from './StreamDefinitionBuilderTypes.js'

/**
 * Builds a stream definition for incremental output or aggregate stream results.
 *
 * Streams can emit typed chunks, optionally aggregate chunks into a final
 * payload, expose server-sent HTTP streams, invoke commands, consume other
 * streams, enqueue queues, and emit custom events.
 *
 * @example
 * ```ts
 * const stream = service
 *   .getStreamBuilder('generateReport', 'Generate report progress')
 *   .addChunkSchema(progressSchema)
 *   .addFinalSchema(reportSchema)
 *   .exposeAsHttpStreamEndpoint('POST', 'reports/generate')
 * ```
 */
export class StreamDefinitionBuilder<
	S extends Service,
	C extends StreamDefinitionBuilderTypes = StreamDefinitionBuilderTypes,
> {
	private payloadSchema?: Schema
	private parameterSchema?: Schema
	private chunkSchema?: Schema
	private finalSchema?: Schema
	private validateChunk = true
	private validateFinal = true
	private aggregateChunks = true
	private finalEventName?: string

	private invokes: C['Invokes'] = {}
	private streamInvokes: C['StreamInvokes'] = {}
	private emitList: C['EmitList'] = {}
	private queueInvokes: QueueInvokeList = {}

	private inputContentType: ContentType | undefined
	private inputContentEncoding: string | undefined
	private outputContentEncoding: string | undefined

	private httpMetadata?: HttpExposedServiceMeta
	private queryParameter: QueryParameter<Infer<C['ParamsSchema']>>[] = []
	private tags: string[] = []
	private summary?: string
	private operationId?: string
	private isSecure = true
	private errorStatusCodes: StatusCode[] = []
	private httpStreamProtocol?: { protocol: string; documentationUrl?: string }
	private httpStreamingMode: 'stream' | 'aggregate' = 'stream'

	private durable = false
	private autoacknowledge = true
	private deprecated = false
	private hooks: {
		beforeGuard: Record<
			string,
			StreamBeforeGuardHook<S, any, any, any, any, C['Resources'], C['Invokes'], C['StreamInvokes'], C['EmitList']>
		>
		afterGuard: Record<
			string,
			StreamAfterGuardHook<
				S,
				any,
				any,
				any,
				any,
				any,
				C['Resources'],
				C['Invokes'],
				C['StreamInvokes'],
				C['EmitList'],
				C['QueueInvokes']
			>
		>
	} = {
		beforeGuard: {},
		afterGuard: {},
	}

	private fn?: StreamFunction<
		S,
		any,
		any,
		any,
		any,
		any,
		any,
		C['Resources'],
		C['Invokes'],
		C['StreamInvokes'],
		C['EmitList'],
		C['QueueInvokes']
	>

	constructor(
		private streamName: Exclude<string, ''>,
		private streamDescription: string,
		finalEventName?: Exclude<string, ''>,
		deprecated = false,
	) {
		this.finalEventName = finalEventName
		this.deprecated = deprecated
	}

	/**
	 * Declare a queue this stream handler may enqueue through its typed queue proxy.
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

		return this as unknown as StreamDefinitionBuilder<
			S,
			StreamDefinitionBuilderTypes<
				C['PayloadSchema'],
				C['ParamsSchema'],
				C['ChunkSchema'],
				C['FinalSchema'],
				C['Resources'],
				C['Invokes'],
				C['StreamInvokes'],
				C['EmitList'],
				C['QueueInvokes'] & Record<QueueName, { payloadSchema: Payload; parameterSchema: Parameter }>
			>
		>
	}

	/** Declare a command this stream handler may invoke through its typed service proxy. */
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
		) as C['Invokes']

		return this as unknown as StreamDefinitionBuilder<
			S,
			StreamDefinitionBuilderTypes<
				C['PayloadSchema'],
				C['ParamsSchema'],
				C['ChunkSchema'],
				C['FinalSchema'],
				C['Resources'],
				C['Invokes'] &
					Record<
						SName,
						Record<
							Version,
							Record<Fname, (payload: InferIn<Payload>, parameter: InferIn<Parameter>) => Promise<Infer<Output>>>
						>
					>,
				C['StreamInvokes'],
				C['EmitList'],
				C['QueueInvokes']
			>
		>
	}

	/** Declare a capability-projected model from a Harness mounted on this service. */
	canUseHarnessModel<const D extends HarnessDefinition<any>, Alias extends keyof D['catalog']['models'] & string>(
		definition: D,
		alias: Alias,
	) {
		this.invokes = registerHarnessModel(this.invokes, definition, alias) as C['Invokes']
		return this as unknown as StreamDefinitionBuilder<
			S,
			StreamDefinitionBuilderTypes<
				C['PayloadSchema'],
				C['ParamsSchema'],
				C['ChunkSchema'],
				C['FinalSchema'],
				C['Resources'],
				C['Invokes'] & HarnessModelDeclaration<D, Alias>,
				C['StreamInvokes'],
				C['EmitList'],
				C['QueueInvokes']
			>
		>
	}

	/** Declare an address-first Harness agent invocation with aggregate and stream access. */
	canInvokeAgent<
		Contract extends HarnessTargetContract<'agent', any, any>,
		SName extends string,
		Version extends string,
		Target extends string,
	>(serviceName: SName, serviceVersion: Version, serviceTarget: Target, contract: Contract) {
		const registered = registerHarnessInvocation(
			this.invokes,
			this.streamInvokes,
			serviceName,
			serviceVersion,
			serviceTarget,
			contract,
		)
		this.invokes = registered.invokes as C['Invokes']
		this.streamInvokes = registered.streamInvokes as C['StreamInvokes']
		return this as unknown as StreamDefinitionBuilder<
			S,
			StreamDefinitionBuilderTypes<
				C['PayloadSchema'],
				C['ParamsSchema'],
				C['ChunkSchema'],
				C['FinalSchema'],
				C['Resources'],
				C['Invokes'] & Record<SName, Record<Version, Record<Target, HarnessInvokeDeclaration<Contract>>>>,
				C['StreamInvokes'] & Record<SName, Record<Version, Record<Target, HarnessStreamDeclaration<Contract>>>>,
				C['EmitList'],
				C['QueueInvokes']
			>
		>
	}

	/** Declare an address-first Harness workflow invocation with aggregate and stream access. */
	canInvokeWorkflow<
		Contract extends HarnessTargetContract<'workflow', any, any>,
		SName extends string,
		Version extends string,
		Target extends string,
	>(serviceName: SName, serviceVersion: Version, serviceTarget: Target, contract: Contract) {
		const registered = registerHarnessInvocation(
			this.invokes,
			this.streamInvokes,
			serviceName,
			serviceVersion,
			serviceTarget,
			contract,
		)
		this.invokes = registered.invokes as C['Invokes']
		this.streamInvokes = registered.streamInvokes as C['StreamInvokes']
		return this as unknown as StreamDefinitionBuilder<
			S,
			StreamDefinitionBuilderTypes<
				C['PayloadSchema'],
				C['ParamsSchema'],
				C['ChunkSchema'],
				C['FinalSchema'],
				C['Resources'],
				C['Invokes'] & Record<SName, Record<Version, Record<Target, HarnessInvokeDeclaration<Contract>>>>,
				C['StreamInvokes'] & Record<SName, Record<Version, Record<Target, HarnessStreamDeclaration<Contract>>>>,
				C['EmitList'],
				C['QueueInvokes']
			>
		>
	}

	/**
	 * Declare a stream this stream handler may consume through its typed stream proxy.
	 *
	 * @example
	 * ```ts
	 * stream.canConsumeStream(
	 *   'reports',
	 *   '1',
	 *   'extractPages',
	 *   pageChunkSchema,
	 *   requestSchema,
	 *   undefined,
	 *   summarySchema,
	 * )
	 * ```
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
		) as C['StreamInvokes']

		return this as unknown as StreamDefinitionBuilder<
			S,
			StreamDefinitionBuilderTypes<
				C['PayloadSchema'],
				C['ParamsSchema'],
				C['ChunkSchema'],
				C['FinalSchema'],
				C['Resources'],
				C['Invokes'],
				C['StreamInvokes'] &
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
									sessionId: string
									cancel(reason?: string): Promise<void>
									[Symbol.asyncIterator](): AsyncIterator<{
										payload: {
											chunk?: Infer<Chunk>
											final?: Infer<Final>
										}
									}>
								}>
							>
						>
					>,
				C['EmitList'],
				C['QueueInvokes']
			>
		>
	}

	/** Declare a custom event this stream handler may emit. */
	canEmit<EventName extends string, T extends Schema>(eventName: EventName, schema: T) {
		this.emitList = registerEmitSchema(this.emitList, eventName, schema) as C['EmitList']
		return this as unknown as StreamDefinitionBuilder<
			S,
			StreamDefinitionBuilderTypes<
				C['PayloadSchema'],
				C['ParamsSchema'],
				C['ChunkSchema'],
				C['FinalSchema'],
				C['Resources'],
				C['Invokes'],
				C['StreamInvokes'],
				C['EmitList'] & Record<EventName, InferIn<typeof schema>>,
				C['QueueInvokes']
			>
		>
	}

	/**
	 * Set one or more before guard hook(s).
	 * If there are multiple before guard hooks, they are executed in parallel.
	 */
	setBeforeGuardHooks(
		beforeGuards: Record<
			string,
			StreamBeforeGuardHook<
				S,
				Infer<C['PayloadSchema']>,
				Infer<C['ParamsSchema']>,
				Infer<C['PayloadSchema']>,
				Infer<C['ParamsSchema']>,
				C['Resources'],
				C['Invokes'],
				C['StreamInvokes'],
				C['EmitList'],
				C['QueueInvokes']
			>
		>,
	) {
		this.hooks.beforeGuard = mergeNamedHooks(
			this.hooks.beforeGuard,
			beforeGuards as Record<
				string,
				StreamBeforeGuardHook<
					S,
					any,
					any,
					any,
					any,
					C['Resources'],
					C['Invokes'],
					C['StreamInvokes'],
					C['EmitList'],
					C['QueueInvokes']
				>
			>,
			'setBeforeGuardHooks',
		)
		return this
	}

	/**
	 * Return a previously registered before-guard hook by name.
	 */
	getBeforeGuardHook(name: keyof typeof this.hooks.beforeGuard) {
		return getNamedHook(this.hooks.beforeGuard, name) as StreamBeforeGuardHook<
			S,
			Infer<C['PayloadSchema']>,
			Infer<C['ParamsSchema']>,
			Infer<C['PayloadSchema']>,
			Infer<C['ParamsSchema']>,
			C['Resources'],
			C['Invokes'],
			C['StreamInvokes'],
			C['EmitList'],
			C['QueueInvokes']
		>
	}

	/**
	 * Set one or more after guard hook(s).
	 * If there are multiple after guard hooks, they are executed in parallel.
	 */
	setAfterGuardHooks(
		afterGuards: Record<
			string,
			StreamAfterGuardHook<
				S,
				Infer<C['PayloadSchema']>,
				Infer<C['ParamsSchema']>,
				Infer<C['PayloadSchema']>,
				Infer<C['ParamsSchema']>,
				InferIn<C['FinalSchema']>,
				C['Resources'],
				C['Invokes'],
				C['StreamInvokes'],
				C['EmitList'],
				C['QueueInvokes']
			>
		>,
	) {
		this.hooks.afterGuard = mergeNamedHooks(
			this.hooks.afterGuard,
			afterGuards as Record<
				string,
				StreamAfterGuardHook<
					S,
					any,
					any,
					any,
					any,
					any,
					C['Resources'],
					C['Invokes'],
					C['StreamInvokes'],
					C['EmitList'],
					C['QueueInvokes']
				>
			>,
			'setAfterGuardHooks',
		)
		return this
	}

	/**
	 * Return a previously registered after-guard hook by name.
	 */
	getAfterGuardHook(name: keyof typeof this.hooks.afterGuard) {
		return getNamedHook(this.hooks.afterGuard, name) as StreamAfterGuardHook<
			S,
			Infer<C['PayloadSchema']>,
			Infer<C['ParamsSchema']>,
			Infer<C['PayloadSchema']>,
			Infer<C['ParamsSchema']>,
			InferIn<C['FinalSchema']>,
			C['Resources'],
			C['Invokes'],
			C['StreamInvokes'],
			C['EmitList'],
			C['QueueInvokes']
		>
	}

	/** Add the payload schema used by stream invocation and handler input. */
	addPayloadSchema<PayloadSchema extends Schema>(
		inputSchema: PayloadSchema,
		inputContentType?: ContentType,
		inputContentEncoding?: string,
	) {
		this.inputContentType = inputContentType ?? this.inputContentType
		this.inputContentEncoding = inputContentEncoding ?? this.inputContentEncoding
		this.payloadSchema = inputSchema

		return this as unknown as StreamDefinitionBuilder<
			S,
			StreamDefinitionBuilderTypes<
				PayloadSchema,
				C['ParamsSchema'],
				C['ChunkSchema'],
				C['FinalSchema'],
				C['Resources'],
				C['Invokes'],
				C['StreamInvokes'],
				C['EmitList'],
				C['QueueInvokes']
			>
		>
	}

	/** Add the parameter schema used by stream invocation and handler input. */
	addParameterSchema<ParamsSchema extends Schema>(parameterSchema: ParamsSchema) {
		this.parameterSchema = parameterSchema
		return this as unknown as StreamDefinitionBuilder<
			S,
			StreamDefinitionBuilderTypes<
				C['PayloadSchema'],
				ParamsSchema,
				C['ChunkSchema'],
				C['FinalSchema'],
				C['Resources'],
				C['Invokes'],
				C['StreamInvokes'],
				C['EmitList'],
				C['QueueInvokes']
			>
		>
	}

	/** Add the schema used to validate each stream chunk written by the handler. */
	addChunkSchema<ChunkSchema extends Schema>(chunkSchema: ChunkSchema, validateChunks = true) {
		this.chunkSchema = chunkSchema
		this.validateChunk = validateChunks
		return this as unknown as StreamDefinitionBuilder<
			S,
			StreamDefinitionBuilderTypes<
				C['PayloadSchema'],
				C['ParamsSchema'],
				ChunkSchema,
				C['FinalSchema'],
				C['Resources'],
				C['Invokes'],
				C['StreamInvokes'],
				C['EmitList'],
				C['QueueInvokes']
			>
		>
	}

	/** Add the schema used to validate the final stream payload. */
	addFinalSchema<FinalSchema extends Schema>(finalSchema: FinalSchema, validateFinal = true) {
		this.finalSchema = finalSchema
		this.validateFinal = validateFinal
		return this as unknown as StreamDefinitionBuilder<
			S,
			StreamDefinitionBuilderTypes<
				C['PayloadSchema'],
				C['ParamsSchema'],
				C['ChunkSchema'],
				FinalSchema,
				C['Resources'],
				C['Invokes'],
				C['StreamInvokes'],
				C['EmitList'],
				C['QueueInvokes']
			>
		>
	}

	/** Mark this stream definition as deprecated in generated metadata. */
	markAsDeprecated() {
		this.deprecated = true
		return this
	}

	/**
	 * Enable or disable default aggregation of chunks into the final payload.
	 *
	 * @example
	 * ```ts
	 * stream.enableChunkAggregation(false)
	 * ```
	 */
	enableChunkAggregation(enabled = true) {
		this.aggregateChunks = enabled
		return this
	}

	/** Set a custom event name emitted for successful final stream output. */
	setFinalEventName<N extends string>(eventName: NonEmptyString<N>) {
		this.finalEventName = eventName
		return this
	}

	/**
	 * Expose this stream as an HTTP stream endpoint.
	 *
	 * @example
	 * ```ts
	 * stream
	 *   .exposeAsHttpStreamEndpoint('POST', 'reports/generate')
	 *   .setHttpStreamingMode('stream')
	 *   .makeEndpointPublic()
	 * ```
	 */
	exposeAsHttpStreamEndpoint(
		method: SupportedHttpMethod,
		path: string,
		contentTypeRequest?: ContentType,
		contentEncodingRequest?: string,
	) {
		this.httpMetadata = {
			expose: {
				contentTypeRequest: contentTypeRequest ?? this.inputContentType ?? 'application/json',
				contentEncodingRequest: contentEncodingRequest ?? this.inputContentEncoding ?? 'utf-8',
				contentTypeResponse: 'text/event-stream',
				contentEncodingResponse: this.outputContentEncoding ?? 'utf-8',
				http: {
					method,
					path,
				},
			},
		}
		return this
	}

	/** Set stream protocol metadata for generated OpenAPI/HTTP exposure. */
	setHttpStreamProtocol(protocol: string, documentationUrl?: string) {
		this.httpStreamProtocol = {
			protocol,
			documentationUrl,
		}
		return this
	}

	/** Choose whether HTTP exposure returns chunks or an aggregate JSON response. */
	setHttpStreamingMode(mode: 'stream' | 'aggregate') {
		this.httpStreamingMode = mode
		return this
	}

	/** Mark the HTTP stream endpoint public in generated security metadata. */
	makeEndpointPublic() {
		this.isSecure = false
		return this
	}

	/** Enable or disable generated HTTP security metadata. */
	enableHttpSecurity(enabled = true) {
		this.isSecure = enabled
		return this
	}

	/** Set the OpenAPI summary for HTTP stream exposure. */
	setOpenApiSummary(summary: string) {
		this.summary = summary
		return this
	}

	/** Add OpenAPI tags for HTTP stream exposure. */
	addOpenApiTags(...tags: string[]) {
		this.tags.push(...tags)
		return this
	}

	/** Set the OpenAPI operation id for HTTP stream exposure. */
	setOpenApiOperationId(operationId: string) {
		this.operationId = operationId
		return this
	}

	/** Add non-default OpenAPI error status codes for HTTP stream exposure. */
	addOpenApiErrorStatusCodes(...codes: StatusCode[]) {
		this.errorStatusCodes.push(...codes)
		return this
	}

	/** Add query parameter metadata for HTTP stream exposure. */
	addQueryParameters(...queryParams: QueryParameter<Infer<C['ParamsSchema']>>[]) {
		this.queryParameter.push(...queryParams)
		return this
	}

	/**
	 * Set the stream handler implementation.
	 *
	 * Use a function declaration so PURISTA can bind the service instance as
	 * `this` when executing the handler.
	 */
	setStreamFunction(
		fn: StreamFunction<
			S,
			Infer<C['PayloadSchema']>,
			Infer<C['ParamsSchema']>,
			Infer<C['PayloadSchema']>,
			Infer<C['ParamsSchema']>,
			InferIn<C['ChunkSchema']>,
			InferIn<C['FinalSchema']>,
			C['Resources'],
			C['Invokes'],
			C['StreamInvokes'],
			C['EmitList'],
			C['QueueInvokes']
		>,
	) {
		assertNonArrowFunction(fn, 'setStreamFunction')
		this.fn = fn
		return this
	}

	/** Return the configured stream handler implementation. */
	getStreamFunction() {
		if (!this.fn) {
			throw new UnhandledError(StatusCode.NotImplemented, `No function implementation for ${this.streamName}`, {
				streamName: this.streamName,
			})
		}

		return this.fn as StreamFunction<
			S,
			Infer<C['PayloadSchema']>,
			Infer<C['ParamsSchema']>,
			Infer<C['PayloadSchema']>,
			Infer<C['ParamsSchema']>,
			InferIn<C['ChunkSchema']>,
			InferIn<C['FinalSchema']>,
			C['Resources'],
			C['Invokes'],
			C['StreamInvokes'],
			C['EmitList'],
			C['QueueInvokes']
		>
	}

	/** Resolve this builder into the stream definition consumed by a service. */
	async getDefinition() {
		if (!this.fn) {
			throw new Error(`StreamDefinitionBuilder: missing function implementation for ${this.streamName}`)
		}

		const eventBridgeConfig: Complete<DefinitionEventBridgeConfig> = {
			durable: this.durable,
			autoacknowledge: this.autoacknowledge,
			shared: true,
			consumerFailureHandling: undefined,
		}

		const [inputPayload, parameter, chunkPayload, finalPayload] = await Promise.all([
			validationToSchema(this.payloadSchema),
			validationToSchema(this.parameterSchema),
			validationToSchema(this.chunkSchema),
			validationToSchema(this.finalSchema),
		])

		const resolvedFinalPayload =
			finalPayload ??
			(this.aggregateChunks
				? {
						type: 'object',
						properties: {
							chunkCount: { type: 'number' },
							chunks: {
								type: 'array',
								items: chunkPayload ?? {},
							},
						},
						required: ['chunkCount', 'chunks'],
					}
				: undefined)

		const metadata: StreamDefinitionMetadataBase = {
			expose: {
				contentTypeRequest: this.inputContentType ?? 'application/json',
				contentEncodingRequest: this.inputContentEncoding ?? 'utf-8',
				contentTypeResponse: this.httpMetadata
					? this.httpStreamingMode === 'aggregate'
						? 'application/json'
						: 'text/event-stream'
					: undefined,
				contentEncodingResponse: this.outputContentEncoding ?? 'utf-8',
				inputPayload,
				parameter,
				chunkPayload,
				finalPayload: resolvedFinalPayload,
				deprecated: this.deprecated,
			},
		}

		if (this.httpMetadata) {
			metadata.expose.http = this.httpMetadata.expose.http
			if (metadata.expose.http) {
				if (this.httpStreamProtocol) {
					metadata.expose.http.stream = this.httpStreamProtocol
				}
				if (!metadata.expose.http.stream) {
					metadata.expose.http.stream = {
						protocol: 'purista',
					}
				}
				if (metadata.expose.http.stream) {
					metadata.expose.http.stream.mode = this.httpStreamingMode
				}
				metadata.expose.http.openApi = {
					description: this.streamDescription,
					summary: this.summary ?? this.streamName,
					isSecure: this.isSecure,
					query: this.queryParameter as QueryParameter<Record<string, unknown>>[],
					tags: this.tags,
					additionalStatusCodes: this.errorStatusCodes,
					operationId: this.operationId ?? this.streamName,
				}
			}
		}

		const definition: StreamDefinition<
			S,
			Infer<C['PayloadSchema']>,
			Infer<C['ParamsSchema']>,
			Infer<C['PayloadSchema']>,
			Infer<C['ParamsSchema']>,
			InferIn<C['ChunkSchema']>,
			InferIn<C['FinalSchema']>,
			C['Resources'],
			C['Invokes'],
			C['StreamInvokes'],
			C['EmitList'],
			StreamDefinitionMetadataBase,
			C['QueueInvokes']
		> = {
			streamName: this.streamName,
			streamDescription: this.streamDescription,
			metadata,
			eventBridgeConfig,
			chunkSchema: this.chunkSchema,
			finalSchema: this.finalSchema,
			call: this.getStreamFunction(),
			finalEventName: this.finalEventName,
			hooks: this.hooks,
			chunkValidationEnabled: this.validateChunk,
			finalValidationEnabled: this.validateFinal,
			aggregateChunks: this.aggregateChunks,
			invokes: this.invokes,
			streamInvokes: this.streamInvokes,
			emitList: this.emitList,
			queueInvokes: this.queueInvokes,
		}

		return definition
	}
}
