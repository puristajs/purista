import type { SkillSourceMap } from '@purista/ai'

export const exampleSkills = {
	'spec-elicitation': {
		content: `
# Spec Elicitation

Clarify missing users, workflows, constraints, and integrations before proposing architecture or implementation details.
    `.trim(),
	},
	'support-workflow': {
		content: `
# Support Workflow

Prefer concise user-facing answers.
Use factual tool outputs first, then summarize them into clear next steps.
If escalation is needed, explain why in one sentence.
    `.trim(),
		references: {
			'answer-style.md': 'Keep answers concise, grounded in tool results, and explicit about next steps.',
		},
	},
	'tool-loop-discipline': {
		content: `
# Tool Loop Discipline

Use the provided tools before answering when the task depends on service data.
Do not invent tool results.
    `.trim(),
	},
} satisfies SkillSourceMap<'spec-elicitation' | 'support-workflow' | 'tool-loop-discipline'>
