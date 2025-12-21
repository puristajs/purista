import type { Schema } from '../../schema/index.js'

export type InvokeList = Record<
	string,
	Record<string, Record<string, { outputSchema?: Schema; payloadSchema?: Schema; parameterSchema?: Schema }>>
>
