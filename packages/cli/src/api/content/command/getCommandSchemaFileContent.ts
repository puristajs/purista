import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase } from '../../change-case.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

/** Generate the schema module for a command's parameter, payload, and output. */
export const getCommandSchemaFileContent = (input: {
	serviceName: string
	serviceVersion: string
	commandName: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)

	const schemaPrefix = camelCase(`${input.serviceName} v${input.serviceVersion} ${input.commandName}`)

	writer.writeLine(`import { extendApi } from '@purista/core'`)
	writer.writeLine(`import { z } from 'zod'`)
	writer.blankLine()
	writer.writeLine(
		`export const ${schemaPrefix}InputParameterSchema = extendApi(z.object({}), { title: 'input parameter schema' })`,
	)
	writer.blankLine()
	writer.writeLine(
		`export const ${schemaPrefix}InputPayloadSchema = extendApi(z.unknown(), { title: 'input payload schema' })`,
	)
	writer.blankLine()
	writer.writeLine(
		`export const ${schemaPrefix}OutputPayloadSchema = extendApi(z.void(), { title: 'output payload schema' })`,
	)

	return writer.toString()
}
