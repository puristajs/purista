import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Options } from 'code-block-writer'
import { camelCase } from './change-case.js'
import { addDefinitionToBuilder } from './content/manipulation/addDefinitionToBuilder.js'
import { getScheduleBuilderFileContent } from './content/schedule/getScheduleBuilderFileContent.js'
import { getScheduleTestFileContent } from './content/schedule/getScheduleTestFileContent.js'
import { convertToProjectFileCasing } from './convertToProjectFileCasing.js'
import type { PuristaConfig } from './loadPuristaConfig.js'
import type { PuristaProjectInfo } from './scanPuristaProject.js'

/** Input for generating an event-only Scheduler Runtime declaration. */
export type AddPuristaScheduleInput = {
	projectRootPath?: string
	puristaConfig: PuristaConfig
	puristaProject: PuristaProjectInfo
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
	codeWriterOptions?: Partial<Options>
}

/**
 * Add an event-only schedule declaration to an existing service version.
 *
 * The generated contract deliberately contains no handler: a separately
 * deployed Scheduler Runtime publishes the event and normal subscriptions,
 * queues, or agents own the business work downstream.
 */
export const addPuristaSchedule = async (input: AddPuristaScheduleInput) => {
	const projectPath = input.projectRootPath ?? process.cwd()
	const scheduleDirectoryName = convertToProjectFileCasing(input.scheduleName, input.puristaConfig)
	const scheduleFileName = convertToProjectFileCasing(`${input.scheduleName} schedule definition`, input.puristaConfig)
	const schedulePath = join(
		projectPath,
		input.puristaConfig.servicePath,
		convertToProjectFileCasing(input.serviceName, input.puristaConfig),
		`v${input.serviceVersion}`,
		'schedule',
		scheduleDirectoryName,
	)

	await mkdir(schedulePath, { recursive: true })
	await writeFile(join(schedulePath, `${scheduleFileName}.ts`), getScheduleBuilderFileContent(input))
	await writeFile(join(schedulePath, `${scheduleFileName}.test.ts`), getScheduleTestFileContent(input))

	const scheduleDefinitionName = camelCase(`${input.scheduleName} schedule definition`)
	await addDefinitionToBuilder({
		arrayName: 'scheduleDefinitions',
		serviceFile: join(
			projectPath,
			input.puristaConfig.servicePath,
			input.puristaProject.services[input.serviceName][input.serviceVersion].serviceFile,
		),
		importFile: `./schedule/${scheduleDirectoryName}/${scheduleFileName}.ts`,
		importDefinition: scheduleDefinitionName,
		definitionExpression: scheduleDefinitionName,
	})
}
