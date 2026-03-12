import type { SchemaObject } from 'openapi3-ts/oas31'
import type { QueryParameter } from '../../HttpServer/types/QueryParameter.js'
import type { SupportedHttpMethod } from '../../HttpServer/types/SupportedHttpMethod.js'
import type { ContentType } from '../ContentType.js'
import type { StatusCode } from '../StatusCode.enum.js'

export type StreamDefinitionMetadataBase = {
	expose: {
		contentTypeRequest?: ContentType
		contentEncodingRequest?: string
		contentTypeResponse?: 'text/event-stream' | 'application/json'
		contentEncodingResponse?: string
		inputPayload?: SchemaObject
		parameter?: SchemaObject
		chunkPayload?: SchemaObject
		finalPayload?: SchemaObject
		deprecated?: boolean
		http?: {
			method: SupportedHttpMethod
			path: string
			stream?: {
				protocol: string
				documentationUrl?: string
				mode?: 'stream' | 'aggregate'
			}
			openApi?: {
				isSecure: boolean
				description: string
				summary: string
				tags?: string[]
				query?: QueryParameter<Record<string, unknown>>[]
				additionalStatusCodes?: StatusCode[]
				operationId?: string
			}
		}
	}
}
