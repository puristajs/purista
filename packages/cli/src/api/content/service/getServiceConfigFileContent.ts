import { camelCase, pascalCase } from 'change-case'
import CodeBlockWriter from 'code-block-writer'
import type { Options } from 'code-block-writer'

/**
 * Generate the service config file, which contains the configuration schema and type for the service
 */
export const getServiceConfigFileContent = (input: {
	serviceName: string
	serviceVersion: string
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	writer.writeLine("import { z } from 'zod'")
	writer.newLine()
	const schemaName = camelCase(`${input.serviceName} service v${input.serviceVersion} config schema`)
	writer.writeLine(`export const ${schemaName} = z.object({})`)
	writer.newLine()
	const typeName = pascalCase(`${input.serviceName} service v${input.serviceVersion} config`)
	writer.writeLine(`export type ${typeName} = z.input<typeof ${schemaName}>`)

	return writer.toString()
}
