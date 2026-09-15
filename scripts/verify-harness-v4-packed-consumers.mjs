#!/usr/bin/env node

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
	cpSync,
	existsSync,
	lstatSync,
	mkdirSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	realpathSync,
	rmSync,
	statSync,
	writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const puristaRoot = resolve(scriptDirectory, '..')
const workspaceRoot = resolve(puristaRoot, '..')
const harnessRoot = join(workspaceRoot, 'ai-harness')
const version = '4.0.0'
const dependencyFields = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']
const ignoredDirectories = new Set(['node_modules', '.git', 'coverage'])
const json = path => JSON.parse(readFileSync(path, 'utf8'))
const writeJson = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
const digest = path => createHash('sha512').update(readFileSync(path)).digest('base64')
const sorted = items => items.slice().sort((a, b) => a.name.localeCompare(b.name, 'en'))

export function diagnostic(code, fields = {}) {
	const detail = { code, ...fields }
	return Object.assign(new Error(JSON.stringify(detail)), { detail })
}

export function parseArgs(args) {
	if (
		args.length !== 3 ||
		args[0] !== '--check' ||
		args[1] !== '--offline-cache' ||
		!args[2] ||
		args[2].startsWith('--')
	)
		throw diagnostic('ARGUMENT_INVALID', { required: '--check --offline-cache <path>' })
	return { check: true, offlineCache: args[2] }
}

function filesUnder(root, accept = () => true) {
	if (!existsSync(root)) return []
	return readdirSync(root, { withFileTypes: true })
		.sort((a, b) => a.name.localeCompare(b.name, 'en'))
		.flatMap(entry => {
			if (ignoredDirectories.has(entry.name)) return []
			const path = join(root, entry.name)
			return entry.isDirectory() ? filesUnder(path, accept) : entry.isFile() && accept(path) ? [path] : []
		})
}

export function assertOfflineCache(cachePath) {
	if (!cachePath || !existsSync(cachePath) || !statSync(cachePath).isDirectory())
		throw diagnostic('OFFLINE_CACHE_MISSING', { cachePath })
	for (const directory of ['content-v2', 'index-v5']) {
		if (filesUnder(join(cachePath, '_cacache', directory)).length === 0)
			throw diagnostic('OFFLINE_CACHE_INVALID', { cachePath, reason: `empty _cacache/${directory}` })
	}
	const rejectLinks = directory => {
		if (lstatSync(directory).isSymbolicLink())
			throw diagnostic('OFFLINE_CACHE_INVALID', { cachePath, reason: 'cache symlinks cannot be isolated' })
		for (const entry of readdirSync(directory, { withFileTypes: true })) {
			if (entry.isSymbolicLink())
				throw diagnostic('OFFLINE_CACHE_INVALID', { cachePath, reason: 'cache symlinks cannot be isolated' })
			if (entry.isDirectory()) rejectLinks(join(directory, entry.name))
		}
	}
	rejectLinks(cachePath)
}

export function readByteBaseline(paths) {
	return Object.fromEntries(
		paths
			.slice()
			.sort()
			.map(path => [path, digest(path)]),
	)
}

export function assertSameBaseline(before, after) {
	const changed = [...new Set([...Object.keys(before), ...Object.keys(after)])]
		.filter(path => before[path] !== after[path])
		.sort()
	if (changed.length) throw diagnostic('CANONICAL_BASELINE_CHANGED', { changed })
}

