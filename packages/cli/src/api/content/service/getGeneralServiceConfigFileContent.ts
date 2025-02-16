import { pascalCase } from 'change-case'
import CodeBlockWriter from 'code-block-writer'
import type { Options } from 'code-block-writer'

/**
 * Generate the general service configuration file content.
 */
export const getGeneralServiceConfigFileContent = (input: {
	serviceName: string
	serviceDescription: string
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)

	writer.writeLine("import type { ServiceInfoType } from '@purista/core'")
	writer.newLine()
	writer
		.writeLine(
			`export const general${pascalCase(input.serviceName)}ServiceInfo: Omit<ServiceInfoType, 'serviceVersion'> =`,
		)
		.block(() => {
			writer.write('serviceName: ')
			writer.quote(pascalCase(input.serviceName))
			writer.write(',')
			writer.newLine()
			writer.write('serviceDescription: ')
			writer.quote(input.serviceDescription)
			writer.write(',')
		})

	return writer.toString()
}
