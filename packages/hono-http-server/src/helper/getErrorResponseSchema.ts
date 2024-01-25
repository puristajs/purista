import { StatusCode } from '@purista/core'
import type { SchemaObject } from 'openapi3-ts/oas31'

const inputValidationFailed: SchemaObject = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      validation: {
        type: 'string',
        example: 'invalid_string',
      },
      code: {
        type: 'string',
        example: 'invalid_string',
      },
      message: {
        type: 'string',
        example: 'String must contain at least 3 character(s)',
      },
      expected: {
        type: 'string',
        example: 'string',
      },
      received: {
        type: 'string',
        example: 'object',
      },
      keys: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      minimum: {
        type: 'number',
        example: 3,
      },
      maximum: {
        type: 'number',
        example: 32,
      },
      path: {
        type: 'array',
        items: {
          type: 'string',
          example: 'username',
        },
      },
    },
    required: ['message', 'code'],
  },
}

export const getErrorResponseSchema = (code: StatusCode, message: string, schema?: SchemaObject): SchemaObject => {
  const obj: SchemaObject = {
    type: 'object',
    properties: {
      status: {
        type: 'number',
        minimum: 100,
        title: 'the error status code',
        example: code,
      },
      message: {
        type: 'string',
        title: 'the error message',
        example: message,
      },
      traceId: {
        type: 'string',
        title: 'trace id',
        example: 'd5dbb17eec16e3c9fce9cf8adc766999',
      },
    },
    required: ['status', 'message'],
  }

  if (schema) {
    obj.properties = {
      ...obj.properties,
      data: schema,
    }
  } else if (code === StatusCode.BadRequest) {
    obj.properties = {
      ...obj.properties,
      data: inputValidationFailed,
    }
  }

  return obj
}
