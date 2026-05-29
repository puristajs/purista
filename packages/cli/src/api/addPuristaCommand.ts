import { mkdir, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import type { Options } from 'code-block-writer'
import { camelCase } from './change-case.js'
import { getCommandBuilderFileContent } from './content/command/getCommandBuilderFileContent.js'
import { getCommandSchemaFileContent } from './content/command/getCommandSchemaFileContent.js'
import { getCommandTestFileContent } from './content/command/getCommandTestFileContent.js'
import { getCommandTypeFileContent } from './content/command/getCommandTypeFileContent.js'
import { addDefinitionToBuilder } from './content/manipulation/addDefinitionToBuilder.js'
import { convertToProjectFileCasing } from './convertToProjectFileCasing.js'
import type { PuristaConfig } from './loadPuristaConfig.js'
import type { PuristaProjectInfo } from './scanPuristaProject.js'

/**
 * Add a command to an existing PURISTA service version.
 *
 * Generates `types.ts`, `schema.ts`, a command builder, a command test, and
 * appends the command definition to the service composition file.
 */
export const addPuristaCommand = async (input: {
	projectRootPath?: string
	puristaConfig: PuristaConfig
	/** Human-readable command description used by `getCommandBuilder`. */
	commandDescription: string
	/** Logical command name, for example `create user`. */
	commandName: string
	/** Event name this command subscribes to, when command triggering is event based. */
	eventToSubscribe?: string
	/** Success event emitted by the generated command. */
	responseEventName?: string
	serviceName: string
	serviceVersion: string
	codeWriterOptions?: Partial<Options>
	puristaProject: PuristaProjectInfo
	/** Queue contracts that the generated command may enqueue through `context.queue.enqueue`. */
	enqueues?: {
		queueName: string
		schemaFilePath: string
		payloadSchemaExportName: string
		parameterSchemaExportName: string
	}[]
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

	const enqueueOptions = input.enqueues?.map(option => {
		const relativePath = relative(commandPath, option.schemaFilePath).replace(/\\/g, '/')
		const moduleSpecifier = relativePath.startsWith('.') ? relativePath : `./${relativePath}`
		return {
			queueName: option.queueName,
			importPath: moduleSpecifier,
			payloadSchemaIdentifier: option.payloadSchemaExportName,
			parameterSchemaIdentifier: option.parameterSchemaExportName,
		}
	})

	await writeFile(join(commandPath, 'types.ts'), getCommandTypeFileContent(input))
	await writeFile(join(commandPath, 'schema.ts'), getCommandSchemaFileContent(input))
	await writeFile(
		join(commandPath, `${commandBuilderFileName}.ts`),
		getCommandBuilderFileContent({ ...input, enqueueOptions }),
	)
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
