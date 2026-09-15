import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
	collectDependencyEdges,
	collectJsrManifests,
	collectReleaseManifests,
	collectVersionFiles,
	EXPECTED_COUNTS,
	EXPECTED_VERSION,
	parseArgs,
	runCheck,
	validateDependencyEdges,
	validateLockfile,
	validateMetadata,
} from './check-purista-v4-release-metadata.mjs'
import { buildPublishPlan } from './publishWorkspaces.mjs'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
assert.equal(collectReleaseManifests(repositoryRoot).length, EXPECTED_COUNTS.manifests)
assert.equal(collectVersionFiles(repositoryRoot).length, EXPECTED_COUNTS.versions)
assert.equal(collectJsrManifests(repositoryRoot).length, EXPECTED_COUNTS.jsr)
assert.equal(collectDependencyEdges(repositoryRoot).length, EXPECTED_COUNTS.edges)

const fixtureRoot = async ({
	version = EXPECTED_VERSION,
	staleVersion = false,
	staleJsr = false,
	invalidEdges = false,
	declaredHarness = false,
} = {}) => {
	const root = await mkdtemp(join(tmpdir(), 'purista-v4-metadata-'))
	await mkdir(join(root, 'packages', 'redis-scheduler-provider', 'src'), { recursive: true })
	await mkdir(join(root, 'packages', 'core', 'src'), { recursive: true })
	await mkdir(join(root, 'packages', 'core'), { recursive: true })
	await writeFile(
		join(root, 'package.json'),
		JSON.stringify({
			name: 'purista',
			version,
			...(declaredHarness ? { dependencies: { '@purista/harness-openai': '^4.0.0' } } : {}),
		}),
	)
	await writeFile(
		join(root, 'packages', 'core', 'package.json'),
		JSON.stringify({
			name: '@purista/core',
			version,
			dependencies: { '@purista/harness': invalidEdges ? '*' : '^4.0.0' },
		}),
	)
	await writeFile(
		join(root, 'packages', 'core', 'src', 'version.ts'),
		`export const puristaVersion = '${staleVersion ? '3.0.0' : version}'\n`,
	)
	await writeFile(
		join(root, 'packages', 'core', 'jsr.json'),
		JSON.stringify({ name: '@purista/core', version: staleVersion || staleJsr ? '3.0.0' : version }),
	)
	return root
}

const assertCode = (callback, code) => assert.throws(callback, error => error.code === code)

assert.deepEqual(parseArgs([]), { metadataOnly: false })
assert.deepEqual(parseArgs(['--metadata-only']), { metadataOnly: true })
assertCode(() => parseArgs(['--metadata-only', '--registry']), 'ARGUMENT_INVALID')

const root = await fixtureRoot()
try {
	await writeFile(
		join(root, 'package-lock.json'),
		JSON.stringify({
			version: '4.0.0',
			lockfileVersion: 3,
			packages: {
				'': { version: '4.0.0' },
				'packages/core': { version: '4.0.0' },
				'node_modules/@purista/harness': {
					version: '4.0.0',
					resolved: 'https://registry.npmjs.org/@purista/harness/-/harness-4.0.0.tgz',
					integrity: `sha512-${Buffer.alloc(64, 1).toString('base64')}`,
				},
			},
		}),
	)
	assert.deepEqual(
		collectReleaseManifests(root).map(item => item.relativePath),
		['package.json', 'packages/core/package.json'],
	)
	assert.deepEqual(
		collectVersionFiles(root).map(item => item.relativePath),
		['packages/core/src/version.ts'],
	)
	assert.deepEqual(
		collectJsrManifests(root).map(item => item.relativePath),
		['packages/core/jsr.json'],
	)
	assert.equal(
		collectReleaseManifests(root).some(item => item.relativePath.includes('redis-scheduler-provider')),
		false,
	)
	assert.equal(collectDependencyEdges(root).length, 1)
	assert.doesNotThrow(() => validateDependencyEdges(collectDependencyEdges(root), { expectedCount: 1 }))
	assert.doesNotThrow(() => validateMetadata(root, { expectedCounts: { manifests: 2, versions: 1, jsr: 1, edges: 1 } }))
	assert.equal(validateLockfile(root).harnessPackages, 1)
	assert.equal(
		runCheck({ args: ['--metadata-only'], root, expectedCounts: { manifests: 2, versions: 1, jsr: 1, edges: 1 } }).lock,
		undefined,
	)
} finally {
	await rm(root, { recursive: true, force: true })
}

