import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
	copyFileSync,
	cpSync,
	existsSync,
	linkSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	renameSync,
	rmSync,
	symlinkSync,
	writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import {
	assertAllowedStagedReference,
	assertInstalledOrigins,
	assertOfflineCache,
	assertPackageClosure,
	assertSameBaseline,
	assertTarballMap,
	cloneOfflineCache,
	consumerClosure,
	discoverFixtures,
	documentedChecks,
	expectedArtifactVersion,
	parseArgs,
	readByteBaseline,
	run,
	withScratch,
} from './verify-harness-v4-packed-consumers.mjs'

function temporary(operation) {
	const root = mkdtempSync(join(tmpdir(), 'packed-v4-test-'))
	try {
		return operation(root)
	} finally {
		rmSync(root, { recursive: true, force: true })
	}
}
function writeJson(path, value) {
	mkdirSync(join(path, '..'), { recursive: true })
	writeFileSync(path, JSON.stringify(value))
}
function cache(root) {
	const path = join(root, 'cache')
	for (const directory of ['content-v2', 'index-v5']) {
		mkdirSync(join(path, '_cacache', directory), { recursive: true })
		writeFileSync(join(path, '_cacache', directory, 'fixture'), 'unit-test cache sentinel')
	}
	return path
}
function tarball(root, name = '@purista/core', override = {}) {
	const manifest = { name, version: '4.0.0', ...override }
	const source = join(root, 'source', name.replace('/', '__'))
	writeJson(join(source, 'package/package.json'), manifest)
	mkdirSync(join(root, 'tarballs'), { recursive: true })
	const path = join(
		root,
		'tarballs',
		`${name.replace('@', '').replace('/', '-')}-${name === 'create-purista' ? '3.0.0' : '4.0.0'}.tgz`,
	)
	execFileSync('tar', ['-czf', path, '-C', source, 'package'])
	return {
		...manifest,
		tarball: path,
		integrity: `sha512-${createHash('sha512').update(readFileSync(path)).digest('base64')}`,
	}
}
function installState(root, staged, override = {}) {
	const directory = join(root, 'consumer')
	const packages = {}
	for (const item of staged) {
		writeJson(join(directory, 'node_modules', item.name, 'package.json'), { name: item.name, version: item.version })
		packages[`node_modules/${item.name}`] = {
			version: item.version,
			resolved: `file:${item.tarball}`,
			integrity: item.integrity,
			...override,
		}
	}
	writeJson(join(directory, 'package-lock.json'), { lockfileVersion: 3, packages })
	return directory
}

test('explicit offline cache and exact CLI shape are required', () =>
	temporary(root => {
		const valid = cache(root)
		assert.deepEqual(parseArgs(['--check', '--offline-cache', valid]), { check: true, offlineCache: valid })
		for (const args of [
			[],
			['--check'],
			['--check', '--offline-cache'],
			['--check', '--offline-cache', valid, '--online'],
		])
			assert.throws(() => parseArgs(args), /ARGUMENT_INVALID/)
		let called = false
		assert.throws(
			() =>
				withScratch(join(root, 'missing'), () => {
					called = true
				}),
			/OFFLINE_CACHE_MISSING/,
		)
		assert.equal(called, false)
		const empty = join(root, 'empty')
		mkdirSync(join(empty, '_cacache'), { recursive: true })
		assert.throws(
			() =>
				withScratch(empty, () => {
					called = true
				}),
			/OFFLINE_CACHE_INVALID/,
		)
		assert.equal(called, false)
		assert.doesNotThrow(() => assertOfflineCache(valid))
	}))