export function withScratch(cachePath, operation, baselinePaths = () => []) {
	assertOfflineCache(cachePath)
	const before = readByteBaseline(baselinePaths())
	const cacheBefore = readByteBaseline(filesUnder(cachePath))
	const scratchRoot = mkdtempSync(join(tmpdir(), 'purista-harness-v4-packed-'))
	let result
	let failure
	try {
		result = operation(scratchRoot)
	} catch (error) {
		failure = error
	} finally {
		rmSync(scratchRoot, { recursive: true, force: true })
		assertSameBaseline(before, readByteBaseline(baselinePaths()))
		assertSameBaseline(cacheBefore, readByteBaseline(filesUnder(cachePath)))
	}
	if (failure) throw Object.assign(failure, { cleanup: 'complete', baseline: 'byte-identical' })
	return {
		...result,
		cleanup: 'complete',
		baseline: { status: 'byte-identical', files: Object.keys(before).length },
		cacheBaseline: { status: 'byte-identical', files: Object.keys(cacheBefore).length },
	}
}

export function cloneOfflineCache(seed, scratchRoot, { platform = process.platform, cloneCommand = run } = {}) {
	assertOfflineCache(seed)
	const cachePath = join(scratchRoot, 'npm-cache')
	if (existsSync(cachePath)) throw diagnostic('CACHE_DESTINATION_EXISTS', { cachePath })
	if (
		realpathSync(scratchRoot) === realpathSync(seed) ||
		realpathSync(scratchRoot).startsWith(`${realpathSync(seed)}${sep}`)
	)
		throw diagnostic('CACHE_CLONE_NOT_ISOLATED', { reason: 'scratch must be outside the seed cache' })
	let method = 'recursive-copy'
	if (platform === 'darwin' || platform === 'linux') {
		try {
			cloneCommand(
				'/bin/cp',
				platform === 'darwin' ? ['-cR', seed, cachePath] : ['--reflink=always', '-R', seed, cachePath],
				{ cwd: scratchRoot },
			)
			method = platform === 'darwin' ? 'darwin-clonefile' : 'linux-reflink'
		} catch {
			// Failed CoW attempts may leave partial files; discard only this owned destination.
			rmSync(cachePath, { recursive: true, force: true })
		}
	}
	if (method === 'recursive-copy')
		cpSync(seed, cachePath, { recursive: true, dereference: false, errorOnExist: true, force: false })
	assertOfflineCache(cachePath)
	const seedFiles = filesUnder(seed)
	const clonedFiles = filesUnder(cachePath)
	if (
		JSON.stringify(seedFiles.map(path => relative(seed, path))) !==
		JSON.stringify(clonedFiles.map(path => relative(cachePath, path)))
	)
		throw diagnostic('CACHE_CLONE_INCOMPLETE')
	const sourceInodes = new Set(
		seedFiles.map(path => {
			const info = statSync(path)
			return `${info.dev}:${info.ino}`
		}),
	)
	for (const path of clonedFiles) {
		const info = statSync(path)
		if (info.nlink !== 1 || sourceInodes.has(`${info.dev}:${info.ino}`))
			throw diagnostic('CACHE_CLONE_NOT_ISOLATED', { path: relative(cachePath, path) })
	}
	return { cachePath, mode: method === 'recursive-copy' ? 'offline-isolated-copy' : 'offline-copy-on-write', method }
}

export function expectedArtifactVersion(name) {
	if (name === 'create-purista') return '3.0.0'
	if (name.startsWith('@purista/')) return version
	throw diagnostic('ARTIFACT_UNEXPECTED', { package: name })
}

export function assertAllowedStagedReference(reference, scratchRoot, tarballs) {
	const target =
		typeof reference === 'string' && reference.startsWith('file:') ? resolve(scratchRoot, reference.slice(5)) : ''
	if (
		!target.startsWith(`${resolve(scratchRoot)}${sep}`) ||
		!target.endsWith('.tgz') ||
		!existsSync(target) ||
		lstatSync(target).isSymbolicLink() ||
		!statSync(target).isFile() ||
		!realpathSync(target).startsWith(`${realpathSync(scratchRoot)}${sep}`) ||
		!tarballs.some(item => resolve(item.tarball) === target && item.integrity === `sha512-${digest(target)}`)
	)
		throw diagnostic('DEPENDENCY_REFERENCE_FORBIDDEN', {
			reference,
			reason: 'only verifier-created, integrity-checked scratch tarballs are allowed',
		})
}

