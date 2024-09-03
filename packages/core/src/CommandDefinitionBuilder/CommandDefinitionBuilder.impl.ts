import type { Infer, InferIn, Schema } from '@typeschema/main'
import type { SinonSandbox } from 'sinon'

import type {
	CommandAfterGuardHook,
	CommandBeforeGuardHook,
	CommandDefinition,
	CommandDefinitionMetadataBase,
	CommandFunction,
	CommandTransformInputHook,
	CommandTransformOutputHook,
	Complete,
	ContentType,
	DefinitionEventBridgeConfig,
	GetMessageParamsType,
	GetMessagePayloadType,
	HttpExposedServiceMeta,
	InferTypeOrEmptyObject,
	InvokeList,
	QueryParameter,
	Service,
	SupportedHttpMethod,
} from '../core/index.js'
import { StatusCode, UnhandledError } from '../core/index.js'
import {
	type NonEmptyString,
	convertEmitValidationsToSchema,
	convertInvokeValidationsToSchema,
} from '../helper/index.js'
import { getCommandContextMock, getCommandTransformContextMock } from '../mocks/index.js'
import { validationToSchema } from '../zodOpenApi/index.js'
import type { CommandDefinitionBuilderTypes } from './CommandDefinitionBuilderTypes.js'
import { getCommandFunctionWithValidation } from './getCommandFunctionWithValidation.impl.js'

/**
 * Command definition builder is a helper to create and define a command for a service.
 * It helps to set all needed information like schemas and hooks.
 * With these information, the types are automatically set and extended.
 *
 * A working schema definition needs at least a command name, a short description and the function implementation.
 *
 * @group Command
 */
export class CommandDefinitionBuilder<
	S extends Service,
	C extends CommandDefinitionBuilderTypes = CommandDefinitionBuilderTypes,