test('only minted, intact tarballs are valid local origins', () =>
	temporary(root => {
		const item = tarball(root)
		assert.doesNotThrow(() => assertAllowedStagedReference(`file:${item.tarball}`, root, [item]))
		for (const reference of [
			'workspace:*',
			'link:../core',
			'copy:../core',
			'latest',
			'*',
			'^4.0.0',
			'4.0.0',
			'@purista/core',
			'npm:@purista/core@4.0.0',
			'https://registry.npmjs.org/core.tgz',
			'file:source',
			'file:../core.tgz',
			'file:source/core.ts',
			'file:missing.tgz',
		])
			assert.throws(() => assertAllowedStagedReference(reference, root, [item]), /DEPENDENCY_REFERENCE_FORBIDDEN/)
		assert.throws(
			() => assertAllowedStagedReference(`file:${item.tarball}`, root, []),
			/DEPENDENCY_REFERENCE_FORBIDDEN/,
		)
		writeFileSync(item.tarball, 'tampered')
		assert.throws(
			() => assertAllowedStagedReference(`file:${item.tarball}`, root, [item]),
			/DEPENDENCY_REFERENCE_FORBIDDEN/,
		)
	}))

test('closure validates exact versions, missing members and every internal dependency field', () => {
	const harness = { name: '@purista/harness', version: '4.0.0' }
	const core = { name: '@purista/core', version: '4.0.0' }
	assert.doesNotThrow(() => assertPackageClosure([harness, core]))
	assert.throws(() => assertPackageClosure([core, core]), /PACKAGE_DUPLICATE/)
	for (const version of ['3.2.4', '4.0.1', '4.0.0-beta.1'])
		assert.throws(() => assertPackageClosure([{ ...core, version }]), /STAGED_VERSION_INVALID/)
	for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
		assert.doesNotThrow(() => assertPackageClosure([harness, { ...core, [field]: { '@purista/harness': '^4.0.0' } }]))
		for (const range of ['*', 'latest', '^3.0.0', '4.0.0', 'workspace:*', 'file:../harness'])
			assert.throws(
				() => assertPackageClosure([harness, { ...core, [field]: { '@purista/harness': range } }]),
				/INTERNAL_EDGE_INVALID/,
			)
		assert.throws(
			() => assertPackageClosure([{ ...core, [field]: { '@purista/missing': '^4.0.0' } }]),
			/CLOSURE_PACKAGE_MISSING/,
		)
	}
})

test('missing, renamed, duplicate, stale and substituted tarballs fail closed', () =>
	temporary(root => {
		const item = tarball(root)
		assert.doesNotThrow(() => assertTarballMap([item], root))
		copyFileSync(item.tarball, join(root, 'tarballs', 'duplicate.tgz'))
		assert.throws(() => assertTarballMap([item], root), /TARBALL_INVENTORY_INVALID/)
		rmSync(join(root, 'tarballs', 'duplicate.tgz'))
		assert.throws(() => assertTarballMap([item, item], root), /PACKAGE_DUPLICATE/)
		renameSync(item.tarball, `${item.tarball}.renamed`)
		assert.throws(() => assertTarballMap([item], root), /TARBALL_MISSING/)
		assert.throws(
			() => assertTarballMap([{ ...item, tarball: `${item.tarball}.renamed` }], root),
			/TARBALL_NAME_INVALID/,
		)
		rmSync(`${item.tarball}.renamed`)
		const stale = tarball(root, '@purista/core', { version: '3.0.0' })
		assert.throws(() => assertTarballMap([{ ...stale, version: '4.0.0' }], root), /TARBALL_IDENTITY_INVALID/)
		const mismatch = tarball(root, '@purista/core', { dependencies: { '@purista/core': '^3.0.0' } })
		assert.throws(
			() => assertTarballMap([{ ...mismatch, dependencies: { '@purista/core': '^4.0.0' } }], root),
			/TARBALL_METADATA_INVALID/,
		)
	}))

