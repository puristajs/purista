import type { HttpExposedServiceMeta } from '../core/index.js'
import { schemaObjectToTsType } from '../helper/schemaObjectToTsType/transform.js'
import { convertToPascalCase } from '../helper/string/convertToPascalCase.impl.js'
import { getWriter } from './getWriter.impl.js'

export const metaToFunctionHttp = (
	serviceName: string,
	serviceVersion: string,
	functionName: string,
	meta: HttpExposedServiceMeta,
): {
	functionString: string
	typeString: string
} => {
	const codeWriter = getWriter()
	const typeWriter = getWriter()

	const typeNamePrefix = `${convertToPascalCase(serviceName)}V${convertToPascalCase(serviceVersion)}${convertToPascalCase(functionName)}`

	const pathParams: { name: string; required: boolean }[] = []
	const path = `\`v${serviceVersion}/${meta.expose.http.path
		.split('/')
		.map(part => {
			if (!part.startsWith(':')) {
				return part
			}
			const name = part.slice(1).replace('?', '')
			pathParams.push({ name, required: !part.endsWith('?') })
			return `\${parameter.${name} ?? '' }`
		})
		.join('/')}\``

	const queries = meta.expose.http.openApi?.query

	const params: {
		name: string
		required: boolean
	}[] = [...pathParams]

	if (queries) {
		for (const query of queries) {
			params.push(query)
		}
	}

	let fnParamString = ''

	if (params.length) {
		const hasRequired = params.some(entry => entry.required)

		fnParamString = `parameter${hasRequired ? '' : '?'}: ClientType.${typeNamePrefix}ParameterType`

		typeWriter
			.blankLine()
			.write(`export type ${typeNamePrefix}ParameterType = `)
			.block(() => {
				for (const param of params) {
					typeWriter.writeLine(`${param.name}${param.required ? '' : '?'}: string,`)
				}
			})
	}

	let returnType = 'void'
	if (meta.expose.outputPayload) {
		const typeFromSchema = schemaObjectToTsType(meta.expose.outputPayload)

		const genType = typeFromSchema.trim().toLowerCase()

		if (genType !== 'undefined' && genType !== 'void') {
			returnType = `${typeNamePrefix}ReturnType`
			typeWriter
				.blankLine()
				.writeLine(`/** ${functionName} return type of ${serviceName} version ${serviceVersion} */`)
				.writeLine(`export type ${returnType} = ${typeFromSchema}`)
		}
	}

	let hasPayload = ['post', 'patch', 'put', 'delete'].includes(meta.expose.http.method.toLocaleLowerCase())

	let payloadType = 'unknown'
	const payloadTypeName = `${typeNamePrefix}PayloadType`
	if (hasPayload) {
		if (meta.expose.inputPayload) {
			payloadType = schemaObjectToTsType(meta.expose.inputPayload)

			const genType = payloadType.trim().toLowerCase()
			if (genType === 'undefined' || genType === 'void') {
				hasPayload = false
			}
		}

		typeWriter
			.blankLine()
			.writeLine(`/** ${functionName} payload type of ${serviceName} version ${serviceVersion} */`)
			.writeLine(`export type ${payloadTypeName} = ${payloadType}`)
	}

	const writeOptions = () => {
		for (const query of queries ?? []) {
			codeWriter.writeLine(
				`if(parameter${query.required ? '' : '?'}.${query.name}) { options.query['${query.name}'] = parameter.${query.name}}`,
			)
		}

		codeWriter
			.blankLine()
			.write('options.headers = ')
			.block(() => {
				codeWriter.writeLine(
					`'Content-Type': '${meta.expose.contentTypeRequest ?? 'application/json'}; ${meta.expose.contentEncodingRequest ?? 'utf-8'}',`,
				)
			})
	}

	if (hasPayload) {
		const addParameters = fnParamString === '' ? '' : `, ${fnParamString}`
		codeWriter
			.write(`async (payload: ClientType.${payloadTypeName}${addParameters}): Promise<ClientType.${returnType}> =>`)
			.block(() => {
				codeWriter.writeLine('const options = { query: {}, headers: {} } satisfies ClientType.HttpClientRequestOptions')
				writeOptions()
				codeWriter.write(
					`return this.__execute__('${meta.expose.http.method.toLocaleLowerCase()}', ${path}, options, payload)`,
				)
			})
	} else {
		codeWriter.write(`async (${fnParamString}): Promise<ClientType.${returnType}> =>`).block(() => {
			codeWriter.writeLine('const options = { query: {}, headers: {} } satisfies ClientType.HttpClientRequestOptions')
			writeOptions()
			codeWriter.write(
				`return this.__execute__('${meta.expose.http.method.toLocaleLowerCase()}', ${path}, options, undefined)`,
			)
		})
	}

	return {
		functionString: codeWriter.toString(),
		typeString: typeWriter.toString(),
	}
}
