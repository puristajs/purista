import { camelCase, pascalCase } from 'change-case'
import CodeBlockWriter from 'code-block-writer'
import type { Options } from 'code-block-writer'
import { convertToProjectEventCasing } from '../../convertToProjectEventCasing'
import { convertToProjectFileCasing } from '../../convertToProjectFileCasing'
import type { PuristaConfig } from '../../loadPuristaConfig.js'
import type { PuristaProjectInfo } from '../../scanPuristaProject.js'

export const getCommandBuilderFileContent = (input: {
	serviceName: string
	serviceVersion: string
	commandName: string
	responseEventName?: string
	commandDescription: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
	puristaProject: PuristaProjectInfo
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)

	const addSuccessEvent = !!input.responseEventName?.trim()

	const template = `${input.serviceName} v${input.serviceVersion} service builder`
	const serviceBuilderName = camelCase(template)
	const serviceBuilderFileName = convertToProjectFileCasing(template, input.puristaConfig)

	const commandBuilderName = camelCase(`${input.commandName} command builder`)

	const schemaPrefix = camelCase(`${input.serviceName} v${input.serviceVersion} ${input.commandName}`)

	writer.writeLine(`import { ${serviceBuilderName} } from '../../${serviceBuilderFileName}.js'`)

	if (addSuccessEvent && input.puristaProject.eventEnumFileName.length > 0) {
		writer.writeLine(
			`import { ServiceEvent } from '../../../../${input.puristaProject.eventEnumFileName.replace('.ts', '.js')}'`,
		)
	}

	writer
		.write('import')
		.inlineBlock(() => {
			writer.writeLine(`${schemaPrefix}InputParameterSchema,`)
			writer.writeLine(`${schemaPrefix}InputPayloadSchema,`)
			writer.writeLine(`${schemaPrefix}OutputPayloadSchema,`)
		})
		.write(` from './schema.js'`)

	writer.blankLine()

	writer.writeLine(`export const ${commandBuilderName} = ${serviceBuilderName}`)
	writer.withIndentationLevel(1, () => {
		writer
			.write('.getCommandBuilder(')
			.quote(camelCase(input.commandName))
			.write(',')
			.quote(input.commandDescription)
			.write(')')
			.newLine()

		if (addSuccessEvent) {
			const eventName = input.puristaProject.eventEnumFileName.length
				? `ServiceEvent.${pascalCase(input.responseEventName as string)}`
				: `'${convertToProjectEventCasing(input.responseEventName as string, input.puristaConfig)}'`

			writer.writeLine(`.setSuccessEventName(${eventName})`)
		}
		writer.writeLine(`.addPayloadSchema(${schemaPrefix}InputPayloadSchema)`)
		writer.writeLine(`.addParameterSchema(${schemaPrefix}InputParameterSchema)`)
		writer.writeLine(`.addOutputSchema(${schemaPrefix}OutputPayloadSchema)`)

		if (input.puristaConfig.linter === 'biome') {
			writer.writeLine(
				'// biome-ignore lint/complexity/useArrowFunction: use function as the this-context contains the service',
			)
		}
		writer
			.write('.setCommandFunction(async function (_context, _payload, _parameter)')
			.inlineBlock(() => {
				writer.writeLine(`// implementation of the command ${camelCase(input.commandName)} goes here`)
			})
			.write(')')
	})

	return writer.toString()
}
