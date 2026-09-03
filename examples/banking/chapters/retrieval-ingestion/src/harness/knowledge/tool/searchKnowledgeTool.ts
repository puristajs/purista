import { defineHarnessModule } from '@purista/harness'
import { searchKnowledgeInputSchema, searchKnowledgeOutputSchema } from '../../../service/knowledge/v1/schema.js'

export const searchKnowledgeTool = defineHarnessModule()('knowledge.tool.search', {
	version: '1.0.0',
	register(builder) {
		return builder.hostTool('search_knowledge', {
			kind: 'host',
			description: 'Search an authorized knowledge collection and return source chunks with stable document ids.',
			input: searchKnowledgeInputSchema,
			output: searchKnowledgeOutputSchema,
		})
	},
})
