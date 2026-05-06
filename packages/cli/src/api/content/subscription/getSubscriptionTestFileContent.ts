import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase, capitalCase, pascalCase } from '../../change-case.js'
import { convertToProjectFileCasing } from '../../convertToProjectFileCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

export const getSubscriptionTestFileContent = (input: {
	serviceName: string
	serviceVersion: string
	subscriptionName: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)

	const serviceTemplate = `${input.serviceName} v${input.serviceVersion} service`
	const serviceFileName = convertToProjectFileCasing(serviceTemplate, input.puristaConfig)
	const serviceName = camelCase(serviceTemplate)

	const subscriptionBuilderFileName = convertToProjectFileCasing(
		`${input.subscriptionName} subscription builder`,
		input.puristaConfig,
	)
	const subscriptionBuilderName = camelCase(`${input.subscriptionName} subscription builder`)

	const typePrefix = pascalCase(`${input.serviceName} v${input.serviceVersion} ${input.subscriptionName}`)

	const testLib = input.puristaConfig.runtime === 'bun' ? 'bun:test' : 'vitest'

	writer.writeLine(`import { afterEach, beforeEach, describe, expect, test } from '${testLib}'`)
	writer.writeLine(
		`import { createSubscriptionContextMock, getCommandSuccessMessageMock, getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'`,
	)
	writer.writeLine(`import { createSandbox } from 'sinon'`)
	writer.blankLine()
	writer.writeLine(`import { ${serviceName} } from '../../${serviceFileName}.js'`)
	writer.writeLine(`import { ${subscriptionBuilderName} } from './${subscriptionBuilderFileName}.js'`)
	writer.writeLine(`import type { ${typePrefix}InputParameter, ${typePrefix}InputPayload } from './types.js'`)
	writer.blankLine()
	writer
		.write(
			`describe('service ${capitalCase(input.serviceName)} version ${input.serviceVersion} - subscription ${camelCase(input.subscriptionName)}',() => `,
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

					writer.writeLine(
						`const ${camelCase(input.subscriptionName)} = safeBind(${subscriptionBuilderName}.getSubscriptionFunction(), service)`,
					)
					writer.blankLine()
					writer.writeLine(`const payload: ${typePrefix}InputPayload = undefined`)
					writer.blankLine()
					writer.writeLine(`const parameter: ${typePrefix}InputParameter = {}`)
					writer.blankLine()
					writer.writeLine('const message = getCommandSuccessMessageMock(payload)')
					writer.blankLine()
					writer.writeLine(`const { context } = createSubscriptionContextMock(${subscriptionBuilderName}, {`)
					writer.withIndentationLevel(1, () => {
						writer.writeLine('message,')
						writer.writeLine('sandbox,')
						writer.writeLine('resources: { ...service.resources },')
					})
					writer.writeLine('})')
					writer.blankLine()
					writer.writeLine(`const result = await ${camelCase(input.subscriptionName)}(context, payload, parameter)`)
					writer.blankLine()
					writer.writeLine('expect(result).toBe(undefined)')
				})
				.write(')')
		})
		.write(')')

	return writer.toString()
}
