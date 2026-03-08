import type { SinonSandbox } from 'sinon'
import { UnhandledError } from '../core/Error/UnhandledError.impl.js'
import type { HttpExposedServiceMeta } from '../core/HttpServer/types/HttpExposedServiceMeta.js'
import type { QueryParameter } from '../core/HttpServer/types/QueryParameter.js'
import type { SupportedHttpMethod } from '../core/HttpServer/types/SupportedHttpMethod.js'
import { assertNonArrowFunction } from '../core/helper/assertNonArrowFunction.impl.js'
import type { QueueEnqueueResult } from '../core/QueueBridge/types/QueueEnqueueResult.js'
import type { Service } from '../core/Service/Service.impl.js'
import type {
	AgentInvocation,
	AgentProtocolResponse,
	agentProtocolPayloadSchema,
} from '../core/types/agent/AgentProtocol.js'
import type { Complete } from '../core/types/Complete.js'
import type { ContentType } from '../core/types/ContentType.js'
import type { DefinitionEventBridgeConfig } from '../core/types/DefinitionEventBridgeConfig.js'
import type { QueueEnqueueOptions } from '../core/types/queue/QueueEnqueueOptions.js'
import type { QueueInvokeList } from '../core/types/queue/QueueInvokeList.js'
import { StatusCode } from '../core/types/StatusCode.enum.js'
import type { StreamDefinition } from '../core/types/stream/StreamDefinition.js'
import type { StreamDefinitionMetadataBase } from '../core/types/stream/StreamDefinitionMetadataBase.js'
import type { StreamFunction } from '../core/types/stream/StreamFunction.js'
import type { StreamWriter } from '../core/types/stream/StreamWriter.js'
import type { NonEmptyString } from '../helper/types/NonEmptyString.js'
import type { Infer, InferIn, Schema } from '../schema/index.js'
import { validationToSchema } from '../zodOpenApi/validationToSchema.js'
import type { StreamDefinitionBuilderTypes } from './StreamDefinitionBuilderTypes.js'

type AgentInvokeConfig<Payload extends Schema, Parameter extends Schema> = {
	payloadSchema?: Payload
	parameterSchema?: Parameter
}

