#!/usr/bin/env node

/* biome-ignore-all lint/suspicious/noConsole: this CLI report writes its result to stdout. */

/**
 * Inventory the narrow set of public fluent APIs which handbook TypeScript
 * examples use to define a PURISTA primitive or a Harness runtime. This is a
 * review report, not a generic dot-call linter: matching arbitrary method
 * calls would incorrectly classify application, schema, and provider code as
 * a Framework builder.
 *
 * A missing link means only that this scanner did not find the source-verified
 * member API route in the example's Markdown section. It intentionally does
 * not claim that prose is absent; reviewers still assess the explanation's
 * parameters, defaults, runtime effect, and choice guidance.
 */

import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const handbookRoot = resolve(process.cwd(), 'web', 'src', 'content', 'handbook')
const supportedProducts = ['framework', 'harness']
const typeScriptFence = /^```(?:ts|tsx|typescript)([^\n]*)\n([\s\S]*?)^```/gm

const frameworkMethodOwners = new Map([
	['getCommandBuilder', 'ServiceBuilder'],
	['getSubscriptionBuilder', 'ServiceBuilder'],
	['getStreamBuilder', 'ServiceBuilder'],
	['getQueueBuilder', 'ServiceBuilder'],
	['getQueueWorkerBuilder', 'ServiceBuilder'],
	['getScheduleBuilder', 'ServiceBuilder'],
	['mountHarness', 'ServiceBuilder'],
	['getHarnessHostToolBuilder', 'ServiceBuilder'],
	['addCommandDefinition', 'ServiceBuilder'],
	['addSubscriptionDefinition', 'ServiceBuilder'],
	['addStreamDefinition', 'ServiceBuilder'],
	['addQueueDefinition', 'ServiceBuilder'],
	['addQueueWorkerDefinition', 'ServiceBuilder'],
	['addScheduleDefinition', 'ServiceBuilder'],
	['addPayloadSchema', 'definition'],
	['addParameterSchema', 'definition'],
	['addOutputSchema', 'definition'],
	['addChunkSchema', 'StreamDefinitionBuilder'],
	['addFinalSchema', 'StreamDefinitionBuilder'],
	['setCommandFunction', 'CommandDefinitionBuilder'],
	['setSubscriptionFunction', 'SubscriptionDefinitionBuilder'],
	['setStreamFunction', 'StreamDefinitionBuilder'],
	['setHandler', 'QueueWorkerBuilder'],
	['setTransformInput', 'definition'],
	['setTransformOutput', 'definition'],
	['setBeforeGuardHooks', 'definition'],
	['setAfterGuardHooks', 'definition'],
	['setSuccessEventName', 'definition'],
	['canInvoke', 'definition'],
	['canEnqueue', 'definition'],
	['canEmit', 'definition'],
	['canConsumeStream', 'definition'],
	['subscribeToEvent', 'SubscriptionDefinitionBuilder'],
	['filterSentFrom', 'SubscriptionDefinitionBuilder'],
	['setMaxParallelHandlers', 'QueueWorkerBuilder'],
	['setMode', 'QueueWorkerBuilder'],
	['setExecutionProfile', 'executionProfile'],
	['canInvokeAgent', 'harnessInvocation'],
	['canInvokeWorkflow', 'harnessInvocation'],
	['canUseHarnessModel', 'definition'],
	['exposeAsHttpEndpoint', 'definition'],
	['exposeAsHttpStreamEndpoint', 'StreamDefinitionBuilder'],
	['setHttpStreamingMode', 'StreamDefinitionBuilder'],
	['setHttpStreamProtocol', 'StreamDefinitionBuilder'],
	['enableHttpSecurity', 'httpDefinition'],
	['disableHttpSecurity', 'CommandDefinitionBuilder'],
	['makeEndpointPublic', 'httpDefinition'],
	['setOpenApiSummary', 'httpDefinition'],
	['setOpenApiOperationId', 'httpDefinition'],
	['addOpenApiTags', 'httpDefinition'],
	['addOpenApiErrorStatusCodes', 'httpDefinition'],
	['addQueryParameters', 'httpDefinition'],
	['setDefaultConfig', 'ServiceBuilder'],
	['setConfigSchema', 'ServiceBuilder'],
	['defineResource', 'ServiceBuilder'],
	['defineMetric', 'ServiceBuilder'],
	['setDeadLetterOptions', 'QueueDefinitionBuilder'],
	['setLifecycleConfig', 'QueueDefinitionBuilder'],
	['setResultPolicy', 'QueueDefinitionBuilder'],
	['setQueueBridgeConfig', 'QueueDefinitionBuilder'],
	['setBeforeEnqueueTransform', 'QueueDefinitionBuilder'],
	['setBeforeExecuteTransform', 'QueueDefinitionBuilder'],
	['bindEventToQueue', 'ServiceBuilder'],
	['emitEvent', 'ScheduleDefinitionBuilder'],
	['markSchedulable', 'definition'],
])

