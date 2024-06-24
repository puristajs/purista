import type { EmptyObject } from '../../types/index.js'

export type QueryParameter<ParameterType = EmptyObject> = {
	required: boolean
	name: keyof ParameterType
}
