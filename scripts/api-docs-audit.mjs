#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const args = new Set(process.argv.slice(2))
const getArgValue = (name, fallback) => {
	const prefix = `${name}=`
	const value = process.argv.slice(2).find(arg => arg.startsWith(prefix))
	return value ? value.slice(prefix.length) : fallback
}

const apiJsonPath = resolve(process.cwd(), getArgValue('--json', 'web/src/generated/purista-api.json'))
const packageFilter = getArgValue('--package', undefined)
const format = getArgValue('--format', 'text')
const failOnMissingSummary = args.has('--fail-on-missing-summary')
const failOnMissingExamples = args.has('--fail-on-missing-examples')

if (!existsSync(apiJsonPath)) {
	process.stderr.write(`API documentation JSON was not found at ${apiJsonPath}\n`)
	process.exit(2)
}

const docs = JSON.parse(readFileSync(apiJsonPath, 'utf8'))

const publicKinds = new Map([
	[8, 'enum'],
	[16, 'enum-member'],
	[32, 'variable'],
	[64, 'function'],
	[128, 'class'],
	[256, 'interface'],
	[512, 'constructor'],
	[1024, 'property'],
	[2048, 'method'],
	[2097152, 'type-alias'],
])

const hasSummary = node => {
	if (node.comment?.summary?.length) {
		return true
	}
	return (node.signatures ?? []).some(signature => signature.comment?.summary?.length)
}

const hasExample = node => {
	const blockTags = [
		...(node.comment?.blockTags ?? []),
		...(node.signatures ?? []).flatMap(signature => signature.comment?.blockTags ?? []),
	]
	return blockTags.some(tag => tag.tag === '@example')
}

const getSource = node => {
	const source = node.sources?.[0] ?? node.signatures?.[0]?.sources?.[0]
	if (!source) {
		return undefined
	}
	return `${source.fileName}:${source.line}`
}

// TypeDoc reads package build declarations in release builds, so source paths
// can be `core/dist/...`, `packages/core/src/...`, or another package-relative
// form. The merged package identity is stable across those representations.
const isPuristaRecord = record => record.packageName.startsWith('@purista/')

const records = []

const walk = (node, packageName = docs.name) => {
	const currentPackage = node.kind === 2 ? node.name : packageName
	const kind = publicKinds.get(node.kind)

	if (kind && (!packageFilter || currentPackage === packageFilter)) {
		records.push({
			packageName: currentPackage,
			kind,
			name: node.name,
			hasSummary: hasSummary(node),
			hasExample: hasExample(node),
			source: getSource(node),
		})
	}

	for (const child of node.children ?? []) {
		walk(child, currentPackage)
	}
}

walk(docs)

const puristaRecords = records.filter(isPuristaRecord)

const totals = new Map()
for (const record of puristaRecords) {
	const key = record.packageName
	const total = totals.get(key) ?? {
		packageName: key,
		total: 0,
		missingSummary: 0,
		withExample: 0,
		missingExamplesForFunctionsAndClasses: 0,
		byKind: {},
	}

	total.total += 1
	total.missingSummary += record.hasSummary ? 0 : 1
	total.withExample += record.hasExample ? 1 : 0

	if (['class', 'function', 'method'].includes(record.kind) && !record.hasExample) {
		total.missingExamplesForFunctionsAndClasses += 1
	}

	const kindTotal = total.byKind[record.kind] ?? { total: 0, missingSummary: 0 }
	kindTotal.total += 1
	kindTotal.missingSummary += record.hasSummary ? 0 : 1
	total.byKind[record.kind] = kindTotal

	totals.set(key, total)
}

const summary = [...totals.values()].sort((a, b) => b.missingSummary - a.missingSummary)
const missing = puristaRecords
	.filter(record => !record.hasSummary)
	.sort((a, b) => `${a.packageName}:${a.source ?? ''}`.localeCompare(`${b.packageName}:${b.source ?? ''}`))

if (format === 'json') {
	process.stdout.write(`${JSON.stringify({ summary, missing }, null, 2)}\n`)
} else {
	const lines = ['PURISTA API documentation audit', `Source: ${apiJsonPath}`]
	if (packageFilter) {
		lines.push(`Package: ${packageFilter}`)
	}
	lines.push('', 'Package\tTotal\tMissing summaries\tWith examples\tMissing examples on classes/functions/methods')
	for (const item of summary) {
		lines.push(
			`${item.packageName}\t${item.total}\t${item.missingSummary}\t${item.withExample}\t${item.missingExamplesForFunctionsAndClasses}`,
		)
	}

	if (missing.length) {
		lines.push('', 'Missing summaries')
		for (const record of missing) {
			lines.push(`${record.packageName}\t${record.kind}\t${record.name}\t${record.source ?? 'unknown source'}`)
		}
	}
	process.stdout.write(`${lines.join('\n')}\n`)
}

const missingSummaryCount = missing.length
const missingExampleCount = puristaRecords.filter(
	record => ['class', 'function', 'method'].includes(record.kind) && !record.hasExample,
).length

if ((failOnMissingSummary && missingSummaryCount > 0) || (failOnMissingExamples && missingExampleCount > 0)) {
	process.exit(1)
}
