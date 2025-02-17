import CodeBlockWriter from 'code-block-writer'
import type { Options } from 'code-block-writer'
import { camelCase } from '../../change-case.js'
import { convertToProjectFileCasing } from '../../convertToProjectFileCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

/**
 * Generate the builder file, which contains the creation of the service builder.
 * This basic service builder is than used in the service file, where commands and services are added.
 * The reason for splitting up: prevent cycling dependencies, as the command and subscription builders are created by this service builder.
 */
export const getServiceBuilderFileContent = (input: {
	serviceName: string
	serviceVersion: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)
	writer.writeLine("import type { ServiceInfoType } from '@purista/core'")
	writer.writeLine("import { ServiceBuilder } from '@purista/core'")
	writer.newLine()

	const generalServiceInfoName = camelCase(`general ${input.serviceName} service info`)
	const serviceConfigSchema = camelCase(`${input.serviceName} service v${input.serviceVersion} config schema`)

	const generalServiceInfoFileName = convertToProjectFileCasing(
		`general ${input.serviceName} service info`,
		input.puristaConfig,
	)
	const serviceConfigFileName = convertToProjectFileCasing(`${input.serviceName} service config`, input.puristaConfig)

	const serviceBuilderName = camelCase(`${input.serviceName} v${input.serviceVersion} service builder`)

	writer.writeLine(`import { ${generalServiceInfoName} } from '../${generalServiceInfoFileName}.js'`)
	writer.writeLine(`import { ${serviceConfigSchema} } from './${serviceConfigFileName}.js'`)
	writer.newLine()

	const serviceInfoName = camelCase(`${input.serviceName} service info`)
	writer
		.write(`export const ${serviceInfoName} =`)
		.inlineBlock(() => {
			writer.write('serviceVersion: ').quote(`${input.serviceVersion}`).write(',')
			writer.newLineIfLastNot()
			writer.writeLine(`...${generalServiceInfoName}`)
		})
		.write(' as const satisfies ServiceInfoType')
	writer.newLineIfLastNot()
	writer.blankLine()
	writer.writeLine(`export const ${serviceBuilderName} = new ServiceBuilder(${serviceInfoName}).setConfigSchema(${serviceConfigSchema})
`)

	return writer.toString()
}
