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

	writer.writeLine(`import { afterEach, beforeEach, describe, expect, test } from '${testLib}'`)
	writer.writeLine(`import { getCommandMessageMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'`)
	writer.writeLine(`import { createSandbox } from 'sinon'`)
	writer.blankLine()
	writer.writeLine(`import { ${serviceName} } from '../../${serviceFileName}.js'`)
	writer.writeLine(`import { ${streamBuilderName} } from './${streamBuilderFileName}.js'`)
	writer.writeLine(
		`import type { ${typePrefix}ChunkPayload, ${typePrefix}FinalPayload, ${typePrefix}InputParameter, ${typePrefix}InputPayload } from './types.js'`,
	)
	writer.blankLine()

	writer
		.write(
			`describe('service ${capitalCase(input.serviceName)} version ${input.serviceVersion} - stream ${streamFunctionName}',() => `,
		)
		.block(() => {
			writer.writeLine('let sandbox = createSandbox()')
			writer
				.write('beforeEach(() =>')
				.inlineBlock(() => {
					writer.writeLine('sandbox = createSandbox()')
				})
				.write(')')
			writer.blankLine()
			writer
				.write('afterEach(() =>')
				.inlineBlock(() => {
					writer.writeLine('sandbox.restore()')
				})
				.write(')')
			writer.blankLine()
			writer
				.write(`test('does not throw', async () => `)
				.inlineBlock(() => {
					writer
						.write(`const service = await ${serviceName}.getInstance(getEventBridgeMock(sandbox).mock,`)
						.inlineBlock(() => {
							writer.writeLine('logger: getLoggerMock(sandbox).mock,')
						})
						.write(')')
					writer.blankLine()
					writer.writeLine(`const ${streamFunctionName} = safeBind(${streamBuilderName}.getStreamFunction(), service)`)
					writer.blankLine()
					writer.writeLine(`const payload: ${typePrefix}InputPayload = undefined`)
					writer.blankLine()
					writer.writeLine(`const parameter: ${typePrefix}InputParameter = {}`)
					writer.blankLine()
					writer.writeLine('const write = sandbox.stub().resolves()')
					writer.writeLine('const close = sandbox.stub().resolves()')
					writer.writeLine('const fail = sandbox.stub().resolves()')
					writer.blankLine()
					writer.writeLine('const writer = {')
					writer.withIndentationLevel(1, () => {
						writer.writeLine('cancelled: false,')
						writer.writeLine(`write: write as (chunk: ${typePrefix}ChunkPayload) => Promise<void>,`)
						writer.writeLine(`close: close as (final?: ${typePrefix}FinalPayload) => Promise<void>,`)
						writer.writeLine('fail,')
						writer.writeLine('onCancel: (_cb: (reason?: string) => void) => {},')
					})
					writer.writeLine('}')
					writer.blankLine()
					writer.writeLine('const message = getCommandMessageMock(payload)')
					writer.writeLine(
						'const context = { resources: service.resources, message, service: {}, stream: {}, emit: sandbox.stub() }',
					)
					writer.blankLine()
					writer.writeLine(
						`const result = await ${streamFunctionName}(context as never, payload, parameter, writer as never)`,
					)
					writer.blankLine()
					writer.writeLine('expect(result).toBeUndefined()')
					writer.writeLine('expect(fail.called).toBe(false)')
				})
				.write(')')
		})
		.write(')')

	return writer.toString()
}
