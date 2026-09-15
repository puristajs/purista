import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = path.join(webRoot, 'dist')
const handbookRoot = path.join(webRoot, 'src', 'content', 'handbook')
const handbook = await import(pathToFileURL(path.join(webRoot, 'src', 'data', 'handbook.ts')).href)
let rewrites = 0
let fragmentRedirects = 0
const unresolvedTargets = []
const fragmentIssues = []

for (const file of await listHtmlFiles(path.join(distRoot, 'handbook'))) {
	const sourceFile = await sourceFileForHtml(file)
	if (!sourceFile) continue

	const html = await readFile(file, 'utf8')
	const normalized = await normalizeLinks(file, sourceFile, html)

	if (normalized !== html) await writeFile(file, normalized)
}

for (const alias of handbook.handbookCompatibilityAliases.filter(alias => alias.disposition === 'redirect' && alias.fragmentAliases)) {
	const target = handbook.getHandbookRedirectTarget(alias.sourceRoute)
	const targetFile = target && path.join(distRoot, target, 'index.html')
	if (!target || !(await isFile(targetFile))) {
		fragmentIssues.push(`${alias.sourceRoute}: missing canonical fragment target ${target ?? '(none)'}`)
		continue
	}
	const targetHtml = await readFile(targetFile, 'utf8')
	for (const fragment of Object.values(alias.fragmentAliases)) {
		if (!hasAnchor(targetHtml, fragment.slice(1))) {
			fragmentIssues.push(`${alias.sourceRoute}: canonical target ${target} is missing ${fragment}`)
		}
	}

	for (const [file, redirectTarget] of [
		[path.join(distRoot, alias.sourceRoute, 'index.html'), target],
		[path.join(distRoot, alias.sourceRoute.replace(/\/$/, '.md')), target.replace(/\/$/, '.md')],
	]) {
		if (!(await isFile(file))) {
			fragmentIssues.push(`${alias.sourceRoute}: missing compatibility output ${path.relative(webRoot, file)}`)
			continue
		}
		const html = await readFile(file, 'utf8')
		const normalized = addFragmentRedirectScript(html, redirectTarget, alias.fragmentAliases)
		if (normalized !== html) {
			await writeFile(file, normalized)
			fragmentRedirects += 1
		}
	}
}

if (unresolvedTargets.length || fragmentIssues.length) {
	if (unresolvedTargets.length) {
	process.stderr.write(`Refused to normalize ${unresolvedTargets.length} handbook link${unresolvedTargets.length === 1 ? '' : 's'} with missing built targets:\n`)
	for (const { sourceRoute, href, destination } of unresolvedTargets.sort((left, right) =>
		`${left.sourceRoute}:${left.href}`.localeCompare(`${right.sourceRoute}:${right.href}`),
	)) {
		process.stderr.write(`- ${sourceRoute}: ${href} -> ${destination}\n`)
	}
	}
	if (fragmentIssues.length) {
		process.stderr.write(`Refused to emit ${fragmentIssues.length} handbook fragment redirect${fragmentIssues.length === 1 ? '' : 's'}:\n`)
		for (const issue of fragmentIssues.sort()) process.stderr.write(`- ${issue}\n`)
	}
	process.exitCode = 1
} else {
	process.stdout.write(`Normalized ${rewrites} legacy handbook link${rewrites === 1 ? '' : 's'} to canonical HTML routes and emitted ${fragmentRedirects} fragment-compatible redirect output${fragmentRedirects === 1 ? '' : 's'}.\n`)
}

async function normalizeLinks(htmlFile, sourceFile, html) {
	const matches = [...html.matchAll(/\bhref=("|')([^"']+\.md(?:[?#][^"']*)?)\1/g)]
	if (!matches.length) return html

	let cursor = 0
	let normalized = ''
	for (const match of matches) {
		const [full, quote, href] = match
		const destination = canonicalHandbookRoute(sourceFile, href)
		const start = match.index ?? 0
		normalized += html.slice(cursor, start)
		cursor = start + full.length

		if (!destination || !(await hasBuiltHtmlRoute(destination))) {
			if (destination) {
				unresolvedTargets.push({ sourceRoute: sourceRouteForHtml(htmlFile), href, destination })
			}
			normalized += full
			continue
		}

		rewrites += 1
		normalized += `href=${quote}${destination}${quote}`
	}

	return `${normalized}${html.slice(cursor)}`
}

async function sourceFileForHtml(htmlFile) {
	const relative = path.relative(path.join(distRoot, 'handbook'), htmlFile)
	const route = relative === 'index.html'
		? ''
		: relative.endsWith(`${path.sep}index.html`)
			? relative.slice(0, -`${path.sep}index.html`.length)
			: undefined
	if (route === undefined) return undefined

	const direct = path.join(handbookRoot, `${route}.md`)
	if (await isFile(direct)) return direct
	const index = path.join(handbookRoot, route, 'index.md')
	return (await isFile(index)) ? index : undefined
}

function canonicalHandbookRoute(sourceFile, href) {
	const match = /^(?<pathname>[^?#]*\.md)(?<suffix>[?#][\s\S]*)?$/.exec(href)
	if (!match?.groups?.pathname || /^(?:https?:)?\/\//.test(match.groups.pathname) || match.groups.pathname.startsWith('/')) return undefined

	const target = path.resolve(path.dirname(sourceFile), match.groups.pathname)
	if (!target.startsWith(`${handbookRoot}${path.sep}`) || !target.endsWith('.md')) return undefined

	const relative = path.relative(handbookRoot, target).split(path.sep).join('/')
	const withoutExtension = relative.slice(0, -'.md'.length)
	const route = withoutExtension.endsWith('/index')
		? withoutExtension.slice(0, -'/index'.length)
		: withoutExtension
	return `/handbook/${route === 'index' ? '' : `${route}/`}${match.groups.suffix ?? ''}`
}

function sourceRouteForHtml(htmlFile) {
	const relative = path.relative(distRoot, htmlFile).split(path.sep).join('/')
	const withoutIndex = relative.endsWith('/index.html') ? relative.slice(0, -'index.html'.length) : relative
	return `/${withoutIndex}`
}

async function hasBuiltHtmlRoute(destination) {
	const pathname = destination.split(/[?#]/, 1)[0]
	return isFile(path.join(distRoot, pathname, 'index.html'))
}

function addFragmentRedirectScript(html, target, fragmentAliases) {
	if (html.includes('data-handbook-fragment-redirect')) return html
	const script = `<script data-handbook-fragment-redirect>const aliases=${JSON.stringify(fragmentAliases)};window.location.replace(${JSON.stringify(target)}+(aliases[window.location.hash]??''));</script>`
	return html.includes('</head>') ? html.replace('</head>', `${script}</head>`) : `${script}${html}`
}

function hasAnchor(html, anchor) {
	const escaped = anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	return new RegExp(`\\bid=["']${escaped}["']`).test(html)
}

async function isFile(file) {
	try {
		return (await stat(file)).isFile()
	} catch {
		return false
	}
}

async function listHtmlFiles(directory) {
	const files = []
	for (const entry of (await readdir(directory, { withFileTypes: true })).sort((left, right) => left.name.localeCompare(right.name))) {
		const file = path.join(directory, entry.name)
		if (entry.isDirectory()) files.push(...(await listHtmlFiles(file)))
		else if (entry.isFile() && entry.name.endsWith('.html')) files.push(file)
	}
	return files
}
