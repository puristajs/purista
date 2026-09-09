import { z } from 'zod'
import { addPuristaSkill } from '../api/addPuristaSkill.js'
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

const runtimeSchema = z
	.array(z.enum(['node', 'python', 'shell']))
	.refine(values => new Set(values).size === values.length, {
		message: 'Skill runtimes must not contain duplicates.',
	})

const schema = baseAddInputSchema.extend({
	name: z
		.string()
		.trim()
		.regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/)
		.max(64),
	description: z.string().trim().min(1),
	serviceName: z.string().trim().min(1),
	serviceVersion: z.string().trim().min(1),
	runtimes: runtimeSchema.optional().default([]),
	responseEventName: z.never().optional(),
})

export type AddSkillInput = z.input<typeof schema>

export const addSkillCommand: PuristaExecutableCommand<AddSkillInput, z.infer<typeof schema>> = {
	id: 'add-skill',
	resolve: async (input, context): Promise<PuristaCommandResolution<AddSkillInput, z.infer<typeof schema>>> => {
		const { projectSnapshot } = requireProjectContext(context)
		const missing = []
		if (!input.name?.trim())
			missing.push({ type: 'input', key: 'name', message: 'Kebab-case Skill name', required: true } as const)
		if (!input.description?.trim())
			missing.push({ type: 'input', key: 'description', message: 'Description of the Skill', required: true } as const)
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
		if (!parsed.success) return createPendingResolution('add-skill', input, missing, createIssuesFromZod(parsed.error))
		return createPendingResolution('add-skill', input, missing, [], [], parsed.data)
	},
	execute: async (resolvedInput, context) => {
		const { projectSnapshot } = requireProjectContext(context)
		const mutations = await addPuristaSkill({
			projectRootPath: context.cwd,
			puristaConfig: requirePuristaConfig(context),
			puristaProject: projectSnapshot,
			serviceName: resolvedInput.serviceName,
			serviceVersion: resolvedInput.serviceVersion,
			skillName: resolvedInput.name,
			skillDescription: resolvedInput.description,
			runtimes: resolvedInput.runtimes,
			codeWriterOptions: context.codeWriterOptions,
		})
		return createResult('add-skill', context.mode, mutations, [mutations.guidance])
	},
}
