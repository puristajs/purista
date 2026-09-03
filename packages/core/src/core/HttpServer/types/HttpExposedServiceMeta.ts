import type { CommandDefinitionMetadataBase } from '../../types/commandType/CommandDefinitionMetadataBase.js'
import type { EmptyObject } from '../../types/EmptyObject.js'
import type { Prettify } from '../../types/Prettify.js'
import type { StatusCode } from '../../types/StatusCode.enum.js'

import type { QueryParameter } from './QueryParameter.js'

export type HttpExposedServiceMeta<ParameterType = EmptyObject> = Prettify<
	CommandDefinitionMetadataBase & {
		expose: {
			http: {
				method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
				path: string
				mode?: 'sync' | 'async'
				stream?: {
					protocol: string
					documentationUrl?: string
					mode?: 'stream' | 'aggregate'
					/** Static response headers required by the declared stream protocol. */
					responseHeaders?: Readonly<Record<string, string>>
				}
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
