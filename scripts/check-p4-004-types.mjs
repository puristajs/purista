import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const ts = require('typescript')

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const workspaceRoot = path.dirname(repositoryRoot)
const configPath = path.join(repositoryRoot, 'packages/core/tsconfig.json')
const ownedRootPaths = [
	'packages/core/src/HarnessMount/runtime.ts',
	'packages/core/src/HarnessMount/types.ts',
	'packages/core/src/HarnessMount/harnessMount.test.ts',
	'packages/core/src/ServiceBuilder/ServiceBuilder.impl.ts',
	'packages/core/src/core/Service/Service.impl.ts',
]
const ownedRootFiles = ownedRootPaths.map(file => path.join(repositoryRoot, file))
const ownedRoots = new Set(ownedRootFiles.map(file => path.resolve(file)))

const expectedTransitiveDiagnostics = [
	{
		file: 'packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts',
		code: 2536,
		message: "Type '\"catalog\"' cannot be used to index type 'D'.",
		count: 1,
	},
	{
		file: 'packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts',
		code: 2536,
		message: 'Type \'"models"\' cannot be used to index type \'D["catalog"]\'.',
		count: 1,
	},
	{
		file: 'packages/core/src/CommandDefinitionBuilder/CommandDefinitionBuilder.impl.ts',
		code: 2707,
		message:
			"Generic type 'HarnessTargetContract<Kind, Id, Input, Output, Updates, Interrupts, Inference>' requires between 6 and 7 type arguments.",
		count: 2,
	},
	{
		file: 'packages/core/src/HarnessMount/model.ts',
		code: 2305,
		message: "Module '\"@purista/harness\"' has no exported member 'BuilderState'.",
		count: 1,
	},
	{
		file: 'packages/core/src/HarnessMount/model.ts',
		code: 2344,
		message: [
			'Type \'D["catalog"]["models"][Alias]\' does not satisfy the constraint \'{ capabilities: readonly ModelCapability[]; }\'.',
			'  Type \'D["catalog"]["models"][keyof D["catalog"]["models"] & string]\' is not assignable to type \'{ capabilities: readonly ModelCapability[]; }\'.',
			'    Type \'D["catalog"]["models"][string]\' is not assignable to type \'{ capabilities: readonly ModelCapability[]; }\'.',
		].join('\n'),
		count: 1,
	},
	{
		file: 'packages/core/src/HarnessMount/model.ts',
		code: 2345,
		message: [
			"Argument of type 'HarnessDefinition<any>' is not assignable to parameter of type 'HarnessDefinition<BuilderState>'.",
			"  Type 'HarnessDefinition<any>' is not assignable to type '{ readonly kind: \"harness\"; readonly name: string; readonly revision?: string | undefined; readonly defaults: Readonly<ResolvedHarnessExecutionDefaults>; ... 8 more ...; readonly [harnessCompiledGraphType]: (graph: HarnessGraphForCatalog<...>) => HarnessGraphForCatalog<...>; }'.",
			"    The types returned by 'addAgent(...)' are incompatible between these types.",
			"      Type 'HarnessDefinition<WithAgent<any, any>, string, HarnessGraphForCatalog<WithAgent<any, any>>>' is not assignable to type 'HarnessDefinition<WithAgent<BuilderState, any>, string, HarnessGraphForCatalog<WithAgent<BuilderState, any>>>'.",
			"        Type 'HarnessDefinition<WithAgent<any, any>, string, HarnessGraphForCatalog<WithAgent<any, any>>>' is not assignable to type '{ readonly kind: \"harness\"; readonly name: string; readonly revision?: string | undefined; readonly defaults: Readonly<ResolvedHarnessExecutionDefaults>; ... 8 more ...; readonly [harnessCompiledGraphType]: (graph: HarnessGraphForCatalog<...>) => HarnessGraphForCatalog<...>; }'.",
			"          Types of property '[harnessCompiledGraphType]' are incompatible.",
			"            Type '(graph: HarnessGraphForCatalog<WithAgent<any, any>>) => HarnessGraphForCatalog<WithAgent<any, any>>' is not assignable to type '(graph: HarnessGraphForCatalog<WithAgent<BuilderState, any>>) => HarnessGraphForCatalog<WithAgent<BuilderState, any>>'.",
			"              Types of parameters 'graph' and 'graph' are incompatible.",
			"                Type 'HarnessGraphForCatalog<WithAgent<BuilderState, any>>' is not assignable to type 'HarnessGraphForCatalog<WithAgent<any, any>>'.",
			'                  Type \'import("<workspace>/ai-harness/packages/harness/dist/runtime/runtime-requirements").RuntimeRequirementsFor<Readonly<Record<never, never>>, Readonly<Record<never, never>>, Readonly<Record<never, never>>, Readonly<Record<string, any>>, Readonly<...>>\' is not assignable to type \'import("<workspace>/ai-harness/packages/harness/dist/runtime/runtime-requirements").RuntimeRequirementsFor<Readonly<Record<never, never>>, Readonly<Record<never, never>>, Readonly<Record<never, never>>, Readonly<Record<string, any>>, Readonly<...>>\'. Two different types with this name exist, but they are unrelated.',
			"                    Types of property 'mcpServers' are incompatible.",
			"                      Type 'readonly any[]' is not assignable to type 'readonly never[]'.",
			"                        Type 'any' is not assignable to type 'never'.",
		].join('\n'),
		count: 1,
	},
	{
		file: 'packages/core/src/HarnessMount/model.ts',
		code: 2536,
		message: "Type '\"catalog\"' cannot be used to index type 'D'.",
		count: 3,
	},
	{
		file: 'packages/core/src/HarnessMount/model.ts',
		code: 2536,
		message: 'Type \'"models"\' cannot be used to index type \'D["catalog"]\'.',
		count: 3,
	},
	{
		file: 'packages/core/src/HarnessMount/remoteTargetContract.ts',
		code: 2344,
		message:
			"Type 'HydratedHarnessTargetContract<Kind, Name, InputSchema, OutputSchema, Updates, Interrupts, Queue>' does not satisfy the constraint 'HarnessTargetContract<HarnessTargetKind, string, ModelSchema, ModelSchema, HarnessOutputUpdateKind, readonly HarnessInterruptKind[], HarnessTargetInference<...>>'.",
		count: 2,
	},
	{
		file: 'packages/core/src/QueueWorkerBuilder/QueueWorkerBuilder.impl.ts',
		code: 2536,
		message: "Type '\"catalog\"' cannot be used to index type 'D'.",
		count: 1,
	},
	{
		file: 'packages/core/src/QueueWorkerBuilder/QueueWorkerBuilder.impl.ts',
		code: 2536,
		message: 'Type \'"models"\' cannot be used to index type \'D["catalog"]\'.',
		count: 1,
	},
	{
		file: 'packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts',
		code: 2536,
		message: "Type '\"catalog\"' cannot be used to index type 'D'.",
		count: 1,
	},
	{
		file: 'packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts',
		code: 2536,
		message: 'Type \'"models"\' cannot be used to index type \'D["catalog"]\'.',
		count: 1,
	},
	{
		file: 'packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts',
		code: 2707,
		message:
			"Generic type 'HarnessTargetContract<Kind, Id, Input, Output, Updates, Interrupts, Inference>' requires between 6 and 7 type arguments.",
		count: 2,
	},
	{
		file: 'packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts',
		code: 2536,
		message: "Type '\"catalog\"' cannot be used to index type 'D'.",
		count: 1,
	},
	{
		file: 'packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts',
		code: 2536,
		message: 'Type \'"models"\' cannot be used to index type \'D["catalog"]\'.',
		count: 1,
	},
	{
		file: 'packages/core/src/SubscriptionDefinitionBuilder/SubscriptionDefinitionBuilder.impl.ts',
		code: 2707,
		message:
			"Generic type 'HarnessTargetContract<Kind, Id, Input, Output, Updates, Interrupts, Inference>' requires between 6 and 7 type arguments.",
		count: 2,
	},
]

