import type { CommandDefinitionMetadataBase, EmptyObject, Prettify, StatusCode } from '../../index.js'
import type { QueryParameter } from './QueryParameter.js'

export type HttpExposedServiceMeta<ParameterType = EmptyObject> = Prettify<
	CommandDefinitionMetadataBase & {
		expose: {
			http: {
				method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
				path: string
				openApi?: {
					isSecure: boolean
					description: string
					summary: string
					tags?: string[]
					query?: QueryParameter<ParameterType>[]
					additionalStatusCodes?: StatusCode[]
					operationId?: string
				}
			}
		}
	}
>