const harnessBuilderMethods = new Set([
	'logger',
	'models',
	'model',
	'requireModel',
	'requireModels',
	'defaults',
	'requires',
	'sandbox',
	'storage',
	'workspace',
	'telemetry',
	'governance',
	'memory',
	'tools',
	'tool',
	'hostTool',
	'skills',
	'skill',
	'agents',
	'agent',
	'workflows',
	'workflow',
	'use',
	'define',
	'build',
])

function getFiles(directory) {
	return readdirSync(directory, { withFileTypes: true })
		.flatMap(entry => {
			const path = join(directory, entry.name)
			return entry.isDirectory() ? getFiles(path) : entry.isFile() && entry.name.endsWith('.md') ? [path] : []
		})
		.sort()
}

function getSection(source, index) {
	const before = source.slice(0, index)
	const headings = [...before.matchAll(/^#{1,6}\s+(.+)$/gm)]
	const heading = headings.at(-1)
	const start = heading?.index ?? 0
	const level = heading?.[0].match(/^#+/)?.[0].length ?? 1
	const after = source.slice(index)
	const end = [...after.matchAll(/^#{1,6}\s+.+$/gm)].find(candidate => {
		return candidate[0].match(/^#+/)?.[0].length <= level
	})?.index
	return {
		heading: heading?.[1]?.trim() ?? 'Page introduction',
		content: source.slice(start, end === undefined ? source.length : index + end),
	}
}

/**
 * A focused snippet often introduces its chain under one heading and follows
 * it immediately with a method table under the next sibling heading. Count
 * that adjacent section as nearby, but never scan the rest of the page: an
 * unrelated API index must not satisfy the lookup requirement.
 */
function getNearbyContext(source, index) {
	const current = getSection(source, index)
	const currentStart = source.indexOf(current.content)
	const currentEnd = currentStart + current.content.length
	const headingMatch = /^#{1,6}\s+.+$/m.exec(current.content)
	const level = headingMatch?.[0].match(/^#+/)?.[0].length ?? 1
	const following = source.slice(currentEnd)
	const sibling = [...following.matchAll(/^#{1,6}\s+.+$/gm)].find(match => {
		return match[0].match(/^#+/)?.[0].length === level
	})
	if (!sibling) return current

	const siblingStart = currentEnd + (sibling.index ?? 0)
	const afterSibling = source.slice(siblingStart + sibling[0].length)
	const nextSibling = [...afterSibling.matchAll(/^#{1,6}\s+.+$/gm)].find(match => {
		return match[0].match(/^#+/)?.[0].length <= level
	})
	return {
		heading: current.heading,
		content: source.slice(
			currentStart,
			nextSibling ? siblingStart + sibling[0].length + (nextSibling.index ?? 0) : source.length,
		),
	}
}

function lineAt(source, index) {
	return source.slice(0, index).split('\n').length
}

function titleFromFenceInfo(info) {
	return /\btitle=(['"])(.*?)\1/.exec(info)?.[2] ?? 'untitled TypeScript block'
}

function candidateOwners(product, code, method) {
	if (product === 'harness') {
		if (method === 'defineHarness') return ['function:defineHarness']
		return code.includes('defineHarness(') && harnessBuilderMethods.has(method) ? ['interface:HarnessBuilder'] : []
	}

	const owner = frameworkMethodOwners.get(method)
	if (!owner) return []
	if (method === 'markSchedulable') {
		// Commands and queues both expose this scheduling declaration. Focused
		// examples often begin from a named builder variable, so the receiver's
		// concrete type is not visible in the fence itself.
		return ['CommandDefinitionBuilder', 'QueueDefinitionBuilder']
	}
	if (method === 'setHandler' && code.includes('getHarnessHostToolBuilder')) {
		return ['HarnessHostToolBuilder']
	}
	if ((method === 'canInvoke' || method === 'canEmit') && code.includes('getHarnessHostToolBuilder')) {
		return ['HarnessHostToolBuilder']
	}
	if (owner === 'harnessInvocation') {
		if (code.includes('getSubscriptionBuilder(')) return ['SubscriptionDefinitionBuilder']
		if (code.includes('getStreamBuilder(')) return ['StreamDefinitionBuilder']
		if (code.includes('getQueueWorkerBuilder(')) return ['QueueWorkerBuilder']
		return [
			'CommandDefinitionBuilder',
			'SubscriptionDefinitionBuilder',
			'StreamDefinitionBuilder',
			'QueueWorkerBuilder',
		]
	}
	if (owner === 'httpDefinition') {
		// Commands and streams expose HTTP projection
		// metadata. A focused example can start from a named builder declared in
		// a neighbouring file, so accept its precise owner link when present.
		if (code.includes('getCommandBuilder(')) return ['CommandDefinitionBuilder']
		if (code.includes('getStreamBuilder(')) return ['StreamDefinitionBuilder']
		return ['CommandDefinitionBuilder', 'StreamDefinitionBuilder']
	}
	if (owner === 'executionProfile') {
		if (code.includes('getQueueBuilder(')) return ['QueueDefinitionBuilder']
		return ['QueueDefinitionBuilder']
	}
	if (owner === 'definition') {
		if (code.includes('getCommandBuilder(')) return ['CommandDefinitionBuilder']
		if (code.includes('getSubscriptionBuilder(')) return ['SubscriptionDefinitionBuilder']
		if (code.includes('getStreamBuilder(')) return ['StreamDefinitionBuilder']
		if (code.includes('getQueueBuilder(')) return ['QueueDefinitionBuilder']
		if (code.includes('getQueueWorkerBuilder(')) return ['QueueWorkerBuilder']
		return [
			'CommandDefinitionBuilder',
			'SubscriptionDefinitionBuilder',
			'StreamDefinitionBuilder',
			'QueueWorkerBuilder',
		]
	}
	return [owner]
}

function hasExactApiLink(section, owner, method) {
	if (owner === 'function:defineHarness') {
		return /\]\(\/handbook\/api\/functions\/_purista_harness\.defineHarness\/?\)/i.test(section)
	}
	const [kind, name] = owner.startsWith('interface:')
		? ['interfaces', owner.slice('interface:'.length)]
		: ['classes', owner]
	const packageName = kind === 'interfaces' && name === 'HarnessBuilder' ? '_purista_harness' : '_purista_core'
	const expected = `/handbook/api/${kind}/${packageName}.${name}/#${method.toLowerCase()}`
	return section.toLowerCase().includes(expected.toLowerCase())
}

function publicCalls(product, code) {
	const calls = new Set()
	if (product === 'harness' && /\bdefineHarness\s*\(/.test(code)) calls.add('defineHarness')
	for (const match of code.matchAll(/\.([A-Za-z][A-Za-z0-9_]*)\s*\(/g)) {
		const method = match[1]
		if (candidateOwners(product, code, method).length) calls.add(method)
	}
	return [...calls].sort()
}

function inventory(root = handbookRoot) {
	const findings = []
	for (const product of supportedProducts) {
		for (const file of getFiles(join(root, product))) {
			const source = readFileSync(file, 'utf8')
			for (const block of source.matchAll(typeScriptFence)) {
				const calls = publicCalls(product, block[2])
				if (!calls.length) continue
				const section = getNearbyContext(source, block.index ?? 0)
				for (const method of calls) {
					const owners = candidateOwners(product, block[2], method)
					findings.push({
						product,
						file: relative(process.cwd(), file),
						line: lineAt(source, block.index ?? 0),
						title: titleFromFenceInfo(block[1]),
						section: section.heading,
						method,
						owners,
						hasExactApiLink: owners.some(owner => hasExactApiLink(section.content, owner, method)),
					})
				}
			}
		}
	}
	return findings
}

function priority(finding) {
	if (
		finding.product === 'framework' &&
		/^(getCommandBuilder|addPayloadSchema|addParameterSchema|addOutputSchema|setCommandFunction|canInvoke|canEnqueue|canEmit|canConsumeStream|exposeAsHttpEndpoint)$/.test(
			finding.method,
		)
	) {
		return 'P0'
	}
	if (
		finding.product === 'harness' &&
		/^(defineHarness|models|agents|tools|skills|workflows|build)$/.test(finding.method)
	)
		return 'P0'
	if (
		/^(getSubscriptionBuilder|getStreamBuilder|getQueueBuilder|getQueueWorkerBuilder|mountHarness|getHarnessHostToolBuilder|setHandler|setStreamFunction|setSubscriptionFunction)$/.test(
			finding.method,
		)
	)
		return 'P1'
	return 'P2'
}

function printMarkdown(findings) {
	const missing = findings.filter(finding => !finding.hasExactApiLink)
	const byProduct = product => {
		const scoped = findings.filter(finding => finding.product === product)
		const unlinked = scoped.filter(finding => !finding.hasExactApiLink)
		return `${product}: ${scoped.length - unlinked.length}/${scoped.length} calls have a same-section exact member lookup (${unlinked.length} missing)`
	}

	console.log('# Handbook fluent snippet coverage')
	console.log('')
	console.log(
		'This report inventories only source-verified Framework primitive builders and `defineHarness(...)` chains. It does not infer arbitrary dot calls or decide whether prose is sufficiently detailed; it identifies where a reviewer must add or verify the exact API lookup and accompanying explanation.',
	)
	console.log('')
	console.log(`- ${byProduct('framework')}`)
	console.log(`- ${byProduct('harness')}`)
	console.log(
		`- total: ${findings.length - missing.length}/${findings.length} calls have a same-section exact API lookup (${missing.length} missing)`,
	)
	console.log('')
	console.log('## Missing exact API lookups')
	console.log('')
	console.log('| Priority | Product | Snippet | Method | Expected owner | Section |')
	console.log('| --- | --- | --- | --- | --- | --- |')
	for (const finding of missing.sort(
		(left, right) =>
			priority(left).localeCompare(priority(right)) ||
			left.file.localeCompare(right.file) ||
			left.line - right.line ||
			left.method.localeCompare(right.method),
	)) {
		console.log(
			`| ${priority(finding)} | ${finding.product} | \`${finding.file}:${finding.line}\` — ${finding.title.replaceAll('|', '\\|')} | \`${finding.method}\` | ${finding.owners.join(' / ')} | ${finding.section.replaceAll('|', '\\|')} |`,
		)
	}
}

const findings = inventory()
if (process.argv.includes('--json')) {
	console.log(JSON.stringify(findings, null, 2))
} else {
	printMarkdown(findings)
}