> {
	private httpMetadata?: HttpExposedServiceMeta
	private inputSchema?: Schema
	private inputContentType: ContentType | undefined
	private inputContentEncoding: string | undefined
	private outputSchema?: Schema
	private outputContentType: ContentType | undefined
	private outputContentEncoding: string | undefined
	private parameterSchema?: Schema
	private queryParameter: QueryParameter[] = []

	private tags: string[] = []

	private deprecated = false

	private summary?: string

	private errorStatusCodes: StatusCode[] = []

	private isSecure = true

	private operationId?: string

	private durable = false
	private autoacknowledge = true

	private invokes: C['Invokes'] = {}

	private emitList: C['EmitList'] = {}

	private hooks: {
		transformInput?: {
			transformInputSchema: Schema
			transformParameterSchema: Schema
			transformFunction: CommandTransformInputHook<S, any, any, any, any, any, any>
		}
		beforeGuard: Record<
			string,
			CommandBeforeGuardHook<S, any, any, any, any, C['Resources'], C['Invokes'], C['EmitList']>
		>
		afterGuard: Record<
			string,
			CommandAfterGuardHook<S, any, any, any, any, any, C['Resources'], C['Invokes'], C['EmitList']>
		>
		transformOutput?: {
			transformOutputSchema: Schema
			transformFunction: CommandTransformOutputHook<S, any, any, any, any, any>
		}
	} = {
		transformInput: undefined,
		beforeGuard: {},
		afterGuard: {},
		transformOutput: undefined,
	}

	private fn?: CommandFunction<S, any, any, any, any, any, C['Resources'], C['Invokes'], C['EmitList']>

	constructor(
		private commandName: Exclude<string, ''>,
		private commandDescription: string,
		private eventName?: Exclude<string, ''>,
		deprecated = false,
	) {
		this.deprecated = deprecated
	}

	/**
	 * Define a command which can be invoked by the current command
	 * @param serviceName
	 * @param serviceVersion
	 * @param serviceTarget
	 * @param outputSchema
	 * @param payloadSchema
	 * @param parameterSchema
	 * @returns
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
		if (serviceName.trim() === '' || serviceVersion.trim() === '' || serviceTarget.trim() === '') {
			throw new Error('canInvoke requires non-empty service name, version and target')
		}

		const x = this.invokes as any
		if (!x[serviceName]) {
			x[serviceName] = {}
		}

		if (!x[serviceName][serviceVersion]) {
			x[serviceName][serviceVersion] = {}
		}

		const f = {
			[serviceName]: {
				[serviceVersion]: {
					[serviceTarget]: { outputSchema, payloadSchema, parameterSchema },
				},
			},
		} as unknown as C['Invokes'] &
			Record<
				SName,
				Record<
					Version,
					Record<Fname, (payload: InferIn<Payload>, parameter: InferIn<Parameter>) => Promise<Infer<Output>>>
				>
			>

		this.invokes = {
			...this.invokes,
			...f,
		}

		return this as unknown as CommandDefinitionBuilder<
			S,
			CommandDefinitionBuilderTypes<
				C['PayloadSchema'],
				C['ParamsSchema'],
				C['OutputSchema'],
				C['TransformInputPayloadSchema'],
				C['TransformInputParamsSchema'],
				C['TransformOutputSchema'],
				C['Resources'],
				C['Invokes'] &
					Record<
						SName,
						Record<
							Version,
							Record<Fname, (payload: InferIn<Payload>, parameter: InferIn<Parameter>) => Promise<Infer<Output>>>
						>
					>,
				C['EmitList']
			>
		>
	}

	/**
	 * Define which custom events the command can emit.
	 *
	 * @param eventName The custom event name
	 * @param schema the payload schema
	 * @returns
	 */
	canEmit<EventName extends string, T extends Schema>(eventName: EventName, schema: T) {
		if (eventName.trim() === '') {
			throw new Error('canEmit requires non-empty event name')
		}

		this.emitList = { ...this.emitList, [eventName]: schema }

		return this as unknown as CommandDefinitionBuilder<
			S,
			CommandDefinitionBuilderTypes<
				C['PayloadSchema'],
				C['ParamsSchema'],
				C['OutputSchema'],
				C['TransformInputPayloadSchema'],
				C['TransformInputParamsSchema'],
				C['TransformOutputSchema'],
				C['Resources'],
				C['Invokes'],
				C['EmitList'] & Record<EventName, InferIn<typeof schema>>
			>
		>
	}

	/*
	 * Event name of success response message.
	 * This makes it easy to subscribe to something like `UserCreated` (optional add service version to the subscription).
	 * Otherwise you will need to subscribe to service name, service function, and message type to get the message.
	 * It is also essential to have this possibility to be able to build event sourcing architectures.
	 */
	setSuccessEventName<N extends string>(eventName: NonEmptyString<N>) {
		this.eventName = eventName
		return this
	}

	/**
	 * Add a schema for input payload validation.
	 * Types for payload of message and function payload input are generated from given schema.
	 * @param inputSchema The schema validation for input payload
	 * @param inputContentType optional the content type of payload
	 * @param inputContentEncoding optional the content encoding
	 * @returns CommandDefinitionBuilder
	 */
	addPayloadSchema<PayloadSchema extends Schema>(
		inputSchema: PayloadSchema,
		inputContentType?: ContentType,
		inputContentEncoding?: string,
	) {
		this.inputContentType = inputContentType ?? this.inputContentType
		this.inputContentEncoding = inputContentEncoding ?? this.inputContentEncoding
		this.inputSchema = inputSchema
		return this as unknown as CommandDefinitionBuilder<
			S,
			CommandDefinitionBuilderTypes<
				PayloadSchema,
				C['ParamsSchema'],
				C['OutputSchema'],
				C['TransformInputPayloadSchema'],
				C['TransformInputParamsSchema'],
				C['TransformOutputSchema'],
				C['Resources'],
				C['Invokes'],
				C['EmitList']
			>
		>
	}

	/**
	 * Add a schema for output parameter validation.
	 * Types for parameter of message and function parameter output are generated from given schema.
	 * @param parameterSchema The schema validation for output parameter
	 * @returns CommandDefinitionBuilder
	 */
	addParameterSchema<ParamsSchema extends Schema>(parameterSchema: ParamsSchema) {
		this.parameterSchema = parameterSchema
		return this as unknown as CommandDefinitionBuilder<
			S,
			CommandDefinitionBuilderTypes<
				C['PayloadSchema'],
				ParamsSchema,
				C['OutputSchema'],
				C['TransformInputPayloadSchema'],
				C['TransformInputParamsSchema'],
				C['TransformOutputSchema'],
				C['Resources'],
				C['Invokes'],
				C['EmitList']
			>
		>
	}

	/**
	 * Add a schema for output payload validation.
	 * Types for payload of message and function payload output are generated from given schema.
	 * @param outputSchema The schema validation for output payload
	 * @param outputContentType optional the content type of payload
	 * @param outputContentEncoding optional the content encoding
	 * @returns CommandDefinitionBuilder
	 */
	addOutputSchema<OutputSchema extends Schema>(
		outputSchema: OutputSchema,
		outputContentType?: ContentType,
		outputContentEncoding?: string,
	) {
		this.outputContentType = outputContentType ?? this.outputContentType
		this.outputContentEncoding = outputContentEncoding ?? this.outputContentEncoding
		this.outputSchema = outputSchema
		return this as unknown as CommandDefinitionBuilder<
			S,
			CommandDefinitionBuilderTypes<
				C['PayloadSchema'],
				C['ParamsSchema'],
				OutputSchema,
				C['TransformInputPayloadSchema'],
				C['TransformInputParamsSchema'],
				C['TransformOutputSchema'],
				C['Resources'],
				C['Invokes'],
				C['EmitList']
			>
		>
	}

	/**
	 * Mark this endpoint/command as deprecated
	 * @returns CommandDefinitionBuilder
	 */
	markAsDeprecated() {
		this.deprecated = true
		return this
	}

	/**
	 * Define query parameters if you expose the function as http endpoint.
	 * Query parameters are add to openApi definition.
	 * Query parameters are add to input parameters.
	 *
	 * @example
	 * ```ts
	 * .addQueryParameters(
	 *   {
	 *     required: false,
	 *     name: 'search',
	 *   },
	 *   {
	 *     required: false,
	 *     name: 'limit',
	 *   },
	 * )
	 * ```
	 *
	 * @param queryParams Add one or more query parameter definitions
	 * @returns CommandDefinitionBuilder
	 */
	addQueryParameters(...queryParams: QueryParameter<Infer<C['ParamsSchema']>>[]) {
		this.queryParameter.push(...(queryParams as any))
		return this
	}

	/**
	 * Add tags for openApi definition for given function.
	 * It is recommended to use some enum for tags to avoid typo issues.
	 *
	 * @example
	 * ```ts
	 * addTags('User','Public')
	 * ```
	 *
	 * @param tags List of tag strings
	 * @returns CommandDefinitionBuilder
	 */
	addOpenApiTags(...tags: string[]) {
		this.tags.push(...tags)
		return this
	}

	/**
	 * If a function can return other status codes, than the default ones, you should add them to openApi definition.
	 * Per default, 200, 204, 400, 401 and 500 can be autogenerated in most cases.
	 * Special cases or different status codes should be added with this function.
	 *
	 * @example
	 * ```ts
	 * addErrorStatusCodes(StatusCode.PaymentRequired, StatusCode.Conflict)
	 * ```
	 *
	 * @param codes List of status codes
	 * @returns CommandDefinitionBuilder
	 */
	addOpenApiErrorStatusCodes(...codes: StatusCode[]) {
		this.errorStatusCodes.push(...codes)
		return this
	}

	/**
	 * Set a transform input hook which will encode or transform the input payload and parameters.
	 * Will be executed as first step before input validation, before guard and the function itself.
	 * This will change the type of input message payload and input message parameter.
	 * @param transformInputSchema Input payload validation schema
	 * @param transformParameterSchema Input parameter validation schema
	 * @param transformFunction Transform input function
	 * @param inputContentType optional the content type of payload
	 * @param inputContentEncoding optional the content encoding
	 * @returns CommandDefinitionBuilder
	 */
	setTransformInput<TransformInputPayloadSchema extends Schema, TransformInputParamsSchema extends Schema>(
		transformInputSchema: TransformInputPayloadSchema,
		transformParameterSchema: TransformInputParamsSchema,
		transformFunction: CommandTransformInputHook<
			S,
			InferIn<TransformInputPayloadSchema>,
			InferIn<TransformInputParamsSchema>,
			Infer<TransformInputPayloadSchema>,
			Infer<TransformInputParamsSchema>,
			InferIn<C['PayloadSchema']>,
			InferIn<C['ParamsSchema']>
		>,
		inputContentType?: ContentType,
		inputContentEncoding?: string,
	) {
		this.inputContentType = inputContentType ?? this.inputContentType
		this.inputContentEncoding = inputContentEncoding ?? this.inputContentEncoding

		this.hooks.transformInput = {
			transformFunction: transformFunction,
			transformInputSchema,
			transformParameterSchema,
		}
		return this as unknown as CommandDefinitionBuilder<
			S,
			CommandDefinitionBuilderTypes<
				C['PayloadSchema'],
				C['ParamsSchema'],
				C['OutputSchema'],
				TransformInputPayloadSchema,
				TransformInputParamsSchema,
				C['TransformOutputSchema'],
				C['Resources'],
				C['Invokes'],
				C['EmitList']
			>
		>
	}

	/**
	 * Return the transform input function
	 * @returns the input transform function if defined
	 */
	getTransformInputFunction() {
		if (!this.hooks.transformInput) {
			return undefined
		}

		return this.hooks.transformInput.transformFunction as CommandTransformInputHook<
			S,
			InferIn<C['TransformInputPayloadSchema']>,
			InferIn<C['TransformInputParamsSchema']>,
			Infer<C['TransformInputPayloadSchema']>,
			Infer<C['TransformInputParamsSchema']>,
			InferIn<C['PayloadSchema']>,
			InferIn<C['ParamsSchema']>
		>
	}

	/**
	 * Set a transform output hook which will encode or transform the response payload.
	 * Will be executed at very last step after function execution, output validation and after guard hooks.
	 * This will change the type of output message payload.
	 * @param transformOutputSchema The output validation schema
	 * @param transformFunction Transform output function
	 * @param outputContentType optional the content type of payload
	 * @param outputContentEncoding optional the content encoding
	 * @returns CommandDefinitionBuilder
	 */
	setTransformOutput<TransformOutputSchema extends Schema>(
		transformOutputSchema: TransformOutputSchema,
		transformFunction: CommandTransformOutputHook<
			S,
			GetMessagePayloadType<C['PayloadSchema'], C['TransformInputPayloadSchema']>,
			GetMessageParamsType<C['ParamsSchema'], C['TransformInputParamsSchema']>,
			Infer<C['OutputSchema']>,
			Infer<C['ParamsSchema']>,
			InferIn<TransformOutputSchema>
		>,

		outputContentType?: ContentType,
		outputContentEncoding?: string,
	) {
		this.outputContentEncoding = outputContentEncoding ?? this.outputContentEncoding
		this.outputContentType = outputContentType ?? this.outputContentType
		this.hooks.transformOutput = {
			transformFunction: transformFunction,
			transformOutputSchema,
		}
		return this as unknown as CommandDefinitionBuilder<
			S,
			CommandDefinitionBuilderTypes<
				C['PayloadSchema'],
				C['ParamsSchema'],
				C['OutputSchema'],
				C['TransformInputPayloadSchema'],
				C['TransformInputParamsSchema'],
				TransformOutputSchema,
				C['Resources'],
				C['Invokes'],
				C['EmitList']
			>
		>
	}

	/**
	 * Return the transform output function
	 * @returns the transform output function if defined
	 */
	getTransformOutputFunction() {
		if (!this.hooks.transformOutput) {
			return undefined
		}

		return this.hooks.transformOutput.transformFunction as CommandTransformOutputHook<
			S,
			GetMessagePayloadType<C['PayloadSchema'], C['TransformInputPayloadSchema']>,
			GetMessageParamsType<C['ParamsSchema'], C['TransformInputParamsSchema']>,
			Infer<C['OutputSchema']>,
			Infer<C['ParamsSchema']>,
			InferIn<C['TransformOutputSchema']>
		>
	}

	/**
	 * Set one or more before guard hook(s).
	 * If there are multiple before guard hooks, they are executed in parallel
	 * @param beforeGuards Object of key = name of guard, value = function
	 * @returns CommandDefinitionBuilder
	 */
	setBeforeGuardHooks(
		beforeGuards: Record<
			string,
			CommandBeforeGuardHook<
				S,
				GetMessagePayloadType<C['PayloadSchema'], C['TransformInputPayloadSchema']>,
				GetMessageParamsType<C['ParamsSchema'], C['TransformInputParamsSchema']>,
				Infer<C['PayloadSchema']>,
				Infer<C['ParamsSchema']>,
				C['Resources'],
				C['Invokes'],
				C['EmitList']
			>
		>,
	) {
		this.hooks.beforeGuard = { ...this.hooks.beforeGuard, ...beforeGuards }
		return this
	}

	/**
	 * Set one or more after guard hook(s).
	 * If there are multiple after guard hooks, they are executed in parallel
	 * @param afterGuard  Object of key = name of guard, value = function
	 * @returns CommandDefinitionBuilder
	 */
	setAfterGuardHooks(
		afterGuards: Record<
			string,
			CommandAfterGuardHook<
				S,
				GetMessagePayloadType<C['PayloadSchema'], C['TransformInputPayloadSchema']>,
				GetMessageParamsType<C['ParamsSchema'], C['TransformInputParamsSchema']>,
				Infer<C['PayloadSchema']>,
				Infer<C['ParamsSchema']>,
				Infer<C['OutputSchema']>,
				C['Resources'],
				C['Invokes'],
				C['EmitList']
			>
		>,
	) {
		this.hooks.afterGuard = { ...this.hooks.afterGuard, ...afterGuards }
		return this
	}

	/**
	 * Mark the function to be exposed as http endpoint.
	 *
	 * Api url prefix and service version are prepended automatically
	 *
	 * For exposing a url like: `/api/V1/user/login` simply provide `user/login`as path
	 *
	 * @param method Http method POST, PUT, PATCH, GET, DELETE
	 * @param path The url path
	 * @param contentTypeRequest input content type defaults to application/json
	 * @param contentEncodingRequest input content encoding defaults to utf-8
	 * @param contentTypeResponse input content type defaults to application/json
	 * @param contentEncodingResponse input content encoding defaults to utf-8
	 * @returns CommandDefinitionBuilder
	 */
	exposeAsHttpEndpoint(
		method: SupportedHttpMethod,
		path: string,
		contentTypeRequest?: ContentType,
		contentEncodingRequest?: string,
		contentTypeResponse?: ContentType,
		contentEncodingResponse?: string,
	) {
		this.httpMetadata = {
			expose: {
				contentTypeRequest: contentTypeRequest ?? this.inputContentType ?? 'application/json',
				contentEncodingRequest: contentEncodingRequest ?? this.inputContentEncoding ?? 'utf-8',
				contentTypeResponse: contentTypeResponse ?? this.outputContentType ?? 'application/json',
				contentEncodingResponse: contentEncodingResponse ?? this.outputContentEncoding ?? 'utf-8',
				http: {
					method,
					path,
				},
			},
		}
		return this
	}

	/**
	 * enable or disable security for this endpoint
	 * @param enabled Defaults to true if not set means "enable security"
	 * @returns CommandDefinitionBuilder
	 */
	enableHttpSecurity(enabled = true) {
		this.isSecure = enabled
		return this
	}

	/**
	 * enable or disable security for this endpoint
	 * @param enabled Defaults to tre if not set meaning "disable security"
	 * @returns CommandDefinitionBuilder
	 */
	disableHttpSecurity(disabled = true) {
		this.isSecure = !disabled
		return this
	}

	/**
	 * Set the function summary text used for example in openApi documentation
	 *
	 * @example
	 * ```ts
	 * setSummary('Some function summary')
	 * ```
	 *
	 * @param summary Summary text
	 * @returns CommandDefinitionBuilder
	 */
	setOpenApiSummary(summary: string) {
		this.summary = summary
		return this
	}

	/**
	 * Set the operationId for openApi documentation
	 * @param operationId
	 * @returns CommandDefinitionBuilder
	 */
	setOpenApiOperationId(operationId: string) {
		this.operationId = operationId
		return this
	}

	private extendWithHttpMetadata<
		MessagePayloadType,
		MessageParamsType,
		TransformInputPayload,
		TransformInputParams,
		FunctionPayloadType,
		FunctionParamsType,
		FunctionOutputType,
		FinalFunctionOutputType,
		TransformOutputHookOutput,
		Resources extends Record<string, any>,
		Invokes extends InvokeList,
		EmitList extends Record<string, Schema>,
	>(
		definition: Complete<
			CommandDefinition<
				S,
				MessagePayloadType,
				MessageParamsType,
				TransformInputPayload,
				TransformInputParams,
				FunctionPayloadType,
				FunctionParamsType,
				FunctionOutputType,
				FinalFunctionOutputType,
				TransformOutputHookOutput,
				Resources,
				Invokes,
				EmitList,
				CommandDefinitionMetadataBase
			>
		>,
	) {
		if (!this.httpMetadata) {
			return definition
		}

		const def: Complete<
			CommandDefinition<
				S,
				MessagePayloadType,
				MessageParamsType,
				TransformInputPayload,
				TransformInputParams,
				FunctionPayloadType,
				FunctionParamsType,
				FunctionOutputType,
				FinalFunctionOutputType,
				TransformOutputHookOutput,
				Resources,
				Invokes,
				EmitList,
				HttpExposedServiceMeta<InferTypeOrEmptyObject<C['ParamsSchema']>>
			>
		> = {
			...definition,
			metadata: {
				...definition.metadata,
				expose: {
					...definition.metadata?.expose,
					...this.httpMetadata.expose,
				},
			},
		}

		def.metadata.expose.http.openApi = {
			description: this.commandDescription,
			summary: this.summary ?? this.commandName,
			isSecure: this.isSecure,
			query: this.queryParameter,
			tags: this.tags,
			additionalStatusCodes: this.errorStatusCodes,
			operationId: this.operationId ?? this.commandName,
		}

		return def
	}

	/**
	 * Instruct the event bridge message broker to autoacknowledge commands as soon as they arrive.
	 * This means, a message will not be resent, if the command execution fails unexpected.
	 *
	 * If set to false, the command message will be resent from message broker to eventbridge, if:
	 * - the underlaying message broker supports it
	 * - if the command execution fails unexpected
	 * - if sending of command response failed
	 *
	 * @param acknowledge Enable (true) and disable (false)
	 * @returns CommandDefinition
	 */
	adviceAutoacknowledgeMessages(acknowledge = true) {
		this.autoacknowledge = acknowledge
		return this
	}

	/**
	 * Creates and returns the CommandDefinition used as input for the service.
	 * @returns CommandDefinition
	 */
	async getDefinition() {
		if (!this.fn) {
			throw new Error('CommandDefinitionBuilder: missing function implementation')
		}

		const eventName = this.eventName

		const inputPayloadSchema: Schema | undefined = this.hooks.transformInput?.transformInputSchema ?? this.inputSchema
		const inputParameterSchema: Schema | undefined =
			this.hooks.transformInput?.transformParameterSchema ?? this.parameterSchema
		const outputPayloadSchema: Schema | undefined =
			this.hooks.transformOutput?.transformOutputSchema ?? this.outputSchema

		const eventBridgeConfig: Complete<DefinitionEventBridgeConfig> = {
			durable: this.durable,
			autoacknowledge: this.autoacknowledge,
			shared: true,
		}

		const [inputPayload, parameter, outputPayload, invokes, emitList] = await Promise.all([
			validationToSchema(inputPayloadSchema),
			validationToSchema(inputParameterSchema),
			validationToSchema(outputPayloadSchema),
			convertInvokeValidationsToSchema(this.invokes),
			convertEmitValidationsToSchema(this.emitList),
		])

		const definition: Complete<
			CommandDefinition<
				S,
				GetMessagePayloadType<C['PayloadSchema'], C['TransformInputPayloadSchema']>,
				GetMessageParamsType<C['ParamsSchema'], C['TransformInputParamsSchema']>,
				Infer<C['TransformInputPayloadSchema']>,
				Infer<C['TransformInputParamsSchema']>,
				Infer<C['PayloadSchema']>,
				Infer<C['ParamsSchema']>,
				InferIn<C['OutputSchema']>,
				Infer<C['OutputSchema']>,
				InferIn<C['TransformOutputSchema']>,
				C['Resources'],
				C['Invokes'],
				C['EmitList']
			>
		> = {
			commandName: this.commandName,
			commandDescription: this.commandDescription,
			eventBridgeConfig,
			metadata: {
				expose: {
					contentTypeRequest: this.inputContentType ?? 'application/json',
					contentEncodingRequest: this.inputContentEncoding ?? 'utf-8',
					contentTypeResponse: this.outputContentType ?? 'application/json',
					contentEncodingResponse: this.outputContentEncoding ?? 'utf-8',
					inputPayload,
					parameter,
					outputPayload,
					deprecated: this.deprecated,
				},
			},
			eventName,
			call: this.getCommandFunction() as any,
			hooks: this.hooks,
			invokes,
			emitList,
		}

		return this.extendWithHttpMetadata(definition)
	}

	/**
	 * Required: Set the function implementation.
	 * The types should be automatically set as soon as schemas previously defined.
	 * As the function will be a a function of a service class you need to implement as function declaration.
	 * Anonymous functions do not have access to the `this` scope.
	 *
	 * @example
	 * ```ts
	 * async function (context, payload, parameter) {
	 *
	 *    return `the result output payload`
	 * }
	 * ```
	 * @param fn the function implementation
	 * @returns CommandDefinitionBuilder
	 */
	public setCommandFunction(
		fn: CommandFunction<
			S,
			GetMessagePayloadType<C['PayloadSchema'], C['TransformInputPayloadSchema']>,
			GetMessageParamsType<C['ParamsSchema'], C['TransformInputParamsSchema']>,
			Infer<C['PayloadSchema']>,
			Infer<C['ParamsSchema']>,
			InferIn<C['OutputSchema']>,
			C['Resources'],
			C['Invokes'],
			C['EmitList']
		>,
	) {
		this.fn = fn

		return this
	}

	/**
	 * Get the function implementation including input and output validation.
	 * Also, before and after hooks are triggered during execution.
	 *
	 * @returns the function
	 */
	getCommandFunction() {
		if (!this.fn) {
			throw new UnhandledError(StatusCode.NotImplemented, `No function implementation for ${this.commandName}`, {
				commandName: this.commandName,
			})
		}

		return getCommandFunctionWithValidation<S>(
			this.fn,
			this.inputSchema,
			this.parameterSchema,
			this.outputSchema,
			this.hooks.beforeGuard,
		) as CommandFunction<
			S,
			GetMessagePayloadType<C['PayloadSchema'], C['TransformInputPayloadSchema']>,
			GetMessageParamsType<C['ParamsSchema'], C['TransformInputParamsSchema']>,
			InferIn<C['PayloadSchema']>,
			InferIn<C['ParamsSchema']>,
			InferIn<C['OutputSchema']>,
			C['Resources'],
			C['Invokes'],
			C['EmitList']
		>
	}

	/**
	 * Get the function implementation without input and output validation.
	 * No hooks are triggered during execution.
	 *
	 * @returns the function
	 */
	getCommandFunctionPlain() {
		if (!this.fn) {
			throw new UnhandledError(StatusCode.NotImplemented, `No function implementation for ${this.commandName}`, {
				commandName: this.commandName,
			})
		}

		return this.fn as CommandFunction<
			S,
			GetMessagePayloadType<C['PayloadSchema'], C['TransformInputPayloadSchema']>,
			GetMessageParamsType<C['ParamsSchema'], C['TransformInputParamsSchema']>,
			Infer<C['PayloadSchema']>,
			Infer<C['ParamsSchema']>,
			InferIn<C['OutputSchema']>,
			C['Resources'],
			C['Invokes'],
			C['EmitList']
		>
	}

	/**
	 * Returns a mocked command function context, which can be used in unit tests.
	 *
	 * @param payload
	 * @param parameter
	 * @param sandbox Sinon sandbox
	 * @param resources if provided, the provided resource will be used instead of a stub
	 * @returns a mocked command function context
	 */
	getCommandContextMock<
		MessagePayloadType = GetMessagePayloadType<C['PayloadSchema'], C['TransformInputPayloadSchema']>,
		MessageParamsType = GetMessageParamsType<C['ParamsSchema'], C['TransformInputParamsSchema']>,
	>(
		payload: MessagePayloadType,
		parameter: MessageParamsType,
		sandbox?: SinonSandbox,
		resources?: Partial<C['Resources']>,
	) {
		return getCommandContextMock<MessagePayloadType, MessageParamsType, C['Resources'], C['Invokes'], C['EmitList']>({
			payload,
			parameter,
			sandbox,
			resources,
			invokes: this.invokes,
			emitList: this.emitList,
		})
	}

	/**
	 * Returns a mocked transform function context, which can be used in unit tests.
	 *
	 * @param message
	 * @param sandbox Sinon sandbox
	 * @returns a mocked transform function context
	 */
	getCommandTransformContextMock(
		payload: GetMessagePayloadType<C['PayloadSchema'], C['TransformInputPayloadSchema']>,
		parameter: GetMessageParamsType<C['ParamsSchema'], C['TransformInputParamsSchema']>,
		sandbox?: SinonSandbox,
	) {
		return getCommandTransformContextMock(payload, parameter, sandbox)
	}
}
