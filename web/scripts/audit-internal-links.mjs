import { access, readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = path.join(webRoot, 'dist')
const siteOrigin = 'https://purista.dev'
const handbook = await import(pathToFileURL(path.join(webRoot, 'src', 'data', 'handbook.ts')).href)
const htmlFiles = await listFiles(distRoot, file => file.endsWith('.html'))
const failures = []
const compatibilityFragments = []

for (const file of htmlFiles) {
	const source = await readFile(file, 'utf8')
	const sourceUrl = routeForFile(file)
	for (const href of source.matchAll(/<a\b[^>]*\bhref=(?:"([^"]*)"|'([^']*)')/gi)) {
		const target = href[1] ?? href[2]
		if (!isInternal(target)) continue

		const targetUrl = new URL(target, `${siteOrigin}${sourceUrl}`)
		const compatibilityTarget = handbook.getHandbookRedirectTarget(normalizeHandbookRoute(targetUrl.pathname))
		const resolvedRoute = compatibilityTarget ?? targetUrl.pathname
		const resolved = await resolveOutputFile(resolvedRoute)
		if (!resolved) {
			failures.push(`${sourceUrl} → ${target} (missing target${compatibilityTarget ? ` ${compatibilityTarget}` : ''})`)
			continue
		}

		if (compatibilityTarget && targetUrl.hash) {
			compatibilityFragments.push(`${sourceUrl} → ${target} → ${compatibilityTarget}`)
			continue
		}

		if (targetUrl.hash && !hasAnchor(await readFile(resolved, 'utf8'), targetUrl.hash.slice(1))) {
			failures.push(`${sourceUrl} → ${target} (missing #${targetUrl.hash.slice(1)})`)
		}
	}
}

if (failures.length > 0) {
	process.stderr.write(`Found ${failures.length} broken internal link${failures.length === 1 ? '' : 's'}:\n`)
	process.stderr.write(`${failures.join('\n')}\n`)
	process.exitCode = 1
} else {
	process.stdout.write(`Checked ${htmlFiles.length} generated HTML pages: all internal links resolve.`)
	if (compatibilityFragments.length) {
		process.stdout.write(` ${compatibilityFragments.length} fragment link${compatibilityFragments.length === 1 ? '' : 's'} use approved compatibility redirects.\n`)
	} else {
		process.stdout.write('\n')
	}
}

function isInternal(href) {
	return href.startsWith('/') || href.startsWith('./') || href.startsWith('../') || href.startsWith('#')
}

function routeForFile(file) {
	const relative = path.relative(distRoot, file).split(path.sep).join('/')
	if (relative === 'index.html') return '/'
	if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`
	return `/${relative}`
}

function normalizeHandbookRoute(pathname) {
	if (!pathname.startsWith('/handbook/')) return pathname
	return pathname.endsWith('/') ? pathname : `${pathname}/`
}

async function resolveOutputFile(pathname) {
	const relative = decodeURIComponent(pathname).replace(/^\/+/, '')
	const candidates = [
		path.join(distRoot, relative),
		path.join(distRoot, relative, 'index.html'),
		path.join(distRoot, `${relative}.html`),
	]

	for (const candidate of candidates) {
		try {
			if ((await stat(candidate)).isFile()) return candidate
		} catch {
			// Continue through the canonical route candidates.
		}
	}
	return undefined
}

function hasAnchor(html, anchor) {
	const escaped = anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	return new RegExp(`\\bid=["']${escaped}["']`).test(html)
}

async function listFiles(directory, include) {
	const files = []
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const file = path.join(directory, entry.name)
		if (entry.isDirectory()) files.push(...(await listFiles(file, include)))
		else if (entry.isFile() && include(file)) files.push(file)
	}
	return files
}
