import { camelCase, pascalCase } from 'change-case'
import CodeBlockWriter from 'code-block-writer'
import type { Options } from 'code-block-writer'
import type { PuristaConfig } from 'src/api/loadPuristaConfig.js'

export const getSubscriptionTypeFileContent = (input: {
	serviceName: string
	serviceVersion: string
	subscriptionName: string
	responseEventName?: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const addSuccessEvent = !!input.responseEventName?.trim()
	const writer = new CodeBlockWriter(input.codeWriterOptions)

	const schemaPrefix = camelCase(`${input.serviceName} v${input.serviceVersion} ${input.subscriptionName}`)
	const typePrefix = pascalCase(schemaPrefix)

	writer.writeLine(`import type { z } from 'zod'`)
	writer.blankLine()
	writer
		.write('import type ')
		.block(() => {
			writer.writeLine(`${schemaPrefix}InputPayloadSchema,`)
			if (addSuccessEvent) {
				writer.writeLine(`${schemaPrefix}OutputPayloadSchema,`)
			}
		})
		.write(`from './schema.js'`)
	writer.blankLine()

	writer.writeLine(`export type ${typePrefix}InputPayload = z.input<typeof ${schemaPrefix}InputPayloadSchema>`)
	if (addSuccessEvent) {
		writer.blankLine()
		writer.writeLine(`export type ${typePrefix}OutputPayload = z.output<typeof ${schemaPrefix}OutputPayloadSchema>`)
	}

	return writer.toString()
}
