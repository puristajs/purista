import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { Options } from 'code-block-writer'
import { camelCase } from './change-case.js'
import { addServiceToDefinitions } from './content/manipulation/addServiceToDefinitions.js'
import { getGeneralServiceConfigFileContent } from './content/service/getGeneralServiceConfigFileContent.js'
import { getServiceBuilderFileContent } from './content/service/getServiceBuilderFileContent.js'
import { getServiceConfigFileContent } from './content/service/getServiceConfigFileContent.js'
import { getServiceFileContent } from './content/service/getServiceFileContent.js'
import { getServiceTestFileContent } from './content/service/getServiceTestFileContent.js'

import { convertToProjectFileCasing } from './convertToProjectFileCasing.js'
import type { PuristaConfig } from './loadPuristaConfig.js'
import type { PuristaProjectInfo } from './scanPuristaProject.js'

/**
 * Add a new PURISTA service version to an existing project.
 *
 * Generates general service info, version config, service builder, service
 * composition, and setup test files using the project's configured file casing.
 */
export const addPuristaService = async (input: {
	/** Project root. Defaults to `process.cwd()`. */
	projectRootPath?: string
	puristaConfig: PuristaConfig
	puristaProject: PuristaProjectInfo
	/** Human-readable service description used in generated service metadata. */
	serviceDescription: string
	/** Logical service name, for example `user` or `billing account`. */
	serviceName: string
	/** Numeric service version. Defaults to `1`. */
	serviceVersion?: string
	/** Add the optional, declaration-only custom metric example used by the OTel scaffold. */
	includeMetricExample?: boolean
	codeWriterOptions?: Partial<Options>
}) => {
	const projectPath = input.projectRootPath ?? process.cwd()

	const serviceVersion = input.serviceVersion ?? '1'
	const serviceName = input.serviceName

	const servicePath = join(
		projectPath,
		input.puristaConfig.servicePath,
		convertToProjectFileCasing(serviceName, input.puristaConfig),
	)

	const serviceVersionPath = join(
		projectPath,
		input.puristaConfig.servicePath,
		convertToProjectFileCasing(serviceName, input.puristaConfig),
		`v${serviceVersion}`,
	)
	await mkdir(serviceVersionPath, { recursive: true })

	const generalServiceInfoFileName = `${convertToProjectFileCasing(`general ${serviceName} service info`, input.puristaConfig)}.ts`
	const generalServiceInfoFilePath = join(servicePath, generalServiceInfoFileName)

	if (!existsSync(generalServiceInfoFilePath)) {
		// check if general service info file exists and create it if not
		const content = getGeneralServiceConfigFileContent(input)
		await writeFile(generalServiceInfoFilePath, content, 'utf-8')
	}

	const serviceConfigFileName = `${convertToProjectFileCasing(`${serviceName} service config`, input.puristaConfig)}.ts`
	const serviceConfigFilePath = join(serviceVersionPath, serviceConfigFileName)
	await writeFile(
		serviceConfigFilePath,
		getServiceConfigFileContent({ ...input, serviceName, serviceVersion }),
		'utf-8',
	)

	const serviceBuilderFileName = `${convertToProjectFileCasing(`${serviceName} v${serviceVersion} service builder`, input.puristaConfig)}.ts`
	const serviceBuilderFilePath = join(serviceVersionPath, serviceBuilderFileName)
	await writeFile(
		serviceBuilderFilePath,
		getServiceBuilderFileContent({
			...input,
			serviceName,
			serviceVersion,
		}),
		'utf-8',
	)

	const serviceFileName = `${convertToProjectFileCasing(`${serviceName} v${serviceVersion} service`, input.puristaConfig)}.ts`
	const serviceFilePath = join(serviceVersionPath, serviceFileName)
	await writeFile(
		serviceFilePath,
		getServiceFileContent({
			...input,
			serviceName,
			serviceVersion,
		}),
		'utf-8',
	)

	const serviceTestFileName = `${convertToProjectFileCasing(`${serviceName} v${serviceVersion} service`, input.puristaConfig)}.test.ts`
	const serviceTestFilePath = join(serviceVersionPath, serviceTestFileName)
	await writeFile(
		serviceTestFilePath,
		getServiceTestFileContent({
			...input,
			serviceName,
			serviceVersion,
		}),
		'utf-8',
	)

	await addServiceToDefinitions({
		definitionsFile: join(projectPath, 'src', 'definitions.ts'),
		serviceFile: serviceFilePath,
		serviceExport: camelCase(`${serviceName} v${serviceVersion} service`),
	})
}
