import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase } from '../../change-case.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

export const getQueueSchemaFileContent = (input: {
	serviceName: string
	serviceVersion: string
	queueName: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)

	const schemaPrefix = camelCase(`${input.serviceName} v${input.serviceVersion} ${input.queueName} queue`)

	writer.writeLine(`import { extendApi } from '@purista/core'`)
	writer.writeLine(`import { z } from 'zod/v4'`)
	writer.blankLine()
	writer.writeLine(
		`export const ${schemaPrefix}PayloadSchema = extendApi(z.unknown(), { title: 'queue payload schema' })`,
	)
	writer.blankLine()
	writer.writeLine(
		`export const ${schemaPrefix}ParameterSchema = extendApi(z.object({}), { title: 'queue parameter schema' })`,
	)

	return writer.toString()
}
