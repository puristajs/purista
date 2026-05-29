import { getApiPage, getApiStaticPaths } from '../../../lib/api-docs'
import { markdownResponse } from '../../../lib/agent-markdown'

export function getStaticPaths() {
	return getApiStaticPaths()
}

export function GET({ props }: { props: { item: Parameters<typeof getApiPage>[0] } }) {
	const page = getApiPage(props.item)
	const blocks = [
		page.summary,
		`Package: \`${page.packageName}\``,
		page.signature ? `## Signature\n\n\`\`\`typescript\n${page.signature}\n\`\`\`` : '',
		page.examples.length
			? `## Examples\n\n${page.examples.map(example => `\`\`\`typescript\n${example}\n\`\`\``).join('\n\n')}`
			: '',
		page.blockTags.length ? `## Notes\n\n${page.blockTags.map(tag => `### ${tag.tag}\n\n${tag.text}`).join('\n\n')}` : '',
		page.memberGroups.length
			? `## Members\n\n${page.memberGroups
					.map(group => {
						const items = group.items
							.map(item => `- \`${item.signature || item.name}\`${item.summary ? ` — ${item.summary}` : ''}`)
							.join('\n')
						return `### ${group.title}\n\n${items}`
					})
					.join('\n\n')}`
			: '',
	]
		.filter(Boolean)
		.join('\n\n')

	return markdownResponse({
		title: `${page.name} API`,
		description: page.summary || `${page.label} from ${page.packageName}`,
		canonicalPath: page.href,
		sourcePath: page.source?.fileName,
		body: blocks,
	})
}