const isAgentInvokeConfig = (value: unknown): value is AgentInvokeConfig<Schema, Schema> => {
	return typeof value === 'object' && value !== null && ('payloadSchema' in value || 'parameterSchema' in value)
}

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
	private agentInvokes: C['AgentInvokes'] = {}
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

	private durable = false
	private autoacknowledge = true
	private deprecated = false

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
				C['QueueInvokes'] &
					Record<
						QueueName,
						(
							payload: InferIn<Payload>,
							parameter: InferIn<Parameter>,
							options?: Omit<
								QueueEnqueueOptions<InferIn<Payload>, InferIn<Parameter>>,
								'queueName' | 'payload' | 'parameter'
							>,
						) => Promise<QueueEnqueueResult>
					>
			>
		>
	}

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
		const existingInvokes = this.invokes as Record<
			string,
			Record<string, Record<string, { outputSchema?: Schema; payloadSchema?: Schema; parameterSchema?: Schema }>>
		>

		this.invokes = {
			...this.invokes,
			[serviceName]: {
				...existingInvokes[serviceName],
				[serviceVersion]: {
					...(existingInvokes[serviceName]?.[serviceVersion] ?? {}),
					[serviceTarget]: { outputSchema, payloadSchema, parameterSchema },
				},
			},
		}

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
		const existingStreams = this.streamInvokes as Record<
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
		>

		this.streamInvokes = {
			...this.streamInvokes,
			[serviceName]: {
				...existingStreams[serviceName],
				[serviceVersion]: {
					...(existingStreams[serviceName]?.[serviceVersion] ?? {}),
					[serviceTarget]: { chunkSchema, finalSchema, payloadSchema, parameterSchema, validateChunk, validateFinal },
				},
			},
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

	/**
	 * Define an agent which can be invoked by the current stream.
	 * The agent must follow the PURISTA agent protocol.
	 *
	 * @param agentName The name of the agent service
	 * @param agentVersion The version of the agent service
	 * @param invokeConfigOrParameterSchema Optional invoke configuration:
	 * - `parameterSchema` (legacy shorthand) validates `.call(_, parameter)`
	 * - `{ payloadSchema, parameterSchema }` validates both `.call(payload, parameter)` arguments
	 */
	canInvokeAgent<
		Payload extends Schema = typeof agentProtocolPayloadSchema,
		Parameter extends Schema = Schema,
		SName extends string = string,
		Version extends string = string,
	>(
		agentName: SName,
		agentVersion: Version,
		invokeConfigOrParameterSchema?: Parameter | AgentInvokeConfig<Payload, Parameter>,
	) {
		if (agentName.trim() === '' || agentVersion.trim() === '') {
			throw new Error('canInvokeAgent requires non-empty agent name and version')
		}

		const payloadSchema = isAgentInvokeConfig(invokeConfigOrParameterSchema)
			? invokeConfigOrParameterSchema.payloadSchema
			: undefined
		const parameterSchema = isAgentInvokeConfig(invokeConfigOrParameterSchema)
			? invokeConfigOrParameterSchema.parameterSchema
			: invokeConfigOrParameterSchema

		this.agentInvokes = {
			...this.agentInvokes,
			[agentName]: {
				...(this.agentInvokes[agentName] as Record<string, any>),
				[agentVersion]: {
					payloadSchema,
					parameterSchema,
				},
			},
		} as unknown as C['AgentInvokes'] &
			Record<
				SName,
				Record<
					Version,
					{
						call: (payload: InferIn<Payload>, parameter?: InferIn<Parameter>) => AgentInvocation<AgentProtocolResponse>
					}
				>
			>

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
				C['QueueInvokes'],
				C['AgentInvokes'] &
					Record<
						SName,
						Record<
							Version,
							{
								call: (
									payload: InferIn<Payload>,
									parameter?: InferIn<Parameter>,
								) => AgentInvocation<AgentProtocolResponse>
							}
						>
					>
			>
		>
	}

	canEmit<EventName extends string, T extends Schema>(eventName: EventName, schema: T) {
		this.emitList = { ...this.emitList, [eventName]: schema }
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

	enableChunkAggregation(enabled = true) {
		this.aggregateChunks = enabled
		return this
	}

	setFinalEventName<N extends string>(eventName: NonEmptyString<N>) {
		this.finalEventName = eventName
		return this
	}

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

	setHttpStreamProtocol(protocol: string, documentationUrl?: string) {
		this.httpStreamProtocol = {
			protocol,
			documentationUrl,
		}
		return this
	}

	makeEndpointPublic() {
		this.isSecure = false
		return this
	}

	enableHttpSecurity(enabled = true) {
		this.isSecure = enabled
		return this
	}

	setOpenApiSummary(summary: string) {
		this.summary = summary
		return this
	}

	addOpenApiTags(...tags: string[]) {
		this.tags.push(...tags)
		return this
	}

	setOpenApiOperationId(operationId: string) {
		this.operationId = operationId
		return this
	}

	addOpenApiErrorStatusCodes(...codes: StatusCode[]) {
		this.errorStatusCodes.push(...codes)
		return this
	}

	addQueryParameters(...queryParams: QueryParameter<Infer<C['ParamsSchema']>>[]) {
		this.queryParameter.push(...queryParams)
		return this
	}

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
			C['QueueInvokes'],
			C['AgentInvokes']
		>,
	) {
		assertNonArrowFunction(fn, 'setStreamFunction')
		this.fn = fn
		return this
	}

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
			C['QueueInvokes'],
			C['AgentInvokes']
		>
	}

	getStreamContextMock(_input: {
		sandbox?: SinonSandbox
		resources?: Partial<C['Resources']>
		writer?: Partial<StreamWriter>
	}) {
		return {
			// currently no dedicated stream context mock helper
		}
	}

	async getDefinition() {
		if (!this.fn) {
			throw new Error(`StreamDefinitionBuilder: missing function implementation for ${this.streamName}`)
		}

		const eventBridgeConfig: Complete<DefinitionEventBridgeConfig> = {
			durable: this.durable,
			autoacknowledge: this.autoacknowledge,
			shared: true,
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
				contentTypeResponse: this.httpMetadata ? 'text/event-stream' : undefined,
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
			C['QueueInvokes'],
			C['AgentInvokes']
		> = {
			streamName: this.streamName,
			streamDescription: this.streamDescription,
			metadata,
			eventBridgeConfig,
			chunkSchema: this.chunkSchema,
			finalSchema: this.finalSchema,
			call: this.getStreamFunction(),
			finalEventName: this.finalEventName,
			chunkValidationEnabled: this.validateChunk,
			finalValidationEnabled: this.validateFinal,
			aggregateChunks: this.aggregateChunks,
			invokes: this.invokes,
			streamInvokes: this.streamInvokes,
			agentInvokes: this.agentInvokes,
			emitList: this.emitList,
			queueInvokes: this.queueInvokes,
		}

		return definition
	}
}
