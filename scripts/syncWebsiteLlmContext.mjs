#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const checkOnly = process.argv.includes('--check')

const files = [
	{ source: 'llms.txt', target: 'web/public/llms/llms.txt' },
	{ source: 'docs/llms/llms-full.txt', target: 'web/public/llms/llms-full.txt' },
]

const staleTargets = []

for (const file of files) {
	const source = readFileSync(resolve(repoRoot, file.source), 'utf8')
	const targetPath = resolve(repoRoot, file.target)

	let target
	try {
		target = readFileSync(targetPath, 'utf8')
	} catch {
		target = undefined
	}

	if (target === source) {
		continue
	}

	if (checkOnly) {
		staleTargets.push(file.target)
		continue
	}

	mkdirSync(dirname(targetPath), { recursive: true })
	writeFileSync(targetPath, source)
}

if (staleTargets.length > 0) {
	throw new Error(`Website LLM context is stale: ${staleTargets.join(', ')}. Run npm run sync:website-llms.`)
}

process.stdout.write(
	`${checkOnly ? 'Website LLM context audit passed' : 'Website LLM context synchronized'} for ${files.length} file(s).\n`,
)