export function assertPackageClosure(packages) {
	const names = new Set()
	for (const item of packages) {
		if (names.has(item.name)) throw diagnostic('PACKAGE_DUPLICATE', { package: item.name })
		names.add(item.name)
		if (item.version !== version)
			throw diagnostic('STAGED_VERSION_INVALID', { package: item.name, version: item.version })
	}
	for (const item of packages) {
		for (const field of dependencyFields) {
			for (const [dependency, range] of Object.entries(item[field] ?? {})) {
				if (!dependency.startsWith('@purista/')) continue
				if (!names.has(dependency))
					throw diagnostic('CLOSURE_PACKAGE_MISSING', { package: item.name, dependency, field })
				if (range !== '^4.0.0')
					throw diagnostic('INTERNAL_EDGE_INVALID', { package: item.name, dependency, field, range })
			}
		}
	}
}

function packageDirectories(root) {
	return ['packages', 'native'].flatMap(folder => {
		const directory = join(root, folder)
		return existsSync(directory)
			? readdirSync(directory)
					.map(name => join(directory, name))
					.filter(path => existsSync(join(path, 'package.json')))
			: []
	})
}

function publicPackages() {
	return sorted(
		[harnessRoot, puristaRoot]
			.flatMap(root => packageDirectories(root))
			.map(directory => ({ directory, ...json(join(directory, 'package.json')) }))
			.filter(item => !item.private && item.name?.startsWith('@purista/')),
	)
}

function manifestPaths() {
	return [harnessRoot, puristaRoot]
		.flatMap(root => [
			join(root, 'package.json'),
			join(root, 'package-lock.json'),
			...filesUnder(join(root, 'packages'), path => basename(path) === 'package.json'),
			...filesUnder(join(root, 'native'), path => basename(path) === 'package.json'),
		])
		.sort()
}

function copyPackage(source, destination) {
	cpSync(source, destination, {
		recursive: true,
		verbatimSymlinks: true,
		filter: path => !ignoredDirectories.has(basename(path)),
	})
}

export function run(command, args, { cwd, env = {}, consumer = basename(cwd), ...options }) {
	try {
		return execFileSync(command, args, {
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'pipe'],
			maxBuffer: 20 * 1024 * 1024,
			...options,
			cwd,
			env: {
				PATH: process.env.PATH,
				HOME: process.env.HOME,
				TMPDIR: process.env.TMPDIR,
				CI: 'true',
				npm_config_offline: 'true',
				npm_config_audit: 'false',
				npm_config_fund: 'false',
				...env,
			},
		})
	} catch (error) {
		throw diagnostic('COMMAND_FAILED', {
			consumer,
			command,
			args,
			cwd,
			exitCode: error.status ?? null,
			output: String(error.stdout ?? '').slice(-4000),
			error: String(error.stderr ?? error.message).slice(-4000),
		})
	}
}

function npm(args, directory, cachePath, scratchRoot) {
	const temporaryDirectory = join(scratchRoot, 'tmp')
	mkdirSync(temporaryDirectory, { recursive: true })
	return run('npm', [...args, '--offline', '--cache', cachePath, '--logs-dir', join(scratchRoot, 'npm-logs')], {
		cwd: directory,
		env: {
			TMPDIR: temporaryDirectory,
			npm_config_cache: cachePath,
			npm_config_logs_dir: join(scratchRoot, 'npm-logs'),
		},
	})
}

