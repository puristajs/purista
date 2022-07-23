import { generateSchema } from '@anatine/zod-openapi'
import type { z } from 'zod'

import type {
  AfterGuardHook,
  BeforeGuardHook,
  CommandDefinition,
  CommandFunction,
  ServiceClass,
  StatusCode,
  TransformInputHook,
  TransformOutputHook,
} from '../core'
import { ContentType, HttpExposedServiceMeta, QueryParameter } from '../httpserver'
import { getFunctionWithValidation } from './getFunctionWithValidation'
import type { SupportedHttpMethod } from './types'

/**
 * Function definition builder is a helper to create and define a function for a service.
 * It helps to set all needed information like schemas and hooks.
 * With these information, the types are automatically set and extended.
 *
 * A working schema definition needs at least a function name, a short description and the function implementation.
 */
export class FunctionDefinitionBuilder<
  ServiceClassType extends ServiceClass,
  MessagePayloadType = unknown,
  MessageParamsType = unknown,
  MessageResultType = unknown,
  FunctionPayloadType = MessagePayloadType,
  FunctionParamsType = MessageParamsType,
  FunctionResultType = MessageResultType,
> {
  private httpMetadata?: HttpExposedServiceMeta
  private inputSchema?: z.ZodType
  private outputSchema?: z.ZodType
  private paramsSchema?: z.ZodType
  private queryParameter: QueryParameter[] = []

  private tags: string[] = []

  private summary?: string

  private errorStatusCodes: StatusCode[] = []

  private isSecure = true

  private hooks: {
    transformInput?: {
      transformInputSchema: z.ZodType
      transformParameterSchema: z.ZodType
      transformFunction: TransformInputHook<ServiceClassType, any, any, any, any>
    }
    beforeGuard: BeforeGuardHook<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      FunctionPayloadType,
      FunctionParamsType
    >[]
    afterGuard: AfterGuardHook<ServiceClassType, MessageResultType, MessagePayloadType, MessageParamsType>[]
    transformOutput?: {
      transformOutputSchema: z.ZodType
      transformFunction: TransformOutputHook<ServiceClassType, any, any, FunctionParamsType, any>
    }
  } = {
    transformInput: undefined,
    beforeGuard: [],
    afterGuard: [],
    transformOutput: undefined,
  }

  private fn?: CommandFunction<
    ServiceClassType,
    MessagePayloadType,
    MessageParamsType,
    FunctionPayloadType,
    FunctionParamsType,
    FunctionResultType
  >

  // eslint-disable-next-line no-useless-constructor
  constructor(private commandName: string, private commandDescription: string, private eventName?: string) {}

  /*
   * Event name of success response message.
   * This makes it easy to subscribe to something like `UserCreated` (optional add service version to the subscription).
   * Otherwise you will need to subscribe to service name, service function, and message type to get the message.
   * It is also essential to have this possibility to be able to build event sourcing architectures.
   */
  setSuccessEventName(eventName: string) {
    this.eventName = eventName
    return this
  }

  /**
   * Add a schema for input payload validation.
   * Types for payload of message and function payload input are generated from given schema.
   * @param inputSchema The schema validation for input payload
   * @returns FunctionDefinitionBuilder
   */
  addInputSchema<I = unknown, D = unknown, O = unknown>(inputSchema: z.ZodType<O, D, I>) {
    this.inputSchema = inputSchema
    return this as unknown as FunctionDefinitionBuilder<
      ServiceClassType,
      I,
      MessageParamsType,
      MessageResultType,
      O,
      FunctionParamsType,
      FunctionResultType
    >
  }

  /**
   * Add a schema for output payload validation.
   * Types for payload of message and function payload output are generated from given schema.
   * @param outputSchema The schema validation for output payload
   * @returns FunctionDefinitionBuilder
   */
  addOutputSchema<I, D, O>(outputSchema: z.ZodType<O, D, I>) {
    this.outputSchema = outputSchema
    return this as unknown as FunctionDefinitionBuilder<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      O,
      FunctionPayloadType,
      FunctionParamsType,
      I
    >
  }

  /**
   * Add a schema for output parameter validation.
   * Types for parameter of message and function parameter output are generated from given schema.
   * @param paramsSchema The schema validation for output parameter
   * @returns FunctionDefinitionBuilder
   */
  addParameterSchema<I, D, O>(paramsSchema: z.ZodType<O, D, I>) {
    this.paramsSchema = paramsSchema
    return this as unknown as FunctionDefinitionBuilder<
      ServiceClassType,
      MessagePayloadType,
      I,
      MessageResultType,
      FunctionPayloadType,
      O,
      FunctionResultType
    >
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
   * @returns FunctionDefinitionBuilder
   */
  addQueryParameters(...queryParams: QueryParameter[]) {
    this.queryParameter.push(...queryParams)
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
   * @returns FunctionDefinitionBuilder
   */
  addTags(...tags: string[]) {
    this.tags.push(...tags)
    return this
  }

  /**
   * If a function can return other status codes you should add them to openApi definition.
   * Per default, 200, 204, 400, 401 and 500 can be autogenerated in most cases.
   * Special cases or different status codes should be added with this function.
   *
   * @example
   * ```ts
   * addErrorStatusCodes(StatusCode.PaymentRequired, StatusCode.Conflict)
   * ```
   *
   * @param codes List of status codes
   * @returns FunctionDefinitionBuilder
   */
  addErrorStatusCodes(...codes: StatusCode[]) {
    this.errorStatusCodes.push(...codes)
    return this
  }

  /**
   * Set a transform input hook which will encode or transform the input payload and parameters.
   * Will be executed as first step before input validation, before guard and the function itself.
   * This will change the type of input message payload and input message parameter.
   * @param transformInput Transform input function
   * @returns FunctionDefinitionBuilder
   */
  transformInput<
    PayloadIn = MessagePayloadType,
    ParamsIn = MessageParamsType,
    PayloadOut = MessagePayloadType,
    ParamsOut = MessageParamsType,
    PayloadD = unknown,
    ParamsD = unknown,
  >(
    transformInputSchema: z.ZodType<PayloadOut, PayloadD, PayloadIn>,
    transformParameterSchema: z.ZodType<ParamsOut, ParamsD, ParamsIn>,
    transformFunction: TransformInputHook<ServiceClassType, PayloadOut, ParamsOut, PayloadIn, ParamsIn>,
  ) {
    this.hooks.transformInput = {
      transformFunction,
      transformInputSchema,
      transformParameterSchema,
    }
    return this as unknown as FunctionDefinitionBuilder<
      ServiceClassType,
      PayloadIn,
      ParamsIn,
      MessageResultType,
      FunctionPayloadType,
      FunctionParamsType,
      FunctionResultType
    >
  }

  /**
   * Set a transform output hook which will encode or transform the response payload.
   * Will be executed at very last step after function execution, output validation and after guard hooks.
   * This will change the type of output message payload.
   * @param transformOutput Transform output function
   * @returns FunctionDefinitionBuilder
   */
  transformOutput<PayloadOut, PayloadD, PayloadIn>(
    transformOutputSchema: z.ZodType<PayloadOut, PayloadD, PayloadIn>,
    transformFunction: TransformOutputHook<
      ServiceClassType,
      PayloadOut,
      MessagePayloadType,
      FunctionParamsType,
      PayloadIn
    >,
  ) {
    this.hooks.transformOutput = {
      transformFunction,
      transformOutputSchema,
    }
    return this as unknown as FunctionDefinitionBuilder<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      PayloadOut,
      FunctionPayloadType,
      FunctionParamsType,
      FunctionResultType
    >
  }

  /**
   * Set one or more before guard hook(s).
   * If there are multiple before guard hooks, they are executed in parallel
   * @param beforeGuards Before guard function
   * @returns FunctionDefinitionBuilder
   */
  setBeforeGuardHook(
    ...beforeGuards: BeforeGuardHook<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      FunctionPayloadType,
      FunctionParamsType
    >[]
  ) {
    this.hooks.beforeGuard.push(...beforeGuards)
    return this
  }

  /**
   * Set one or more after guard hook(s).
   * If there are multiple after guard hooks, they are executed in parallel
   * @param afterGuard After guard function
   * @returns FunctionDefinitionBuilder
   */
  setAfterGuardHook(
    ...afterGuard: AfterGuardHook<ServiceClassType, MessageResultType, MessagePayloadType, MessageParamsType>[]
  ) {
    this.hooks.afterGuard.push(...afterGuard)
    return this
  }

  /**
   * Called
   * @returns FunctionDefinitionBuilder
   */
  onFailure() {
    return this
  }

  /**
   * Called
   * @returns FunctionDefinitionBuilder
   */
  onSuccess() {
    return this
  }

  /**
   * Mark the function to be exposed as http endpoint.
   * @param method Http method POST, PUT, PATCH, GET, DELETE
   * @param path The url path
   * @param contentType response content type defaults to application/json
   * @returns FunctionDefinitionBuilder
   */
  exposeAsHttpEndpoint(method: SupportedHttpMethod, path: string, contentType: ContentType = 'application/json') {
    this.httpMetadata = {
      expose: {
        http: {
          method,
          path,
          contentType,
        },
      },
    }
    return this
  }

  /**
   * enable or disable security for this endpoint
   * @param enabled Defaults to true if not set
   * @returns FunctionDefinitionBuilder
   */
  enableHttpSecurity(enabled = true) {
    this.isSecure = enabled
    return this
  }

  /**
   * enable or disable security for this endpoint
   * @param enabled Defaults to false if not set
   * @returns FunctionDefinitionBuilder
   */
  disableHttpSecurity(enabled = false) {
    this.isSecure = enabled
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
   * @returns FunctionDefinitionBuilder
   */
  setSummary(summary: string) {
    this.summary = summary
    return this
  }

  private extendWithHttpMetadata(
    definition: CommandDefinition<
      ServiceClassType,
      Record<string, unknown>,
      MessagePayloadType,
      MessageParamsType,
      MessageResultType,
      FunctionPayloadType,
      FunctionParamsType
    >,
  ) {
    if (!this.httpMetadata) {
      return definition
    }

    const def = definition as CommandDefinition<
      ServiceClassType,
      HttpExposedServiceMeta,
      MessagePayloadType,
      MessageParamsType,
      MessageResultType,
      FunctionPayloadType,
      FunctionParamsType
    >

    def.metadata.expose = {
      ...(def.metadata.expose || {}),
      ...this.httpMetadata.expose,
    }

    const inputPayloadSchema = this.hooks.transformInput?.transformInputSchema || this.inputSchema
    const inputParameterSchema = this.hooks.transformInput?.transformParameterSchema || this.paramsSchema
    const outputPayloadSchema = this.hooks.transformOutput?.transformOutputSchema || this.outputSchema

    def.metadata.expose.http.openApi = {
      description: this.commandDescription,
      summary: this.summary || this.commandName,
      isSecure: this.isSecure,
      inputPayload: inputPayloadSchema ? generateSchema(inputPayloadSchema) : undefined,
      parameter: inputParameterSchema ? generateSchema(inputParameterSchema) : undefined,
      outputPayload: outputPayloadSchema ? generateSchema(outputPayloadSchema) : undefined,
      query: this.queryParameter,
      tags: this.tags,
      additionalStatusCodes: this.errorStatusCodes,
    }

    return def
  }

  /**
   * Creates and returns the CommandDefinition used as input for the service.
   * @returns CommandDefinition
   */
  getDefinition(): CommandDefinition<
    ServiceClassType,
    Record<string, unknown>,
    MessagePayloadType,
    MessageParamsType,
    MessageResultType,
    FunctionPayloadType,
    FunctionParamsType
  > {
    if (!this.fn) {
      throw new Error('FunctionDefinitionBuilder: missing function implementation')
    }

    const eventName = this.eventName
    let definition: CommandDefinition<
      ServiceClassType,
      Record<string, unknown>,
      MessagePayloadType,
      MessageParamsType,
      MessageResultType,
      FunctionPayloadType,
      FunctionParamsType
    > = {
      commandName: this.commandName,
      commandDescription: this.commandDescription,
      metadata: {},
      eventName,
      call: getFunctionWithValidation<
        ServiceClassType,
        MessagePayloadType,
        MessageParamsType,
        MessageResultType,
        FunctionPayloadType,
        FunctionParamsType,
        FunctionResultType
      >(this.fn, this.inputSchema, this.paramsSchema, this.outputSchema, this.hooks.beforeGuard),
      hooks: this.hooks,
    }

    definition = this.extendWithHttpMetadata(definition)

    return definition
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
   * @returns FunctionDefinitionBuilder
   */
  public setFunction(
    fn: CommandFunction<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      FunctionPayloadType,
      FunctionParamsType,
      FunctionResultType
    >,
  ): FunctionDefinitionBuilder<
    ServiceClassType,
    MessagePayloadType,
    MessageParamsType,
    MessageResultType,
    FunctionPayloadType,
    FunctionParamsType,
    FunctionResultType
  > {
    this.fn = fn as unknown as CommandFunction<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      FunctionPayloadType,
      FunctionParamsType,
      FunctionResultType
    >

    return this as unknown as FunctionDefinitionBuilder<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      MessageResultType,
      FunctionPayloadType,
      FunctionParamsType,
      FunctionResultType
    >
  }

  /**
   * Get the function implementation
   * @returns the function
   */
  getFunction():
    | CommandFunction<
        ServiceClassType,
        MessagePayloadType,
        MessageParamsType,
        FunctionPayloadType,
        FunctionParamsType,
        FunctionResultType
      >
    | undefined {
    return this.fn
  }
}
