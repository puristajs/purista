import CodeBlockWriter from 'code-block-writer'
import type { Options } from 'code-block-writer'
import { camelCase, pascalCase } from '../../change-case.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

export const getCommandTypeFileContent = (input: {
	serviceName: string
	serviceVersion: string
	commandName: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)

	const schemaPrefix = camelCase(`${input.serviceName} v${input.serviceVersion} ${input.commandName}`)
	const typePrefix = pascalCase(schemaPrefix)

	writer.writeLine(`import type { z } from 'zod'`)
	writer.blankLine()
	writer
		.write('import type ')
		.block(() => {
			writer.writeLine(`${schemaPrefix}InputParameterSchema,`)
			writer.writeLine(`${schemaPrefix}InputPayloadSchema,`)
			writer.writeLine(`${schemaPrefix}OutputPayloadSchema,`)
		})
		.write(`from './schema.js'`)
	writer.blankLine()

	writer.writeLine(`export type ${typePrefix}InputParameter = z.input<typeof ${schemaPrefix}InputParameterSchema>`)
	writer.blankLine()

	writer.writeLine(`export type ${typePrefix}InputPayload = z.input<typeof ${schemaPrefix}InputPayloadSchema>`)
	writer.blankLine()
	writer.writeLine(`export type ${typePrefix}OutputPayload = z.output<typeof ${schemaPrefix}OutputPayloadSchema>`)

	return writer.toString()
}
