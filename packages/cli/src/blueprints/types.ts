import type { TsConfigJson } from 'type-fest'
import type { PuristaConfig } from '../api/loadPuristaConfig.js'
import type { PKG } from '../create/getPackageJson.js'
import type { CreateProjectInput, PackageManager } from '../create/types.js'

/** Ordered list of built-in project blueprint identifiers. */
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
] as const

/** Built-in project blueprint identifiers understood by the generator. */
export type BlueprintId = (typeof blueprintIds)[number]

/** A file that a blueprint contributes to a project generation plan. */
export type ProjectFileContribution = {
	/** Contribution discriminator. */
	type?: 'file'
	/** File path relative to the generated project root. */
	path: string
	/** Full UTF-8 file content to write. */
	content: string
}

/** A symbolic link that a blueprint contributes to a project generation plan. */
export type ProjectLinkContribution = {
	/** Contribution discriminator. */
	type: 'symlink'
	/** Link path relative to the generated project root. */
	path: string
	/** Link target, relative to the link parent directory. */
	target: string
}

/** File-system entry that a blueprint contributes to a project generation plan. */
export type ProjectEntryContribution = ProjectFileContribution | ProjectLinkContribution

/** Partial project-level configuration merged from a blueprint. */
export type ProjectConfigPatch = {
	/** Partial package.json contribution. */
	packageJson?: PKG
	/** Partial tsconfig contribution. */
	tsconfig?: TsConfigJson
	/** Partial PURISTA CLI configuration contribution. */
	puristaConfig?: Partial<PuristaConfig>
}

/** Deferred generator action that creates the example service after base files exist. */
export type ExampleServiceGeneratorStep = {
	/** Generator step discriminator. */
	type: 'example-service'
	/** Service name passed to `addPuristaService`. */
	serviceName: string
	/** Human-readable service description. */
	serviceDescription: string
	/** Service version passed to `addPuristaService`. */
	serviceVersion: string
	/** Command name passed to `addPuristaCommand`. */
	commandName: string
	/** Human-readable command description. */
	commandDescription: string
}

/** Union of deferred generator steps executed while materializing a project. */
export type ProjectGeneratorStep = ExampleServiceGeneratorStep

/** Input visible to a blueprint while it decides and creates contributions. */
export type ProjectBlueprintContext = CreateProjectInput & {
	/** Absolute target directory for the generated project. */
	targetDirectoryPath: string
}

/** Files, config patches, warnings, and deferred steps emitted by a blueprint. */
export type ProjectBlueprintContribution = ProjectConfigPatch & {
	files?: ProjectEntryContribution[]
	warnings?: string[]
	generatorSteps?: ProjectGeneratorStep[]
}

/** A reusable project generator unit. */
export type ProjectBlueprint = {
	/** Unique blueprint id. */
	id: BlueprintId
	/** Human-readable summary. */
	description: string
	/** Search or grouping tags. */
	tags: string[]
	/** Blueprints that must be selected before this blueprint. */
	dependencies?: BlueprintId[]
	/** Blueprints that cannot be selected with this blueprint. */
	conflicts?: BlueprintId[]
	/** Optional predicate that decides if this blueprint applies to the input. */
	applies?: (context: ProjectBlueprintContext) => boolean
	/** Create this blueprint's file and configuration contribution. */
	create: (context: ProjectBlueprintContext) => ProjectBlueprintContribution
}

/** Result of selecting project blueprints for a concrete init input. */
export type ResolvedProjectBlueprints = {
	/** Blueprint ids selected after dependency and conflict resolution. */
	selectedBlueprints: BlueprintId[]
	/** Non-fatal warnings produced during blueprint selection. */
	warnings: string[]
	/** Conflicts that prevented optional blueprint selection. */
	conflicts: string[]
}

/** Complete dry-run project generation plan. */
export type ProjectGenerationPlan = {
	/** Original create-project input used to produce the plan. */
	input: CreateProjectInput
	/** Absolute target directory. */
	targetDirectoryPath: string
	/** Blueprint ids included in the plan. */
	selectedBlueprints: BlueprintId[]
	/** Base files to write before deferred generator steps run. */
	files: ProjectEntryContribution[]
	/** Complete package.json to write. */
	packageJson: PKG
	/** Complete tsconfig to write. */
	tsconfig: TsConfigJson
	/** Complete PURISTA CLI configuration to write. */
	puristaConfig: PuristaConfig
	/** Non-fatal warnings surfaced to the caller. */
	warnings: string[]
	/** Blueprint conflicts surfaced to the caller. */
	conflicts: string[]
	/** Deferred generator steps run after base files are materialized. */
	generatorSteps: ProjectGeneratorStep[]
	/** Relative files expected after base files and deferred generator steps complete. */
	predictedFiles: string[]
	/** Install command matching the selected package manager. */
	installCommand: string
	/** Package manager selected for generated scripts and install guidance. */
	packageManager: PackageManager
}
