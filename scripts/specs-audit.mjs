#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const requestedRoot = process.argv.find(
	argument => !argument.startsWith('--') && argument !== process.argv[0] && argument !== process.argv[1],
)
const specificationRoot = resolve(repositoryRoot, requestedRoot ?? 'specs')
const writeReport = process.argv.includes('--write')
const manifestPath = resolve(specificationRoot, 'spec-manifest.yaml')
const reportPath = resolve(specificationRoot, '.readiness-report.yaml')
const executableStatuses = new Set(['active', 'implemented'])
const validStatuses = new Set(['proposed', 'active', 'implemented', 'superseded', 'historical'])
const requiredFields = [
	'path',
	'status',
	'owner',
	'scope',
	'acceptance',
	'verification',
	'securityPrivacy',
	'operationsRecovery',
	'publicApiImpact',
	'generatedArtifacts',
	'releaseMigration',
]

const sha256 = value => createHash('sha256').update(value).digest('hex')
const collectMarkdown = directory => {
	const paths = []
	for (const entry of readdirSync(directory, { withFileTypes: true }).sort((left, right) =>
		left.name.localeCompare(right.name),
	)) {
		const path = resolve(directory, entry.name)
		if (entry.isDirectory()) paths.push(...collectMarkdown(path))
		if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') paths.push(path)
	}
	return paths
}
const parseJsonYaml = path => {
	try {
		return JSON.parse(readFileSync(path, 'utf8'))
	} catch (error) {
		throw new Error(`${relative(repositoryRoot, path)} must be JSON-compatible YAML: ${String(error)}`)
	}
}

if (!existsSync(specificationRoot) || !existsSync(manifestPath)) {
	throw new Error(
		`Specification root and spec-manifest.yaml are required at ${relative(repositoryRoot, specificationRoot)}`,
	)
}

const manifest = parseJsonYaml(manifestPath)
const diagnostics = []
if (manifest.format !== 'purista.spec-manifest.v1' || !Array.isArray(manifest.specifications)) {
	diagnostics.push('Manifest must contain format purista.spec-manifest.v1 and a specifications array.')
}
const manifestPaths = new Set()
const entries = (manifest.specifications ?? []).map(entry => {
	for (const field of requiredFields) {
		if (
			entry[field] === undefined ||
			entry[field] === '' ||
			(Array.isArray(entry[field]) && entry[field].length === 0)
		) {
			diagnostics.push(`${entry.path ?? '<unknown>'}: missing ${field}`)
		}
	}
	if (!validStatuses.has(entry.status)) diagnostics.push(`${entry.path}: invalid status ${entry.status}`)
	if (manifestPaths.has(entry.path)) diagnostics.push(`${entry.path}: duplicate manifest entry`)
	manifestPaths.add(entry.path)
	if (executableStatuses.has(entry.status) && typeof entry.approval !== 'string') {
		diagnostics.push(`${entry.path}: ${entry.status} specs require approval evidence`)
	}
	const sourcePath = resolve(specificationRoot, entry.path)
	if (!existsSync(sourcePath)) diagnostics.push(`${entry.path}: source file is missing`)
	return { ...entry, digest: existsSync(sourcePath) ? sha256(readFileSync(sourcePath)) : null }
})

for (const sourcePath of collectMarkdown(specificationRoot)) {
	const path = relative(specificationRoot, sourcePath)
	if (!manifestPaths.has(path)) diagnostics.push(`${path}: canonical spec is not indexed in spec-manifest.yaml`)
}

const decision = diagnostics.length === 0 ? 'approved' : 'blocked'
const report = {
	format: 'purista.spec-readiness.v1',
	decision,
	manifestDigest: sha256(readFileSync(manifestPath)),
	specifications: entries.map(({ path, status, approval, digest }) => ({
		path,
		status,
		approval: approval ?? null,
		digest,
	})),
	diagnostics,
}
if (writeReport) writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
if (!writeReport && !existsSync(reportPath))
	diagnostics.push('.readiness-report.yaml is missing; run node scripts/specs-audit.mjs specs --write')
if (!writeReport && existsSync(reportPath)) {
	const saved = parseJsonYaml(reportPath)
	if (saved.manifestDigest !== report.manifestDigest || saved.decision !== decision) {
		diagnostics.push('.readiness-report.yaml is stale; run node scripts/specs-audit.mjs specs --write')
	}
}
if (diagnostics.length > 0) {
	for (const diagnostic of diagnostics) process.stderr.write(`SPEC_AUDIT_ERROR: ${diagnostic}\n`)
	process.exit(1)
}
process.stdout.write(`Specification audit passed (${entries.length} specs, ${decision}).\n`)
