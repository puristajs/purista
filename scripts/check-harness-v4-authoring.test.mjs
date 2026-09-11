#!/usr/bin/env node

import assert from 'node:assert/strict'
import { lstat, mkdir, mkdtemp, readdir, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
	auditSource,
	collectFiles,
	filesToScan,
	isContained,
	repositoryRoot,
	scanRepository,
	workspaceRoot,
} from './check-harness-v4-authoring.mjs'

const here = fileURLToPath(new URL('.', import.meta.url))
const fixtureRoot = join(here, 'fixtures', 'harness-v4')
const fixture = name => join(fixtureRoot, name)
const readFixture = async name => readFile(fixture(name), 'utf8')
const expectFixtureRule = async (name, rule) => {
	const findings = auditSource(fixture(name), await readFixture(name))
	assert(
		findings.some(item => item.rule === rule),
		`${name}: expected ${rule}`,
	)
}

await expectFixtureRule('removed-import.ts', 'removed-import-export')
await expectFixtureRule('removed-declarations.ts', 'removed-import-export')
await expectFixtureRule('removed-export-assignments.ts', 'removed-import-export')
await expectFixtureRule('agent-handler.ts', 'custom-agent-handler')
await expectFixtureRule('agent-handler-forms.ts', 'custom-agent-handler')
await expectFixtureRule('mount-publish.ts', 'mounted-target-publish')
await expectFixtureRule('terminal-builder.ts', 'terminal-harness-builder')
await expectFixtureRule('registry-methods.ts', 'removed-registry-api')
await expectFixtureRule('removed-prose.md', 'removed-name')
await expectFixtureRule('removed-layout.md', 'top-level-harness-layout')
await expectFixtureRule('removed-registry.md', 'removed-registry-api')
await expectFixtureRule('manual-bindings.md', 'manual-host-tool-bindings')
await expectFixtureRule('direct-target.md', 'direct-target-execution')
await expectFixtureRule('legacy-arity.ts', 'legacy-invocation-arity')
await expectFixtureRule('invocation-arity.md', 'legacy-invocation-arity')
await expectFixtureRule('fences.md', 'removed-name')

assert.deepEqual(auditSource(fixture('allowed.ts'), await readFixture('allowed.ts')), [])
assert.deepEqual(auditSource(fixture('allowed-publish.ts'), await readFixture('allowed-publish.ts')), [])
assert.deepEqual(auditSource(fixture('allowed-fence.md'), await readFixture('allowed-fence.md')), [])
assert.deepEqual(
	auditSource(
		fixture('allowed.ts'),
		"defineAgent('nested', { model: 'tools', tools: [{ handler: async () => ({}) }] })",
	),
	[],
	'nested tool handlers must not be treated as agent handlers',
)
assert(
	auditSource(fixture('allowed.ts'), "defineAgent('missing', { instructions: 'Answer.' })").some(
		item => item.rule === 'missing-agent-model',
	),
	'an agent without an explicit alias must be reported',
)
assert.deepEqual(
	auditSource(fixture('allowed.ts'), "defineAgent('answer', { model: 'answering', instructions: 'Answer.' })"),
	[],
	'an application-chosen agent model alias is valid',
)
assert(
	auditSource(
		fixture('allowed.ts'),
		"import { defineHarness } from '@purista/harness'\ndefinition.getInstance({ model: { provider, model: 'provider-id' } })",
	).some(item => item.rule === 'singular-harness-model'),
	'the removed singular standalone model binding must be reported',
)
assert(
	auditSource(
		fixture('allowed.ts'),
		"service.getInstance(eventBridge, { ai: { model: { provider, model: 'provider-id' } } })",
	).some(item => item.rule === 'singular-harness-model'),
	'the removed singular hosted model binding must be reported',
)
assert.deepEqual(
	auditSource(
		fixture('allowed.ts'),
		'// @ts-expect-error singular model bindings are intentionally rejected\nservice.getInstance(eventBridge, { ai: { model: binding } })',
	),
	[],
	'negative type tests may document the rejected singular model binding',
)
assert.deepEqual(
	auditSource(
		fixture('allowed.ts'),
		"service.getInstance(eventBridge, { ai: { models: { answering: { provider, model: 'provider-id' } } } })",
	),
	[],
	'an exact hosted alias map is valid',
)
assert.deepEqual(
	auditSource(fixture('fences.md'), '```ts\nold\n~~~'),
	[],
	'mismatched fence delimiters must not be parsed',
)
assert.equal(
	auditSource(fixture('allowed.ts'), "```ts\nworker.canInvokeAgent('Service', '1', agent)\n```").filter(
		item => item.rule === 'legacy-invocation-arity',
	).length,
	0,
	'three agent invocation arguments are valid',
)
assert(
	auditSource(fixture('allowed.ts'), '```ts title="src/harness/<service>"\nconst ok = true\n```').some(
		item => item.rule === 'top-level-harness-layout',
	),
	'fence info/title must be inspected',
)
assert.deepEqual(
	auditSource(
		fixture('allowed.ts'),
		'```ts title="src/service/foo/v1/harness/supportHarness.ts"\nconst path = "src/service/**/harness/**"\n```',
	),
	[],
	'service-owned harness paths are valid',
)
assert.deepEqual(
	auditSource(
		fixture('allowed.ts'),
		'```ts\nconst first = "src/harness-support/tool.ts"\nconst second = "src/agents-helper.ts"\n```',
	),
	[],
	'similarly prefixed application paths must not be treated as removed layouts',
)
const nativeHarnessFence = '```ts title="src/harness/support.ts"\nconst path = "src/harness/support.ts"\n```'
assert.equal(
	auditSource(join(repositoryRoot, 'web/src/content/handbook/harness/example.md'), nativeHarnessFence).filter(
		item => item.rule === 'top-level-harness-layout',
	).length,
	0,
	'native Harness handbook surfaces are exempt from the application layout rule',
)
assert.equal(
	auditSource(join(workspaceRoot, 'ai-harness/examples/example.md'), nativeHarnessFence).filter(
		item => item.rule === 'top-level-harness-layout',
	).length,
	0,
	'standalone Harness examples are exempt from the application layout rule',
)
assert(
	auditSource(join(repositoryRoot, 'web/src/content/tutorials/example.md'), nativeHarnessFence).some(
		item => item.rule === 'top-level-harness-layout',
	),
	'PURISTA tutorial surfaces retain the application layout check',
)
const annotated =
	"// @ts-expect-error\ndefineAgent('invalid', { handler: async () => ({}) })\ndefineAgent('valid-to-audit', { handler: async () => ({}) })"
