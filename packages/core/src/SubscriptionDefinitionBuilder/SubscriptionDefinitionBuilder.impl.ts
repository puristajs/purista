import type { Infer, InferIn, Schema } from '@typeschema/main'
import type { SinonSandbox } from 'sinon'
import type { ZodAny } from 'zod'

import {
  type Complete,
  type ContentType,
  type DefinitionEventBridgeConfig,
  type EBMessage,
  type EBMessageType,
  type FromInvokeToOtherType,
  type InstanceId,
  type PrincipalId,
  type ServiceClass,
  StatusCode,
  type SubscriptionAfterGuardHook,
  type SubscriptionBeforeGuardHook,
  type SubscriptionDefinition,
  type SubscriptionDefinitionMetadataBase,
  type SubscriptionFunction,
  type SubscriptionTransformInputHook,
  type SubscriptionTransformOutputHook,
  type TenantId,
  UnhandledError,
} from '../core/index.js'
import type { NonEmptyString } from '../helper/index.js'
import { getSubscriptionContextMock, getSubscriptionTransformContextMock } from '../mocks/index.js'
import { validationToSchema } from '../zodOpenApi/index.js'
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
  PayloadSchema extends Schema = ZodAny,
  ParameterSchema extends Schema = ZodAny,
  ResultSchema extends Schema = ZodAny,
  Invokes = {},
  EmitListType = {},
