import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase, pascalCase } from '../../change-case.js'
import { convertToProjectEventCasing } from '../../convertToProjectEventCasing.js'
import { convertToProjectFileCasing } from '../../convertToProjectFileCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'
import type { PuristaProjectInfo } from '../../scanPuristaProject.js'

/**
 * Generate a stream builder file.
 *
 * The generated builder uses `.getStreamBuilder(...)`, attaches input, chunk,
 * and final schemas, optionally sets a final event, and closes the writer in the
 * starter implementation.
 */
export const getStreamBuilderFileContent = (input: {
	serviceName: string
	serviceVersion: string
	streamName: string
	responseEventName?: string
	streamDescription: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
	puristaProject: PuristaProjectInfo
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const addFinalEvent = !!input.responseEventName?.trim()
	const template = `${input.serviceName} v${input.serviceVersion} service builder`
	const serviceBuilderName = camelCase(template)
	const serviceBuilderFileName = convertToProjectFileCasing(template, input.puristaConfig)
	const streamBuilderName = camelCase(`${input.streamName} stream builder`)
	const schemaPrefix = camelCase(`${input.serviceName} v${input.serviceVersion} ${input.streamName}`)

	writer.writeLine(`import { ${serviceBuilderName} } from '../../${serviceBuilderFileName}.js'`)

	if (addFinalEvent && input.puristaProject.eventEnumFileName.length > 0) {
		writer.writeLine(
			`import { ServiceEvent } from '../../../../${input.puristaProject.eventEnumFileName.replace('.ts', '.js')}'`,
		)
	}

	writer
		.write('import')
		.inlineBlock(() => {
			writer.writeLine(`${schemaPrefix}ChunkPayloadSchema,`)
			writer.writeLine(`${schemaPrefix}FinalPayloadSchema,`)
			writer.writeLine(`${schemaPrefix}InputParameterSchema,`)
			writer.writeLine(`${schemaPrefix}InputPayloadSchema,`)
		})
		.write(` from './schema.js'`)
	writer.blankLine()

	writer.writeLine(`export const ${streamBuilderName} = ${serviceBuilderName}`)
	writer.withIndentationLevel(1, () => {
		writer
			.write('.getStreamBuilder(')
			.quote(camelCase(input.streamName))
			.write(',')
			.quote(input.streamDescription)
			.write(')')
			.newLine()

		if (addFinalEvent) {
			const eventName = input.puristaProject.eventEnumFileName.length
				? `ServiceEvent.${pascalCase(input.responseEventName as string)}`
				: `'${convertToProjectEventCasing(input.responseEventName as string, input.puristaConfig)}'`
			writer.writeLine(`.setFinalEventName(${eventName})`)
		}

		writer.writeLine(`.addPayloadSchema(${schemaPrefix}InputPayloadSchema)`)
		writer.writeLine(`.addParameterSchema(${schemaPrefix}InputParameterSchema)`)
		writer.writeLine(`.addChunkSchema(${schemaPrefix}ChunkPayloadSchema)`)
		writer.writeLine(`.addFinalSchema(${schemaPrefix}FinalPayloadSchema)`)

		if (input.puristaConfig.linter === 'biome') {
			writer.writeLine(
				'// biome-ignore lint/complexity/useArrowFunction: use function as the this-context contains the service',
			)
		}

		writer
			.write('.setStreamFunction(async function (_context, _payload, _parameter, writer)')
			.inlineBlock(() => {
				writer.writeLine(`// implementation of the stream ${camelCase(input.streamName)} goes here`)
				writer.writeLine('await writer.close()')
			})
			.write(')')
	})

	return writer.toString()
}