const annotatedFindings = auditSource(fixture('allowed.ts'), annotated).filter(
	item => item.rule === 'custom-agent-handler',
)
assert.equal(annotatedFindings.length, 1, 'suppression must apply only to the annotated call')
assert.equal(annotatedFindings[0].line, 3, 'the unannotated call must be the reported line')

const temp = await mkdtemp('/tmp/harness-v4-authoring-')
try {
	const migration = join(temp, 'web/src/content/migration/before.mdx')
	const similarlyNamed = join(temp, 'web/src/content/migration-notes.mdx')
	const negative = join(temp, 'ai-harness/packages/harness/type-tests/removed-v3-api.ts')
	const similarlyNamedNegative = join(temp, 'ai-harness/packages/harness/type-tests/removed-v3-api-copy.ts')
	await mkdir(join(temp, 'web/src/content/migration'), { recursive: true })
	await mkdir(join(temp, 'ai-harness/packages/harness/type-tests'), { recursive: true })
	await writeFile(migration, '```ts\ndefineHarnessModule()\n```')
	await writeFile(similarlyNamed, '```ts\ndefineHarnessModule()\n```')
	await writeFile(negative, 'import { BuilderState } from "x"')
	await writeFile(similarlyNamedNegative, 'import { BuilderState } from "x"')
	assert.deepEqual(auditSource(migration, await readFile(migration, 'utf8')), [])
	assert(auditSource(similarlyNamed, await readFile(similarlyNamed, 'utf8')).length > 0)
	assert.deepEqual(auditSource(negative, await readFile(negative, 'utf8')), [])
	assert(auditSource(similarlyNamedNegative, await readFile(similarlyNamedNegative, 'utf8')).length > 0)

	const symlinkRoot = join(temp, 'symlinks')
	await mkdir(symlinkRoot)
	await symlink(fixture('removed-import.ts'), join(symlinkRoot, 'linked.ts'))
	assert.deepEqual(await collectFiles(symlinkRoot), [], 'symlinks must not be traversed')
	assert.equal(isContained(symlinkRoot, join(symlinkRoot, 'linked.ts')), true)
	assert.equal(isContained(symlinkRoot, join(temp, 'outside.ts')), false)
	for (const ignored of ['node_modules', 'dist', 'coverage']) {
		const ignoredRoot = join(temp, ignored)
		await mkdir(ignoredRoot)
		await writeFile(join(ignoredRoot, 'hidden.ts'), 'import { BuilderState } from "x"')
		assert(
			!(await collectFiles(temp)).some(file => file.startsWith(`${ignoredRoot}${sep}`)),
			`ignored directory ${ignored} must not be scanned`,
		)
	}
	const internal = join(temp, 'ai-harness/packages/harness/src/harness/internal.ts')
	await mkdir(join(temp, 'ai-harness/packages/harness/src/harness'), { recursive: true })
	await writeFile(internal, 'import { BuilderState } from "x"')
	assert(
		auditSource(internal, await readFile(internal, 'utf8')).some(item => item.rule === 'removed-import-export'),
		'internal Harness paths must still be audited',
	)
} finally {
	await rm(temp, { recursive: true, force: true })
}

const scanned = await filesToScan()
assert.deepEqual(scanned, [...scanned].sort(), 'scan ordering must be deterministic')
for (const root of [
	join(repositoryRoot, 'packages'),
	join(repositoryRoot, 'examples'),
	join(repositoryRoot, 'web/src/content'),
	join(repositoryRoot, 'skills'),
	join(workspaceRoot, 'starter'),
	join(workspaceRoot, 'create-purista'),
	join(workspaceRoot, 'ai-harness/packages'),
	join(workspaceRoot, 'ai-harness/examples'),
	join(workspaceRoot, 'ai-harness/specs'),
])
	assert(
		scanned.some(file => file === root || file.startsWith(`${root}${sep}`)),
		`missing scan root ${root}`,
	)
const rootMarkdown = (await readdir(join(workspaceRoot, 'ai-harness'), { withFileTypes: true }))
	.filter(entry => entry.isFile() && entry.name.endsWith('.md'))
	.map(entry => join(workspaceRoot, 'ai-harness', entry.name))
for (const file of rootMarkdown) assert(scanned.includes(file), `missing dynamic ai-harness root markdown ${file}`)

const first = await scanRepository()
const second = await scanRepository()
assert.deepEqual(first, second, 'scan results must be deterministic')
assert.equal((await lstat(fixture('removed-import.ts'))).isFile(), true)

process.stdout.write('Harness v4 authoring fixture tests passed.\n')
