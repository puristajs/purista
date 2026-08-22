import type { EmptyObject } from '../../types/EmptyObject.js'

/** One declared HTTP query parameter for a command projection. */
export type QueryParameter<ParameterType = EmptyObject> = {
	required: boolean
	name: keyof ParameterType
}
