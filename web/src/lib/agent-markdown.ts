import { readFile } from 'node:fs/promises'
import path from 'node:path'

const contentRoot = path.join(process.cwd(), 'src/content')

export type AgentMarkdownDocument = {
	title: string
	description?: string
	canonicalPath: string
	sourcePath?: string
	body: string
}

export function estimateMarkdownTokens(markdown: string): number {
	return Math.ceil(markdown.length / 4)
}

export function stripFrontmatter(markdown: string): string {
	return markdown.replace(/^---\n[\s\S]*?\n---\n?/, '').trim()
}

export async function readContentMarkdown(
	collection: string,
	id: string,
	extension: 'md' | 'mdx' | 'auto' = 'md',
) {
	const normalizedRoot = path.resolve(contentRoot)

	async function readSafe(relativePath: string) {
		const absolutePath = path.join(contentRoot, relativePath)
		const normalizedPath = path.resolve(absolutePath)
		if (!normalizedPath.startsWith(`${normalizedRoot}${path.sep}`)) {
			throw new Error(`Invalid content path: ${relativePath}`)
		}
		return {
			markdown: await readFile(normalizedPath, 'utf8'),
			relativePath,
		}
	}

	const extensions = extension === 'auto' ? ['md', 'mdx'] : [extension]
	for (const currentExtension of extensions) {
		for (const relativePath of [
			path.join(collection, `${id}.${currentExtension}`),
			path.join(collection, id, `index.${currentExtension}`),
		]) {
			try {
				const result = await readSafe(relativePath)
				return {
					body: stripFrontmatter(result.markdown),
					sourcePath: `web/src/content/${result.relativePath}`,
				}
			} catch (error) {
				if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error
			}
		}
	}

	throw new Error(`Content entry not found: ${collection}/${id}`)
}

export function renderAgentMarkdown(document: AgentMarkdownDocument): string {
	const lines = [
		`# ${document.title}`,
		document.description ? `\n${document.description}` : '',
		'\n---',
		`Canonical: ${document.canonicalPath}`,
		document.sourcePath ? `Source: ${document.sourcePath}` : '',
		'Format: Markdown for agents',
		'---\n',
		document.body.trim(),
		'',
	]

	return `${lines.filter(Boolean).join('\n')}\n`
}

export function markdownResponse(document: AgentMarkdownDocument): Response {
	const markdown = renderAgentMarkdown(document)
	return new Response(markdown, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			Vary: 'Accept',
			'X-Markdown-Tokens': String(estimateMarkdownTokens(markdown)),
			'Content-Signal': 'ai-train=no, search=yes, ai-input=yes',
		},
	})
}
