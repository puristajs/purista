import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase, capitalCase } from '../../change-case.js'
import { convertToProjectFileCasing } from '../../convertToProjectFileCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

/** Generate a queue definition test for a generated queue builder. */
export const getQueueTestFileContent = (input: {
	serviceName: string
	serviceVersion: string
	queueName: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)

	const queueBuilderFileName = convertToProjectFileCasing(`${input.queueName} queue builder`, input.puristaConfig)
	const queueBuilderName = camelCase(`${input.queueName} queue builder`)
	const testLib = input.puristaConfig.runtime === 'bun' ? 'bun:test' : 'vitest'

	writer.writeLine(`import { describe, expect, it } from '${testLib}'`)
	writer.writeLine(`import { ${queueBuilderName} } from './${queueBuilderFileName}.js'`)
	writer.blankLine()
	writer
		.write(
			`describe('service ${capitalCase(input.serviceName)} version ${input.serviceVersion} - queue ${camelCase(input.queueName)}', () =>`,
		)
		.inlineBlock(() => {
			writer
				.write(`it('resolves queue definition', async () =>`)
				.inlineBlock(() => {
					writer.writeLine(`const definition = await ${queueBuilderName}.getDefinition()`)
					writer.writeLine(`expect(definition.queueName).toBe('${camelCase(input.queueName)}')`)
				})
				.write(')')
		})
		.write(')')

	return writer.toString()
}
