import CodeBlockWriter from 'code-block-writer'
import type { Options } from 'code-block-writer'
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

	writer.writeLine(`import { getEventBridgeMock, getLoggerMock, safeBind } from '@purista/core'`)
	writer.writeLine(`import { createSandbox } from 'sinon'`)
	writer.blankLine()
	writer.writeLine(`import { ${serviceName} } from '../../${serviceFileName}.js'`)
	writer.writeLine(`import { ${subscriptionBuilderName} } from './${subscriptionBuilderFileName}.js'`)
	writer.writeLine(`import type { ${typePrefix}InputPayload } from './types.js'`)
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
					writer.writeLine(
						`const context = ${subscriptionBuilderName}.getSubscriptionContextMock({ payload, undefined, sandbox, resources: { ...service.resources } })`,
					)
					writer.blankLine()
					writer.writeLine(`const result = await ${camelCase(input.subscriptionName)}(context.mock, payload)`)
					writer.blankLine()
					writer.writeLine('expect(result).toBe(undefined)')
				})
				.write(')')
		})
		.write(')')

	return writer.toString()
}