test('consumer closure traverses runtime/peer/optional edges in deterministic order', () => {
	const packages = [
		{ name: '@purista/core', version: '4.0.0', dependencies: { '@purista/harness': '^4.0.0' } },
		{ name: '@purista/harness', version: '4.0.0' },
		{ name: '@purista/cli', version: '4.0.0', peerDependencies: { '@purista/core': '^4.0.0' } },
	]
	const input = { devDependencies: { '@purista/cli': '^4.0.0' } }
	assert.deepEqual(
		consumerClosure(input, packages, 'example').map(item => item.name),
		['@purista/cli', '@purista/core', '@purista/harness'],
	)
	assert.deepEqual(
		consumerClosure(input, packages.toReversed(), 'example'),
		consumerClosure(input, packages, 'example'),
	)
	for (const range of [
		'*',
		'latest',
		'^3.0.0',
		'workspace:*',
		'link:../core',
		'file:../core',
		'copy:../core',
		'https://registry.npmjs.org/core.tgz',
	])
		assert.throws(
			() => consumerClosure({ dependencies: { '@purista/core': range } }, packages, 'named-consumer'),
			error =>
				error.detail.consumer === 'named-consumer' &&
				error.detail.package === '@purista/core' &&
				error.detail.code === 'CONSUMER_RANGE_INVALID',
		)
	assert.throws(() => consumerClosure(input, [], 'example'), /CLOSURE_PACKAGE_MISSING/)
})

test('installed lock origins, manifests, nested fallbacks and symlinks are checked', () =>
	temporary(root => {
		const item = tarball(root)
		let directory = installState(root, [item])
		assert.equal(assertInstalledOrigins(directory, [item])[0].symlink, false)
		for (const resolved of [
			'https://registry.npmjs.org/core.tgz',
			'file:../source',
			'workspace:*',
			'link:../core',
			'file:wrong.tgz',
		]) {
			installState(root, [item], { resolved })
			assert.throws(() => assertInstalledOrigins(directory, [item]), /INSTALLED_ORIGIN_INVALID/)
		}
		for (const override of [{ link: true }, { version: '3.2.4' }, { integrity: 'sha512-wrong' }]) {
			installState(root, [item], override)
			assert.throws(() => assertInstalledOrigins(directory, [item]), /INSTALLED_ORIGIN_INVALID/)
		}
		directory = installState(root, [item])
		writeJson(join(directory, 'node_modules/@purista/core/package.json'), { name: '@purista/wrong', version: '4.0.0' })
		assert.throws(() => assertInstalledOrigins(directory, [item]), /INSTALLED_IDENTITY_INVALID/)
		installState(root, [item])
		const external = join(root, 'ambient')
		writeJson(join(external, 'package.json'), { name: item.name, version: item.version })
		rmSync(join(directory, 'node_modules/@purista/core'), { recursive: true })
		symlinkSync(external, join(directory, 'node_modules/@purista/core'))
		assert.throws(() => assertInstalledOrigins(directory, [item]), /INSTALLED_IDENTITY_INVALID/)
		rmSync(join(directory, 'node_modules/@purista/core'))
		installState(root, [item])
		const lockPath = join(directory, 'package-lock.json')
		const lock = JSON.parse(readFileSync(lockPath))
		lock.packages['node_modules/other/node_modules/@purista/core'] = {
			version: '4.0.0',
			resolved: 'https://registry.npmjs.org/core.tgz',
		}
		writeJson(lockPath, lock)
		assert.throws(() => assertInstalledOrigins(directory, [item]), /INSTALLED_ORIGIN_INVALID/)
		writeJson(lockPath, { packages: {} })
		assert.throws(() => assertInstalledOrigins(directory, [item]), /INSTALLED_PACKAGE_MISSING/)
	}))

