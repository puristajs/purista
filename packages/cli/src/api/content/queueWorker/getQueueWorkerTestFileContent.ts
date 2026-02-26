import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase, capitalCase } from '../../change-case.js'
import { convertToProjectFileCasing } from '../../convertToProjectFileCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

export const getQueueWorkerTestFileContent = (input: {
	serviceName: string
	serviceVersion: string
	workerName: string
	queueName: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)

	const workerBuilderFileName = convertToProjectFileCasing(
		`${input.workerName} queue worker builder`,
		input.puristaConfig,
	)
	const workerBuilderName = camelCase(`${input.workerName} queue worker builder`)
	const testLib = input.puristaConfig.runtime === 'bun' ? 'bun:test' : 'vitest'

	writer.writeLine(`import { describe, expect, it } from '${testLib}'`)
	writer.writeLine(`import { ${workerBuilderName} } from './${workerBuilderFileName}.js'`)
	writer.blankLine()
	writer
		.write(
			`describe('service ${capitalCase(input.serviceName)} version ${input.serviceVersion} - queue worker ${camelCase(input.workerName)}', () =>`,
		)
		.inlineBlock(() => {
			writer
				.write(`it('resolves worker definition', async () =>`)
				.inlineBlock(() => {
					writer.writeLine(`const definition = await ${workerBuilderName}.getDefinition()`)
					writer.writeLine(`expect(definition.queueName).toBe('${camelCase(input.queueName)}')`)
					writer.writeLine(`expect(definition.name).toBe('${camelCase(input.workerName)}')`)
				})
				.write(')')
		})
		.write(')')

	return writer.toString()
}
