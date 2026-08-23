import { basename, resolve } from 'node:path'
import { z } from 'zod'
import { materializeProjectGeneration } from '../blueprints/materializeProjectGeneration.js'
import { planProjectGeneration } from '../blueprints/planProjectGeneration.js'
import { resolveProjectBlueprints } from '../blueprints/resolveProjectBlueprints.js'
import type { PuristaExecutableCommand } from '../core/command.js'
import { PuristaCliValidationError } from '../core/errors.js'
import type { PuristaCommandResolution } from '../core/types.js'
import { ensureProjectDir } from '../create/ensureProjectDir.js'
import { installDependencies } from '../create/installDependencies.js'
import type { CreateProjectInput } from '../create/types.js'
import { captureMutationSnapshot, createPendingResolution, createResult } from './shared.js'

const schema = z.strictObject({
	target: z.string().trim().min(1).default('my-app'),
	projectName: z.string().trim().optional(),
	runtime: z.enum(['node', 'bun']).default('node'),
	eventBridge: z.enum(['default', 'mqtt', 'amqp', 'nats', 'dapr']).default('default'),
	useWebserver: z.coerce.boolean().default(false),
	telemetry: z.enum(['none', 'otel']).default('none'),
	fileConvention: z.enum(['camel', 'snake', 'kebab', 'pascal', 'pascalSnake']).default('camel'),
	eventConvention: z
		.enum(['camel', 'snake', 'kebab', 'pascal', 'pascalSnake', 'constantCase', 'dotCase', 'pathCase', 'trainCase'])
		.default('camel'),
	linter: z.enum(['biome', 'eslint', 'none']).default('biome'),
	formatter: z.enum(['biome', 'prettier', 'none']).default('biome'),
	packageManager: z.enum(['npm', 'bun', 'pnpm', 'yarn']).default('npm'),
	installDependencies: z.coerce.boolean().default(true),
})

export type InitProjectInput = z.input<typeof schema>

const packageManagerChoices = [
	{ name: 'npm', value: 'npm' as const },
	{ name: 'bun', value: 'bun' as const },
	{ name: 'pnpm', value: 'pnpm' as const },
	{ name: 'yarn', value: 'yarn' as const },
]

export const initProjectCommand: PuristaExecutableCommand<InitProjectInput, CreateProjectInput> = {
	id: 'init-project',
	resolve: async (input, _context): Promise<PuristaCommandResolution<InitProjectInput, CreateProjectInput>> => {
		const missing = []
		if (!input.target?.trim())
			missing.push({ type: 'input', key: 'target', message: 'Target directory', defaultValue: 'my-app' } as const)
		if (!input.runtime?.trim())
			missing.push({
				type: 'select',
				key: 'runtime',
				message: 'Which runtime do you use?',
				choices: [
					{ name: 'Node.js', value: 'node' },
					{ name: 'Bun', value: 'bun' },
				],
				defaultValue: 'node',
			} as const)
		if (!input.packageManager?.trim())
			missing.push({
				type: 'select',
				key: 'packageManager',
				message: 'Which package manager do you want to use?',
				choices: packageManagerChoices,
				defaultValue: 'npm',
			} as const)
		const parsed = schema.safeParse(input)
		if (!parsed.success) {
			return createPendingResolution(
				'init-project',
				input,
				missing,
				parsed.error.issues.map(issue => ({
					code: issue.code,
					message: issue.message,
					path: issue.path.map(entry => String(entry)),
				})),
			)
		}

		const target = parsed.data.target
		const resolvedInput = {
			...parsed.data,
			target,
			projectName: parsed.data.projectName ?? (target === '.' ? basename(_context.cwd) : basename(target)),
		}
		const blueprintResolution = resolveProjectBlueprints(resolvedInput, { cwd: _context.cwd })
		return createPendingResolution(
			'init-project',
			input,
			missing,
			blueprintResolution.conflicts.map(conflict => ({
				code: 'blueprint_conflict',
				message: conflict,
			})),
			blueprintResolution.warnings,
			blueprintResolution.conflicts.length > 0 ? undefined : resolvedInput,
		)
	},
	execute: async (resolvedInput, context) => {
		const targetDirectoryPath = resolve(context.cwd, resolvedInput.target)
		const targetEmptyOrCreated = await ensureProjectDir(targetDirectoryPath)
		if (!targetEmptyOrCreated && context.mode === 'non-interactive') {
			throw new PuristaCliValidationError(
				'Target directory is not empty. Use interactive mode to confirm or choose another directory.',
			)
		}
		if (!targetEmptyOrCreated && context.mode !== 'non-interactive') {
			const overwrite = await context.prompt.confirm({
				type: 'confirm',
				key: 'overwrite',
				message: `Target directory ${resolvedInput.target} is not empty. Continue and overwrite matching files?`,
				defaultValue: false,
			})
			if (!overwrite) {
				throw new PuristaCliValidationError('Project initialization cancelled.')
			}
		}

		const generationPlan = planProjectGeneration(resolvedInput, { cwd: context.cwd })
		const mutationSnapshot = captureMutationSnapshot(
			generationPlan.predictedFiles.map(relativePath => resolve(generationPlan.targetDirectoryPath, relativePath)),
		)
		await materializeProjectGeneration(generationPlan)
		if (resolvedInput.installDependencies) {
			await installDependencies(resolvedInput.packageManager, generationPlan.targetDirectoryPath)
		}

		return createResult('init-project', context.mode, mutationSnapshot, generationPlan.warnings)
	},
}