test('cleanup runs after success, command failure and injected validation failure; bytes are preserved', () =>
	temporary(root => {
		const valid = cache(root)
		const manifests = [
			'harness/package.json',
			'harness/package-lock.json',
			'harness/packages/one/package.json',
			'purista/package.json',
			'purista/package-lock.json',
			'purista/packages/two/package.json',
		].map(path => join(root, path))
		for (const path of manifests) writeJson(path, { preserved: path })
		const before = readByteBaseline(manifests)
		let scratch
		const result = withScratch(
			valid,
			path => {
				scratch = path
				return { completed: true }
			},
			() => manifests,
		)
		assert.equal(result.cleanup, 'complete')
		assert.equal(result.baseline.files, 6)
		assert.equal(existsSync(scratch), false)
		for (const operation of [
			() => {
				throw new Error('injected validation failure')
			},
			path => run(process.execPath, ['-e', 'process.exit(19)'], { cwd: path, consumer: 'named-consumer' }),
		]) {
			assert.throws(
				() =>
					withScratch(
						valid,
						path => {
							scratch = path
							return operation(path)
						},
						() => manifests,
					),
				error => error.cleanup === 'complete',
			)
			assert.equal(existsSync(scratch), false)
			assertSameBaseline(before, readByteBaseline(manifests))
		}
		assert.throws(
			() => run(process.execPath, ['-e', 'process.exit(19)'], { cwd: root, consumer: 'named-consumer' }),
			error =>
				error.detail.consumer === 'named-consumer' &&
				error.detail.exitCode === 19 &&
				error.detail.code === 'COMMAND_FAILED',
		)
		assert.throws(
			() =>
				withScratch(
					valid,
					path => {
						scratch = path
						writeJson(manifests[0], { changed: true })
						return {}
					},
					() => manifests,
				),
			/CANONICAL_BASELINE_CHANGED/,
		)
		assert.equal(existsSync(scratch), false)
		assert.throws(() => assertSameBaseline(before, { ...before, added: 'new' }), /CANONICAL_BASELINE_CHANGED/)
	}))

test('fixture inventory is discovered recursively and sorted without hardcoded consumer names', () =>
	temporary(root => {
		assert.throws(() => discoverFixtures(root), /FIXTURE_INVENTORY_EMPTY/)
		for (const name of ['z/new', 'a/fresh']) writeJson(join(root, name, 'package.json'), { name })
		assert.deepEqual(
			discoverFixtures(root).map(item => item.name),
			['tracked-fixture:a/fresh', 'tracked-fixture:z/new'],
		)
		assert.ok(discoverFixtures().some(item => item.name === 'tracked-fixture:fresh'))
	}))

test('copy-on-write cache clone is isolated from the declared seed', () =>
	temporary(root => {
		const seed = cache(root)
		const baseline = readByteBaseline([
			join(seed, '_cacache/content-v2/fixture'),
			join(seed, '_cacache/index-v5/fixture'),
		])
		const scratch = join(root, 'scratch')
		mkdirSync(scratch)
		const clone = cloneOfflineCache(seed, scratch)
		writeFileSync(join(clone.cachePath, '_cacache/content-v2/fixture'), 'npm cache writes stay isolated')
		assertSameBaseline(baseline, readByteBaseline(Object.keys(baseline)))
	}))

test('generated consumer checks preserve the declared compiler, test and build commands', () => {
	const checks = documentedChecks(
		{ scripts: { test: 'tsc --noEmit && vitest run src', build: 'tsc' } },
		'generated-base',
	)
	assert.deepEqual(
		checks.map(item => item.check),
		['typecheck', 'test', 'build'],
	)
	assert.equal(checks[0].command, 'tsc --noEmit')
	assert.equal(checks[0].source, 'package.json scripts.test prefix')
	assert.equal(checks[1].command, 'npm run test')
	assert.equal(checks[2].command, 'npm run build')
	assert.equal(
		documentedChecks({ scripts: { test: 'vitest run', build: 'tsc' } }, 'missing')[0].diagnostic.code,
		'CONSUMER_CHECK_MISSING',
	)
	assert.equal(documentedChecks({ scripts: { typecheck: 'tsc --noEmit' } }, 'explicit')[0].command, 'npm run typecheck')
})

test('cache symlinks are rejected before a scratch operation can mutate their targets', () =>
	temporary(root => {
		const seed = cache(root)
		symlinkSync(root, join(seed, 'ambient'))
		let staged = false
		assert.throws(
			() =>
				withScratch(seed, () => {
					staged = true
				}),
			/OFFLINE_CACHE_INVALID/,
		)
		assert.equal(staged, false)
	}))

