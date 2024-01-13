import type { SinonSandbox } from 'sinon'
import type { ZodType } from 'zod'
import { z } from 'zod'

import type {
  Complete,
  ContentType,
  DefinitionEventBridgeConfig,
  EBMessage,
  EBMessageType,
  FromInvokeToOtherType,
  InstanceId,
  PrincipalId,
  ServiceClass,
  SubscriptionAfterGuardHook,
  SubscriptionBeforeGuardHook,
  SubscriptionDefinition,
  SubscriptionDefinitionMetadataBase,
  SubscriptionFunction,
  SubscriptionTransformInputHook,
  SubscriptionTransformOutputHook,
  TenantId,
} from '../core/index.js'
import type { NonEmptyString } from '../helper/index.js'
import { getSubscriptionContextMock } from '../mocks/index.js'
import type { OpenApiZodAny } from '../zodOpenApi/index.js'
import { generateSchema } from '../zodOpenApi/index.js'
import { getSubscriptionFunctionWithValidation } from './getSubscriptionFunctionWithValidation.impl.js'

/**
 * Subscription definition builder is a helper to create and define a subscriptions for a service.
 * It helps to set all needed filters.
 *
 * A working schema definition needs at least a subscription name, a short description and the subscription implementation.
 *
 * @group Subscription
 */
export class SubscriptionDefinitionBuilder<
  ServiceClassType extends ServiceClass = ServiceClass,
  MessagePayloadType = unknown,
  MessageParamsType = undefined,
  MessageResultType = void,
  FunctionPayloadType = MessagePayloadType,
  FunctionParamsType = MessageParamsType,
  FunctionResultType = MessageResultType | void | undefined,
  Invokes = {},
