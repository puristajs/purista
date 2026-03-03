import type { ServiceClass } from '../ServiceClass.js'
import type { StreamDefinition } from './StreamDefinition.js'
import type { StreamDefinitionMetadataBase } from './StreamDefinitionMetadataBase.js'

export type StreamDefinitionList<S extends ServiceClass> = Promise<
	StreamDefinition<S, any, any, any, any, any, any, any, any, any, any, StreamDefinitionMetadataBase>
>[]

export type StreamDefinitionListResolved<S extends ServiceClass> = StreamDefinition<
	S,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	StreamDefinitionMetadataBase
>[]