test('generator stays at 3.0.0 while all Framework/Harness artifacts require 4.0.0', () =>
	temporary(root => {
		assert.equal(expectedArtifactVersion('create-purista'), '3.0.0')
		assert.equal(expectedArtifactVersion('@purista/harness'), '4.0.0')
		const core = tarball(root)
		const generator = tarball(root, 'create-purista', { version: '3.0.0' })
		assert.doesNotThrow(() => assertTarballMap([core, generator], root))
		const directory = installState(root, [generator])
		assert.equal(assertInstalledOrigins(directory, [generator])[0].version, '3.0.0')
		installState(root, [generator], { version: '4.0.0' })
		assert.throws(() => assertInstalledOrigins(directory, [generator]), /INSTALLED_ORIGIN_INVALID/)
		installState(root, [generator])
		writeJson(join(directory, 'node_modules/create-purista/package.json'), { name: 'create-purista', version: '4.0.0' })
		assert.throws(() => assertInstalledOrigins(directory, [generator]), /INSTALLED_IDENTITY_INVALID/)
		const stale = tarball(root, 'create-purista', { version: '4.0.0' })
		assert.throws(() => assertTarballMap([core, stale], root), /STAGED_VERSION_INVALID/)
		assert.throws(() => assertTarballMap([core, { ...stale, version: '3.0.0' }], root), /TARBALL_IDENTITY_INVALID/)
	}))

test('portable cache fallback copies into scratch with method evidence and no source alias', () =>
	temporary(root => {
		const seed = cache(root)
		const baseline = readByteBaseline([
			join(seed, '_cacache/content-v2/fixture'),
			join(seed, '_cacache/index-v5/fixture'),
		])
		for (const platform of ['darwin', 'linux', 'other']) {
			const scratch = join(root, platform)
			mkdirSync(scratch)
			const attempts = []
			const clone = cloneOfflineCache(seed, scratch, {
				platform,
				cloneCommand(command, args) {
					attempts.push({ command, args })
					mkdirSync(join(scratch, 'npm-cache'))
					writeFileSync(join(scratch, 'npm-cache', 'partial'), 'failed clone output')
					throw new Error('copy-on-write unsupported')
				},
			})
			assert.equal(clone.mode, 'offline-isolated-copy')
			assert.equal(clone.method, 'recursive-copy')
			assert.equal(existsSync(join(clone.cachePath, 'partial')), false)
			assert.equal(attempts.length, platform === 'other' ? 0 : 1)
			if (platform === 'darwin') assert.deepEqual(attempts[0].args.slice(0, 1), ['-cR'])
			if (platform === 'linux') assert.deepEqual(attempts[0].args.slice(0, 2), ['--reflink=always', '-R'])
			writeFileSync(join(clone.cachePath, '_cacache/content-v2/fixture'), 'isolated cache writes')
			assertSameBaseline(baseline, readByteBaseline(Object.keys(baseline)))
		}
	}))

test('successful reflink reports its method; hardlink aliases are rejected', () =>
	temporary(root => {
		const seed = cache(root)
		const scratch = join(root, 'linux')
		mkdirSync(scratch)
		const clone = cloneOfflineCache(seed, scratch, {
			platform: 'linux',
			cloneCommand(_command, args) {
				cpSync(args[2], args[3], { recursive: true })
			},
		})
		assert.equal(clone.mode, 'offline-copy-on-write')
		assert.equal(clone.method, 'linux-reflink')
		const bad = join(root, 'bad')
		mkdirSync(bad)
		assert.throws(
			() =>
				cloneOfflineCache(seed, bad, {
					platform: 'linux',
					cloneCommand(_command, args) {
						cpSync(args[2], args[3], { recursive: true })
						const target = join(args[3], '_cacache/content-v2/fixture')
						rmSync(target)
						linkSync(join(seed, '_cacache/content-v2/fixture'), target)
					},
				}),
			/CACHE_CLONE_NOT_ISOLATED/,
		)
	}))
