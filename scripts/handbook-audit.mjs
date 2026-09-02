#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const handbookProducts = ['framework', 'harness']
const handbookRoles = new Set([
	'landing',
	'chapter',
	'hub',
	'tutorial',
	'concept',
	'task',
	'adapter',
	'operations',
	'migration',
	'reference',
])
const handbookStatuses = new Set(['canonical', 'deprecated', 'redirected', 'private'])

function contentSourceExists(root, source) {
	if (!source || !['handbook', 'handbookCards'].includes(source.collection) || !source.id || source.id.includes('..')) {
		return false
	}

	const contentDirectory = source.collection === 'handbook' ? 'handbook' : 'handbook-cards'
	const candidates = ['.md', '.mdx'].flatMap(extension => [
		join(root, 'web', 'src', 'content', contentDirectory, `${source.id}${extension}`),
		join(root, 'web', 'src', 'content', contentDirectory, source.id, `index${extension}`),
	])

	return candidates.some(existsSync)
}

function getContentChapterSlugs(root, product) {
	const productDirectory = join(root, 'web', 'src', 'content', 'handbook', product)
	if (!existsSync(productDirectory)) {
		return []
	}

	return readdirSync(productDirectory, { withFileTypes: true })
		.filter(entry => entry.isDirectory() && existsSync(join(productDirectory, entry.name, 'index.md')))
		.map(entry => entry.name)
		.sort()
}

function getContentTopics(root, product) {
	const productDirectory = join(root, 'web', 'src', 'content', 'handbook', product)
	const visit = directory =>
		readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
			const path = join(directory, entry.name)
			if (entry.isDirectory()) return visit(path)
			return entry.isFile() && entry.name.endsWith('.md') ? [path] : []
		})

	if (!existsSync(productDirectory)) {
		return []
	}

	return visit(productDirectory)
		.map(file => ({
			file,
			path: relative(productDirectory, file)
				.replace(/\.md$/, '')
				.replace(/\/index$/, ''),
		}))
		.sort()
}