> {
  private messageType: EBMessageType | undefined

  private inputSchema?: PayloadSchema
  private inputContentType: ContentType | undefined
  private inputContentEncoding: string | undefined
  private outputSchema?: ResultSchema
  private outputContentType: ContentType | undefined
  private outputContentEncoding: string | undefined
  private parameterSchema?: ParameterSchema

  private hooks: {
    transformInput?: {
      transformInputSchema: Schema
      transformParameterSchema: Schema
      transformFunction: SubscriptionTransformInputHook<ServiceClassType, any, any, any, any>
    }
    beforeGuard: Record<
      string,
      SubscriptionBeforeGuardHook<ServiceClassType, Infer<PayloadSchema>, Infer<ParameterSchema>, Invokes, EmitListType>
    >
    afterGuard: Record<
      string,
      SubscriptionAfterGuardHook<
        ServiceClassType,
        Infer<ResultSchema>,
        Infer<PayloadSchema>,
        Infer<ParameterSchema>,
        Invokes,
        EmitListType
      >
    >
    transformOutput?: {
      transformOutputSchema: Schema
      transformFunction: SubscriptionTransformOutputHook<
        ServiceClassType,
        Infer<ResultSchema>,
        Infer<PayloadSchema>,
        any
      >
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
    Infer<PayloadSchema>,
    Infer<ParameterSchema>,
    InferIn<ResultSchema>,
    Invokes,
    EmitListType
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
    { outputSchema?: Schema; payloadSchema?: Schema; parameterSchema?: Schema }
  > = {} as FromInvokeToOtherType<Invokes, { outputSchema?: Schema; payloadSchema?: Schema; parameterSchema?: Schema }>

  private emitList: EmitListType = {} as EmitListType

  // eslint-disable-next-line no-useless-constructor
  constructor(
    private subscriptionName: Exclude<string, ''>,
    private subscriptionDescription: string,
  ) {}

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
    } as Invokes &
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

    return this as SubscriptionDefinitionBuilder<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      MessageResultType,
      PayloadSchema,
      ParameterSchema,
      ResultSchema,
      Invokes &
        Record<
          SName,
          Record<
            Version,
            Record<Fname, (payload: InferIn<Payload>, parameter: InferIn<Parameter>) => Promise<Infer<Output>>>
          >
        >,
      EmitListType
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

    return this as SubscriptionDefinitionBuilder<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      MessageResultType,
      PayloadSchema,
      ParameterSchema,
      ResultSchema,
      Invokes,
      EmitListType & Record<EventName, InferIn<typeof schema>>
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
    this.sender = this.sender ?? {}
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
  addPayloadSchema<T extends Schema>(
    inputSchema: T,
    inputContentType = 'application/json',
    inputContentEncoding = 'utf-8',
  ) {
    this.inputContentType = inputContentType || this.inputContentType
    this.inputContentEncoding = inputContentEncoding || this.inputContentEncoding

    this.inputSchema = inputSchema as unknown as PayloadSchema
    return this as unknown as SubscriptionDefinitionBuilder<
      ServiceClassType,
      InferIn<T>,
      MessageParamsType,
      MessageResultType,
      T,
      ParameterSchema,
      ResultSchema,
      Invokes,
      EmitListType
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
  addOutputSchema<T extends Schema>(
    eventName: string,
    outputSchema: T,
    outputContentType = 'application/json',
    outputContentEncoding = 'utf-8',
  ) {
    this.emitEventName = eventName
    this.outputContentEncoding = outputContentEncoding
    this.outputContentType = outputContentType
    this.outputSchema = outputSchema as unknown as ResultSchema
    return this as unknown as SubscriptionDefinitionBuilder<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      T,
      PayloadSchema,
      ParameterSchema,
      T,
      Invokes,
      EmitListType
    >
  }

  /**
   * Add a schema for output parameter validation.
   * Types for parameter of message and function parameter output are generated from given schema.
   * @param parameterSchema the validation schema for output parameter
   * @returns SubscriptionDefinitionBuilder
   */
  addParameterSchema<T extends Schema>(parameterSchema: T) {
    this.parameterSchema = parameterSchema as unknown as ParameterSchema
    return this as unknown as SubscriptionDefinitionBuilder<
      ServiceClassType,
      MessagePayloadType,
      InferIn<T>,
      MessageResultType,
      PayloadSchema,
      T,
      ResultSchema,
      Invokes,
      EmitListType
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
  setTransformInput<TransFormPayloadSchema extends Schema, TransFormParameterSchema extends Schema>(
    transformInputSchema: TransFormPayloadSchema,
    transformParameterSchema: TransFormParameterSchema,
    transformFunction: SubscriptionTransformInputHook<
      ServiceClassType,
      InferIn<PayloadSchema>,
      InferIn<ParameterSchema>,
      InferIn<TransFormPayloadSchema>,
      InferIn<TransFormParameterSchema>
    >,
    inputContentType?: ContentType,
    inputContentEncoding?: string,
  ) {
    this.inputContentType = inputContentType ?? this.inputContentType
    this.inputContentEncoding = inputContentEncoding ?? this.inputContentEncoding

    this.hooks.transformInput = {
      transformFunction,
      transformInputSchema,
      transformParameterSchema,
    }
    return this as unknown as SubscriptionDefinitionBuilder<
      ServiceClassType,
      InferIn<typeof transformInputSchema>,
      InferIn<typeof transformParameterSchema>,
      MessageResultType,
      PayloadSchema,
      ParameterSchema,
      ResultSchema,
      Invokes,
      EmitListType
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
      InferIn<PayloadSchema>,
      InferIn<ParameterSchema>,
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
  setTransformOutput<Output extends Schema>(
    transformOutputSchema: Output,
    transformFunction: SubscriptionTransformOutputHook<
      ServiceClassType,
      Infer<ResultSchema>,
      Infer<ParameterSchema>,
      InferIn<Output>
    >,
    outputContentType?: ContentType,
    outputContentEncoding?: string,
  ) {
    this.outputContentEncoding = outputContentEncoding ?? this.outputContentEncoding
    this.outputContentType = outputContentType ?? this.outputContentType

    this.hooks.transformOutput = {
      transformFunction,
      transformOutputSchema,
    }
    return this as unknown as SubscriptionDefinitionBuilder<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      Infer<typeof transformOutputSchema>,
      PayloadSchema,
      ParameterSchema,
      ResultSchema,
      Invokes,
      EmitListType
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
      Infer<ResultSchema>,
      Infer<ParameterSchema>,
      Infer<ResultSchema>
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
      SubscriptionBeforeGuardHook<ServiceClassType, Infer<PayloadSchema>, Infer<ParameterSchema>, Invokes, EmitListType>
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
      SubscriptionAfterGuardHook<
        ServiceClassType,
        Infer<ResultSchema>,
        Infer<PayloadSchema>,
        Infer<ParameterSchema>,
        Invokes,
        EmitListType
      >
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
      Infer<PayloadSchema>,
      Infer<ParameterSchema>,
      Infer<ResultSchema>,
      Invokes,
      EmitListType
    >,
  ): SubscriptionDefinitionBuilder<
    ServiceClassType,
    MessagePayloadType,
    MessageParamsType,
    MessageResultType,
    PayloadSchema,
    ParameterSchema,
    ResultSchema,
    Invokes,
    EmitListType
  > {
    this.fn = fn as unknown as SubscriptionFunction<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      Infer<PayloadSchema>,
      Infer<ParameterSchema>,
      Infer<ResultSchema>,
      Invokes,
      EmitListType
    >

    return this as unknown as SubscriptionDefinitionBuilder<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      MessageResultType,
      PayloadSchema,
      ParameterSchema,
      ResultSchema,
      Invokes,
      EmitListType
    >
  }

  /**
   * Get the function implementation including input and output validation.
   * Also, before and after hooks are triggered during execution.
   *
   * @returns the subscription function
   */
  getSubscriptionFunction() {
    if (!this.fn) {
      throw new UnhandledError(StatusCode.NotImplemented, `No function implementation for ${this.subscriptionName}`, {
        subscriptionName: this.subscriptionName,
      })
    }

    const f: SubscriptionFunction<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      InferIn<PayloadSchema>,
      InferIn<ParameterSchema>,
      Infer<ResultSchema>,
      Invokes,
      EmitListType
    > = getSubscriptionFunctionWithValidation<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      MessageResultType,
      InferIn<PayloadSchema>,
      InferIn<ParameterSchema>,
      Infer<ResultSchema>,
      Invokes,
      EmitListType
    >(this.fn, this.inputSchema, this.parameterSchema, this.outputSchema, this.hooks.beforeGuard)

    return f
  }

  /**
   * Get the function implementation without input and output validation.
   * No hooks are triggered during execution.
   *
   * @returns the subscription function
   */
  getSubscriptionFunctionPlain() {
    if (!this.fn) {
      throw new UnhandledError(StatusCode.NotImplemented, `No function implementation for ${this.subscriptionName}`, {
        subscriptionName: this.subscriptionName,
      })
    }

    this.fn as SubscriptionFunction<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      InferIn<PayloadSchema>,
      InferIn<ParameterSchema>,
      Infer<ResultSchema>,
      Invokes,
      EmitListType
    >
  }

  /**
   * Returns the final subscription definition which will be passed into the service class.
   * @returns SubscriptionDefinition
   */
  async getDefinition(): Promise<
    SubscriptionDefinition<
      ServiceClassType,
      SubscriptionDefinitionMetadataBase,
      MessagePayloadType,
      MessageParamsType,
      MessageResultType,
      Infer<PayloadSchema>,
      Infer<ParameterSchema>,
      Infer<ResultSchema>,
      Invokes,
      EmitListType
    >
  > {
    if (!this.fn) {
      throw new Error(`SubscriptionDefinitionBuilder: missing function implementation for ${this.subscriptionName}`)
    }

    const inputPayloadSchema: Schema | undefined = this.hooks.transformInput?.transformInputSchema ?? this.inputSchema
    const inputParameterSchema: Schema | undefined =
      this.hooks.transformInput?.transformParameterSchema ?? this.parameterSchema
    const outputPayloadSchema: Schema | undefined =
      this.hooks.transformOutput?.transformOutputSchema ?? this.outputSchema

    const eventBridgeConfig: Complete<DefinitionEventBridgeConfig> = {
      durable: this.durable,
      autoacknowledge: this.autoacknowledge,
      shared: this.shared,
    }

    const [inputPayload, parameter, outputPayload] = await Promise.all([
      validationToSchema(inputPayloadSchema),
      validationToSchema(inputParameterSchema),
      validationToSchema(outputPayloadSchema),
    ])

    const subscription: Complete<
      SubscriptionDefinition<
        ServiceClassType,
        SubscriptionDefinitionMetadataBase,
        MessagePayloadType,
        MessageParamsType,
        MessageResultType,
        Infer<PayloadSchema>,
        Infer<ParameterSchema>,
        Infer<ResultSchema>,
        Invokes,
        EmitListType
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
          inputPayload,
          parameter,
          outputPayload,
        },
      },
      receiver: this.receiver,
      sender: this.sender,
      messageType: this.messageType,
      eventName: this.eventName,
      emitEventName: this.emitEventName,
      principalId: this.principalId,
      tenantId: this.tenantId,
      call: this.getSubscriptionFunction(),
      hooks: this.hooks,
      invokes: this.invokes,
      emitList: this.emitList,
    }

    return subscription
  }

  /**
   * Returns a mocked command function context, which can be used in unit tests.
   *
   * @param message
   * @param sandbox Sinon sandbox
   * @returns a mocked command function context
   */
  getSubscriptionContextMock(message: EBMessage, sandbox?: SinonSandbox) {
    return getSubscriptionContextMock<Invokes, EmitListType>(message, sandbox, this.invokes, this.emitList)
  }

  /**
   * Returns a mocked transform function context, which can be used in unit tests.
   *
   * @param message
   * @param sandbox Sinon sandbox
   * @returns a mocked transform function context
   */
  getSubscriptionTransformContextMock(message: EBMessage, sandbox?: SinonSandbox) {
    return getSubscriptionTransformContextMock(message, sandbox)
  }
}
