import { getHarnessMarkdownPage } from '../data/harness-markdown'
import { markdownResponse } from '../lib/agent-markdown'

export function GET() {
	const page = getHarnessMarkdownPage('index')
	if (!page) return new Response('Not found', { status: 404 })

	return markdownResponse({
		title: page.title,
		description: page.description,
		canonicalPath: '/harness/',
		sourcePath: 'web/src/data/harness-markdown.ts',
		body: page.body,
	})
}
