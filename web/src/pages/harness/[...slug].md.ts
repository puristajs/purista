import { harnessMarkdownPages } from '../../data/harness-markdown'
import { markdownResponse } from '../../lib/agent-markdown'

export function getStaticPaths() {
	return harnessMarkdownPages
		.filter(page => page.id !== 'index')
		.map(page => ({ params: { slug: page.id }, props: { page } }))
}

export function GET({ props }: { props: { page: (typeof harnessMarkdownPages)[number] } }) {
	return markdownResponse({
		title: props.page.title,
		description: props.page.description,
		canonicalPath: `/harness/${props.page.id}/`,
		sourcePath: 'web/src/data/harness-markdown.ts',
		body: props.page.body,
	})
}
