import type { OpenAPIObject, ParameterObject, RequestBodyObject, SchemaObject } from 'openapi3-ts'
import { isReferenceObject } from 'openapi3-ts'

import { StatusCode } from '../../../core'
import { OPENAPI_DEFAULT_INFO } from '../../config'
import { Handler } from '../../types'

export const openApiHandler: Handler = async function (_request, _response, context) {
  const paths: Record<string, Record<string, unknown>> = {}

  const info = this.config.openApi?.info || OPENAPI_DEFAULT_INFO
  const servers = this.config.openApi?.servers || [{ url: `https://localhost:${this.config.port}` }]
  const components = this.config.openApi?.components
  const security = this.config.openApi?.security
  const externalDocs = this.config.openApi?.externalDocs

  const json: OpenAPIObject = {
    openapi: '3.0.3',
    info,
    servers,
    paths,
    components,
    security,
    tags: this.config.openApi?.tags,
    externalDocs,
  }

  const getErrorResponseSchema = (code: StatusCode, message: string, schema?: SchemaObject) => {
    return {
      type: 'object',

      properties: {
        status: {
          type: 'number',
          min: 100,
          title: 'the error status code',
          example: code,
        },
        message: {
          type: 'string',
          title: 'the error message',
          example: message,
        },
        data: schema,
      },
      required: ['status', 'message'],
    }
  }

  const findPathParamsRegex = /:[^:/]+/gm

  this.routeDefinitions.forEach((entry) => {
    const definition = entry.expose.http

    let m
    let routeParams: string[] = []
    while ((m = findPathParamsRegex.exec(definition.path)) !== null) {
      if (m.index === findPathParamsRegex.lastIndex) {
        findPathParamsRegex.lastIndex++
      }

      routeParams = m.map((name) => name)
    }

    const pathParams: Record<string, unknown>[] = routeParams.map((pathParamName): ParameterObject => {
      const name = pathParamName.replace('?', '').replace(':', '')
      const required = !pathParamName.endsWith('?')

      const schema = definition.openApi?.parameter?.properties?.[name]

      if (!schema) {
        this.log.warn(
          `${definition.method} ${definition.path}: Path parameter ${name} is not in parameter schema and will not be available in service function`,
        )
      }

      if (!!schema && isReferenceObject(schema)) {
        return {
          in: 'path',
          name,
          required,
          ...schema,
        }
      }

      return {
        in: 'path',
        name,
        required,
        schema,
        description: schema?.description || schema?.title,
      }
    })

    const queryParams =
      definition.openApi?.query?.map((queryParam): ParameterObject => {
        const name = queryParam.name
        const schema = definition.openApi?.parameter?.properties?.[name]
        const required = queryParam.required

        if (!schema) {
          this.log.warn(
            `${definition.method} ${definition.path}: Query parameter ${name} is not in parameter schema and will not be available in service function`,
          )
        }

        if (!!schema && isReferenceObject(schema)) {
          return {
            in: 'query',
            name,
            required,
            ...schema,
          }
        }

        return {
          in: 'query',
          name,
          required,
          schema,
          description: schema?.description || schema?.title,
        }
      }) || []

    let path = definition.path
    routeParams.forEach((pathParamName) => {
      const name = pathParamName.replace('?', '').replace(':', '')
      path = path.replace(pathParamName, `{${name}}`)
    })

    let requestBody: RequestBodyObject | undefined

    if (['POST', 'PATCH', 'PUT'].includes(definition.method)) {
      requestBody = {
        content: {
          [definition.contentType || 'application/json']: {
            schema: definition.openApi?.inputPayload,
          },
        },
      }
    }

    const inputValidationFailed: SchemaObject = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          validation: {
            type: 'string',
          },
          code: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
          path: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    }

    const errorResponses: Record<number, unknown> = {}

    const getErrorName = (code: StatusCode) => StatusCode[code].replace(/[A-Z]/g, (letter) => ` ${letter}`)

    if (definition.openApi?.inputPayload) {
      errorResponses[400] = {
        description: getErrorName(400),
        content: {
          'application/json': {
            schema: getErrorResponseSchema(400, 'input validation failed', inputValidationFailed),
          },
        },
      }
    }

    if (definition.openApi?.parameter) {
      errorResponses[404] = {
        description: getErrorName(404),
        content: {
          'application/json': {
            schema: getErrorResponseSchema(404, 'ressource for given id does not exist'),
          },
        },
      }
    }

    definition.openApi?.additionalStatusCodes?.forEach((code) => {
      errorResponses[code] = {
        description: getErrorName(code),
        content: {
          'application/json': {
            schema: getErrorResponseSchema(code, getErrorName(code)),
          },
        },
      }
    })

    paths[path] = {
      ...paths[path],
      [definition.method.toLowerCase()]: {
        description: definition.openApi?.description,
        summary: definition.openApi?.summary,
        parameters: [...pathParams, ...queryParams],
        tags: definition.openApi?.tags,
        requestBody,
        responses: {
          [definition.openApi?.outputPayload ? 200 : 204]: {
            description: definition.openApi?.description,
            content: {
              [definition.contentType || 'application/json']: {
                schema: definition.openApi?.outputPayload,
              },
            },
          },
          ...errorResponses,
        },
      },
    }
  })

  context.headers['content-type'] = 'application/json'
  context.payload = json

  return context
}
