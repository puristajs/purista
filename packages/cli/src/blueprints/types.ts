import type { TsConfigJson } from 'type-fest'
import type { PuristaConfig } from '../api/loadPuristaConfig.js'
import type { PKG } from '../create/getPackageJson.js'
import type { CreateProjectInput, PackageManager } from '../create/types.js'

export const blueprintIds = [
	'base',
	'runtime-node',
	'runtime-bun',
	'bridge-default',
	'bridge-amqp',
	'bridge-mqtt',
	'bridge-nats',
	'bridge-dapr',
	'http-node',
	'http-bun',
	'linter-biome',
	'linter-eslint-module',
	'linter-eslint-commonjs',
] as const

export type BlueprintId = (typeof blueprintIds)[number]

export type ProjectFileContribution = {
	path: string
	content: string
}

export type ProjectConfigPatch = {
	packageJson?: PKG
	tsconfig?: TsConfigJson
	puristaConfig?: Partial<PuristaConfig>
}

export type ExampleServiceGeneratorStep = {
	type: 'example-service'
	serviceName: string
	serviceDescription: string
	serviceVersion: string
	commandName: string
	commandDescription: string
}

export type ProjectGeneratorStep = ExampleServiceGeneratorStep

export type ProjectBlueprintContext = CreateProjectInput & {
	targetDirectoryPath: string
}

export type ProjectBlueprintContribution = ProjectConfigPatch & {
	files?: ProjectFileContribution[]
	warnings?: string[]
	generatorSteps?: ProjectGeneratorStep[]
}

export type ProjectBlueprint = {
	id: BlueprintId
	description: string
	tags: string[]
	dependencies?: BlueprintId[]
	conflicts?: BlueprintId[]
	applies?: (context: ProjectBlueprintContext) => boolean
	create: (context: ProjectBlueprintContext) => ProjectBlueprintContribution
}

export type ResolvedProjectBlueprints = {
	selectedBlueprints: BlueprintId[]
	warnings: string[]
	conflicts: string[]
}

export type ProjectGenerationPlan = {
	input: CreateProjectInput
	targetDirectoryPath: string
	selectedBlueprints: BlueprintId[]
	files: ProjectFileContribution[]
	packageJson: PKG
	tsconfig: TsConfigJson
	puristaConfig: PuristaConfig
	warnings: string[]
	conflicts: string[]
	generatorSteps: ProjectGeneratorStep[]
	predictedFiles: string[]
	installCommand: string
	packageManager: PackageManager
}