> {
  private messageType: EBMessageType | undefined

  private inputSchema?: z.ZodTypeAny
  private inputContentType: ContentType | undefined
  private inputContentEncoding: string | undefined
  private outputSchema: z.ZodType = z.void()
  private outputContentType: ContentType | undefined
  private outputContentEncoding: string | undefined
  private parameterSchema?: z.ZodType

  private hooks: {
    transformInput?: {
      transformInputSchema: z.ZodType
      transformParameterSchema: z.ZodType
      transformFunction: SubscriptionTransformInputHook<ServiceClassType, any, any, any, any>
    }
    beforeGuard: Record<
      string,
      SubscriptionBeforeGuardHook<ServiceClassType, FunctionPayloadType, FunctionParamsType, Invokes>
    >
    afterGuard: Record<
      string,
      SubscriptionAfterGuardHook<ServiceClassType, FunctionResultType, FunctionPayloadType, FunctionParamsType, Invokes>
    >
    transformOutput?: {
      transformOutputSchema: z.ZodType
      transformFunction: SubscriptionTransformOutputHook<ServiceClassType, FunctionResultType, FunctionParamsType, any>
    }
  } = {
    transformInput: undefined,
    beforeGuard: {},
    afterGuard: {},
    transformOutput: undefined,
  }

  private sender?: {
    serviceName?: string
    serviceVersion?: string
    serviceTarget?: string
    instanceId?: InstanceId
  }

  private receiver?: {
    serviceName?: string
    serviceVersion?: string
    serviceTarget?: string
    instanceId?: InstanceId
  }

  private fn?: SubscriptionFunction<
    ServiceClassType,
    MessagePayloadType,
    MessageParamsType,
    FunctionPayloadType,
    FunctionParamsType,
    FunctionResultType,
    Invokes
  >

  private eventName?: string
  private emitEventName?: string

  private principalId?: PrincipalId
  private tenantId?: TenantId

  private durable = true

  private shared = true
  private autoacknowledge = false

  private invokes: FromInvokeToOtherType<
    Invokes,
    { outputSchema?: z.ZodType; payloadSchema?: z.ZodType; parameterSchema?: z.ZodType }
  > = {} as FromInvokeToOtherType<
    Invokes,
    { outputSchema?: z.ZodType; payloadSchema?: z.ZodType; parameterSchema?: z.ZodType }
  >

  // eslint-disable-next-line no-useless-constructor
  constructor(
    private subscriptionName: Exclude<string, ''>,
    private subscriptionDescription: string,
  ) {}

  canInvoke<
    Payload = unknown,
    Parameter = unknown,
    Output = unknown,
    SName extends string = string,
    Version extends string = string,
    Fname extends string = string,
  >(
    serviceName: SName,
    serviceVersion: Version,
    serviceTarget: Fname,
    outputSchema: z.ZodType<Output, any, any> = z.any(),
    payloadSchema: z.ZodType<Payload, any, any> = z.any(),
    parameterSchema: z.ZodType<Parameter, any, any> = z.any(),
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
    } as Invokes &
      Record<SName, Record<Version, Record<Fname, (payload: Payload, parameter: Parameter) => Promise<Output>>>>

    this.invokes = {
      ...this.invokes,
      ...f,
    }

    return this as SubscriptionDefinitionBuilder<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      MessageResultType,
      FunctionPayloadType,
      FunctionParamsType,
      FunctionResultType,
      Invokes &
        Record<SName, Record<Version, Record<Fname, (payload: Payload, parameter: Parameter) => Promise<Output>>>>
    >
  }

  /**
   * Add a filter to only subscribe to messages with matching event name
   * @param eventName The name of event to subscribe
   * @param serviceVersion the version of the service that produces the event
   * @returns SubscriptionDefinitionBuilder
   */
  subscribeToEvent<N extends string, V extends string>(
    eventName: NonEmptyString<N>,
    serviceVersion?: NonEmptyString<V>,
  ) {
    this.eventName = eventName
    this.sender = this.sender || {}
    this.sender.serviceVersion = serviceVersion
    return this
  }

  /**
   * Filter messages only for principalId
   * @param principalId the principal id to subscribe
   * @returns
   */
  filterPrincipalId<T extends PrincipalId>(principalId: NonEmptyString<T>) {
    this.principalId = principalId
    return this
  }

  /**
   * Filter messages only for tenantId
   * @param tenantId the principal id to subscribe
   * @returns
   */
  filterTenantId<T extends TenantId>(tenantId: NonEmptyString<T>) {
    this.tenantId = tenantId
    return this
  }

  /**
   * Instruct the event bridge message broker to autoacknowledge messages as soon as they arrive.
   * This means, a message will not be resent, if the subscription execution fails unexpected.
   *
   * If set to false, the message will be resent from message broker to eventbridge, if:
   * - the underlaying message broker supports it
   * - if the subscription execution fails unexpected
   * - if sending of optional subscription response failed
   *
   * @param acknowledge Enable (true) and disable (false)
   * @returns SubscriptionDefinition
   */
  adviceAutoacknowledgeMessage(acknowledge = true) {
    this.autoacknowledge = acknowledge
    return this
  }

  /**
   * Instruct the event bridge message broker to send the matching message to every running instance.
   * The underlaying message broker must support this functionality.
   *
   * In serverless environments, this flag should not have any effect
   *
   * @param shared
   * @returns SubscriptionDefinition
   */
  receiveMessageOnEveryInstance(enforce = true) {
    this.shared = !enforce
    return this
  }

  /**
   * False: defines the subscription as a live-subscription, which is only able to process messages while the subscription itself is running.
   *
   * True: Advises the event bridge (like rabbitMQ) to store all messages if the subscription is not running.
   * As soon as the subscription is back again, all missed messages will be sent first, before it starts working like a live-subscription.
   */
  adviceDurable(durable: boolean) {
    this.durable = durable
    return this
  }

  /**
   * Add filter to only match messages send by given service function & version.
   * Set one or more parameters to undefined means "do not filter by this criteria".
   * For example:
   *
   * This will filter for all messages send from function testFunction of service UserService.
   * This will include messages from all versions of this function.
   *
   * ```typescript
   * sentFrom('UserService', undefined, 'testFunction')
   * ```
   *
   * @param serviceName the name of the service that produces the message
   * @param serviceVersion the version of the service that produces the message
   * @param serviceTarget the command or subscription name of the service that produces the message
   * @param instanceId the event bridge instance id which was publishing the message
   * @returns
   */
  filterSentFrom<N extends string, V extends string, T extends string, I extends InstanceId>(
    serviceName: NonEmptyString<N> | undefined,
    serviceVersion: NonEmptyString<V> | undefined,
    serviceTarget: NonEmptyString<T> | undefined,
    instanceId: NonEmptyString<I> | undefined,
  ) {
    this.sender = {
      serviceName,
      serviceVersion,
      serviceTarget,
      instanceId,
    }
    return this
  }

  /**
   * Add filter to only match messages received by given service function & version.
   * Set one or more parameters to undefined means "do not filter by this criteria".
   * For example:
   *
   * This will filter for all messages send to function testFunction of service UserService.
   * This will include messages from all versions of this function.
   *
   * ```typescript
   * receivedBy('UserService', undefined, 'testFunction')
   * ```
   *
   * @param serviceName the name of the service that consumes the message
   * @param serviceVersion the version of the service that consumes the message
   * @param serviceTarget the command or subscription name of the service that consumes the message
   * @param instanceId the event bridge instance id which should receive the message
   * @returns
   */
  filterReceivedBy<N extends string, V extends string, T extends string, I extends InstanceId>(
    serviceName: NonEmptyString<N> | undefined,
    serviceVersion: NonEmptyString<V> | undefined,
    serviceTarget: NonEmptyString<T> | undefined,
    instanceId: NonEmptyString<I> | undefined,
  ) {
    this.receiver = {
      serviceName,
      serviceVersion,
      serviceTarget,
      instanceId,
    }
    return this
  }

  /**
   * Adds a filter to match specific message type.
   *
   * Common message types are `Command`, `CommandSuccessResponse` and `CommandErrorResponse`.
   *
   * See @enum EBMessageType for full available list.
   *
   * @param messageType the type of message
   * @returns
   */
  filterForMessageType(messageType: EBMessageType) {
    this.messageType = messageType

    return this
  }

  /**
   * Add a schema for input payload validation.
   * Types for payload of message and function payload input are generated from given schema.
   * @param inputSchema the validation schema for input payload
   * @param inputContentType optional the content type of payload
   * @param inputContentEncoding optional the content encoding
   * @returns SubscriptionDefinitionBuilder
   */
  addPayloadSchema<I = unknown, D extends z.ZodTypeDef = z.ZodTypeDef, O = unknown>(
    inputSchema: z.ZodType<O, D, I>,
    inputContentType = 'application/json',
    inputContentEncoding = 'utf-8',
  ) {
    this.inputContentType = inputContentType || this.inputContentType
    this.inputContentEncoding = inputContentEncoding || this.inputContentEncoding

    this.inputSchema = inputSchema
    return this as unknown as SubscriptionDefinitionBuilder<
      ServiceClassType,
      I,
      MessageParamsType,
      MessageResultType,
      O,
      FunctionParamsType,
      FunctionResultType,
      Invokes
    >
  }

  /**
   * Add a schema for output payload validation.
   * Types for payload of message and function payload output are generated from given schema.
   * @param eventName the event name to be used when the subscription result is emitted as custom event
   * @param outputSchema the validation schema for the output payload
   * @param outputContentType optional the content type of payload
   * @param outputContentEncoding optional the content encoding
   * @returns SubscriptionDefinitionBuilder
   */
  addOutputSchema<I, D extends z.ZodTypeDef, O>(
    eventName: string,
    outputSchema: z.ZodType<O, D, I>,
    outputContentType = 'application/json',
    outputContentEncoding = 'utf-8',
  ) {
    this.emitEventName = eventName
    this.outputContentEncoding = outputContentEncoding
    this.outputContentType = outputContentType
    this.outputSchema = outputSchema
    return this as unknown as SubscriptionDefinitionBuilder<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      O,
      FunctionPayloadType,
      FunctionParamsType,
      I,
      Invokes
    >
  }

  /**
   * Add a schema for output parameter validation.
   * Types for parameter of message and function parameter output are generated from given schema.
   * @param parameterSchema the validation schema for output parameter
   * @returns SubscriptionDefinitionBuilder
   */
  addParameterSchema<I, D extends z.ZodTypeDef, O>(parameterSchema: z.ZodType<O, D, I>) {
    this.parameterSchema = parameterSchema
    return this as unknown as SubscriptionDefinitionBuilder<
      ServiceClassType,
      MessagePayloadType,
      I,
      MessageResultType,
      FunctionPayloadType,
      O,
      FunctionResultType,
      Invokes
    >
  }

  /**
   * Set a transform input hook which will encode or transform the input payload and parameters.
   * Will be executed as first step before input validation, before guard and the function itself.
   * This will change the type of input message payload and input message parameter.
   * @param transformInputSchema Input payload validation schema
   * @param transformParameterSchema Input parameter validation schema
   * @param transformFunction the transform input function
   * @param inputContentType optional the content type of payload
   * @param inputContentEncoding optional the content encoding
   * @returns SubscriptionDefinitionBuilder
   */
  setTransformInput<
    PayloadIn = MessagePayloadType,
    ParamsIn = MessageParamsType,
    PayloadOut = MessagePayloadType,
    ParamsOut = MessageParamsType,
    PayloadD extends z.ZodTypeDef = z.ZodTypeDef,
    ParamsD extends z.ZodTypeDef = z.ZodTypeDef,
  >(
    transformInputSchema: z.ZodType<PayloadOut, PayloadD, PayloadIn>,
    transformParameterSchema: z.ZodType<ParamsOut, ParamsD, ParamsIn>,
    transformFunction: SubscriptionTransformInputHook<
      ServiceClassType,
      FunctionPayloadType,
      FunctionParamsType,
      PayloadIn,
      ParamsIn
    >,
    inputContentType?: ContentType,
    inputContentEncoding?: string,
  ) {
    this.inputContentType = inputContentType || this.inputContentType
    this.inputContentEncoding = inputContentEncoding || this.inputContentEncoding

    this.hooks.transformInput = {
      transformFunction,
      transformInputSchema,
      transformParameterSchema,
    }
    return this as unknown as SubscriptionDefinitionBuilder<
      ServiceClassType,
      PayloadIn,
      ParamsIn,
      MessageResultType,
      FunctionPayloadType,
      FunctionParamsType,
      FunctionResultType,
      Invokes
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

    return this.hooks.transformInput.transformFunction as SubscriptionTransformInputHook<
      ServiceClassType,
      FunctionPayloadType,
      FunctionParamsType,
      MessagePayloadType,
      MessageParamsType
    >
  }

  /**
   * Set a transform output hook which will encode or transform the response payload.
   * Will be executed at very last step after function execution, output validation and after guard hooks.
   * This will change the type of output message payload.
   * @param transformOutputSchema The output validation schema
   * @param transformFunction the transform output function
   * @param outputContentType optional the content type of payload
   * @param outputContentEncoding optional the content encoding
   * @returns SubscriptionDefinitionBuilder
   */
  setTransformOutput<PayloadOut, PayloadD extends z.ZodTypeDef, PayloadIn>(
    transformOutputSchema: z.ZodType<PayloadOut, PayloadD, PayloadIn>,
    transformFunction: SubscriptionTransformOutputHook<
      ServiceClassType,
      FunctionResultType,
      FunctionParamsType,
      PayloadIn
    >,
    outputContentType?: ContentType,
    outputContentEncoding?: string,
  ) {
    this.outputContentEncoding = outputContentEncoding || this.outputContentEncoding
    this.outputContentType = outputContentType || this.outputContentType

    this.hooks.transformOutput = {
      transformFunction,
      transformOutputSchema,
    }
    return this as unknown as SubscriptionDefinitionBuilder<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      PayloadOut,
      FunctionPayloadType,
      FunctionParamsType,
      FunctionResultType,
      Invokes
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

    return this.hooks.transformOutput.transformFunction as SubscriptionTransformOutputHook<
      ServiceClassType,
      FunctionResultType,
      FunctionParamsType,
      FunctionResultType
    >
  }

  /**
   * Set one or more before guard hook(s).
   * If there are multiple before guard hooks, they are executed in parallel
   * @param beforeGuards Object of key = name of guard, value = function
   * @returns SubscriptionDefinitionBuilder
   */
  setBeforeGuardHooks(
    beforeGuards: Record<
      string,
      SubscriptionBeforeGuardHook<ServiceClassType, FunctionPayloadType, FunctionParamsType, Invokes>
    >,
  ) {
    this.hooks.beforeGuard = { ...this.hooks.beforeGuard, ...beforeGuards }
    return this
  }

  /**
   * Set one or more after guard hook(s).
   * If there are multiple after guard hooks, they are executed in parallel
   * @param afterGuard Object of key = name of guard, value = function
   * @returns SubscriptionDefinitionBuilder
   */
  setAfterGuardHooks(
    afterGuards: Record<
      string,
      SubscriptionAfterGuardHook<ServiceClassType, FunctionResultType, FunctionPayloadType, FunctionParamsType, Invokes>
    >,
  ) {
    this.hooks.afterGuard = { ...this.hooks.afterGuard, ...afterGuards }
    return this
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
   * @returns SubscriptionDefinitionBuilder
   */
  public setSubscriptionFunction(
    fn: SubscriptionFunction<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      FunctionPayloadType,
      FunctionParamsType,
      FunctionResultType,
      Invokes
    >,
  ): SubscriptionDefinitionBuilder<
    ServiceClassType,
    MessagePayloadType,
    MessageParamsType,
    MessageResultType,
    FunctionPayloadType,
    FunctionParamsType,
    FunctionResultType,
    Invokes
  > {
    this.fn = fn as unknown as SubscriptionFunction<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      FunctionPayloadType,
      FunctionParamsType,
      FunctionResultType,
      Invokes
    >

    return this as unknown as SubscriptionDefinitionBuilder<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      MessageResultType,
      FunctionPayloadType,
      FunctionParamsType,
      FunctionResultType,
      Invokes
    >
  }

  /**
   * Get the function implementation
   * @returns the subscription function
   */
  getSubscriptionFunction(): SubscriptionFunction<
    ServiceClassType,
    MessagePayloadType,
    MessageParamsType,
    FunctionPayloadType,
    FunctionParamsType,
    FunctionResultType,
    Invokes
  > {
    if (!this.fn) {
      throw new Error(`No function implementation for ${this.subscriptionName}`)
    }

    const f = getSubscriptionFunctionWithValidation<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      MessageResultType,
      FunctionPayloadType,
      FunctionParamsType,
      FunctionResultType,
      Invokes
    >(this.fn, this.inputSchema, this.parameterSchema, this.outputSchema, this.hooks.beforeGuard)

    return f
  }

  /**
   * Returns the final subscription definition which will be passed into the service class.
   * @returns SubscriptionDefinition
   */
  getDefinition(): SubscriptionDefinition<
    ServiceClassType,
    SubscriptionDefinitionMetadataBase,
    MessagePayloadType,
    MessageParamsType,
    MessageResultType,
    FunctionPayloadType,
    FunctionParamsType,
    FunctionResultType,
    Invokes
  > {
    if (!this.fn) {
      throw new Error(`SubscriptionDefinitionBuilder: missing function implementation for ${this.subscriptionName}`)
    }

    const inputPayloadSchema: ZodType | undefined = this.hooks.transformInput?.transformInputSchema || this.inputSchema
    const inputParameterSchema: ZodType | undefined =
      this.hooks.transformInput?.transformParameterSchema || this.parameterSchema
    const outputPayloadSchema: ZodType | undefined =
      this.hooks.transformOutput?.transformOutputSchema || this.outputSchema

    const eventBridgeConfig: Complete<DefinitionEventBridgeConfig> = {
      durable: this.durable,
      autoacknowledge: this.autoacknowledge,
      shared: this.shared,
    }

    const subscription: Complete<
      SubscriptionDefinition<
        ServiceClassType,
        SubscriptionDefinitionMetadataBase,
        MessagePayloadType,
        MessageParamsType,
        MessageResultType,
        FunctionPayloadType,
        FunctionParamsType,
        FunctionResultType,
        Invokes
      >
    > = {
      subscriptionName: this.subscriptionName,
      subscriptionDescription: this.subscriptionDescription,
      eventBridgeConfig,
      metadata: {
        expose: {
          contentTypeRequest: this.inputContentType,
          contentEncodingRequest: this.inputContentEncoding,
          contentTypeResponse: this.outputContentType,
          contentEncodingResponse: this.outputContentEncoding,
          inputPayload: inputPayloadSchema ? generateSchema(inputPayloadSchema as unknown as OpenApiZodAny) : undefined,
          parameter: inputParameterSchema
            ? generateSchema(inputParameterSchema as unknown as OpenApiZodAny)
            : undefined,
          outputPayload: outputPayloadSchema
            ? generateSchema(outputPayloadSchema as unknown as OpenApiZodAny)
            : undefined,
        },
      },
      receiver: this.receiver,
      sender: this.sender,
      messageType: this.messageType,
      eventName: this.eventName,
      emitEventName: this.emitEventName,
      principalId: this.principalId,
      tenantId: this.tenantId,
      call: getSubscriptionFunctionWithValidation<
        ServiceClassType,
        MessagePayloadType,
        MessageParamsType,
        MessageResultType,
        FunctionPayloadType,
        FunctionParamsType,
        FunctionResultType,
        Invokes
      >(this.fn, this.inputSchema, this.parameterSchema, this.outputSchema, this.hooks.beforeGuard),
      hooks: this.hooks,
      invokes: this.invokes,
    }

    return subscription
  }

  /**
   * Returns a mocked command function context, which can be used in unit tests.
   *
   * @param payload
   * @param parameter
   * @param sandbox Sinon sandbox
   * @returns a mocked command function context
   */
  getSubscriptionContextMock(message: EBMessage, sandbox?: SinonSandbox) {
    return getSubscriptionContextMock<Invokes>(message, sandbox)
  }
}
