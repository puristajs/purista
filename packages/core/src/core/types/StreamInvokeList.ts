import type { Schema } from '../../schema/index.js'

export type StreamInvokeList = Record<
	string,
	Record<
		string,
		Record<
			string,
			{
				chunkSchema?: Schema
				finalSchema?: Schema
				payloadSchema?: Schema
				parameterSchema?: Schema
				validateChunk?: boolean
				validateFinal?: boolean
			}
		>
	>
>
