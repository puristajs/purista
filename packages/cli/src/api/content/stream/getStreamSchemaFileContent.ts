import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase } from '../../change-case.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

export const getStreamSchemaFileContent = (input: {
	serviceName: string
	serviceVersion: string
	streamName: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const schemaPrefix = camelCase(`${input.serviceName} v${input.serviceVersion} ${input.streamName}`)

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
		`export const ${schemaPrefix}ChunkPayloadSchema = extendApi(z.unknown(), { title: 'chunk payload schema' })`,
	)
	writer.blankLine()
	writer.writeLine(
		`export const ${schemaPrefix}FinalPayloadSchema = extendApi(z.void(), { title: 'final payload schema' })`,
	)

	return writer.toString()
}
