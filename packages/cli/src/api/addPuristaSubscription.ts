import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { camelCase } from 'change-case'
import type { Options } from 'code-block-writer'
import { addDefinitionToBuilder } from './content/manipulation/addDefinitionToBuilder.js'
import { getSubscriptionBuilderFileContent } from './content/subscription/getSubscriptionBuilderFileContent.js'
import { getSubscriptionSchemaFileContent } from './content/subscription/getSubscriptionSchemaFileContent.js'
import { getSubscriptionTestFileContent } from './content/subscription/getSubscriptionTestFileContent.js'
import { getSubscriptionTypeFileContent } from './content/subscription/getSubscriptionTypeFileContent.js'
import { convertToProjectFileCasing } from './convertToProjectFileCasing.js'
import type { PuristaConfig } from './loadPuristaConfig.js'
import type { PuristaProjectInfo } from './scanPuristaProject.js'

/**
 * Add all folders and files for a new subscription to an existing PURISTA service.
 */
export const addPuristaSubscription = async (input: {
	projectRootPath?: string
	puristaConfig: PuristaConfig
	subscriptionDescription: string
	subscriptionName: string
	eventToSubscribe?: string
	responseEventName?: string
	serviceName: string
	serviceVersion: string
	codeWriterOptions?: Partial<Options>
	puristaProject: PuristaProjectInfo
}) => {
	const projectPath = input.projectRootPath ?? process.cwd()

	const subscriptionPath = join(
		projectPath,
		input.puristaConfig.servicePath,
		convertToProjectFileCasing(input.serviceName, input.puristaConfig),
		`v${input.serviceVersion}`,
		'subscription',
		convertToProjectFileCasing(input.subscriptionName, input.puristaConfig),
	)
	const subscriptionBuilderFileName = convertToProjectFileCasing(
		`${input.subscriptionName} subscription builder`,
		input.puristaConfig,
	)

	await mkdir(subscriptionPath, { recursive: true })

	await writeFile(join(subscriptionPath, 'types.ts'), getSubscriptionTypeFileContent(input))
	await writeFile(join(subscriptionPath, 'schema.ts'), getSubscriptionSchemaFileContent(input))
	await writeFile(join(subscriptionPath, `${subscriptionBuilderFileName}.ts`), getSubscriptionBuilderFileContent(input))
	await writeFile(
		join(subscriptionPath, `${subscriptionBuilderFileName}.test.ts`),
		getSubscriptionTestFileContent(input),
	)

	await addDefinitionToBuilder({
		arrayName: 'subscriptionDefinitions',
		serviceFile: join(
			projectPath,
			input.puristaConfig.servicePath,
			input.puristaProject.services[input.serviceName][input.serviceVersion].serviceFile,
		),
		importFile: `./subscription/${convertToProjectFileCasing(input.subscriptionName, input.puristaConfig)}/${subscriptionBuilderFileName}.ts`,
		importDefinition: camelCase(`${input.subscriptionName} subscription builder`),
	})
}
