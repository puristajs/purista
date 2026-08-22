#!/usr/bin/env node

import { execFileSync, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const defaultSpecRoot = resolve(repositoryRoot, '..', 'specs')
const npmExecutable = process.platform === 'win32' ? 'npm.cmd' : 'npm'

const checks = [
	'lint',
	'test:unit',
	'test:reference-examples',
	'build:public-packages',
	'test:generated-project',
	'build:api-docs',
	'audit:api-docs',
	'audit:public-api-surface',
	'audit:agent-api-knowledge',
	'audit:specs',
	'test:skill-evaluations',
	'audit:skills',
	'audit:packaged-skills',
	'audit:knowledge',
	'audit:website-llms',
	'test:package-imports',
]

const argumentsList = process.argv.slice(2)
const optionValue = option => {
	const index = argumentsList.indexOf(option)
	if (index === -1) return undefined
	const value = argumentsList[index + 1]
	if (!value || value.startsWith('--')) {
		throw new Error(`${option} requires a path`)
	}
	return value
}

if (argumentsList.includes('--help')) {
	process.stdout.write('Usage: node scripts/releaseCheck.mjs [options]\n\n')
	process.stdout.write('Runs the standard release checks and prints deterministic JSON evidence.\n\n')
	process.stdout.write('Options:\n')
	process.stdout.write('  --out <path>       Also write the evidence JSON to an explicit path.\n')
	process.stdout.write('  --spec-root <path> Read the non-git specification tree from this path.\n')
	process.stdout.write('  --require-specs    Fail if the specification tree is unavailable.\n')
	process.stdout.write('  --evidence-only    Do not run checks; inspect only the evidence inputs.\n')
	process.exit(0)
}

const outputPath = optionValue('--out')
const configuredSpecRoot = optionValue('--spec-root') ?? process.env.PURISTA_SPEC_ROOT ?? defaultSpecRoot
const specRoot = resolve(repositoryRoot, configuredSpecRoot)
const requireSpecs = argumentsList.includes('--require-specs')
const evidenceOnly = argumentsList.includes('--evidence-only')

const sha256 = value => createHash('sha256').update(value).digest('hex')

const collectFiles = directory => {
	if (!existsSync(directory)) return []
	const files = []
	for (const entry of readdirSync(directory, { withFileTypes: true }).sort((left, right) =>
		left.name.localeCompare(right.name),
	)) {
		const path = join(directory, entry.name)
		if (entry.isDirectory()) {
			files.push(...collectFiles(path))
		} else if (entry.isFile()) {
			files.push(path)
		}
	}
	return files
}

const digestPath = path => {
	if (!existsSync(path)) {
		return { available: false, digest: null, files: 0 }
	}

	const stats = statSync(path)
	const files = stats.isDirectory() ? collectFiles(path) : [path]
	const digest = createHash('sha256')
	for (const file of files) {
		digest.update(relative(path, file))
		digest.update('\0')
		digest.update(readFileSync(file))
		digest.update('\0')
	}
	return { available: true, digest: digest.digest('hex'), files: files.length }
}

const safeGit = args => {
	try {
		return execFileSync('git', args, {
			cwd: repositoryRoot,
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore'],
		}).trim()
	} catch {
		return undefined
	}
}

const packageVersions = () => {
	const packageDirectories = collectFiles(join(repositoryRoot, 'packages'))
		.filter(path => basename(path) === 'package.json')
		.map(path => JSON.parse(readFileSync(path, 'utf8')))
		.filter(manifest => manifest.name?.startsWith('@purista/') && manifest.private !== true)
		.map(manifest => ({ name: manifest.name, version: manifest.version }))
		.sort((left, right) => left.name.localeCompare(right.name))

	return {
		root: JSON.parse(readFileSync(join(repositoryRoot, 'package.json'), 'utf8')).version,
		public: packageDirectories,
	}
}

const parseTestCounts = output => {
	const filesMatch = output.match(/Test Files\s+(\d+) passed/g)
	const testsMatch = output.match(/Tests\s+(\d+) passed/g)
	return {
		testFiles: filesMatch?.at(-1)?.match(/(\d+)/)?.[1] ? Number(filesMatch.at(-1).match(/(\d+)/)[1]) : null,
		tests: testsMatch?.at(-1)?.match(/(\d+)/)?.[1] ? Number(testsMatch.at(-1).match(/(\d+)/)[1]) : null,
	}
}

const results = []
let failure = false

if (!evidenceOnly) {
	for (const check of checks) {
		process.stdout.write(`\n> release check: npm run ${check}\n\n`)
		const run = spawnSync(npmExecutable, ['run', check], {
			cwd: repositoryRoot,
			encoding: 'utf8',
			maxBuffer: 32 * 1024 * 1024,
		})
		const output = `${run.stdout ?? ''}${run.stderr ?? ''}`
		process.stdout.write(output)
		results.push({
			command: `npm run ${check}`,
			name: check,
			passed: run.status === 0,
			testCounts: parseTestCounts(output),
		})
		if (run.status !== 0) {
			failure = true
			break
		}
	}
}

const gitStatus = safeGit(['status', '--porcelain=v1'])
const specDigest = digestPath(specRoot)
const knowledgeInputs = {
	canonicalSkill: digestPath(join(repositoryRoot, 'skills')),
	generatedApiKnowledge: digestPath(join(repositoryRoot, 'skills', 'purista', 'references', 'generated-api-index.md')),
	llms: digestPath(join(repositoryRoot, 'llms.txt')),
	publishedLlms: digestPath(join(repositoryRoot, 'web', 'public', 'llms')),
}

const knownLimitations = [
	'Live model/provider benchmarks are intentionally outside the deterministic default release gate.',
	'Architecture inspect, validate, and doctor report declarations and static diagnostics; they do not prove live provider health.',
]

if (!specDigest.available) {
	knownLimitations.push(
		`The non-git specification tree is unavailable at ${specRoot}. Supply PURISTA_SPEC_ROOT or --spec-root to bind this evidence to specs.`,
	)
}

const evidence = {
	format: 'purista.release-evidence.v1',
	source: {
		commit: safeGit(['rev-parse', 'HEAD']) ?? null,
		dirty: gitStatus === undefined ? null : gitStatus.length > 0,
		dirtyPathCount: gitStatus === undefined ? null : gitStatus.split('\n').filter(Boolean).length,
		dirtyPathDigest: gitStatus === undefined ? null : sha256(gitStatus),
	},
	specifications: {
		available: specDigest.available,
		digest: specDigest.digest,
		files: specDigest.files,
		root: specDigest.available ? relative(repositoryRoot, specRoot) || '.' : null,
	},
	knowledge: knowledgeInputs,
	packages: packageVersions(),
	checks: results,
	knownLimitations,
}

const canonicalEvidence = JSON.stringify(evidence)
const completeEvidence = { ...evidence, digest: sha256(canonicalEvidence) }
const serializedEvidence = `${JSON.stringify(completeEvidence, null, 2)}\n`

if (outputPath) {
	const resolvedOutputPath = resolve(repositoryRoot, outputPath)
	writeFileSync(resolvedOutputPath, serializedEvidence)
	process.stdout.write(`PURISTA_RELEASE_EVIDENCE_FILE=${resolvedOutputPath}\n`)
	process.stdout.write(`PURISTA_RELEASE_EVIDENCE_DIGEST=${completeEvidence.digest}\n`)
} else {
	process.stdout.write(`\nPURISTA_RELEASE_EVIDENCE=${serializedEvidence}`)
}

if (failure || (requireSpecs && !specDigest.available)) {
	process.exit(1)
}
