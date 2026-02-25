import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase, pascalCase } from '../../change-case.js'
import { convertToProjectEventCasing } from '../../convertToProjectEventCasing.js'
import { convertToProjectFileCasing } from '../../convertToProjectFileCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'
import type { PuristaProjectInfo } from '../../scanPuristaProject.js'

type EnqueueOption = {
	queueName: string
	importPath: string
	payloadSchemaIdentifier: string
	parameterSchemaIdentifier: string
}

export const getCommandBuilderFileContent = (input: {
	serviceName: string
	serviceVersion: string
	commandName: string
	responseEventName?: string
	commandDescription: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
	puristaProject: PuristaProjectInfo
	enqueueOptions?: EnqueueOption[]
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)

	const addSuccessEvent = !!input.responseEventName?.trim()

	const template = `${input.serviceName} v${input.serviceVersion} service builder`
	const serviceBuilderName = camelCase(template)
	const serviceBuilderFileName = convertToProjectFileCasing(template, input.puristaConfig)

	const commandBuilderName = camelCase(`${input.commandName} command builder`)

	const schemaPrefix = camelCase(`${input.serviceName} v${input.serviceVersion} ${input.commandName}`)

	writer.writeLine(`import { ${serviceBuilderName} } from '../../${serviceBuilderFileName}.js'`)

	if (input.enqueueOptions?.length) {
		const groupedImports = new Map<string, Set<string>>()
		for (const option of input.enqueueOptions) {
			const names = groupedImports.get(option.importPath) ?? new Set<string>()
			names.add(option.payloadSchemaIdentifier)
			names.add(option.parameterSchemaIdentifier)
			groupedImports.set(option.importPath, names)
		}
		for (const [modulePath, names] of groupedImports) {
			const filteredNames = Array.from(names).filter(Boolean)
			if (filteredNames.length === 0) {
				continue
			}
			writer.writeLine(`import { ${filteredNames.join(', ')} } from '${modulePath.replace(/\.ts$/, '.js')}'`)
		}
	}

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
		if (input.enqueueOptions?.length) {
			for (const option of input.enqueueOptions) {
				writer.writeLine(
					`.canEnqueue('${option.queueName}', ${option.payloadSchemaIdentifier}, ${option.parameterSchemaIdentifier})`,
				)
			}
		}

		if (input.puristaConfig.linter === 'biome') {
			writer.writeLine(
				'// biome-ignore lint/complexity/useArrowFunction: use function as the this-context contains the service',
			)
		}
		writer.write('.setCommandFunction(async function (context, payload, parameter)')
		writer.inlineBlock(() => {
			writer.writeLine(`// implementation of the command ${camelCase(input.commandName)} goes here`)
			if (input.enqueueOptions?.length) {
				writer.writeLine('// enqueue asynchronous work if needed')
				for (const option of input.enqueueOptions) {
					writer.writeLine(`await context.queue.enqueue.${camelCase(option.queueName)}(payload, parameter)`)
				}
			}
		})
		writer.write(')')
	})

	return writer.toString()
}
