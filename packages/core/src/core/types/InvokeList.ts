import type { Schema } from '@typeschema/main'

export type InvokeList = Record<
	string,
	Record<string, Record<string, { outputSchema: Schema; payloadSchema: Schema; parameterSchema: Schema }>>
>
