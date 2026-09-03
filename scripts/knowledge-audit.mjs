#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { auditHandbookManifest } from './handbook-audit.mjs'

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
		!rel.startsWith('skills/purista-docs-maintainer/') &&
		!rel.startsWith('skills/purista-tutorial-maintainer/') &&
		/\bspecs?\b|specs\//i.test(text)
	) {
		addIssue(file, 'user-facing skills must not reference internal specs')
	}
}

const guardrailKnowledgeSources = [
	'web/src/data/guardrails-content.ts',
	'web/src/content/handbook/harness/secure-and-govern/guardrails.md',
	'web/src/content/handbook/harness/secure-and-govern/privacy-detectors.md',
	'web/src/content/handbook-cards/harness/guardrails-governance.mdx',
	'web/src/content/handbook-cards/harness/privacy-detectors.mdx',
	'web/src/content/handbook-cards/harness/ecosystem-packages.mdx',
	'web/src/content/handbook-cards/blocks/agent-pattern/guardrails.mdx',
	'web/src/data/harness-markdown.ts',
	'web/src/pages/harness/guardrails.astro',
	'web/src/components/harness/GuardrailsArchitecture.astro',
	'skills/purista/references/05-ai-harness-runtime.md',
	'skills/purista/references/11-evaluation-scenarios.md',
]
const retiredGuardrailConfiguration =
	/\bNeMo\b|\bloadGuardrailsConfig\b|\bparseGuardrailsConfig\b|guardrails\/config\.(?:yaml|yml)|rails\.config\.sensitive_data_detection|\bpolicy YAML\b|\bconfiguration[- ]file\b|\bpolicy file\b|\b(?:policy )?loader\b|\bsecond policy language\b|\balternate policy format\b|\bexternal policy format\b|\bcompatibility vocabulary\b/i
for (const relativePath of guardrailKnowledgeSources) {
	const file = resolve(root, relativePath)
	if (!existsSync(file)) {
		addIssue(file, 'required guardrail knowledge source is missing')
		continue
	}
	if (retiredGuardrailConfiguration.test(readText(file))) {
		addIssue(file, 'must not reference retired Guardrails file configuration')
	}
}

const guardrailsContentFile = resolve(root, 'web/src/data/guardrails-content.ts')
if (!existsSync(guardrailsContentFile)) {
	addIssue(guardrailsContentFile, 'canonical Guardrails lifecycle content is missing')
} else {
	const text = readText(guardrailsContentFile)
	for (const phase of ['input', 'output', 'tool_input', 'tool_output', 'retrieval']) {
		if (!new RegExp(`id: '${phase}'`).test(text)) {
			addIssue(guardrailsContentFile, `must define the ${phase} phase`)
		}
	}
	if (
		!/Output rails run only on final answer candidates\./.test(text) ||
		!/Intermediate tool-call responses skip output rails\./.test(text)
	) {
		addIssue(guardrailsContentFile, 'must define final-candidate-only output rails')
	}
	if (!/build\(\) verifies selected tool IDs and required model aliases\/capabilities/.test(text)) {
		addIssue(guardrailsContentFile, 'must define the build preflight guarantee')
	}
	for (const stage of ['TypeScript inline configuration', 'Zod parse/compile', 'Harness build\\(\\)', 'Invocation']) {
		if (!new RegExp(`stage: '${stage}'`).test(text)) {
			addIssue(guardrailsContentFile, `must define the ${stage} guarantee stage`)
		}
	}
}

for (const [relativePath, projections, renderings] of [
	[
		'web/src/data/harness-markdown.ts',
		['guardrailsPhases', 'guardrailsOutputRailGuarantee', 'guardrailsBuildGuarantee'],
		[
			'const guardrailsPhaseMarkdown = guardrailsPhases',
			'${guardrailsPhaseMarkdown}',
			'${guardrailsOutputRailGuarantee}',
			'${guardrailsBuildGuarantee}',
		],
	],
	[
		'web/src/pages/harness/guardrails.astro',
		['guardrailsOutputRailGuarantee', 'guardrailsBuildGuarantee', 'guardrailsStageGuarantees'],
		['{guardrailsOutputRailGuarantee}', '{guardrailsBuildGuarantee}', 'guardrailsStageGuarantees.map'],
	],
	[
		'web/src/components/harness/GuardrailsArchitecture.astro',
		['guardrailsPhasesById', 'guardrailsOutputRailGuarantee', 'guardrailsBuildGuarantee'],
		[
			'{output.diagramTiming}',
			'{output.diagramDescription}',
			'{guardrailsOutputRailGuarantee}',
			'{guardrailsBuildGuarantee}',
		],
	],
]) {
	const file = resolve(root, relativePath)
	if (!existsSync(file)) {
		addIssue(file, 'required Guardrails projection is missing')
		continue
	}
	const text = readText(file)
	if (
		!/guardrails-content\.ts/.test(text) ||
		projections.some(projection => !new RegExp(`\\b${projection}\\b`).test(text)) ||
		renderings.some(rendering => !text.includes(rendering))
	) {
		addIssue(file, 'must project canonical Guardrails lifecycle content')
	}
}

for (const relativePath of [
	'web/src/content/handbook/harness/secure-and-govern/guardrails.md',
	'web/src/content/handbook-cards/harness/guardrails-governance.mdx',
]) {
	const file = resolve(root, relativePath)
	if (!existsSync(file) || !/\[Guardrails overview\]\(\/harness\/guardrails\/\)/.test(readText(file))) {
		addIssue(file, 'must link lifecycle prose to the canonical Guardrails overview')
	}
}

const canonicalGuardrailsSkill = resolve(root, 'skills/purista/references/05-ai-harness-runtime.md')
if (!existsSync(canonicalGuardrailsSkill)) {
	addIssue(canonicalGuardrailsSkill, 'canonical Guardrails skill reference is missing')
} else {
	const text = readText(canonicalGuardrailsSkill)
	if (!/final[- ]answer candidates?/i.test(text) || !/intermediate tool-call responses skip output rails/i.test(text)) {
		addIssue(canonicalGuardrailsSkill, 'must state final-candidate-only output rails')
	}
}

const staleAiPattern =
	/@purista\/ai|packages\/ai|AgentProtocolEnvelope|AiSdkProvider|purista-ai|context\.ai|streamProtocolAdapter|invokeAgent|context\.invoke\.agents/
const allowedStaleAiSpecFiles = new Set([
	'specs/20-agents/README.md',
	'specs/20-agents/77-ai-harness-integration-strategy.md',
	'specs/20-agents/78-clean-ai-package-architecture.md',
	'specs/20-agents/80-core-ai-migration-plan.md',
	'specs/20-agents/88-harness-first-service-integration.md',
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

issues.push(...(await auditHandbookManifest(root)))

if (issues.length) {
	process.stderr.write(`PURISTA knowledge audit found ${issues.length} issue(s):\n`)
	for (const issue of issues) {
		process.stderr.write(`- ${issue}\n`)
	}
	process.exit(1)
}

process.stdout.write('PURISTA knowledge audit passed.\n')
