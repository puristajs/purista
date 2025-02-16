import { camelCase, pascalCase } from 'change-case'
import CodeBlockWriter from 'code-block-writer'
import type { Options } from 'code-block-writer'
import type { PuristaConfig } from 'src/api/loadPuristaConfig.js'
import { convertToProjectEventCasing } from '../../convertToProjectEventCasing'
import { convertToProjectFileCasing } from '../../convertToProjectFileCasing'
import type { PuristaProjectInfo } from '../../scanPuristaProject.js'

export const getSubscriptionBuilderFileContent = (input: {
	serviceName: string
	serviceVersion: string
	subscriptionName: string
	subscriptionDescription: string
	subscribeToEvent?: string
	responseEventName?: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
	puristaProject: PuristaProjectInfo
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)

	const addSuccessEvent = !!input.responseEventName?.trim()
	const addSubscriptionEvent = !!input.subscribeToEvent?.trim()

	const template = `${input.serviceName} v${input.serviceVersion} service builder`
	const serviceBuilderName = camelCase(template)
	const serviceBuilderFileName = convertToProjectFileCasing(template, input.puristaConfig)

	const subscriptionBuilderName = camelCase(`${input.subscriptionName} subscription builder`)

	const schemaPrefix = camelCase(`${input.serviceName} v${input.serviceVersion} ${input.subscriptionName}`)

	writer.writeLine(`import { ${serviceBuilderName} } from '../../${serviceBuilderFileName}.js'`)

	if (addSuccessEvent && input.puristaProject.eventEnumFileName.length > 0) {
		writer.writeLine(
			`import { ServiceEvent } from '../../../../${input.puristaProject.eventEnumFileName.replace('.ts', '.js')}'`,
		)
	}

	writer
		.write('import')
		.inlineBlock(() => {
			writer.writeLine(`${schemaPrefix}InputPayloadSchema,`)
			if (addSuccessEvent) {
				writer.writeLine(`${schemaPrefix}OutputPayloadSchema,`)
			}
		})
		.write(` from './schema.js'`)

	writer.blankLine()

	writer.writeLine(`export const ${subscriptionBuilderName} = ${serviceBuilderName}`)
	writer.withIndentationLevel(1, () => {
		writer
			.write('.getSubscriptionBuilder(')
			.quote(camelCase(input.subscriptionName))
			.write(',')
			.quote(input.subscriptionDescription)
			.write(')')
			.newLine()

		if (addSubscriptionEvent) {
			const eventName = input.puristaProject.eventEnumFileName.length
				? `ServiceEvent.${pascalCase(input.subscribeToEvent as string)}`
				: `'${convertToProjectEventCasing(input.subscribeToEvent as string, input.puristaConfig)}'`

			writer.writeLine(`.subscribeToEvent(${eventName})`)
		}

		writer.writeLine(`.addPayloadSchema(${schemaPrefix}InputPayloadSchema)`)
		if (addSuccessEvent) {
			const eventName = input.puristaProject.eventEnumFileName.length
				? `ServiceEvent.${pascalCase(input.responseEventName as string)}`
				: `'${convertToProjectEventCasing(input.responseEventName as string, input.puristaConfig)}'`

			writer.writeLine(`.addOutputSchema(${eventName},${schemaPrefix}OutputPayloadSchema)`)
		}

		if (input.puristaConfig.linter === 'biome') {
			writer.writeLine(
				'// biome-ignore lint/complexity/useArrowFunction: use function as the this-context contains the service',
			)
		}
		writer
			.write('.setSubscriptionFunction(async function (_context, _payload)')
			.inlineBlock(() => {
				writer.writeLine(`// implementation of the subscription ${camelCase(input.subscriptionName)} goes here`)
			})
			.write(')')
	})

	return writer.toString()
}
