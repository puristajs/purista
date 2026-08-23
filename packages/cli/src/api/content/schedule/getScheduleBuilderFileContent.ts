import type { Options } from 'code-block-writer'
import CodeBlockWriter from 'code-block-writer'
import { camelCase, pascalCase } from '../../change-case.js'
import { convertToProjectEventCasing } from '../../convertToProjectEventCasing.js'
import { convertToProjectFileCasing } from '../../convertToProjectFileCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'
import type { PuristaProjectInfo } from '../../scanPuristaProject.js'

/** Generate an event-only schedule declaration for a service version. */
export const getScheduleBuilderFileContent = (input: {
	serviceName: string
	serviceVersion: string
	scheduleName: string
	scheduleDescription: string
	eventName: string
	cronExpression: string
	timezone?: string
	schedulerGroup?: string
	missedRunPolicy?: 'skip' | 'runOnce' | 'backfill'
	enabledByDefault?: boolean
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
	puristaProject: PuristaProjectInfo
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	const serviceTemplate = `${input.serviceName} v${input.serviceVersion} service builder`
	const serviceBuilderName = camelCase(serviceTemplate)
	const serviceBuilderFileName = convertToProjectFileCasing(serviceTemplate, input.puristaConfig)
	const scheduleDefinitionName = camelCase(`${input.scheduleName} schedule definition`)
	const eventName = input.puristaProject.eventEnumFileName.length
		? `ServiceEvent.${pascalCase(input.eventName)}`
		: `'${convertToProjectEventCasing(input.eventName, input.puristaConfig)}'`

	writer.writeLine(`import { ${serviceBuilderName} } from '../../${serviceBuilderFileName}.js'`)
	if (input.puristaProject.eventEnumFileName.length) {
		writer.writeLine(
			`import { ServiceEvent } from '../../../../${input.puristaProject.eventEnumFileName.replace('.ts', '.js')}'`,
		)
	}
	writer.blankLine()
	writer.writeLine(`export const ${scheduleDefinitionName} = ${serviceBuilderName}`)
	writer.withIndentationLevel(1, () => {
		writer
			.write('.getScheduleBuilder(')
			.quote(camelCase(input.scheduleName))
			.write(',')
			.quote(input.scheduleDescription)
			.write(')')
		writer.newLine()
		writer
			.write(`.emitEvent(${eventName}, `)
			.inlineBlock(() => {
				writer
					.write('expression: ')
					.inlineBlock(() => {
						writer.write("kind: 'cron', ")
						writer.write('value: ').quote(input.cronExpression)
					})
					.write(',')
				writer.newLine()
				if (input.timezone) writer.write('timezone: ').quote(input.timezone).write(',').newLine()
				writer.write(`missedRunPolicy: '${input.missedRunPolicy ?? 'skip'}',`).newLine()
				writer
					.write('schedulerGroup: ')
					.quote(input.schedulerGroup ?? 'default')
					.write(',')
					.newLine()
				writer.write(`enabledByDefault: ${input.enabledByDefault ?? true},`).newLine()
			})
			.write(')')
	})

	return writer.toString()
}
