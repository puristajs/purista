import { camelCase } from 'change-case'
import CodeBlockWriter from 'code-block-writer'
import type { Options } from 'code-block-writer'
import { convertToProjectFileCasing } from '../../convertToProjectFileCasing.js'
import type { PuristaConfig } from '../../loadPuristaConfig.js'

/**
 * Create the content of the service test file.
 */
export const getServiceTestFileContent = (input: {
	serviceName: string
	serviceVersion: string
	puristaConfig: PuristaConfig
	codeWriterOptions?: Partial<Options>
}) => {
	const writer = new CodeBlockWriter(input.codeWriterOptions)

	const serviceFileName = convertToProjectFileCasing(
		`${input.serviceName} v${input.serviceVersion} service`,
		input.puristaConfig,
	)
	const serviceName = camelCase(`${input.serviceName} v${input.serviceVersion} service`)

	writer.writeLine(`import { ${serviceName} as service } from './${serviceFileName}.js'`)
	writer.newLine()
	writer
		.write(`describe('service ${input.serviceName} version ${input.serviceVersion}', () =>`)
		.block(() => {
			writer
				.write(`it('has valid configuration', () =>`)
				.block(() => {
					writer.writeLine('service.testServiceSetup()')
				})
				.write(')')
		})
		.write(')')

	return writer.toString()
}
