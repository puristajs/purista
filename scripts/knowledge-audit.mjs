#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const root = process.cwd()
const issues = []

const addIssue = (file, message) => {
	issues.push(`${relative(root, file)}: ${message}`)
}

const readText = file => readFileSync(file, 'utf8')

const listMarkdown = dir => {
	const results = []
	if (!existsSync(dir)) {
		return results
	}

	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name)
		if (entry.isDirectory()) {
			results.push(...listMarkdown(path))
		} else if (entry.isFile() && entry.name.endsWith('.md')) {
			results.push(path)
		}
	}

	return results.sort()
}

const requireContains = (file, patterns) => {
	if (!existsSync(file)) {
		addIssue(file, 'file is missing')
		return
	}

	const text = readText(file)
	for (const [pattern, message] of patterns) {
		if (!pattern.test(text)) {
			addIssue(file, message)
		}
	}
}

const skillMarkdown = listMarkdown(resolve(root, 'skills'))
for (const file of skillMarkdown) {
	const rel = relative(root, file)
	const text = readText(file)
	if (
		rel !== 'skills/README.md' &&
		!rel.startsWith('skills/purista-skill-maintainer/') &&
		/\bspecs?\b|specs\//i.test(text)
	) {
		addIssue(file, 'user-facing skills must not reference internal specs')
	}
}

const staleAiPattern =
	/@purista\/ai|packages\/ai|AgentProtocolEnvelope|AiSdkProvider|purista-ai|context\.ai|Vercel AI|streamProtocolAdapter|ui-message|invokeAgent|context\.invoke\.agents/
const allowedStaleAiSpecFiles = new Set([
	'specs/20-agents/README.md',
	'specs/20-agents/77-ai-harness-integration-strategy.md',
	'specs/20-agents/78-clean-ai-package-architecture.md',
	'specs/20-agents/80-core-ai-migration-plan.md',
	'specs/ai-phase2.md',
])

for (const file of listMarkdown(resolve(root, 'specs'))) {
	const rel = relative(root, file)
	const text = readText(file)
	if (staleAiPattern.test(text) && !allowedStaleAiSpecFiles.has(rel)) {
		addIssue(file, 'obsolete AI terms are only allowed in migration or superseded AI spec files')
	}

	if (/Source of truth:\s*\[.*specs\//i.test(text)) {
		addIssue(file, 'spec files must not point at another internal specs tree as source of truth')
	}
}

requireContains(resolve(root, 'AGENTS.md'), [
	[/npm run audit:skills/, 'must tell agents to run the skill audit after skill changes'],
	[/npm run audit:knowledge/, 'must tell agents to run the knowledge audit after skills/spec/agent-doc changes'],
	[/Specs are the source of truth/i, 'must state that specs are the source of truth for framework development'],
	[
		/User-facing framework skills must not require access to internal specs/i,
		'must state the user-facing skill/spec boundary',
	],
])

requireContains(resolve(root, 'web', 'AGENTS.md'), [
	[/public handbook/i, 'must route website agents to public handbook/source docs rather than internal specs'],
	[/Specs are the source\s+of\s+truth/i, 'must preserve the spec/source boundary for website agents'],
	[/user-facing skill/i, 'must state the user-facing skill boundary for website agents'],
])

requireContains(resolve(root, 'web', 'CLAUDE.md'), [
	[/AGENTS\.md/, 'must keep Claude website guidance chained to AGENTS.md'],
	[/Specs are the source of truth/i, 'must preserve the spec/source boundary for Claude website guidance'],
	[/user-facing skill/i, 'must state the user-facing skill boundary for Claude website guidance'],
])

requireContains(resolve(root, 'specs', 'README.md'), [
	[/Concise Specs/i, 'must define concise spec rules'],
	[/Knowledge Alignment/i, 'must define knowledge alignment rules'],
	[
		/Specs in this directory are the source of truth/i,
		'must state that specs are authoritative for framework development',
	],
])

if (issues.length) {
	process.stderr.write(`PURISTA knowledge audit found ${issues.length} issue(s):\n`)
	for (const issue of issues) {
		process.stderr.write(`- ${issue}\n`)
	}
	process.exit(1)
}

process.stdout.write('PURISTA knowledge audit passed.\n')