export function assertTarballMap(staged, scratchRoot) {
	assertPackageClosure(staged.filter(item => item.name.startsWith('@purista/')))
	const paths = new Set()
	for (const item of staged) {
		const expectedVersion = expectedArtifactVersion(item.name)
		if (item.version !== expectedVersion)
			throw diagnostic('STAGED_VERSION_INVALID', { package: item.name, version: item.version, expectedVersion })
		const expected = `${item.name.replace('@', '').replace('/', '-')}-${expectedVersion}.tgz`
		if (basename(item.tarball) !== expected || paths.has(item.tarball))
			throw diagnostic('TARBALL_NAME_INVALID', { package: item.name, expected, actual: basename(item.tarball) })
		paths.add(item.tarball)
		if (!existsSync(item.tarball)) throw diagnostic('TARBALL_MISSING', { package: item.name, tarball: item.tarball })
		assertAllowedStagedReference(`file:${item.tarball}`, scratchRoot, staged)
		const manifest = JSON.parse(run('tar', ['-xOf', item.tarball, 'package/package.json'], { cwd: scratchRoot }))
		if (manifest.name !== item.name || manifest.version !== expectedVersion)
			throw diagnostic('TARBALL_IDENTITY_INVALID', {
				package: item.name,
				actualName: manifest.name,
				actualVersion: manifest.version,
			})
		for (const field of dependencyFields)
			if (JSON.stringify(manifest[field] ?? {}) !== JSON.stringify(item[field] ?? {}))
				throw diagnostic('TARBALL_METADATA_INVALID', { package: item.name, field })
	}
	const actual = readdirSync(join(scratchRoot, 'tarballs'))
		.filter(name => name.endsWith('.tgz'))
		.sort()
	if (JSON.stringify(actual) !== JSON.stringify([...paths].map(path => basename(path)).sort()))
		throw diagnostic('TARBALL_INVENTORY_INVALID', { actual })
}

function exportPaths(value) {
	return typeof value === 'string'
		? [value]
		: value && typeof value === 'object'
			? Object.values(value).flatMap(exportPaths)
			: []
}

