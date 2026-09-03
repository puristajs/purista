import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = path.join(webRoot, 'dist')
const handbook = await import(pathToFileURL(path.join(webRoot, 'src', 'data', 'handbook.ts')).href)
const aliases = handbook.handbookCompatibilityAliases.filter(alias => alias.disposition === 'redirect')
const configuredRedirects = handbook.getHandbookCompatibilityRedirects()
const issues = []

for (const alias of aliases) {
	const target = handbook.getHandbookRedirectTarget(alias.sourceRoute)
	if (!target) {
		issues.push(`${alias.sourceRoute}: manifest has no canonical redirect target`)
		continue
	}
	if (configuredRedirects[alias.sourceRoute] !== target) {
		issues.push(`${alias.sourceRoute}: Astro redirect projection differs from manifest target`)
	}

	const htmlFile = path.join(distRoot, alias.sourceRoute, 'index.html')
	const markdownSource = alias.sourceRoute.replace(/\/$/, '.md')
	const markdownTarget = target.replace(/\/$/, '.md')
	const markdownFile = path.join(distRoot, markdownSource)

	const builtHtml = (await isFile(htmlFile)) ? await readFile(htmlFile, 'utf8') : undefined
	if (!builtHtml) {
		issues.push(`${alias.sourceRoute}: missing built HTML redirect ${path.relative(webRoot, htmlFile)}`)
	} else if (!builtHtml.includes(`url=${target}`)) {
		issues.push(`${alias.sourceRoute}: built HTML redirect does not point to ${target}`)
	}

	const builtMarkdown = (await isFile(markdownFile)) ? await readFile(markdownFile, 'utf8') : undefined
	if (!builtMarkdown) {
		issues.push(`${markdownSource}: missing built Markdown redirect ${path.relative(webRoot, markdownFile)}`)
	} else if (!builtMarkdown.includes(markdownTarget)) {
		issues.push(`${markdownSource}: built Markdown redirect does not point to ${markdownTarget}`)
	}

	const targetHtmlFile = path.join(distRoot, target, 'index.html')
	const targetMarkdownFile = path.join(distRoot, markdownTarget)
	const targetHtml = (await isFile(targetHtmlFile)) ? await readFile(targetHtmlFile, 'utf8') : undefined
	if (!targetHtml) issues.push(`${alias.sourceRoute}: canonical HTML target is missing ${target}`)
	if (!(await isFile(targetMarkdownFile))) issues.push(`${markdownSource}: canonical Markdown target is missing ${markdownTarget}`)

	if (alias.fragmentAliases) {
		const fragmentAliases = JSON.stringify(alias.fragmentAliases)
		if (
			!builtHtml?.includes('data-handbook-fragment-redirect') ||
			!builtHtml.includes(fragmentAliases) ||
			!builtHtml.includes(JSON.stringify(target))
		) {
			issues.push(`${alias.sourceRoute}: built HTML redirect is missing its reviewed fragment aliases`)
		}
		if (
			!builtMarkdown?.includes('data-handbook-fragment-redirect') ||
			!builtMarkdown.includes(fragmentAliases) ||
			!builtMarkdown.includes(JSON.stringify(markdownTarget))
		) {
			issues.push(`${markdownSource}: built Markdown redirect is missing its reviewed fragment aliases`)
		}
		for (const fragment of Object.values(alias.fragmentAliases)) {
			if (!targetHtml || !hasAnchor(targetHtml, fragment.slice(1))) {
				issues.push(`${alias.sourceRoute}: canonical target ${target} is missing fragment ${fragment}`)
			}
		}
	}
}

if (issues.length) {
	process.stderr.write(`PURISTA handbook redirect audit found ${issues.length} issue(s):\n`)
	for (const issue of issues) process.stderr.write(`- ${issue}\n`)
	process.exitCode = 1
} else {
	process.stdout.write(`PURISTA handbook redirect audit passed (${aliases.length} HTML and ${aliases.length} Markdown compatibility redirects).\n`)
}

async function isFile(file) {
	try {
		return (await stat(file)).isFile()
	} catch {
		return false
	}
}

function hasAnchor(html, anchor) {
	const escaped = anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	return new RegExp(`\\bid=["']${escaped}["']`).test(html)
}
