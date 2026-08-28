import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const guardrailSources = [
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
	'packages/core/skills/purista/references/05-ai-harness-runtime.md',
	'packages/core/skills/purista/references/11-evaluation-scenarios.md',
]

const retiredGuardrailConfiguration = [
	/\bNeMo\b/i,
	/\bloadGuardrailsConfig\b/,
	/\bparseGuardrailsConfig\b/,
	/guardrails\/config\.(?:yaml|yml)/i,
	/rails\.config\.sensitive_data_detection/,
	/\bpolicy YAML\b/i,
	/\bconfiguration[- ]file\b/i,
	/\bpolicy file\b/i,
	/\b(?:policy )?loader\b/i,
	/\bsecond policy language\b/i,
	/\balternate policy format\b/i,
	/\bexternal policy format\b/i,
	/\bcompatibility vocabulary\b/i,
]

test('public guardrail knowledge has only the inline configuration surface', () => {
	for (const source of guardrailSources) {
		const text = readFileSync(resolve(root, source), 'utf8')
		for (const pattern of retiredGuardrailConfiguration) {
			assert.equal(pattern.test(text), false, `${source} must not reference ${pattern}`)
		}
	}
})

test('canonical Guardrails content defines every phase and the four-stage boundary', () => {
	const source = 'web/src/data/guardrails-content.ts'
	const text = readFileSync(resolve(root, source), 'utf8')
	for (const phase of ['input', 'output', 'tool_input', 'tool_output', 'retrieval']) {
		assert.match(text, new RegExp(`id: '${phase}'`), `${source} must define the ${phase} phase`)
	}
	assert.match(text, /Output rails run only on final answer candidates\./, `${source} must limit output rails to final answer candidates`)
	assert.match(text, /Intermediate tool-call responses skip output rails\./, `${source} must skip output rails for intermediate tool calls`)
	assert.match(text, /build\(\) verifies selected tool IDs and required model aliases\/capabilities/, `${source} must define the build preflight guarantee`)
	for (const stage of ['TypeScript inline configuration', 'Zod parse/compile', 'Harness build\\(\\)', 'Invocation']) {
		assert.match(text, new RegExp(`stage: '${stage}'`), `${source} must define the ${stage} guarantee stage`)
	}
})

test('website projections render the canonical Guardrails lifecycle content', () => {
	for (const [source, imports, renderings] of [
		[
			'web/src/data/harness-markdown.ts',
			['guardrailsPhases', 'guardrailsOutputRailGuarantee', 'guardrailsBuildGuarantee'],
			['const guardrailsPhaseMarkdown = guardrailsPhases', '${guardrailsPhaseMarkdown}', '${guardrailsOutputRailGuarantee}', '${guardrailsBuildGuarantee}'],
		],
		[
			'web/src/pages/harness/guardrails.astro',
			['guardrailsOutputRailGuarantee', 'guardrailsBuildGuarantee', 'guardrailsStageGuarantees'],
			['{guardrailsOutputRailGuarantee}', '{guardrailsBuildGuarantee}', 'guardrailsStageGuarantees.map'],
		],
		[
			'web/src/components/harness/GuardrailsArchitecture.astro',
			['guardrailsPhasesById', 'guardrailsOutputRailGuarantee', 'guardrailsBuildGuarantee'],
			['{output.diagramTiming}', '{output.diagramDescription}', '{guardrailsOutputRailGuarantee}', '{guardrailsBuildGuarantee}'],
		],
	]) {
		const text = readFileSync(resolve(root, source), 'utf8')
		assert.match(text, /guardrails-content\.ts/, `${source} must import the shared Guardrails content module`)
		for (const imported of imports) {
			assert.match(text, new RegExp(`\\b${imported}\\b`), `${source} must project ${imported}`)
		}
		for (const rendering of renderings) {
			assert.ok(text.includes(rendering), `${source} must render ${rendering}`)
		}
	}

	for (const source of [
		'web/src/content/handbook/harness/secure-and-govern/guardrails.md',
		'web/src/content/handbook-cards/harness/guardrails-governance.mdx',
	]) {
		const text = readFileSync(resolve(root, source), 'utf8')
		assert.match(text, /\[Guardrails overview\]\(\/harness\/guardrails\/\)/, `${source} must defer shared lifecycle prose to the canonical overview`)
	}
})

test('canonical PURISTA skill keeps the final-candidate output rule', () => {
	for (const source of [
		'skills/purista/references/05-ai-harness-runtime.md',
		'packages/core/skills/purista/references/05-ai-harness-runtime.md',
	]) {
		const text = readFileSync(resolve(root, source), 'utf8')
		assert.match(text, /final[- ]answer candidates?/i, `${source} must limit output rails to final answer candidates`)
		assert.match(text, /intermediate tool-call responses skip output rails/i, `${source} must state that intermediate tool-call responses skip output rails`)
	}
})

test('canonical PURISTA skill overlay stays byte-for-byte aligned', () => {
	for (const relative of [
		'purista/references/05-ai-harness-runtime.md',
		'purista/references/11-evaluation-scenarios.md',
	]) {
		assert.equal(
			readFileSync(resolve(root, 'skills', relative), 'utf8'),
			readFileSync(resolve(root, 'packages/core/skills', relative), 'utf8'),
			`${relative} must match the package overlay`,
		)
	}
})
