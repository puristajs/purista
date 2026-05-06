import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase, capitalCase, pascalCase } from '../../change-case.js'
import { convertToProjectFileCasing } from '../../convertToProjectFileCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

export const getStreamTestFileContent = (input: {
	serviceName: string
	serviceVersion: string
	streamName: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const serviceTemplate = `${input.serviceName} v${input.serviceVersion} service`
	const serviceFileName = convertToProjectFileCasing(serviceTemplate, input.puristaConfig)
	const serviceName = camelCase(serviceTemplate)
	const streamBuilderFileName = convertToProjectFileCasing(`${input.streamName} stream builder`, input.puristaConfig)
	const streamBuilderName = camelCase(`${input.streamName} stream builder`)
	const typePrefix = pascalCase(`${input.serviceName} v${input.serviceVersion} ${input.streamName}`)
	const streamFunctionName = camelCase(input.streamName)
	const testLib = input.puristaConfig.runtime === 'bun' ? 'bun:test' : 'vitest'

	writer.writeLine(`import { describe, expect, test } from '${testLib}'`)
	writer.writeLine(`import { createStreamTestHarness } from '@purista/core'`)
	writer.blankLine()
	writer.writeLine(`import { ${serviceName} } from '../../${serviceFileName}.js'`)
	writer.writeLine(`import { ${streamBuilderName} } from './${streamBuilderFileName}.js'`)
	writer.writeLine(
		`import type { ${typePrefix}FinalPayload, ${typePrefix}InputParameter, ${typePrefix}InputPayload } from './types.js'`,
	)
	writer.blankLine()

	writer
		.write(
			`describe('service ${capitalCase(input.serviceName)} version ${input.serviceVersion} - stream ${streamFunctionName}',() => `,
		)
		.block(() => {
			writer
				.write(`test('streams frames through the runtime harness', async () => `)
				.inlineBlock(() => {
					writer.writeLine(`const payload: ${typePrefix}InputPayload = undefined`)
					writer.blankLine()
					writer.writeLine(`const parameter: ${typePrefix}InputParameter = {}`)
					writer.blankLine()
					writer.writeLine(`const harness = await createStreamTestHarness(${serviceName}, ${streamBuilderName})`)
					writer.blankLine()
					writer.writeLine('try {')
					writer.withIndentationLevel(1, () => {
						writer.writeLine('const result = await harness.run({ payload, parameter })')
						writer.blankLine()
						writer.writeLine('expect(result.frames.length).toBeGreaterThan(0)')
						writer.writeLine(`expect(result.final as ${typePrefix}FinalPayload | undefined).toBeDefined()`)
					})
					writer.writeLine('} finally {')
					writer.withIndentationLevel(1, () => {
						writer.writeLine('await harness.destroy()')
					})
					writer.writeLine('}')
				})
				.write(')')
		})
		.write(')')

	return writer.toString()
}
