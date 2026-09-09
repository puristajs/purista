import { defineSkill } from '@purista/harness'

export const supportMethodsSkill = defineSkill('support-methods', {
	directory: new URL('./', import.meta.url),
})
