import type { CommandDefinitionMetadataBase } from '../core/index.js'
import { schemaObjectToTsType } from '../helper/schemaObjectToTsType/transform.js'
import { convertToPascalCase } from '../helper/string/convertToPascalCase.impl.js'
import { getWriter } from './getWriter.impl.js'

export const metaToFunctionBridge = (
	serviceName: string,
	serviceVersion: string,
	functionName: string,
	meta: CommandDefinitionMetadataBase,
	clientName: string,
): {
	functionString: string
	typeString: string
} => {
	const codeWriter = getWriter()
	const typeWriter = getWriter()

	const typeNamePrefix = `${convertToPascalCase(serviceName)}V${convertToPascalCase(serviceVersion)}${convertToPascalCase(functionName)}`

	const parameterType = meta.expose.parameter ? schemaObjectToTsType(meta.expose.parameter) : '{}'
	const payloadType = meta.expose.inputPayload ? schemaObjectToTsType(meta.expose.inputPayload) : 'unknown'
	const resposeType = meta.expose.outputPayload ? schemaObjectToTsType(meta.expose.outputPayload) : 'unknown'

	typeWriter
		.blankLine()
		.writeLine(`/** ${functionName} parameter type of ${serviceName} version ${serviceVersion} */`)
		.writeLine(`export type ${typeNamePrefix}ParameterType = ${parameterType}`)
		.blankLine()
		.writeLine(`/** ${functionName} payload type of ${serviceName} version ${serviceVersion} */`)
		.writeLine(`export type ${typeNamePrefix}PayloadType = ${payloadType}`)
		.blankLine()
		.writeLine(`/** ${functionName} return type of ${serviceName} version ${serviceVersion} */`)
		.writeLine(`export type ${typeNamePrefix}ResposeType = ${resposeType}`)

	codeWriter
		.writeLine(
			`async (payload: ClientType.${typeNamePrefix}PayloadType, parameter: ClientType.${typeNamePrefix}ParameterType, options?: ClientType.InvokeOptions) => `,
		)
		.block(() => {
			codeWriter
				.write(`return this.__eventBridge__.invoke<ClientType.${typeNamePrefix}ResposeType>(`)
				.block(() => {
					codeWriter
						.write('sender:')
						.inlineBlock(() => {
							codeWriter
								.writeLine(`serviceName: '${clientName}',`)
								.writeLine(`serviceVersion: '1',`)
								.writeLine(`serviceTarget: '__client_invoke__',`)
								.writeLine('instanceId: this.__eventBridge__.instanceId,')
						})
						.write(', receiver:')
						.inlineBlock(() => {
							codeWriter
								.writeLine(`serviceName: '${serviceName}',`)
								.writeLine(`serviceVersion: '${serviceVersion}',`)
								.writeLine(`serviceTarget: '${functionName}',`)
						})
						.write(', payload: ')
						.block(() => {
							codeWriter.writeLine('payload,').writeLine('parameter,')
						})
						.writeLine(`, contentType: '${meta.expose.contentTypeRequest}',`)
						.writeLine(`contentEncoding: '${meta.expose.contentEncodingRequest}',`)
						.writeLine('...options,')
				})
				.write(')')
		})

	return {
		functionString: codeWriter.toString(),
		typeString: typeWriter.toString(),
	}
}
