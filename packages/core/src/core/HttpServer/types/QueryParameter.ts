export type QueryParameter<ParameterType = {}> = {
	required: boolean
	name: keyof ParameterType
}