const config = ts.readConfigFile(configPath, ts.sys.readFile)
if (config.error) failWithConfigDiagnostics([config.error])
const parsed = ts.parseJsonConfigFileContent(
	config.config,
	ts.sys,
	path.dirname(configPath),
	{ noEmit: true, incremental: false },
	configPath,
)
if (parsed.errors.length > 0) failWithConfigDiagnostics(parsed.errors)

const program = ts.createProgram({ rootNames: ownedRootFiles, options: parsed.options })
const diagnostics = ts.getPreEmitDiagnostics(program)
const globalDiagnostics = diagnostics.filter(diagnostic => diagnostic.file === undefined)
const ownedDiagnostics = diagnostics.filter(
	diagnostic => diagnostic.file !== undefined && ownedRoots.has(path.resolve(diagnostic.file.fileName)),
)
const transitiveDiagnostics = diagnostics.filter(
	diagnostic => diagnostic.file !== undefined && !ownedRoots.has(path.resolve(diagnostic.file.fileName)),
)

const expectedTransitive = toMultiset(expectedTransitiveDiagnostics)
const actualTransitive = toMultiset(transitiveDiagnostics.map(normalizeDiagnostic))
const missingTransitive = subtractMultisets(expectedTransitive, actualTransitive)
const unexpectedTransitive = subtractMultisets(actualTransitive, expectedTransitive)

