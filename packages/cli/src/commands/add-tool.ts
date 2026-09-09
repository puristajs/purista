import { z } from 'zod'
import { addPuristaTool } from '../api/addPuristaTool.js'
import type { PuristaExecutableCommand } from '../core/command.js'
import type { PuristaCommandResolution } from '../core/types.js'
import {
	baseAddInputSchema,
	createIssuesFromZod,
	createPendingResolution,
	createResult,
	getServiceChoices,
	getServiceVersionChoices,
	requireProjectContext,
	requirePuristaConfig,
} from './shared.js'

const schema = baseAddInputSchema.extend({
	name: z.string().trim().min(1),
	description: z.string().trim().min(1),
	serviceName: z.string().trim().min(1),
	serviceVersion: z.string().trim().min(1),
	kind: z.enum(['portable', 'purista']),
	responseEventName: z.never().optional(),
})

export type AddToolInput = z.input<typeof schema>

export const addToolCommand: PuristaExecutableCommand<AddToolInput, z.infer<typeof schema>> = {
	id: 'add-tool',
	resolve: async (input, context): Promise<PuristaCommandResolution<AddToolInput, z.infer<typeof schema>>> => {
		const { projectSnapshot } = requireProjectContext(context)
		const missing = []
		if (!input.name?.trim())
			missing.push({ type: 'input', key: 'name', message: 'Name of the tool', required: true } as const)
		if (!input.description?.trim())
			missing.push({ type: 'input', key: 'description', message: 'Description of the tool', required: true } as const)
		if (!input.kind)
			missing.push({
				type: 'select',
				key: 'kind',
				message: 'Choose portable or PURISTA host tool ownership',
				choices: [
					{ name: 'portable', value: 'portable' },
					{ name: 'purista', value: 'purista' },
				],
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
		if (!parsed.success) return createPendingResolution('add-tool', input, missing, createIssuesFromZod(parsed.error))
		return createPendingResolution('add-tool', input, missing, [], [], parsed.data)
	},
	execute: async (resolvedInput, context) => {
		const { projectSnapshot } = requireProjectContext(context)
		const mutations = await addPuristaTool({
			projectRootPath: context.cwd,
			puristaConfig: requirePuristaConfig(context),
			puristaProject: projectSnapshot,
			serviceName: resolvedInput.serviceName,
			serviceVersion: resolvedInput.serviceVersion,
			toolName: resolvedInput.name,
			toolDescription: resolvedInput.description,
			kind: resolvedInput.kind,
			codeWriterOptions: context.codeWriterOptions,
		})
		return createResult('add-tool', context.mode, mutations, [mutations.guidance])
	},
}
