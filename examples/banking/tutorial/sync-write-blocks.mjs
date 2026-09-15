import { readFile, readdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { join, resolve, sep } from 'node:path'

const chapter = process.argv[2]
if (!chapter) throw new Error('Pass a chapter id')

const repoRoot = new URL('../../..', import.meta.url).pathname
const docsRoot = join(repoRoot, 'web/src/content/tutorials', chapter)
const sourceRoot = join(repoRoot, 'examples/banking/chapters', chapter)
const course = JSON.parse(await readFile(join(repoRoot, 'examples/banking/tutorial/course.json'), 'utf8'))
const chapterDefinition = course.chapters.find(candidate => candidate.id === chapter)
assert(chapterDefinition, `Unknown chapter: ${chapter}`)
const enforceV4Source = true

async function visit(directory) {
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name)
		if (entry.isDirectory()) await visit(path)
		else if (entry.name.endsWith('.mdx')) {
			const source = await readFile(path, 'utf8')
			const updated = await replaceAsync(
				source,
				/^```(\w+)([^\n]*)\n([\s\S]*?)^```\s*$/gm,
				async (block, language, meta) => {
					if (!/(?:^|\s)write(?:\s|$)/.test(meta)) return block
					const title = meta.match(/title="([^"]+)"/)?.[1]
					if (!title) throw new Error(`Write block in ${path} has no title`)
					if (enforceV4Source) {
						assert(!title.startsWith('src/harness/'), `Top-level Harness path is forbidden: ${title}`)
						assert(!/HarnessMount\.[cm]?[jt]sx?$/.test(title), `HarnessMount file is forbidden: ${title}`)
					}
					const sourcePath = resolve(sourceRoot, title)
					assert(sourcePath.startsWith(`${sourceRoot}${sep}`), `Write block path escapes the retained project: ${title}`)
					const content = (await readFile(sourcePath, 'utf8')).trimEnd()
					return `\`\`\`${language}${meta}\n${content}\n\`\`\``
				},
			)
			await writeFile(path, updated)
		}
	}
}

async function replaceAsync(value, pattern, replacer) {
	const matches = [...value.matchAll(pattern)]
	const replacements = await Promise.all(matches.map(match => replacer(...match)))
	let result = value
	for (let index = matches.length - 1; index >= 0; index--) {
		const match = matches[index]
		result = result.slice(0, match.index) + replacements[index] + result.slice(match.index + match[0].length)
	}
	return result
}

await visit(docsRoot)
