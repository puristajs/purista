import { access, readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = path.join(webRoot, 'dist')
const siteOrigin = 'https://purista.dev'
const htmlFiles = await listFiles(distRoot, file => file.endsWith('.html'))
const failures = []

for (const file of htmlFiles) {
	const source = await readFile(file, 'utf8')
	const sourceUrl = routeForFile(file)
	for (const href of source.matchAll(/<a\b[^>]*\bhref=(?:"([^"]*)"|'([^']*)')/gi)) {
		const target = href[1] ?? href[2]
		if (!isInternal(target)) continue

		const targetUrl = new URL(target, `${siteOrigin}${sourceUrl}`)
		const resolved = await resolveOutputFile(targetUrl.pathname)
		if (!resolved) {
			failures.push(`${sourceUrl} → ${target} (missing target)`)
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
	process.stdout.write(`Checked ${htmlFiles.length} generated HTML pages: all internal links resolve.\n`)
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
