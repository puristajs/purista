import type { EmptyObject } from '../../types/EmptyObject.js'

export type QueryParameter<ParameterType = EmptyObject> = {
	required: boolean
	name: keyof ParameterType
}
