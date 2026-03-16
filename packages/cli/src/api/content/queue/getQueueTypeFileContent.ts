import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase, pascalCase } from '../../change-case.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

export const getQueueTypeFileContent = (input: {
	serviceName: string
	serviceVersion: string
	queueName: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)

	const schemaPrefix = camelCase(`${input.serviceName} v${input.serviceVersion} ${input.queueName} queue`)
	const typePrefix = pascalCase(schemaPrefix)

	writer.writeLine(`import type { z } from 'zod'`)
	writer.blankLine()
	writer
		.write('import type ')
		.block(() => {
			writer.writeLine(`${schemaPrefix}ParameterSchema,`)
			writer.writeLine(`${schemaPrefix}PayloadSchema,`)
		})
		.write(` from './schema.js'`)
	writer.blankLine()
	writer.writeLine(`export type ${typePrefix}Parameter = z.input<typeof ${schemaPrefix}ParameterSchema>`)
	writer.blankLine()
	writer.writeLine(`export type ${typePrefix}Payload = z.input<typeof ${schemaPrefix}PayloadSchema>`)

	return writer.toString()
}