for (const [mutate, code] of [
	[lock => ({ ...lock, lockfileVersion: 2 }), 'LOCKFILE_INVALID'],
	[lock => ({ ...lock, version: '3.0.0' }), 'LOCKFILE_INVALID'],
	[
		lock => ({
			...lock,
			packages: {
				'node_modules/@purista/harness': {
					version: '3.0.0',
					resolved: 'https://registry.npmjs.org/@purista/harness/-/harness-3.0.0.tgz',
					integrity: 'sha512-AAAA',
				},
			},
		}),
		'LOCK_PACKAGE_INVALID',
	],
	[
		lock => ({
			...lock,
			packages: {
				'node_modules/@purista/harness': { version: '4.0.0', resolved: 'file:../harness', integrity: 'sha512-AAAA' },
			},
		}),
		'LOCK_PACKAGE_INVALID',
	],
	[
		lock => ({
			...lock,
			packages: {
				'node_modules/@purista/harness': {
					version: '4.0.0',
					resolved: 'https://cache.example/harness.tgz',
					integrity: 'sha512-AAAA',
				},
			},
		}),
		'LOCK_PACKAGE_INVALID',
	],
	[
		lock => ({
			...lock,
			packages: {
				'node_modules/@purista/harness': {
					version: '4.0.0',
					resolved: 'https://registry.npmjs.org/@purista/harness/-/harness-4.0.0.tgz',
				},
			},
		}),
		'LOCK_PACKAGE_INVALID',
	],
]) {
	const temp = await fixtureRoot()
	try {
		await writeFile(
			join(temp, 'package-lock.json'),
			JSON.stringify(
				mutate({
					version: '4.0.0',
					lockfileVersion: 3,
					packages: {
						'': { version: '4.0.0' },
						'packages/core': { version: '4.0.0' },
						'node_modules/@purista/harness': {
							version: '4.0.0',
							resolved: 'https://registry.npmjs.org/@purista/harness/-/harness-4.0.0.tgz',
							integrity: 'sha512-AAAA',
						},
					},
				}),
			),
		)
		assertCode(() => validateLockfile(temp), code)
	} finally {
		await rm(temp, { recursive: true, force: true })
	}
}

{
	const temp = await fixtureRoot({ declaredHarness: true })
	try {
		await writeFile(
			join(temp, 'package-lock.json'),
			JSON.stringify({
				version: '4.0.0',
				lockfileVersion: 3,
				packages: {
					'node_modules/@purista/harness': {
						version: '4.0.0',
						resolved: 'https://registry.npmjs.org/@purista/harness/-/harness-4.0.0.tgz',
						integrity: `sha512-${Buffer.alloc(64, 1).toString('base64')}`,
					},
				},
			}),
		)
		assertCode(() => validateLockfile(temp), 'LOCK_PACKAGE_MISSING')
	} finally {
		await rm(temp, { recursive: true, force: true })
	}
}

for (const [workspacePackages, code] of [
	[
		{
			'node_modules/@purista/harness': {
				version: '4.0.0',
				resolved: 'https://registry.npmjs.org/@purista/harness/-/harness-4.0.0.tgz',
				integrity: `sha512-${Buffer.alloc(64, 1).toString('base64')}`,
			},
		},
		'LOCK_WORKSPACE_MISSING',
	],
	[
		{
			'': { version: '3.0.0' },
			'packages/core': { version: '4.0.0' },
			'node_modules/@purista/harness': {
				version: '4.0.0',
				resolved: 'https://registry.npmjs.org/@purista/harness/-/harness-4.0.0.tgz',
				integrity: `sha512-${Buffer.alloc(64, 1).toString('base64')}`,
			},
		},
		'LOCK_WORKSPACE_INVALID',
	],
]) {
	const temp = await fixtureRoot()
	try {
		await writeFile(
			join(temp, 'package-lock.json'),
			JSON.stringify({ version: '4.0.0', lockfileVersion: 3, packages: workspacePackages }),
		)
		assertCode(() => validateLockfile(temp), code)
	} finally {
		await rm(temp, { recursive: true, force: true })
	}
}

