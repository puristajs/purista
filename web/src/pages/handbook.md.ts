import { markdownResponse } from '../lib/agent-markdown'

export function GET() {
	return markdownResponse({
		title: 'PURISTA Handbook',
		description:
			'Handbook chapters from hands-on tutorials to mental model, building blocks, enterprise patterns, operations, and API documentation.',
		canonicalPath: '/handbook/',
		body: `The PURISTA handbook explains how to build production-grade TypeScript systems with PURISTA.

## Main Sections

- [Quickstart](/handbook/1_quickstart.md)
- [Core Concepts](/handbook/concept.md)
- [Principles](/handbook/principles.md)
- [Building Business Logic](/handbook/2_building_business-logic.md)
- [Ecosystem](/handbook/3_eco_system.md)
- [OpenTelemetry](/handbook/4_open_telemetry.md)
- [Deploy and Scale](/handbook/5_deploy_and_scale.md)
- [Integrations](/handbook/6_integrations.md)
- [API Documentation](/handbook/api.md)

Use the canonical HTML pages for human navigation and the \`.md\` pages for source-backed agent context.`,
	})
}
