import { camelCase } from 'change-case'
import CodeBlockWriter from 'code-block-writer'
import type { Options } from 'code-block-writer'
import { convertToProjectFileCasing } from 'src/api/convertToProjectFileCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

/**
 * Generate the service file content for a given service name and version.
 */
export const getServiceFileContent = (input: {
	serviceName: string
	serviceVersion: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const serviceBuilderFileName = convertToProjectFileCasing(
		`${input.serviceName} v${input.serviceVersion} service builder`,
		input.puristaConfig,
	)
	const serviceBuilderName = camelCase(`${input.serviceName} v${input.serviceVersion} service builder`)
	const serviceName = camelCase(`${input.serviceName} v${input.serviceVersion} service`)

	const writer = new CodeBlockWriter(input.codeWriterOptions)
	writer.writeLine(`import { ${serviceBuilderName} } from './${serviceBuilderFileName}.js'`)
	writer.blankLine()
	writer.writeLine(
		`const commandDefinitions: Parameters<typeof ${serviceBuilderName}['addCommandDefinition']>[0][] = []`,
	)
	writer.blankLine()
	writer.writeLine(
		`const subscriptionDefinitions: Parameters<typeof ${serviceBuilderName}['addSubscriptionDefinition']>[0][] = []`,
	)
	writer.writeLine(`export const ${serviceName} = ${serviceBuilderName}`)
	writer.withIndentationLevel(1, () => {
		writer.writeLine('.addCommandDefinition(...commandDefinitions)')
		writer.writeLine('.addSubscriptionDefinition(...subscriptionDefinitions)')
	})

	return writer.toString()
}