for (const fixture of [
	{ options: { staleVersion: true }, code: 'VERSION_ARTIFACT_INVALID' },
	{ options: { staleJsr: true }, code: 'JSR_METADATA_INVALID' },
	{ options: { invalidEdges: true }, code: 'DEPENDENCY_EDGE_INVALID' },
	{ options: { version: '3.0.0' }, code: 'MANIFEST_METADATA_INVALID' },
]) {
	const temp = await fixtureRoot(fixture.options)
	try {
		assertCode(
			() => validateMetadata(temp, { expectedCounts: { manifests: 2, versions: 1, jsr: 1, edges: 1 } }),
			fixture.code,
		)
	} finally {
		await rm(temp, { recursive: true, force: true })
	}
}

const manifests = [
	{ name: '@purista/core', version: '4.0.0', directory: '/core', manifest: { dependencies: {} } },
	{
		name: '@purista/adapter',
		version: '4.0.0',
		directory: '/adapter',
		manifest: { dependencies: { '@purista/core': '^4.0.0' } },
	},
	{
		name: '@purista/consumer',
		version: '4.0.0',
		directory: '/consumer',
		manifest: { dependencies: { '@purista/adapter': '^4.0.0' } },
	},
]
assert.deepEqual(
	buildPublishPlan(manifests).map(pkg => pkg.name),
	['@purista/core', '@purista/adapter', '@purista/consumer'],
)
assert.throws(
	() =>
		buildPublishPlan([
			{ ...manifests[0], manifest: { dependencies: { '@purista/consumer': '^4.0.0' } } },
			...manifests.slice(1),
		]),
	/cycle/,
)

const dryRunWorkflow = readFileSync(new URL('../.github/workflows/release_dry_run.yml', import.meta.url), 'utf8')
const publishWorkflow = readFileSync(new URL('../.github/workflows/release_publish.yml', import.meta.url), 'utf8')
const rootManifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const versionGenerator = readFileSync(new URL('./commitVersion.sh', import.meta.url), 'utf8')
assert.match(dryRunWorkflow, /node scripts\/publishWorkspaces\.mjs --dry-run/)
assert.match(publishWorkflow, /node scripts\/publishWorkspaces\.mjs\n/)
assert.doesNotMatch(dryRunWorkflow, /npm publish --workspaces/)
assert.doesNotMatch(publishWorkflow, /npm publish --workspaces/)
for (const releaseType of ['major', 'minor', 'patch']) {
	assert.match(rootManifest.scripts[`release:${releaseType}`], /node scripts\/publishWorkspaces\.mjs$/)
	assert.doesNotMatch(rootManifest.scripts[`release:${releaseType}`], /npm publish --workspaces/)
}
assert.match(versionGenerator, /\.\/packages\/\*\/package\.json/)
assert.doesNotMatch(versionGenerator, /for\s+\w+\s+in\s+\.\/packages\/\*\/;\s*do/)

{
	const temp = await fixtureRoot({ version: '3.2.4', staleJsr: true })
	const manifestlessVersion = join(temp, 'packages', 'redis-scheduler-provider', 'src', 'version.ts')
	try {
		await writeFile(manifestlessVersion, "export const puristaVersion = 'unchanged'\n")
		execFileSync(fileURLToPath(new URL('./commitVersion.sh', import.meta.url)), { cwd: temp, stdio: 'ignore' })
		assert.match(readFileSync(join(temp, 'packages', 'core', 'src', 'version.ts'), 'utf8'), /'3\.2\.4'/)
		assert.equal(JSON.parse(readFileSync(join(temp, 'packages', 'core', 'jsr.json'), 'utf8')).version, '3.2.4')
		assert.equal(readFileSync(manifestlessVersion, 'utf8'), "export const puristaVersion = 'unchanged'\n")
	} finally {
		await rm(temp, { recursive: true, force: true })
	}
}

for (const range of ['*', 'latest', '^3.0.0', 'file:../core', 'link:../core', 'workspace:*']) {
	assertCode(
		() => validateDependencyEdges([{ packageName: 'x', dependency: '@purista/core', range }], { expectedCount: 1 }),
		'DEPENDENCY_EDGE_INVALID',
	)
}
