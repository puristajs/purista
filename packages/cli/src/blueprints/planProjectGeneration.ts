import { resolve } from 'node:path'
import type { TsConfigJson } from 'type-fest'
import { convertToProjectFileCasing } from '../api/convertToProjectFileCasing.js'
import { type PuristaConfig, puristaConfigSchema } from '../api/loadPuristaConfig.js'
import { PuristaCliValidationError } from '../core/errors.js'
import { mergePackageJson, type PKG } from '../create/getPackageJson.js'
import type { CreateProjectInput } from '../create/types.js'
import { createEntrypointFile, createEventBridgeFile, createHttpFile } from './content.js'
import { projectBlueprintRegistry } from './registry.js'
import { resolveProjectBlueprints } from './resolveProjectBlueprints.js'
import type {
	BlueprintId,
	ProjectBlueprintContext,
	ProjectFileContribution,
	ProjectGenerationPlan,
	ProjectGeneratorStep,
} from './types.js'

const installCommands = {
	npm: 'npm install',
	bun: 'bun install',
	pnpm: 'pnpm install',
	yarn: 'yarn',
} as const

const mergeTsConfig = (base: TsConfigJson, patch: TsConfigJson): TsConfigJson => {
	const baseTypes = Array.isArray(base.compilerOptions?.types) ? base.compilerOptions.types : []
	const patchTypes = Array.isArray(patch.compilerOptions?.types) ? patch.compilerOptions.types : []
	const types = [...new Set([...baseTypes, ...patchTypes])]

	return {
		...base,
		...patch,
		compilerOptions: {
			...base.compilerOptions,
			...patch.compilerOptions,
			...(types.length > 0 ? { types } : {}),
		},
		include: patch.include ?? base.include,
		exclude: patch.exclude ?? base.exclude,
	}
}

const mergePuristaConfig = (base: Partial<PuristaConfig>, patch: Partial<PuristaConfig>) => ({
	...base,
	...patch,
})

const pushFile = (target: ProjectFileContribution[], file: ProjectFileContribution) => {
	const existingIndex = target.findIndex(entry => entry.path === file.path)
	if (existingIndex >= 0) {
		target[existingIndex] = file
		return
	}
	target.push(file)
}

const createPredictedExampleArtifacts = (step: ProjectGeneratorStep, puristaConfig: PuristaConfig): string[] => {
	if (step.type !== 'example-service') {
		return []
	}

	const serviceDirectory = convertToProjectFileCasing(step.serviceName, puristaConfig)
	const generalInfoFile = `${convertToProjectFileCasing(`general ${step.serviceName} service info`, puristaConfig)}.ts`
	const serviceConfigFile = `${convertToProjectFileCasing(`${step.serviceName} service config`, puristaConfig)}.ts`
	const serviceBuilderFile = `${convertToProjectFileCasing(`${step.serviceName} v${step.serviceVersion} service builder`, puristaConfig)}.ts`
	const serviceFile = `${convertToProjectFileCasing(`${step.serviceName} v${step.serviceVersion} service`, puristaConfig)}.ts`
	const serviceTestFile = `${convertToProjectFileCasing(`${step.serviceName} v${step.serviceVersion} service`, puristaConfig)}.test.ts`
	const commandDirectory = convertToProjectFileCasing(step.commandName, puristaConfig)
	const commandBuilderFile = `${convertToProjectFileCasing(`${step.commandName} command builder`, puristaConfig)}.ts`

	return [
		`${puristaConfig.servicePath}/${serviceDirectory}/${generalInfoFile}`,
		`${puristaConfig.servicePath}/${serviceDirectory}/v${step.serviceVersion}/${serviceConfigFile}`,
		`${puristaConfig.servicePath}/${serviceDirectory}/v${step.serviceVersion}/${serviceBuilderFile}`,
		`${puristaConfig.servicePath}/${serviceDirectory}/v${step.serviceVersion}/${serviceFile}`,
		`${puristaConfig.servicePath}/${serviceDirectory}/v${step.serviceVersion}/${serviceTestFile}`,
		`${puristaConfig.servicePath}/${serviceDirectory}/v${step.serviceVersion}/command/${commandDirectory}/types.ts`,
		`${puristaConfig.servicePath}/${serviceDirectory}/v${step.serviceVersion}/command/${commandDirectory}/schema.ts`,
		`${puristaConfig.servicePath}/${serviceDirectory}/v${step.serviceVersion}/command/${commandDirectory}/${commandBuilderFile}`,
		`${puristaConfig.servicePath}/${serviceDirectory}/v${step.serviceVersion}/command/${commandDirectory}/${commandBuilderFile.replace('.ts', '.test.ts')}`,
	]
}

