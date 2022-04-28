import { generateSchema } from '@anatine/zod-openapi'
import { z } from 'zod'

import { CommandDefinition, CommandFunction, ErrorCode, Service } from '../core'
import { HttpExposedServiceMeta, QueryParameter } from '../http-server'
import { getFunctionWithValidation } from './getFunctionWithValidation'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export class FunctionDefinitionBuilder<
  ServiceClassType extends Service,
  PayloadType = unknown,
  ParamsType = unknown,
  ResultType = unknown,
> {
  private httpMetadata?: HttpExposedServiceMeta
  private inputSchema?: z.ZodType<PayloadType>
  private outputSchema?: z.ZodType<ResultType>
  private paramsSchema?: z.ZodType<ParamsType>

  private queryParameter: QueryParameter[] = []

  private tags: string[] = []

  private summary?: string

  private errorStatusCodes: ErrorCode[] = []

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

  addErrorStatusCodes(...codes: ErrorCode[]) {
    this.errorStatusCodes.push(...codes)
    return this
  }

  exposeAsHttpEndpoint(method: HttpMethod, path: string, contentType?: string) {
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

  setSummary(summary: string) {
    this.summary = summary
    return this
  }

  private extendWithHttpMetadata(
    definition: CommandDefinition<
      HttpExposedServiceMeta,
      CommandFunction<ServiceClassType, PayloadType, ParamsType, ResultType>
    >,
  ) {
    if (!this.httpMetadata) {
      return definition
    }

    definition.metadata.expose = {
      ...(definition.metadata.expose || {}),
      ...this.httpMetadata.expose,
    }

    definition.metadata.expose.http.openApi = {
      description: this.commandDescription,
      summary: this.summary || this.commandName,
      inputPayload: this.inputSchema ? generateSchema(this.inputSchema) : undefined,
      parameter: this.paramsSchema ? generateSchema(this.paramsSchema) : undefined,
      outputPayload: this.outputSchema ? generateSchema(this.outputSchema) : undefined,
      query: this.queryParameter,
      tags: this.tags,
      additionalErrorCodes: this.errorStatusCodes,
    }

    return definition
  }

  getDefinition(): CommandDefinition<unknown, CommandFunction<ServiceClassType, PayloadType, ParamsType, ResultType>> {
    let definition: CommandDefinition<
      unknown,
      CommandFunction<ServiceClassType, PayloadType, ParamsType, ResultType>
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
    }

    definition = this.extendWithHttpMetadata(
      definition as CommandDefinition<
        HttpExposedServiceMeta,
        CommandFunction<ServiceClassType, PayloadType, ParamsType, ResultType>
      >,
    )

    return definition
  }
}
