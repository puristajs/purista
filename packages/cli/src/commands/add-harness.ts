import { z } from 'zod'
import { addPuristaHarness } from '../api/addPuristaHarness.js'
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
	name: z.string().trim().min(1).optional(),
	description: z.string().trim().optional(),
	serviceName: z.string().trim().min(1),
	serviceVersion: z.string().trim().min(1),
	responseEventName: z.never().optional(),
})

export type AddHarnessInput = z.input<typeof schema>

export const addHarnessCommand: PuristaExecutableCommand<AddHarnessInput, z.infer<typeof schema>> = {
	id: 'add-harness',
	resolve: async (input, context): Promise<PuristaCommandResolution<AddHarnessInput, z.infer<typeof schema>>> => {
		const { projectSnapshot } = requireProjectContext(context)
		const missing = []
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
			return createPendingResolution('add-harness', input, missing, createIssuesFromZod(parsed.error))
		}
		return createPendingResolution('add-harness', input, missing, [], [], parsed.data)
	},
	execute: async (resolvedInput, context) => {
		const { projectSnapshot } = requireProjectContext(context)
		const puristaConfig = requirePuristaConfig(context)
		const mutationSnapshot = await addPuristaHarness({
			projectRootPath: context.cwd,
			puristaConfig,
			puristaProject: projectSnapshot,
			serviceName: resolvedInput.serviceName,
			serviceVersion: resolvedInput.serviceVersion,
			harnessName: resolvedInput.name,
			codeWriterOptions: context.codeWriterOptions,
		})

		return createResult('add-harness', context.mode, mutationSnapshot)
	},
}
