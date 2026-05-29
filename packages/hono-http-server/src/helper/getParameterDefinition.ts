import type { ParameterObject, SchemaObject } from 'openapi3-ts/oas31'
import { isReferenceObject } from 'openapi3-ts/oas31'

const findPathParamsRegex = /:[^:/]+/gm

/**
 * Runs the getParameterDefinition helper exported by @purista/hono-http-server.
 * Expose only schemas and metadata that are safe for clients to inspect.
 */
/**
 * Converts Hono-style route parameters such as `:id` into OpenAPI path parameters.
 */
export const getParameterDefinition = (path: string, parameterschema?: SchemaObject): ParameterObject[] => {
	const routeParams: string[] = []
	let m: RegExpExecArray | null

	while (true) {
		m = findPathParamsRegex.exec(path)
		if (m === null) {
			break
		}
		if (m.index === findPathParamsRegex.lastIndex) {
			findPathParamsRegex.lastIndex++
		}
		routeParams.push(...m.map(name => name))
	}

	return routeParams.map(pathParamName => {
		const name = pathParamName.replace('?', '').replace(':', '')
		const required = !pathParamName.endsWith('?')

		const schema = parameterschema?.properties?.[name]

		if (schema && isReferenceObject(schema)) {
			return {
				in: 'path',
				name,
				required,
				...schema,
			}
		}

		return {
			in: 'path',
			name,
			required,
			schema,
			description: schema?.description ?? schema?.title,
		}
	})
}
