import { markdownResponse } from '../lib/agent-markdown'

export function GET() {
	return markdownResponse({
		title: 'PURISTA Handbook',
		description:
			'Handbook chapters from hands-on tutorials to mental model, building blocks, enterprise patterns, operations, and API documentation.',
		canonicalPath: '/handbook/',
		body: `The PURISTA handbook has independent Framework and AI Harness developer paths.

## Choose a product

- [Framework handbook](/handbook/framework.md)
- [AI Harness handbook](/handbook/harness.md)
- [Build an AI-powered PURISTA service](/handbook/blocks/agent-pattern.md)
- [Framework API documentation](/handbook/api.md)

Use the canonical HTML pages for human navigation and the \`.md\` pages for source-backed agent context.`,
	})
}
