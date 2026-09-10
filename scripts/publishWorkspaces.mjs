import { execFile } from 'node:child_process'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const dependencyFields = ['dependencies', 'optionalDependencies', 'peerDependencies']
// Harness packages are published from their own repository and are intentionally absent here.
const isCrossRepositoryPackage = name => /^@purista\/harness(?:-|$)/.test(name)

/**
 * Read package manifests from the direct children of `packages`.
 * Directories without package.json are intentionally ignored.
 */
export async function collectWorkspaces(root) {
	const packagesRoot = path.join(root, 'packages')
	const entries = await readdir(packagesRoot, { withFileTypes: true })
	const packages = []
	for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
		if (!entry.isDirectory()) continue
		const directory = path.join(packagesRoot, entry.name)
		const manifestPath = path.join(directory, 'package.json')
		try {
			const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
			packages.push({
				directory,
				manifestPath,
				name: manifest.name,
				version: manifest.version,
				private: manifest.private === true,
				manifest,
			})
		} catch (error) {
			if (error?.code === 'ENOENT') continue
			throw new Error(`Unable to read ${manifestPath}: ${error.message}`)
		}
	}
	return packages
}

const getInternalDependencies = pkg => {
	const dependencies = new Map()
	for (const field of dependencyFields) {
		for (const [name, range] of Object.entries(pkg.manifest[field] ?? {})) {
			dependencies.set(name, range)
		}
	}
	return dependencies
}

const validateInternalRange = (name, range) => {
	if (typeof range !== 'string' || /^(?:workspace|file|link):/i.test(range) || /^(?:\*|latest)$/i.test(range)) {
		throw new Error(`invalid internal dependency range for ${name}: ${String(range)}`)
	}
	if (
		!/^(?:[~^<>=]*\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)(?:\s+(?:[~^<>=]*\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?))*$/.test(range)
	) {
		throw new Error(`invalid internal dependency range for ${name}: ${range}`)
	}
}

/** Build a stable dependency-first publication plan. */
export function buildPublishPlan(packages) {
	const byName = new Map()
	for (const pkg of packages) {
		if (!pkg.name || typeof pkg.name !== 'string') throw new Error(`workspace at ${pkg.directory} has no valid name`)
		if (!pkg.version || typeof pkg.version !== 'string') throw new Error(`workspace ${pkg.name} has no valid version`)
		if (byName.has(pkg.name)) throw new Error(`duplicate workspace name: ${pkg.name}`)
		byName.set(pkg.name, pkg)
	}
	const publicPackages = packages.filter(pkg => !pkg.private).sort((left, right) => left.name.localeCompare(right.name))
	const publicNames = new Set(publicPackages.map(pkg => pkg.name))
	const dependents = new Map(publicPackages.map(pkg => [pkg.name, new Set()]))
	const indegree = new Map(publicPackages.map(pkg => [pkg.name, 0]))

	for (const pkg of publicPackages) {
		for (const [dependencyName, range] of getInternalDependencies(pkg)) {
			const target = byName.get(dependencyName)
			const packageScope = pkg.name.startsWith('@') ? pkg.name.split('/')[0] : null
			if (!target) {
				if (
					packageScope &&
					dependencyName.startsWith(`${packageScope}/`) &&
					!isCrossRepositoryPackage(dependencyName)
				) {
					throw new Error(`missing internal dependency target for ${pkg.name}: ${dependencyName}`)
				}
				if (isCrossRepositoryPackage(dependencyName)) validateInternalRange(dependencyName, range)
				continue
			}
			if (target.private || !publicNames.has(dependencyName)) {
				throw new Error(
					`internal dependency target ${dependencyName} for ${pkg.name} is private and cannot be published`,
				)
			}
			validateInternalRange(dependencyName, range)
			if (!dependents.get(dependencyName).has(pkg.name)) {
				dependents.get(dependencyName).add(pkg.name)
				indegree.set(pkg.name, indegree.get(pkg.name) + 1)
			}
		}
	}

	const ready = publicPackages.filter(pkg => indegree.get(pkg.name) === 0).map(pkg => pkg.name)
	const plan = []
	while (ready.length > 0) {
		ready.sort((left, right) => left.localeCompare(right))
		const name = ready.shift()
		plan.push(byName.get(name))
		for (const dependent of [...dependents.get(name)].sort((left, right) => left.localeCompare(right))) {
			const next = indegree.get(dependent) - 1
			indegree.set(dependent, next)
			if (next === 0) ready.push(dependent)
		}
	}
	if (plan.length !== publicPackages.length) {
		const cycle = publicPackages
			.filter(pkg => indegree.get(pkg.name) > 0)
			.map(pkg => pkg.name)
			.join(', ')
		throw new Error(`dependency cycle detected among workspaces: ${cycle}`)
	}
	return plan
}

const defaultRun = async (command, options = {}) => {
	const [file, ...args] = command
	const result = await execFileAsync(file, args, { cwd: options.cwd })
	return result.stdout
}

/** Publish the public package plan, or print it when dryRun is enabled. */
export async function publishWorkspaces({
	root = process.cwd(),
	dryRun = false,
	registry = 'https://registry.npmjs.org',
	run = defaultRun,
	view,
	log = message => process.stdout.write(`${message}\n`),
} = {}) {
	const plan = buildPublishPlan(await collectWorkspaces(root))
	const published = []
	const skipped = []
	const lookup =
		view ??
		(async pkg => {
			try {
				return (
					await run(['npm', 'view', `${pkg.name}@${pkg.version}`, 'version', `--registry=${registry}`, '--silent'])
				).trim()
			} catch {
				return null
			}
		})
	for (const pkg of plan) {
		if (dryRun) {
			log(`Would publish ${pkg.name}@${pkg.version}`)
			await run(['npm', 'publish', '--access', 'public', '--dry-run', '--json'], { cwd: pkg.directory })
			continue
		}
		if ((await lookup(pkg)) === pkg.version) {
			skipped.push(pkg.name)
			log(`Skipping ${pkg.name}@${pkg.version} (already published)`)
			continue
		}
		log(`Publishing ${pkg.name}@${pkg.version}`)
		await run(['npm', 'publish', '--provenance', '--access', 'public'], { cwd: pkg.directory })
		published.push(pkg.name)
	}
	return { plan, published, skipped }
}

const parseCliArgs = args => {
	let dryRun = false
	for (const arg of args) {
		if (arg === '--dry-run') {
			dryRun = true
			continue
		}
		throw new Error(`unknown argument: ${arg}`)
	}
	return { dryRun }
}

if (process.argv[1] && path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1])) {
	let options
	try {
		options = parseCliArgs(process.argv.slice(2))
	} catch (error) {
		process.stderr.write(`${error.message}\n`)
		process.exitCode = 1
	}
	if (!options) {
		// Argument parsing failed; do not inspect manifests or invoke npm.
	} else {
		publishWorkspaces(options).catch(error => {
			process.stderr.write(`${error.message}\n`)
			process.exitCode = 1
		})
	}
}
