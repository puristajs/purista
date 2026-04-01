import { join } from 'node:path'
import { z } from 'zod'
import { addPuristaService } from '../api/addPuristaService.js'
import type { PuristaExecutableCommand } from '../core/command.js'
import type { PuristaCommandResolution } from '../core/types.js'
import { createProjectSnapshot } from '../project/createProjectSnapshot.js'
import {
	captureMutationSnapshot,
	createIssuesFromZod,
	createPendingResolution,
	createResult,
	requirePuristaConfig,
} from './shared.js'

export type AddServiceInput = {
	name?: string
	description?: string
	version?: string
}

const schema = z.object({
	name: z.string().trim().min(1),
	description: z.string().trim().min(1),
	version: z.string().trim().min(1).default('1'),
})

export const addServiceCommand: PuristaExecutableCommand<AddServiceInput, z.infer<typeof schema>> = {
	id: 'add-service',
	resolve: async (input, _context): Promise<PuristaCommandResolution<AddServiceInput, z.infer<typeof schema>>> => {
		const missing = []
		if (!input.name?.trim()) {
			missing.push({ type: 'input', key: 'name', message: 'Name of the service', required: true } as const)
		}
		if (!input.description?.trim()) {
			missing.push({
				type: 'input',
				key: 'description',
				message: 'Description of the service',
				required: true,
			} as const)
		}

		const parsed = schema.safeParse({ ...input, version: input.version ?? '1' })
		if (!parsed.success) {
			return createPendingResolution('add-service', input, missing, createIssuesFromZod(parsed.error))
		}

		return createPendingResolution('add-service', input, missing, [], [], parsed.data)
	},
	execute: async (resolvedInput, context) => {
		const puristaConfig = requirePuristaConfig(context)
		const projectSnapshot = context.projectSnapshot ?? (await createProjectSnapshot(puristaConfig, context.cwd))
		const serviceBasePath = join(context.cwd, puristaConfig.servicePath, resolvedInput.name)
		const expectedPaths = [
			join(serviceBasePath, `general${resolvedInput.name}ServiceInfo.ts`),
			join(serviceBasePath, `v${resolvedInput.version}`),
		]
		const mutationSnapshot = captureMutationSnapshot(expectedPaths)

		await addPuristaService({
			projectRootPath: context.cwd,
			puristaConfig,
			puristaProject: projectSnapshot,
			serviceName: resolvedInput.name,
			serviceDescription: resolvedInput.description,
			serviceVersion: resolvedInput.version,
			codeWriterOptions: context.codeWriterOptions,
		})

		return createResult('add-service', context.mode, mutationSnapshot)
	},
}
