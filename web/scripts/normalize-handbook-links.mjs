import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = path.join(webRoot, 'dist')
const handbookRoot = path.join(webRoot, 'src', 'content', 'handbook')
let rewrites = 0

for (const file of await listHtmlFiles(path.join(distRoot, 'handbook'))) {
	const sourceFile = await sourceFileForHtml(file)
	if (!sourceFile) continue

	const html = await readFile(file, 'utf8')
	const normalized = html.replace(/\bhref=("|')([^"']+\.md(?:[?#][^"']*)?)\1/g, (full, quote, href) => {
		const destination = canonicalHandbookRoute(sourceFile, href)
		if (!destination || destination === href) return full
		rewrites += 1
		return `href=${quote}${destination}${quote}`
	})

	if (normalized !== html) await writeFile(file, normalized)
}

process.stdout.write(`Normalized ${rewrites} legacy handbook link${rewrites === 1 ? '' : 's'} to canonical HTML routes.\n`)

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

async function isFile(file) {
	try {
		return (await stat(file)).isFile()
	} catch {
		return false
	}
}

async function listHtmlFiles(directory) {
	const files = []
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const file = path.join(directory, entry.name)
		if (entry.isDirectory()) files.push(...(await listHtmlFiles(file)))
		else if (entry.isFile() && entry.name.endsWith('.html')) files.push(file)
	}
	return files
}
