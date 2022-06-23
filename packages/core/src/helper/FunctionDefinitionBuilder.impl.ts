import { generateSchema } from '@anatine/zod-openapi'
import { z } from 'zod'

import {
  AfterGuardHook,
  BeforeGuardHook,
  CommandDefinition,
  CommandFunction,
  Service,
  StatusCode,
  TransformHook,
} from '../core'
import { ContentType, HttpExposedServiceMeta, QueryParameter } from '../http-server'
import { getFunctionWithValidation } from './getFunctionWithValidation'
import { SupportedHttpMethod } from './types'

export class FunctionDefinitionBuilder<
  ServiceClassType extends Service,
  PayloadType = unknown,
  ParamsType = Record<string, unknown>,
  ResultType = unknown,
> {
  private httpMetadata?: HttpExposedServiceMeta
  private inputSchema?: z.ZodType<PayloadType>
  private outputSchema?: z.ZodType<ResultType>
  private paramsSchema?: z.ZodType<ParamsType>

  private queryParameter: QueryParameter[] = []

  private tags: string[] = []

  private summary?: string

  private errorStatusCodes: StatusCode[] = []

  private isSecure = true

  private hooks: {
    transformInput: TransformHook<ServiceClassType, PayloadType, ParamsType>[]
    beforeGuard: BeforeGuardHook<ServiceClassType, PayloadType, ParamsType>[]
    afterGuard: AfterGuardHook<ServiceClassType, ResultType>[]
  } = {
    transformInput: [],
    beforeGuard: [],
    afterGuard: [],
  }

  // eslint-disable-next-line no-useless-constructor
  constructor(
    private commandName: string,
    private commandDescription: string,
    private fn: CommandFunction<ServiceClassType, PayloadType, ParamsType, ResultType>,
  ) {}

  addInputSchema(inputSchema: z.ZodType<PayloadType>) {
    this.inputSchema = inputSchema
    return this
  }

  addOutputSchema(outputSchema: z.ZodType<ResultType>) {
    this.outputSchema = outputSchema
    return this
  }

  addParameterSchema(paramsSchema: z.ZodType<ParamsType>) {
    this.paramsSchema = paramsSchema
    return this
  }

  addQueryParameters(...queryParams: QueryParameter[]) {
    this.queryParameter.push(...queryParams)
    return this
  }

  addTags(...tags: string[]) {
    this.tags.push(...tags)
    return this
  }

  addErrorStatusCodes(...codes: StatusCode[]) {
    this.errorStatusCodes.push(...codes)
    return this
  }

  setTransformInputHook(transformHook: TransformHook<ServiceClassType, PayloadType, ParamsType>[]) {
    this.hooks.transformInput.push(...transformHook)
    return this
  }

  setBeforeGuardHook(beforeGuard: BeforeGuardHook<ServiceClassType, PayloadType, ParamsType>[]) {
    this.hooks.beforeGuard.push(...beforeGuard)
    return this
  }

  setAfterGuardHook(...afterGuard: AfterGuardHook<ServiceClassType, ResultType>[]) {
    this.hooks.afterGuard.push(...afterGuard)
    return this
  }

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

  /** enable or disable security for this endpoint */
  enableHttpSecurity(enabled = true) {
    this.isSecure = enabled
    return this
  }

  setSummary(summary: string) {
    this.summary = summary
    return this
  }

  private extendWithHttpMetadata(
    definition: CommandDefinition<Record<string, unknown>, ServiceClassType, PayloadType, ParamsType, ResultType>,
  ): CommandDefinition<Record<string, unknown>, ServiceClassType, PayloadType, ParamsType, ResultType> {
    if (!this.httpMetadata) {
      return definition
    }

    const def = definition as CommandDefinition<
      HttpExposedServiceMeta,
      ServiceClassType,
      PayloadType,
      ParamsType,
      ResultType
    >

    def.metadata.expose = {
      ...(def.metadata.expose || {}),
      ...this.httpMetadata.expose,
    }

    def.metadata.expose.http.openApi = {
      description: this.commandDescription,
      summary: this.summary || this.commandName,
      isSecure: this.isSecure,
      inputPayload: this.inputSchema ? generateSchema(this.inputSchema) : undefined,
      parameter: this.paramsSchema ? generateSchema(this.paramsSchema) : undefined,
      outputPayload: this.outputSchema ? generateSchema(this.outputSchema) : undefined,
      query: this.queryParameter,
      tags: this.tags,
      additionalStatusCodes: this.errorStatusCodes,
    }

    return def
  }

  getDefinition(): CommandDefinition<Record<string, unknown>, ServiceClassType, PayloadType, ParamsType, ResultType> {
    let definition: CommandDefinition<
      Record<string, unknown>,
      ServiceClassType,
      PayloadType,
      ParamsType,
      ResultType
    > = {
      commandName: this.commandName,
      commandDescription: this.commandDescription,
      metadata: {},
      call: getFunctionWithValidation<ServiceClassType, PayloadType, ParamsType, ResultType>(
        this.fn,
        this.inputSchema,
        this.paramsSchema,
        this.outputSchema,
      ),
      hooks: this.hooks,
    }

    definition = this.extendWithHttpMetadata(definition)

    return definition
  }
}