/**
 * Build a complete project generation plan without writing files.
 *
 * @example
 * ```ts
 * const plan = planProjectGeneration({
 *   target: 'my-service',
 *   projectName: 'my-service',
 *   runtime: 'node',
 *   eventBridge: 'default',
 *   useWebserver: true,
 *   fileConvention: 'camel',
 *   eventConvention: 'camel',
 *   linter: 'biome',
 *   formatter: 'biome',
 *   type: 'module',
 *   packageManager: 'npm',
 *   installDependencies: false,
 * })
 * ```
 */
export const planProjectGeneration = (
	input: CreateProjectInput,
	options: { cwd?: string } = {},
): ProjectGenerationPlan => {
	const targetDirectoryPath = resolve(options.cwd ?? process.cwd(), input.target)
	const resolution = resolveProjectBlueprints(input, options)
	const blueprintContext: ProjectBlueprintContext = {
		...input,
		targetDirectoryPath,
	}

	if (resolution.conflicts.length > 0) {
		throw new PuristaCliValidationError('Invalid blueprint combination.', {
			command: 'init-project',
			issues: resolution.conflicts.map(conflict => ({
				code: 'blueprint_conflict',
				message: conflict,
			})),
		})
	}

	let packageJson: PKG = {
		name: input.projectName,
		private: true,
		type: input.type,
		dependencies: {},
		devDependencies: {},
		trustedDependencies: [],
	}
	let tsconfig: TsConfigJson = {}
	let puristaConfig: Partial<PuristaConfig> = {
		runtime: input.runtime,
		eventBridge: input.eventBridge,
		fileConvention: input.fileConvention,
		eventConvention: input.eventConvention,
		linter: input.linter,
		formatter: input.formatter,
	}
	const files: ProjectFileContribution[] = []
	const generatorSteps: ProjectGeneratorStep[] = []
	const warnings = [...resolution.warnings]

	for (const blueprintId of resolution.selectedBlueprints) {
		const blueprint = projectBlueprintRegistry[blueprintId]
		const contribution = blueprint.create(blueprintContext)
		packageJson = mergePackageJson(
			packageJson,
			contribution.packageJson ?? { dependencies: {}, devDependencies: {}, trustedDependencies: [] },
		)
		tsconfig = mergeTsConfig(tsconfig, contribution.tsconfig ?? {})
		puristaConfig = mergePuristaConfig(puristaConfig, contribution.puristaConfig ?? {})
		for (const file of contribution.files ?? []) {
			pushFile(files, file)
		}
		for (const step of contribution.generatorSteps ?? []) {
			generatorSteps.push(step)
		}
		for (const warning of contribution.warnings ?? []) {
			warnings.push(warning)
		}
	}

	const normalizedPuristaConfig = puristaConfigSchema.parse(puristaConfig)

	pushFile(files, {
		path: 'src/eventbridge.ts',
		content: createEventBridgeFile(input),
	})

	if (
		resolution.selectedBlueprints.includes('http-node' as BlueprintId) ||
		resolution.selectedBlueprints.includes('http-bun' as BlueprintId)
	) {
		pushFile(files, {
			path: 'src/http.ts',
			content: createHttpFile(input.runtime),
		})
	}

	pushFile(files, {
		path: 'src/index.ts',
		content: createEntrypointFile(
			{
				...input,
				useWebserver:
					resolution.selectedBlueprints.includes('http-node' as BlueprintId) ||
					resolution.selectedBlueprints.includes('http-bun' as BlueprintId),
			},
			normalizedPuristaConfig,
		),
	})

	pushFile(files, {
		path: 'package.json',
		content: `${JSON.stringify(packageJson, null, 2)}\n`,
	})
	pushFile(files, {
		path: 'tsconfig.json',
		content: `${JSON.stringify(tsconfig, null, 2)}\n`,
	})
	pushFile(files, {
		path: 'purista.json',
		content: `${JSON.stringify(normalizedPuristaConfig, null, 2)}\n`,
	})

	const predictedFiles = [
		...files.map(file => file.path),
		...generatorSteps.flatMap(step => createPredictedExampleArtifacts(step, normalizedPuristaConfig)),
	]

	return {
		input,
		targetDirectoryPath,
		selectedBlueprints: resolution.selectedBlueprints,
		files,
		packageJson,
		tsconfig,
		puristaConfig: normalizedPuristaConfig,
		warnings,
		conflicts: resolution.conflicts,
		generatorSteps,
		predictedFiles,
		installCommand: installCommands[input.packageManager],
		packageManager: input.packageManager,
	}
}
