import { getApiOverview } from '../../lib/api-docs'
import { markdownResponse } from '../../lib/agent-markdown'

export function GET() {
	const overview = getApiOverview()
	const groups = overview.groups
		.map(group => {
			const entries = group.items
				.slice(0, 50)
				.map(item => `- [${item.name}](${item.href.replace(/\/$/, '.md')}) — ${item.summary || item.packageName}`)
				.join('\n')
			return `## ${group.title}\n\n${entries}`
		})
		.join('\n\n')

	return markdownResponse({
		title: 'PURISTA API Documentation',
		description: 'Markdown index for the handbook-native PURISTA TypeScript API reference.',
		canonicalPath: '/handbook/api/',
		sourcePath: 'web/src/generated/purista-api.json',
		body: `Project: ${overview.projectName}

Total exports: ${overview.totalExports}

## Packages

${overview.packages.map(item => `- [${item.name}](${item.href.replace(/\/$/, '.md')})`).join('\n')}

${groups}`,
	})
}
