import type { HttpExposedServiceMeta } from '@purista/core'
import { StatusCode } from '@purista/core'
import type { OpenApiBuilder, OperationObject, ParameterObject, ResponsesObject } from 'openapi3-ts/oas31'

import { getErrorName } from './getErrorName.js'
import { getErrorResponseSchema } from './getErrorResponseSchema.js'
import { getParameterDefinition } from './getParameterDefinition.js'
import { getQueryDefintion } from './getQueryDefintion.js'

type Config = {
  traceHeaderField?: string
}

export const addPathToOpenApi = (
  openApiBuilder: OpenApiBuilder,
  metadata: HttpExposedServiceMeta,
  path: string,
  config: Config,
) => {
  const expose = metadata.expose

  const method = expose.http.method.toLowerCase() as 'put' | 'post' | 'patch' | 'get' | 'delete'

  const requestContentType = expose.contentTypeResponse || 'application/json'
  const _requestEncodingType = expose.contentEncodingResponse || 'utf-8'

  const responseContentType = expose.contentTypeResponse || 'application/json'
  const responseEncodingType = expose.contentEncodingResponse || 'utf-8'

  const traceIdParameter: ParameterObject = {
    in: 'header',
    required: false,
    name: config.traceHeaderField || 'x-trace-id',
    schema: { type: 'string' },
    example: '022bcd32-0a7c-4635-90ce-7940d0b9793f',
    description: 'TraceID which can be used by business logic',
  }

  const traceParent: ParameterObject = {
    in: 'header',
    required: false,
    name: 'traceparent',
    schema: { type: 'string' },
    description: 'see: https://www.w3.org/TR/trace-context/#traceparent-header-field-values',
  }

  const securitySchema = Object.keys(openApiBuilder.rootDoc.components?.securitySchemes || {}).map((name) => ({
    [name]: [],
  }))

  const errorCodes: Set<StatusCode> = new Set([...(expose.http.openApi?.additionalStatusCodes || [])])

  if (expose.http.openApi?.isSecure) {
    errorCodes.add(StatusCode.Unauthorized)
  }

  if (expose.inputPayload?.type) {
    errorCodes.add(StatusCode.BadRequest)
  }

  const errArray = Array.from(errorCodes).sort((a, b) => a - b)

  errArray.forEach((code) => {
    openApiBuilder.addSchema(`error_${code}_schema`, getErrorResponseSchema(code, getErrorName(code)))
  })

  const errResponses = errArray.reduce((prev, code) => {
    return {
      ...prev,
      [`${code}`]: {
        description: getErrorName(code),
        content: {
          'application/json': {
            schema: {
              $ref: `#/components/schemas/error_${code}_schema`,
            },
          },
        },
      },
    }
  }, {} as ResponsesObject)

  const okCode = expose.outputPayload ? StatusCode.OK : StatusCode.NoContent

  const operation: OperationObject = {
    tags: expose.http.openApi?.tags,
    summary: expose.http.openApi?.summary,
    description: expose.http.openApi?.description,
    deprecated: expose.deprecated,
    operationId: expose.http.openApi?.operationId,
    security: securitySchema.length > 0 && expose.http.openApi?.isSecure ? securitySchema : [],
    parameters: [
      ...getParameterDefinition(path, expose.parameter),
      ...getQueryDefintion(expose.http.openApi?.query, expose.parameter),
      traceIdParameter,
      traceParent,
    ],
    requestBody: {
      content: {
        [requestContentType]: {
          schema: method !== 'get' ? expose.inputPayload : undefined,
        },
      },
    },
    responses: {
      [`${okCode}`]: {
        description: getErrorName(okCode),
        content: {
          [responseContentType]: {
            schema: expose.outputPayload,
            encoding: responseEncodingType,
          },
        },
      },
      ...errResponses,
    },
  }

  openApiBuilder.addPath(path, {
    [method]: operation,
  })
}