if (
	globalDiagnostics.length === 0 &&
	ownedDiagnostics.length === 0 &&
	missingTransitive.length === 0 &&
	unexpectedTransitive.length === 0
) {
	process.stdout.write('P4-004 TypeScript gate passed: 0 owned and 25 exact transitive P4-001 diagnostics.\n')
	process.exit(0)
}

process.stderr.write('P4-004 TypeScript gate failed.\n')
if (globalDiagnostics.length > 0)
	printDiagnosticGroup('Global diagnostics', globalDiagnostics.map(normalizeGlobalDiagnostic))
if (ownedDiagnostics.length > 0)
	printDiagnosticGroup('Owned diagnostics (expected 0)', ownedDiagnostics.map(normalizeDiagnostic))
if (missingTransitive.length > 0) printEntries('Missing transitive P4-001 diagnostics', missingTransitive)
if (unexpectedTransitive.length > 0) printEntries('Unexpected transitive diagnostics', unexpectedTransitive)
if (missingTransitive.length === 0 && unexpectedTransitive.length === 0) {
	process.stderr.write('Transitive P4-001 baseline matched exactly: 25 diagnostics.\n')
}
process.exit(1)

function normalizeDiagnostic(diagnostic) {
	return {
		file: normalizeFile(diagnostic.file.fileName),
		code: diagnostic.code,
		message: normalizeMessage(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')),
		count: 1,
	}
}

function normalizeGlobalDiagnostic(diagnostic) {
	return {
		file: '<global>',
		code: diagnostic.code,
		message: normalizeMessage(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')),
		count: 1,
	}
}

function normalizeFile(file) {
	return path.relative(repositoryRoot, path.resolve(file)).split(path.sep).join('/')
}

function normalizeMessage(message) {
	return message.split(workspaceRoot).join('<workspace>').split(path.sep).join('/')
}

function toMultiset(entries) {
	const multiset = new Map()
	for (const entry of entries) {
		const normalized = { file: entry.file, code: entry.code, message: entry.message }
		const key = JSON.stringify(normalized)
		multiset.set(key, (multiset.get(key) ?? 0) + (entry.count ?? 1))
	}
	return multiset
}

function subtractMultisets(left, right) {
	const difference = []
	for (const [key, leftCount] of left) {
		const count = leftCount - (right.get(key) ?? 0)
		if (count > 0) difference.push({ ...JSON.parse(key), count })
	}
	return difference.sort(compareEntries)
}

function compareEntries(left, right) {
	return compareText(left.file, right.file) || left.code - right.code || compareText(left.message, right.message)
}

function compareText(left, right) {
	return left < right ? -1 : left > right ? 1 : 0
}

function printDiagnosticGroup(label, diagnostics) {
	const entries = [...toMultiset(diagnostics)]
		.map(([key, count]) => ({ ...JSON.parse(key), count }))
		.sort(compareEntries)
	printEntries(`${label}: ${diagnostics.length}`, entries)
}

function printEntries(label, entries) {
	process.stderr.write(`${label}:\n`)
	for (const entry of entries) {
		const suffix = entry.count === 1 ? '' : ` (count ${entry.count})`
		process.stderr.write(`  ${entry.file} TS${entry.code}${suffix}: ${entry.message.replaceAll('\n', '\n    ')}\n`)
	}
}

function failWithConfigDiagnostics(diagnostics) {
	process.stderr.write('P4-004 TypeScript gate failed before program creation.\n')
	printDiagnosticGroup('Configuration diagnostics', diagnostics.map(normalizeGlobalDiagnostic))
	process.exit(1)
}
