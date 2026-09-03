import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const chapter = process.argv[2]
if (!chapter) throw new Error('Pass a chapter id')

const repoRoot = new URL('../../..', import.meta.url).pathname
const docsRoot = join(repoRoot, 'web/src/content/tutorials', chapter)
const sourceRoot = join(repoRoot, 'examples/banking/chapters', chapter)

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
					const content = (await readFile(join(sourceRoot, title), 'utf8')).trimEnd()
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
