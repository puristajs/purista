import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Options } from 'code-block-writer'
import { camelCase } from './change-case.js'
import { addDefinitionToBuilder } from './content/manipulation/addDefinitionToBuilder.js'
import { getStreamBuilderFileContent } from './content/stream/getStreamBuilderFileContent.js'
import { getStreamSchemaFileContent } from './content/stream/getStreamSchemaFileContent.js'
import { getStreamTestFileContent } from './content/stream/getStreamTestFileContent.js'
import { getStreamTypeFileContent } from './content/stream/getStreamTypeFileContent.js'
import { convertToProjectFileCasing } from './convertToProjectFileCasing.js'
import type { PuristaConfig } from './loadPuristaConfig.js'
import type { PuristaProjectInfo } from './scanPuristaProject.js'

/**
 * Add a stream to an existing PURISTA service version.
 *
 * Generates `types.ts`, `schema.ts`, a stream builder, a stream test, and
 * appends the stream definition to the service composition file.
 */
export const addPuristaStream = async (input: {
	projectRootPath?: string
	puristaConfig: PuristaConfig
	/** Human-readable stream description used by `getStreamBuilder`. */
	streamDescription: string
	/** Logical stream name, for example `watch account status`. */
	streamName: string
	/** Optional final event emitted when the stream completes. */
	responseEventName?: string
	serviceName: string
	serviceVersion: string
	codeWriterOptions?: Partial<Options>
	puristaProject: PuristaProjectInfo
}) => {
	const projectPath = input.projectRootPath ?? process.cwd()

	const streamPath = join(
		projectPath,
		input.puristaConfig.servicePath,
		convertToProjectFileCasing(input.serviceName, input.puristaConfig),
		`v${input.serviceVersion}`,
		'stream',
		convertToProjectFileCasing(input.streamName, input.puristaConfig),
	)
	const streamBuilderFileName = convertToProjectFileCasing(`${input.streamName} stream builder`, input.puristaConfig)

	await mkdir(streamPath, { recursive: true })

	await writeFile(join(streamPath, 'types.ts'), getStreamTypeFileContent(input))
	await writeFile(join(streamPath, 'schema.ts'), getStreamSchemaFileContent(input))
	await writeFile(join(streamPath, `${streamBuilderFileName}.ts`), getStreamBuilderFileContent(input))
	await writeFile(join(streamPath, `${streamBuilderFileName}.test.ts`), getStreamTestFileContent(input))

	await addDefinitionToBuilder({
		arrayName: 'streamDefinitions',
		serviceFile: join(
			projectPath,
			input.puristaConfig.servicePath,
			input.puristaProject.services[input.serviceName][input.serviceVersion].serviceFile,
		),
		importFile: `./stream/${convertToProjectFileCasing(input.streamName, input.puristaConfig)}/${streamBuilderFileName}.ts`,
		importDefinition: camelCase(`${input.streamName} stream builder`),
	})
}
