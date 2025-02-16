import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { camelCase } from 'change-case'
import type { Options } from 'code-block-writer'
import { getCommandBuilderFileContent } from './content/command/getCommandBuilderFileContent.js'
import { getCommandSchemaFileContent } from './content/command/getCommandSchemaFileContent.js'
import { getCommandTestFileContent } from './content/command/getCommandTestFileContent.js'
import { getCommandTypeFileContent } from './content/command/getCommandTypeFileContent.js'
import { addDefinitionToBuilder } from './content/manipulation/addDefinitionToBuilder.js'
import { convertToProjectFileCasing } from './convertToProjectFileCasing.js'
import type { PuristaConfig } from './loadPuristaConfig.js'
import type { PuristaProjectInfo } from './scanPuristaProject.js'

/**
 * Add all folders and files for a new command to an existing PURISTA service.
 */
export const addPuristaCommand = async (input: {
	projectRootPath?: string
	puristaConfig: PuristaConfig
	commandDescription: string
	commandName: string
	eventToSubscribe?: string
	responseEventName?: string
	serviceName: string
	serviceVersion: string
	codeWriterOptions?: Partial<Options>
	puristaProject: PuristaProjectInfo
}) => {
	const projectPath = input.projectRootPath ?? process.cwd()

	const commandPath = join(
		projectPath,
		input.puristaConfig.servicePath,
		convertToProjectFileCasing(input.serviceName, input.puristaConfig),
		`v${input.serviceVersion}`,
		'command',
		convertToProjectFileCasing(input.commandName, input.puristaConfig),
	)
	const commandBuilderFileName = convertToProjectFileCasing(`${input.commandName} command builder`, input.puristaConfig)

	await mkdir(commandPath, { recursive: true })

	await writeFile(join(commandPath, 'types.ts'), getCommandTypeFileContent(input))
	await writeFile(join(commandPath, 'schema.ts'), getCommandSchemaFileContent(input))
	await writeFile(join(commandPath, `${commandBuilderFileName}.ts`), getCommandBuilderFileContent(input))
	await writeFile(join(commandPath, `${commandBuilderFileName}.test.ts`), getCommandTestFileContent(input))

	await addDefinitionToBuilder({
		arrayName: 'commandDefinitions',
		serviceFile: join(
			projectPath,
			input.puristaConfig.servicePath,
			input.puristaProject.services[input.serviceName][input.serviceVersion].serviceFile,
		),
		importFile: `./command/${convertToProjectFileCasing(input.commandName, input.puristaConfig)}/${commandBuilderFileName}.ts`,
		importDefinition: camelCase(`${input.commandName} command builder`),
	})
}
