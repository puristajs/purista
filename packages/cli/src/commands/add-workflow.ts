import { dirname, join } from 'node:path'
import { z } from 'zod'
import { addPuristaWorkflow } from '../api/addPuristaWorkflow.js'
import { ensureServiceEvent } from '../api/content/manipulation/ensureServiceEvent.js'
import { convertToProjectFileCasing } from '../api/convertToProjectFileCasing.js'
import type { PuristaExecutableCommand } from '../core/command.js'
import type { PuristaCommandResolution } from '../core/types.js'
import {
	baseAddInputSchema,
	captureMutationSnapshot,
	createIssuesFromZod,
	createPendingResolution,
	createResult,
	getServiceChoices,
	getServiceVersionChoices,
	nonEmptyOptionalStringSchema,
	requireProjectContext,
	requirePuristaConfig,
} from './shared.js'

const schema = baseAddInputSchema.extend({
	name: z.string().trim().min(1),
	description: z.string().trim().min(1),
	serviceName: z.string().trim().min(1),
	serviceVersion: z.string().trim().min(1),
	responseEventName: nonEmptyOptionalStringSchema,
})

export type AddWorkflowInput = z.input<typeof schema>

export const addWorkflowCommand: PuristaExecutableCommand<AddWorkflowInput, z.infer<typeof schema>> = {
	id: 'add-workflow',
	resolve: async (input, context): Promise<PuristaCommandResolution<AddWorkflowInput, z.infer<typeof schema>>> => {
		const { projectSnapshot } = requireProjectContext(context)
		const missing = []
		if (!input.name?.trim())
			missing.push({ type: 'input', key: 'name', message: 'Name of the workflow', required: true } as const)
		if (!input.description?.trim())
			missing.push({
				type: 'input',
				key: 'description',
				message: 'Description of the workflow',
				required: true,
			} as const)
		if (!input.serviceName?.trim())
			missing.push({
				type: 'select',
				key: 'serviceName',
				message: 'What service do you want to use?',
				choices: getServiceChoices(projectSnapshot),
			} as const)
		if (!input.serviceVersion?.trim())
			missing.push({
				type: 'select',
				key: 'serviceVersion',
				message: `Choose the version of service ${input.serviceName ?? ''}`.trim(),
				choices: getServiceVersionChoices(projectSnapshot, input.serviceName),
			} as const)

		const parsed = schema.safeParse(input)
		if (!parsed.success) {
			return createPendingResolution('add-workflow', input, missing, createIssuesFromZod(parsed.error))
		}
		return createPendingResolution('add-workflow', input, missing, [], [], parsed.data)
	},
	execute: async (resolvedInput, context) => {
		const { projectSnapshot } = requireProjectContext(context)
		const puristaConfig = requirePuristaConfig(context)
		const serviceDirectory = convertToProjectFileCasing(resolvedInput.serviceName, puristaConfig)
		const workflowDirectory = convertToProjectFileCasing(resolvedInput.name, puristaConfig)
		if (resolvedInput.responseEventName) {
			await ensureServiceEvent({
				projectRootPath: context.cwd,
				puristaProjectConfig: puristaConfig,
				puristaProject: projectSnapshot,
				eventName: resolvedInput.responseEventName,
				description: `Emitted by ${resolvedInput.serviceName} v${resolvedInput.serviceVersion} workflow ${resolvedInput.name}:\n${resolvedInput.description}`,
			})
		}

		const mutationSnapshot = captureMutationSnapshot([
			join(
				context.cwd,
				dirname(puristaConfig.servicePath ?? 'src/service'),
				'harness',
				serviceDirectory,
				`${serviceDirectory}Harness.ts`,
			),
			join(
				context.cwd,
				dirname(puristaConfig.servicePath ?? 'src/service'),
				'harness',
				serviceDirectory,
				'workflow',
				workflowDirectory,
			),
			join(
				context.cwd,
				puristaConfig.servicePath ?? 'src/service',
				resolvedInput.serviceName,
				`v${resolvedInput.serviceVersion}`,
				'harness',
			),
			join(context.cwd, 'package.json'),
		])
		await addPuristaWorkflow({
			projectRootPath: context.cwd,
			puristaConfig,
			puristaProject: projectSnapshot,
			serviceName: resolvedInput.serviceName,
			serviceVersion: resolvedInput.serviceVersion,
			workflowName: resolvedInput.name,
			workflowDescription: resolvedInput.description,
			responseEventName: resolvedInput.responseEventName,
			codeWriterOptions: context.codeWriterOptions,
		})

		return createResult('add-workflow', context.mode, mutationSnapshot)
	},
}
