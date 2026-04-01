import { join } from 'node:path'
import { z } from 'zod'
import { addPuristaAgent } from '../api/addPuristaAgent.js'
import { ensureServiceEvent } from '../api/content/manipulation/ensureServiceEvent.js'
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

export type AddAgentInput = z.input<typeof schema>

export const addAgentCommand: PuristaExecutableCommand<AddAgentInput, z.infer<typeof schema>> = {
	id: 'add-agent',
	resolve: async (input, context): Promise<PuristaCommandResolution<AddAgentInput, z.infer<typeof schema>>> => {
		const { projectSnapshot } = requireProjectContext(context)
		const missing = []
		if (!input.name?.trim())
			missing.push({ type: 'input', key: 'name', message: 'Name of the agent', required: true } as const)
		if (!input.description?.trim())
			missing.push({ type: 'input', key: 'description', message: 'Description of the agent', required: true } as const)
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
			return createPendingResolution('add-agent', input, missing, createIssuesFromZod(parsed.error))
		}
		return createPendingResolution('add-agent', input, missing, [], [], parsed.data)
	},
	execute: async (resolvedInput, context) => {
		const { projectSnapshot } = requireProjectContext(context)
		const puristaConfig = requirePuristaConfig(context)
		if (resolvedInput.responseEventName) {
			await ensureServiceEvent({
				projectRootPath: context.cwd,
				puristaProjectConfig: puristaConfig,
				puristaProject: projectSnapshot,
				eventName: resolvedInput.responseEventName,
				description: `Emitted by ${resolvedInput.serviceName} v${resolvedInput.serviceVersion} agent ${resolvedInput.name}:\n${resolvedInput.description}`,
			})
		}

		const mutationSnapshot = captureMutationSnapshot([
			join(context.cwd, puristaConfig.agentPath ?? 'src/agents', resolvedInput.name),
		])
		await addPuristaAgent({
			projectRootPath: context.cwd,
			puristaConfig,
			puristaProject: projectSnapshot,
			serviceName: resolvedInput.serviceName,
			serviceVersion: resolvedInput.serviceVersion,
			agentName: resolvedInput.name,
			agentDescription: resolvedInput.description,
			responseEventName: resolvedInput.responseEventName,
			codeWriterOptions: context.codeWriterOptions,
		})

		return createResult('add-agent', context.mode, mutationSnapshot)
	},
}
