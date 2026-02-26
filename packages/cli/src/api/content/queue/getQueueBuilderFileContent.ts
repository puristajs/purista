import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase } from '../../change-case.js'
import { convertToProjectFileCasing } from '../../convertToProjectFileCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

export const getQueueBuilderFileContent = (input: {
	serviceName: string
	serviceVersion: string
	queueName: string
	queueDescription: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)

	const template = `${input.serviceName} v${input.serviceVersion} service builder`
	const serviceBuilderName = camelCase(template)
	const serviceBuilderFileName = convertToProjectFileCasing(template, input.puristaConfig)

	const queueBuilderName = camelCase(`${input.queueName} queue builder`)
	const schemaPrefix = camelCase(`${input.serviceName} v${input.serviceVersion} ${input.queueName} queue`)

	writer.writeLine(`import { ${serviceBuilderName} } from '../../${serviceBuilderFileName}.js'`)
	writer.writeLine('import {')
	writer.indent(() => {
		writer.writeLine(`${schemaPrefix}PayloadSchema,`)
		writer.writeLine(`${schemaPrefix}ParameterSchema,`)
	})
	writer.writeLine(`} from './schema.js'`)
	writer.blankLine()

	writer.writeLine(`export const ${queueBuilderName} = ${serviceBuilderName}`)
	writer.indent(() => {
		writer
			.write('.getQueueBuilder(')
			.quote(camelCase(input.queueName))
			.write(',')
			.quote(input.queueDescription)
			.write(')')
			.newLine()
		writer.writeLine(`.addPayloadSchema(${schemaPrefix}PayloadSchema)`)
		writer.writeLine(`.addParameterSchema(${schemaPrefix}ParameterSchema)`)
		if (input.puristaConfig.linter === 'biome') {
			writer.writeLine(
				'// biome-ignore lint/complexity/useArrowFunction: handler relies on service context `this` binding',
			)
		}
		writer
			.write('.setBeforeEnqueueTransform(async function (_context, payload, parameter)')
			.inlineBlock(() => {
				writer.writeLine('// normalize queue payload before persisting if needed')
				writer.writeLine('return { payload, parameter }')
			})
			.write(')')
	})

	return writer.toString()
}
