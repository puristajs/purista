import { camelCase } from 'change-case'
import CodeBlockWriter from 'code-block-writer'
import type { Options } from 'code-block-writer'
import type { PuristaConfig } from 'src/api/loadPuristaConfig.js'

export const getSubscriptionSchemaFileContent = (input: {
	serviceName: string
	serviceVersion: string
	subscriptionName: string
	puristaConfig: PuristaConfig
	responseEventName?: string
	codeWriterOptions?: Partial<Options>
}) => {
	const addSuccessEvent = !!input.responseEventName?.trim()
	const writer = new CodeBlockWriter(input.codeWriterOptions)

	const schemaPrefix = camelCase(`${input.serviceName} v${input.serviceVersion} ${input.subscriptionName}`)

	writer.writeLine(`import { extendApi } from '@purista/core'`)
	writer.writeLine(`import { z } from 'zod'`)
	writer.blankLine()
	writer.writeLine(
		`export const ${schemaPrefix}InputPayloadSchema = extendApi(z.any(), { title: 'input payload schema' })`,
	)

	if (addSuccessEvent) {
		writer.blankLine()
		writer.writeLine(
			`export const ${schemaPrefix}OutputPayloadSchema = extendApi(z.unknown(), { title: 'output payload schema' })`,
		)
	}

	return writer.toString()
}
