import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase, pascalCase } from '../../change-case.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

export const getStreamTypeFileContent = (input: {
	serviceName: string
	serviceVersion: string
	streamName: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const schemaPrefix = camelCase(`${input.serviceName} v${input.serviceVersion} ${input.streamName}`)
	const typePrefix = pascalCase(schemaPrefix)

	writer.writeLine(`import type { z } from 'zod/v4'`)
	writer.blankLine()
	writer
		.write('import type ')
		.block(() => {
			writer.writeLine(`${schemaPrefix}ChunkPayloadSchema,`)
			writer.writeLine(`${schemaPrefix}FinalPayloadSchema,`)
			writer.writeLine(`${schemaPrefix}InputParameterSchema,`)
			writer.writeLine(`${schemaPrefix}InputPayloadSchema,`)
		})
		.write(`from './schema.js'`)
	writer.blankLine()
	writer.writeLine(`export type ${typePrefix}InputParameter = z.input<typeof ${schemaPrefix}InputParameterSchema>`)
	writer.blankLine()
	writer.writeLine(`export type ${typePrefix}InputPayload = z.input<typeof ${schemaPrefix}InputPayloadSchema>`)
	writer.blankLine()
	writer.writeLine(`export type ${typePrefix}ChunkPayload = z.input<typeof ${schemaPrefix}ChunkPayloadSchema>`)
	writer.blankLine()
	writer.writeLine(`export type ${typePrefix}FinalPayload = z.output<typeof ${schemaPrefix}FinalPayloadSchema>`)

	return writer.toString()
}