function getFrontmatterValue(file, field) {
	const frontmatter = readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? ''
	return frontmatter
		.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'))?.[1]
		?.trim()
		.replace(/^['"]|['"]$/g, '')
}

/**
 * A TypeScript example that starts with a fluent-builder dot cannot be copied
 * on its own. Canonical handbook pages must show the owning declaration or
 * present the material as non-code prose; detached chains have repeatedly
 * hidden required imports, builder values, and lifecycle context.
 */
function hasDetachedTypeScriptBuilderExample(source) {
	for (const block of source.matchAll(/^```(?:ts|tsx|typescript)(?:\s[^\n]*)?\n([\s\S]*?)^```/gm)) {
		const firstStatement = block[1]
			.split('\n')
			.map(line => line.trim())
			.find(line => line.length > 0 && !line.startsWith('import '))
		if (firstStatement?.startsWith('.')) return true
	}
	return false
}

/**
 * A bare `models:`, `agents:`, or `workflows:` property looks like a complete
 * TypeScript example but cannot run without the surrounding builder or object.
 * Canonical pages may use a named handler fragment when that scope is explicit;
 * they must not present a detached configuration property as source code.
 */
function hasDetachedTypeScriptConfigurationPropertyExample(source) {
	const builderProperties = /^(?:models|tools|skills|agents|workflows|defaults|storage|workspace|sandbox)\s*:/
	for (const block of source.matchAll(/^```(?:ts|tsx|typescript)(?:\s[^\n]*)?\n([\s\S]*?)^```/gm)) {
		const firstStatement = block[1]
			.split('\n')
			.map(line => line.trim())
			.find(line => line.length > 0 && !line.startsWith('import ') && !line.startsWith('//'))
		if (firstStatement && builderProperties.test(firstStatement)) return true
	}
	return false
}

/**
 * `ServiceBuilder.getInstance(...)` accepts validated service settings through
 * `serviceConfig`, not `config`. The latter is commonly valid for adapter
 * constructors, so this check scopes the guard to examples that call the
 * service factory and leaves adapter configuration untouched.
 */
function hasLegacyServiceInstanceConfigExample(source) {
	for (const block of source.matchAll(/^```(?:ts|tsx|typescript)(?:\s[^\n]*)?\n([\s\S]*?)^```/gm)) {
		if (/\.getInstance\(\s*[^,]+,\s*\{[\s\S]{0,240}?\bconfig\s*:/.test(block[1])) return true
	}
	return false
}

/**
 * The generated project exposes `purista add service` without a `--version`
 * CLI option; it creates v1 by default. Child generators use
 * `--service-version`, which is intentionally not covered by this guard.
 */
function hasUnsupportedAddServiceVersionOption(source) {
	for (const block of source.matchAll(/^```(?:bash|sh)(?:\s[^\n]*)?\n([\s\S]*?)^```/gm)) {
		if (/npm\s+run\s+add:service\s+--[^\n]*\s--version(?:\s|=)/.test(block[1])) return true
	}
	return false
}

const documentedFenceLanguages = new Set([
	'ts',
	'tsx',
	'typescript',
	'bash',
	'sh',
	'json',
	'yaml',
	'yml',
	'dotenv',
	'sql',
	'text',
	'mermaid',
])

/**
 * Mounted Harness integration has a compact, high-risk Framework surface. A
 * code example is incomplete when it introduces one of these calls but leaves
 * the reader without the member-level lookup in the same section.
 *
 * This deliberately covers the mount and address-first declaration surface
 * rather than attempting to infer every arbitrary dot call in TypeScript. The
 * latter would mistake schema, resource, and application code for a PURISTA
 * builder and turn the audit into noise. Other builder families remain covered
 * by the method-level ledger and the handbook authoring rule.
 */
const attachedAgentBuilderMethodAnchors = new Map([
	['mountHarness', 'mountharness'],
	['getHarnessHostToolBuilder', 'getharnesshosttoolbuilder'],
	['canInvokeAgent', 'caninvokeagent'],
	['canInvokeWorkflow', 'caninvokeworkflow'],
	['canUseHarnessModel', 'canuseharnessmodel'],
])

function getMarkdownSection(source, index) {
	const before = source.slice(0, index)
	const headings = [...before.matchAll(/^#{1,6}\s+.+$/gm)]
	const start = headings.at(-1)?.index ?? 0
	const level = headings.at(-1)?.[0].match(/^#+/)?.[0].length ?? 1
	const after = source.slice(index)
	const nextHeading = [...after.matchAll(/^#{1,6}\s+.+$/gm)].find(match => match[0].match(/^#+/)?.[0].length <= level)
	const end = nextHeading?.index === undefined ? source.length : index + nextHeading.index
	return source.slice(start, end)
}

/**
 * The explanation may be prose, a table, or an API-linked task sentence; its
 * exact wording cannot be judged mechanically. Requiring the generated-member
 * link in the code block's own Markdown section is a narrow, stable proxy: it
 * makes a reader's exact lookup available at the point of use without
 * accepting a distant, unrelated API index as coverage.
 */
function getAttachedAgentBuilderLookupIssues(source) {
	const issues = []
	for (const block of source.matchAll(/^```(?:ts|tsx|typescript)(?:\s[^\n]*)?\n([\s\S]*?)^```/gm)) {
		const section = getMarkdownSection(source, block.index ?? 0)
		for (const [method, anchor] of attachedAgentBuilderMethodAnchors) {
			if (!new RegExp(`\\.${method}\\s*\\(`).test(block[1])) continue
			const apiLink = new RegExp(
				`\\]\\(/handbook/api/(?:classes|interfaces|functions|types)/[^)\\s]+#${anchor}\\)`,
				'i',
			)
			if (!apiLink.test(section)) {
				issues.push(method)
			}
		}
	}
	return [...new Set(issues)]
}

function hasUntitledDocumentedFence(source) {
	return source.split('\n').some(line => {
		const language = /^```([^\s`]+)/.exec(line)?.[1]
		return language !== undefined && documentedFenceLanguages.has(language) && !/\btitle=(['"]).*?\1/.test(line)
	})
}

const retiredFrameworkDocumentationFragments = [
	['SchedulerRuntime', 'Core does not ship a SchedulerRuntime; schedules are exported contracts'],
	['DefaultSchedulerProvider', 'Core does not ship a DefaultSchedulerProvider'],
	['createHttpServer', 'generated Hono projects use getHttpServer'],
	['subscribeToEvent(eventName, eventVersion', 'subscribeToEvent receives a producer service version'],
]

function getRetiredFrameworkDocumentationIssues(source) {
	return retiredFrameworkDocumentationFragments
		.filter(([fragment]) => source.includes(fragment))
		.map(([, explanation]) => explanation)
}

function hasDevelopmentNarrative(source) {
	return /\b(?:current HEAD|current v4 target|not yet published|unreleased development branch|while v4 was being developed)\b/i.test(
		source,
	)
}

/**
 * Verify that the handbook manifest remains a complete, product-aware routing
 * graph. The manifest deliberately includes deprecated compatibility topics;
 * those entries retain their routes but are not required to have canonical
 * content sources.
 */
export async function auditHandbookManifest(root = process.cwd()) {
	const issues = []
	const manifestFile = resolve(root, 'web', 'src', 'data', 'handbook.ts')
	if (!existsSync(manifestFile)) {
		return ['web/src/data/handbook.ts: handbook manifest is missing']
	}

	let handbook
	try {
		handbook = await import(pathToFileURL(manifestFile).href)
	} catch (error) {
		return [
			`web/src/data/handbook.ts: could not load handbook manifest (${error instanceof Error ? error.message : String(error)})`,
		]
	}

	const {
		handbookManifest: topics,
		handbookProducts: products,
		handbookCompatibilityAliases: aliases,
		getHandbookCompatibilityRedirects,
		getHandbookRedirectTarget,
		getProductCardTopics,
		getProductPageTopics,
		getPreviousTopic,
		getNextTopic,
	} = handbook
	if (!Array.isArray(topics) || !Array.isArray(products)) {
		return ['web/src/data/handbook.ts: must export handbookManifest and handbookProducts arrays']
	}
	if (
		!Array.isArray(aliases) ||
		typeof getHandbookCompatibilityRedirects !== 'function' ||
		typeof getHandbookRedirectTarget !== 'function'
	) {
		return ['web/src/data/handbook.ts: must export compatibility aliases and redirect selectors']
	}

	const topicIds = new Map()
	const routes = new Map()
	for (const topic of topics) {
		if (!topic?.topicId) {
			issues.push('web/src/data/handbook.ts: every manifest topic needs a topicId')
			continue
		}
		if (topicIds.has(topic.topicId)) {
			issues.push(`web/src/data/handbook.ts: duplicate topicId ${topic.topicId}`)
		} else {
			topicIds.set(topic.topicId, topic)
		}

		if (!topic.canonicalRoute?.startsWith('/handbook/') || !topic.canonicalRoute.endsWith('/')) {
			issues.push(`web/src/data/handbook.ts: ${topic.topicId} must use a normalized /handbook/.../ canonicalRoute`)
		} else if (routes.has(topic.canonicalRoute)) {
			issues.push(`web/src/data/handbook.ts: duplicate canonicalRoute ${topic.canonicalRoute}`)
		} else {
			routes.set(topic.canonicalRoute, topic)
		}

		if (!handbookProducts.includes(topic.product)) {
			issues.push(`web/src/data/handbook.ts: ${topic.topicId} has unsupported product ${String(topic.product)}`)
		}
		if (!topic.chapterId) {
			issues.push(`web/src/data/handbook.ts: ${topic.topicId} needs a chapterId`)
		}
		if (!handbookRoles.has(topic.pageRole)) {
			issues.push(`web/src/data/handbook.ts: ${topic.topicId} has unsupported pageRole ${String(topic.pageRole)}`)
		}
		if (!handbookStatuses.has(topic.status)) {
			issues.push(`web/src/data/handbook.ts: ${topic.topicId} has unsupported status ${String(topic.status)}`)
		}
		if (!Array.isArray(topic.redirects)) {
			issues.push(`web/src/data/handbook.ts: ${topic.topicId} must declare redirects, even when empty`)
		}
	}

	for (const topic of topics) {
		if (!topic?.topicId) {
			continue
		}

		if (topic.parentTopicId) {
			const parent = topicIds.get(topic.parentTopicId)
			if (!parent) {
				issues.push(`web/src/data/handbook.ts: ${topic.topicId} references missing parent ${topic.parentTopicId}`)
			} else if (parent.product !== topic.product) {
				issues.push(`web/src/data/handbook.ts: ${topic.topicId} crosses products through parent ${topic.parentTopicId}`)
			}
		} else if (topic.pageRole !== 'landing') {
			issues.push(`web/src/data/handbook.ts: non-landing topic ${topic.topicId} needs a parentTopicId`)
		}

		if (topic.status === 'canonical' && topic.pageRole !== 'landing') {
			if (!topic.source) {
				issues.push(`web/src/data/handbook.ts: canonical topic ${topic.topicId} needs a content source`)
			} else if (!contentSourceExists(root, topic.source)) {
				issues.push(
					`web/src/data/handbook.ts: canonical topic ${topic.topicId} source ${topic.source.collection}/${topic.source.id} is missing`,
				)
			}
		}
	}

	for (const product of products) {
		const rootTopic = topicIds.get(product.topicId)
		if (
			!rootTopic ||
			rootTopic.product !== product.id ||
			rootTopic.pageRole !== 'landing' ||
			rootTopic.canonicalRoute !== product.canonicalRoute
		) {
			issues.push(`web/src/data/handbook.ts: product ${product.id} needs a matching landing manifest topic`)
		}
	}

	const compatibilityRoutes = new Set()
	const configuredRedirects = getHandbookCompatibilityRedirects()
	for (const alias of aliases) {
		if (!/^\/(?:handbook|harness)\/(?:.*)$/.test(alias.sourceRoute)) {
			issues.push(
				`web/src/data/handbook.ts: compatibility alias ${alias.sourceRoute} must use a normalized public route`,
			)
		}
		if (compatibilityRoutes.has(alias.sourceRoute)) {
			issues.push(`web/src/data/handbook.ts: duplicate compatibility alias ${alias.sourceRoute}`)
		}
		compatibilityRoutes.add(alias.sourceRoute)

		const target = topicIds.get(alias.targetTopicId)
		if (target?.status !== 'canonical') {
			issues.push(
				`web/src/data/handbook.ts: compatibility alias ${alias.sourceRoute} targets missing canonical topic ${alias.targetTopicId}`,
			)
			continue
		}
		if (alias.disposition !== 'redirect') continue

		const markdownSource = alias.sourceRoute.replace(/\/$/, '.md')
		if (getHandbookRedirectTarget(alias.sourceRoute) !== target.canonicalRoute) {
			issues.push(`web/src/data/handbook.ts: compatibility alias ${alias.sourceRoute} has an incorrect redirect target`)
		}
		if (configuredRedirects[alias.sourceRoute] !== target.canonicalRoute) {
			issues.push(
				`web/src/data/handbook.ts: compatibility alias ${alias.sourceRoute} is missing an HTML redirect projection`,
			)
		}
		if (!target.redirects.includes(alias.sourceRoute) || !target.redirects.includes(markdownSource)) {
			issues.push(
				`web/src/data/handbook.ts: canonical topic ${alias.targetTopicId} must record both compatibility routes`,
			)
		}
	}

	for (const alias of aliases) {
		if (alias.disposition !== 'redirect' && configuredRedirects[alias.sourceRoute]) {
			issues.push(
				`web/src/data/handbook.ts: ${alias.disposition} compatibility alias ${alias.sourceRoute} must not emit a redirect`,
			)
		}
	}

	for (const product of handbookProducts) {
		if (
			typeof getProductCardTopics !== 'function' ||
			typeof getProductPageTopics !== 'function' ||
			typeof getPreviousTopic !== 'function' ||
			typeof getNextTopic !== 'function'
		) {
			issues.push('web/src/data/handbook.ts: product-local page navigation selectors are missing')
			break
		}

		for (const [graphName, graph] of [
			['canonical page', getProductPageTopics(product)],
			['legacy card', getProductCardTopics(product)],
		]) {
			const seen = new Set()
			for (const [index, topic] of graph.entries()) {
				if (topic.product !== product) {
					issues.push(
						`web/src/data/handbook.ts: ${product} ${graphName} next/previous graph includes ${topic.topicId} from ${topic.product}`,
					)
				}
				if (seen.has(topic.topicId)) {
					issues.push(
						`web/src/data/handbook.ts: ${product} ${graphName} next/previous graph duplicates ${topic.topicId}`,
					)
				}
				seen.add(topic.topicId)

				const expectedPrevious = graph[index - 1]
				const expectedNext = graph[index + 1]
				if (getPreviousTopic(topic)?.topicId !== expectedPrevious?.topicId) {
					issues.push(`web/src/data/handbook.ts: ${topic.topicId} has an incorrect product-local previous topic`)
				}
				if (getNextTopic(topic)?.topicId !== expectedNext?.topicId) {
					issues.push(`web/src/data/handbook.ts: ${topic.topicId} has an incorrect product-local next topic`)
				}
			}
		}
	}

	for (const product of handbookProducts) {
		for (const content of getContentTopics(root, product)) {
			const topicId = `${product}/${content.path}`
			const topic = topicIds.get(topicId)
			if (topic?.status !== 'canonical' || topic.source?.collection !== 'handbook' || topic.source.id !== topicId) {
				issues.push(
					`web/src/content/handbook/${product}/${content.path}.md: canonical content is missing from the handbook manifest`,
				)
				continue
			}

			for (const field of ['title', 'description']) {
				const value = getFrontmatterValue(content.file, field)
				if (value !== undefined && topic[field] !== value) {
					issues.push(
						`web/src/data/handbook-content-manifest.ts: ${topicId} ${field} does not match its content frontmatter`,
					)
				}
			}

			const order = Number(getFrontmatterValue(content.file, 'order') ?? 999999)
			if (topic.order !== order) {
				issues.push(
					`web/src/data/handbook-content-manifest.ts: ${topicId} order does not match its content frontmatter`,
				)
			}

			const contentSource = readFileSync(content.file, 'utf8')

			if (hasDetachedTypeScriptBuilderExample(contentSource)) {
				issues.push(
					`web/src/content/handbook/${topicId}.md: TypeScript examples must not start with a detached fluent-builder call`,
				)
			}

			if (hasDetachedTypeScriptConfigurationPropertyExample(contentSource)) {
				issues.push(
					`web/src/content/handbook/${topicId}.md: TypeScript examples must not start with a detached builder configuration property`,
				)
			}

			if (hasLegacyServiceInstanceConfigExample(contentSource)) {
				issues.push(
					`web/src/content/handbook/${topicId}.md: ServiceBuilder.getInstance(...) examples must use serviceConfig, not config`,
				)
			}

			if (hasUnsupportedAddServiceVersionOption(contentSource)) {
				issues.push(
					`web/src/content/handbook/${topicId}.md: npm run add:service does not support --version; it creates v1 by default`,
				)
			}

			if (hasUntitledDocumentedFence(contentSource)) {
				issues.push(
					`web/src/content/handbook/${topicId}.md: every documented code, command, output, and diagram fence needs a meaningful title`,
				)
			}

			if (product === 'framework') {
				for (const explanation of getRetiredFrameworkDocumentationIssues(contentSource)) {
					issues.push(`web/src/content/handbook/${topicId}.md: ${explanation}`)
				}
				if (hasDevelopmentNarrative(contentSource)) {
					issues.push(
						`web/src/content/handbook/${topicId}.md: public documentation must describe the released final state`,
					)
				}
			}

			if (topicId.startsWith('framework/build-ai-powered-services/')) {
				const missingLookups = getAttachedAgentBuilderLookupIssues(contentSource)
				if (missingLookups.length) {
					issues.push(
						`web/src/content/handbook/${topicId}.md: attached-agent builder call(s) need an exact generated API member link in the same section: ${missingLookups.join(', ')}`,
					)
				}
			}
		}

		for (const chapterSlug of getContentChapterSlugs(root, product)) {
			const topicId = `${product}/${chapterSlug}`
			const topic = topicIds.get(topicId)
			if (topic?.status !== 'canonical' || topic.pageRole !== 'chapter') {
				issues.push(
					`web/src/content/handbook/${product}/${chapterSlug}/index.md: canonical chapter is missing from the handbook manifest`,
				)
				continue
			}
			if (topic.canonicalRoute !== `/handbook/${product}/${chapterSlug}/`) {
				issues.push(`web/src/data/handbook.ts: canonical chapter ${topicId} has an incorrect route`)
			}
			if (topic.source?.collection !== 'handbook' || topic.source.id !== topicId) {
				issues.push(`web/src/data/handbook.ts: canonical chapter ${topicId} must source handbook/${topicId}`)
			}
		}
	}

	return issues
}

async function main() {
	const issues = await auditHandbookManifest()
	if (issues.length) {
		process.stderr.write(`PURISTA handbook audit found ${issues.length} issue(s):\n`)
		for (const issue of issues) {
			process.stderr.write(`- ${issue}\n`)
		}
		process.exitCode = 1
		return
	}

	process.stdout.write('PURISTA handbook audit passed.\n')
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	await main()
}