function packStagedPackages(packages, scratchRoot, cachePath) {
	const tarballRoot = join(scratchRoot, 'tarballs')
	mkdirSync(tarballRoot, { recursive: true })
	const staged = []
	for (const { directory: source, ...original } of packages) {
		const directory = join(scratchRoot, 'packages', original.name.replace('/', '__'))
		copyPackage(source, directory)
		const manifest = structuredClone(original)
		if (manifest.name === 'create-purista' && manifest.version !== expectedArtifactVersion(manifest.name))
			throw diagnostic('STAGED_VERSION_INVALID', { package: manifest.name, version: manifest.version })
		manifest.version = expectedArtifactVersion(manifest.name)
		for (const field of dependencyFields)
			for (const name of Object.keys(manifest[field] ?? {}))
				if (name.startsWith('@purista/')) manifest[field][name] = '^4.0.0'
		writeJson(join(directory, 'package.json'), manifest)
		const packed = JSON.parse(
			npm(['pack', '--json', '--ignore-scripts', '--pack-destination', tarballRoot], directory, cachePath, scratchRoot),
		)
		if (packed.length !== 1) throw diagnostic('PACK_RESULT_INVALID', { package: manifest.name })
		const output = packed[0]
		for (const path of [
			...exportPaths(manifest.exports),
			...exportPaths(manifest.bin),
			manifest.main,
			manifest.types,
		].filter(Boolean)) {
			if (path.includes('*')) continue
			if (!output.files.some(file => file.path === path.replace(/^\.\//, '')))
				throw diagnostic('PACKED_ARTIFACT_MISSING', { package: manifest.name, path })
		}
		const tarball = join(tarballRoot, output.filename)
		staged.push({
			...manifest,
			tarball,
			integrity: `sha512-${digest(tarball)}`,
			artifacts: output.files.filter(file => /\.(js|d\.ts)$/.test(file.path)).length,
		})
	}
	return sorted(staged)
}

export function consumerClosure(manifest, staged, consumer) {
	const result = new Map()
	const visit = (name, range) => {
		if (!name.startsWith('@purista/')) return
		if (range !== '^4.0.0') throw diagnostic('CONSUMER_RANGE_INVALID', { consumer, package: name, range })
		if (result.has(name)) return
		const item = staged.find(item => item.name === name)
		if (!item) throw diagnostic('CLOSURE_PACKAGE_MISSING', { consumer, package: name })
		result.set(name, item)
		for (const field of ['dependencies', 'peerDependencies', 'optionalDependencies'])
			for (const [dependency, dependencyRange] of Object.entries(item[field] ?? {})) visit(dependency, dependencyRange)
	}
	for (const field of dependencyFields)
		for (const [name, range] of Object.entries(manifest[field] ?? {})) visit(name, range)
	return sorted([...result.values()])
}

export function assertInstalledOrigins(directory, staged) {
	const lock = json(join(directory, 'package-lock.json'))
	const expected = new Map(staged.map(item => [item.name, item]))
	const evidence = []
	for (const [location, entry] of Object.entries(lock.packages ?? {})) {
		const match = location.match(/(?:^|\/)node_modules\/(@purista\/[^/]+|create-purista)$/)
		if (!match) continue
		const name = match[1]
		const item = expected.get(name)
		if (
			!item ||
			entry.link ||
			entry.version !== expectedArtifactVersion(name) ||
			!entry.resolved?.startsWith('file:') ||
			resolve(directory, entry.resolved.slice(5)) !== resolve(item.tarball) ||
			entry.integrity !== item.integrity
		)
			throw diagnostic('INSTALLED_ORIGIN_INVALID', {
				consumer: basename(directory),
				package: name,
				location,
				resolved: entry.resolved,
				version: entry.version,
			})
		const installedPath = join(directory, location)
		const manifest = json(join(installedPath, 'package.json'))
		if (
			manifest.name !== name ||
			manifest.version !== expectedArtifactVersion(name) ||
			lstatSync(installedPath).isSymbolicLink() ||
			!realpathSync(installedPath).startsWith(`${realpathSync(directory)}${sep}`)
		)
			throw diagnostic('INSTALLED_IDENTITY_INVALID', { consumer: basename(directory), package: name })
		for (const field of dependencyFields)
			for (const [dependency, range] of Object.entries(manifest[field] ?? {}))
				if (dependency.startsWith('@purista/') && range !== '^4.0.0')
					throw diagnostic('INTERNAL_EDGE_INVALID', {
						consumer: basename(directory),
						package: name,
						dependency,
						field,
						range,
					})
		evidence.push({
			name,
			version: expectedArtifactVersion(name),
			location,
			resolved: `file:tarballs/${basename(item.tarball)}`,
			integrity: item.integrity,
			symlink: false,
		})
	}
	for (const item of staged)
		if (!evidence.some(entry => entry.name === item.name))
			throw diagnostic('INSTALLED_PACKAGE_MISSING', { consumer: basename(directory), package: item.name })
	return sorted(evidence)
}

function installConsumer(directory, staged, cachePath, scratchRoot) {
	const manifest = json(join(directory, 'package.json'))
	for (const field of dependencyFields) {
		for (const [name, reference] of Object.entries(manifest[field] ?? {})) {
			if (!name.startsWith('@purista/') || !reference.startsWith('file:')) continue
			const item = staged.find(item => item.name === name)
			assertAllowedStagedReference(reference, scratchRoot, item ? [item] : [])
			manifest[field][name] = '^4.0.0'
		}
	}
	const closure = consumerClosure(manifest, staged, basename(directory))
	for (const field of dependencyFields) {
		for (const name of Object.keys(manifest[field] ?? {})) {
			if (name.startsWith('@purista/'))
				manifest[field][name] = `file:${closure.find(item => item.name === name).tarball}`
		}
	}
	// Pin transitive local packages at the consumer root so internal ^4.0.0 edges cannot resolve through the registry.
	manifest.dependencies ??= {}
	for (const item of closure)
		if (!dependencyFields.some(field => Object.hasOwn(manifest[field] ?? {}, item.name)))
			manifest.dependencies[item.name] = `file:${item.tarball}`
	for (const field of dependencyFields)
		for (const [name, reference] of Object.entries(manifest[field] ?? {}))
			if (name.startsWith('@purista/')) assertAllowedStagedReference(reference, scratchRoot, staged)
	writeJson(join(directory, 'package.json'), manifest)
	npm(['install', '--ignore-scripts', '--no-audit', '--no-fund'], directory, cachePath, scratchRoot)
	return assertInstalledOrigins(directory, closure)
}

export function discoverFixtures(root = join(scriptDirectory, 'fixtures', 'harness-v4-packed')) {
	const fixtures = filesUnder(root, path => basename(path) === 'package.json').map(path => ({
		name: `tracked-fixture:${relative(root, dirname(path))}`,
		directory: dirname(path),
	}))
	if (!fixtures.length) throw diagnostic('FIXTURE_INVENTORY_EMPTY', { root })
	return sorted(fixtures)
}

export function documentedChecks(manifest, consumer) {
	return ['typecheck', 'test', 'build'].map(check => {
		if (manifest.scripts?.[check]) return { check, command: `npm run ${check}`, script: check }
		if (check === 'typecheck' && /^tsc --noEmit\s*&&/.test(manifest.scripts?.test ?? ''))
			return {
				check,
				command: 'tsc --noEmit',
				source: 'package.json scripts.test prefix',
			}
		return { check, command: `npm run ${check}`, diagnostic: { code: 'CONSUMER_CHECK_MISSING', consumer, check } }
	})
}

function runChecks(directory, cachePath, scratchRoot) {
	const manifest = json(join(directory, 'package.json'))
	return documentedChecks(manifest, basename(directory)).map(
		({ check, command, script, source, diagnostic: missing }) => {
			try {
				if (missing) throw diagnostic(missing.code, { consumer: missing.consumer, check })
				if (script) npm(['run', script], directory, cachePath, scratchRoot)
				else {
					const compiler = join(directory, 'node_modules/.bin/tsc')
					if (!realpathSync(compiler).startsWith(`${realpathSync(directory)}${sep}`))
						throw diagnostic('CONSUMER_COMPILER_ORIGIN_INVALID', { consumer: basename(directory) })
					run(process.execPath, [compiler, '--noEmit'], { cwd: directory })
				}
				return { check, command, ...(source ? { source } : {}), status: 'passed' }
			} catch (error) {
				return { check, command, status: 'failed', diagnostic: error.detail ?? { message: error.message } }
			}
		},
	)
}

export function verify(seedCache) {
	return withScratch(
		seedCache,
		scratchRoot => {
			const cacheClone = cloneOfflineCache(seedCache, scratchRoot)
			const { cachePath } = cacheClone
			process.stderr.write(
				`${JSON.stringify({ event: 'cache_isolated', seed: relative(workspaceRoot, seedCache), workingCache: '<scratch>/npm-cache', mode: cacheClone.mode, method: cacheClone.method })}\n`,
			)
			const frameworkPackages = packStagedPackages(publicPackages(), scratchRoot, cachePath)
			const [generator] = packStagedPackages(
				[
					{
						directory: join(workspaceRoot, 'create-purista'),
						...json(join(workspaceRoot, 'create-purista/package.json')),
					},
				],
				scratchRoot,
				cachePath,
			)
			const staged = sorted([...frameworkPackages, generator])
			assertTarballMap(staged, scratchRoot)
			const consumers = []
			const verifyConsumer = (name, directory, generate) => {
				try {
					generate(directory)
					let origins = installConsumer(directory, staged, cachePath, scratchRoot)
					if (name === 'create-purista-generated-first-agent') {
						const cli = json(join(directory, 'node_modules/@purista/cli/package.json'))
						run(
							process.execPath,
							[
								join(directory, 'node_modules/@purista/cli', cli.bin.purista),
								'add',
								'agent',
								'packedAgent',
								'--description',
								'Packed consumer agent',
								'--service',
								'ping',
								'--service-version',
								'1',
								'--non-interactive',
							],
							{ cwd: directory },
						)
						// The first-agent flow adds its runtime model provider dependency.
						origins = installConsumer(directory, staged, cachePath, scratchRoot)
					}
					const checks = runChecks(directory, cachePath, scratchRoot)
					consumers.push({
						name,
						status: checks.every(check => check.status === 'passed') ? 'passed' : 'failed',
						install: 'passed',
						origins,
						checks,
					})
					process.stderr.write(
						`${JSON.stringify({ event: checks.every(check => check.status === 'passed') ? 'consumer_verified' : 'consumer_failed', consumer: name, packages: origins.length, checks: checks.map(({ check, status }) => ({ check, status })) })}\n`,
					)
				} catch (error) {
					consumers.push({ name, status: 'failed', diagnostic: error.detail ?? { message: error.message } })
					process.stderr.write(
						`${JSON.stringify({ event: 'consumer_failed', consumer: name, diagnostic: error.detail ?? { message: error.message } })}\n`,
					)
				}
			}
			for (const fixture of discoverFixtures())
				verifyConsumer(fixture.name, join(scratchRoot, fixture.name.replace(':', '-')), directory =>
					copyPackage(fixture.directory, directory),
				)
			verifyConsumer('starter-base-template', join(scratchRoot, 'starter-base-template'), directory =>
				copyPackage(join(workspaceRoot, 'starter/templates/base'), directory),
			)
			const generatorRoot = join(scratchRoot, 'generator')
			mkdirSync(generatorRoot)
			writeJson(join(generatorRoot, 'package.json'), {
				name: 'packed-generator',
				private: true,
				dependencies: { 'create-purista': `file:${generator.tarball}` },
			})
			npm(['install', '--ignore-scripts', '--no-audit', '--no-fund'], generatorRoot, cachePath, scratchRoot)
			const generatorManifest = json(join(generatorRoot, 'node_modules/create-purista/package.json'))
			const [generatorOrigin] = assertInstalledOrigins(generatorRoot, [generator])
			for (const name of ['create-purista-generated-base', 'create-purista-generated-first-agent']) {
				verifyConsumer(name, join(scratchRoot, name), directory =>
					run(
						process.execPath,
						[
							join(generatorRoot, 'node_modules/create-purista', generatorManifest.bin['create-purista']),
							directory,
							'--runtime',
							'node',
							'--package-manager',
							'npm',
							'--event-bridge',
							'default',
							'--linter',
							'none',
							'--formatter',
							'none',
							'--no-webserver',
							'--no-install',
							'--non-interactive',
						],
						{ cwd: scratchRoot },
					),
				)
			}
			assertTarballMap(staged, scratchRoot)
			if (consumers.some(consumer => consumer.status === 'failed'))
				throw diagnostic('CONSUMER_VERIFICATION_FAILED', { consumers: sorted(consumers) })
			return {
				cache: {
					seed: relative(workspaceRoot, seedCache),
					working: '<scratch>/npm-cache',
					mode: cacheClone.mode,
					method: cacheClone.method,
				},
				generator: generatorOrigin,
				consumers: sorted(consumers),
				packages: staged.map(item => ({
					name: item.name,
					version: item.version,
					tarball: `tarballs/${basename(item.tarball)}`,
					integrity: item.integrity,
					artifacts: item.artifacts,
				})),
			}
		},
		manifestPaths,
	)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	try {
		const { offlineCache } = parseArgs(process.argv.slice(2))
		process.stdout.write(`${JSON.stringify({ status: 'PASS', ...verify(resolve(puristaRoot, offlineCache)) })}\n`)
	} catch (error) {
		process.stderr.write(
			`${JSON.stringify({ status: 'FAIL', ...(error.detail ?? { code: 'VERIFIER_FAILED', message: error.message }), cleanup: error.cleanup ?? 'not-staged', baseline: error.baseline })}\n`,
		)
		process.exitCode = 1
	}
}
