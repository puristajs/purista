import { builtInTools } from '@purista/harness'
import { describe, expect, it } from 'vitest'
import { supportMethodsSkill } from '../../skill/support-methods/supportMethodsSkill.js'
import { answerProcedureQuestionAgent } from './answerProcedureQuestionAgent.js'

describe('answerProcedureQuestionAgent', () => {
	it('uses direct Skill and read-tool definitions', () => {
		expect(answerProcedureQuestionAgent.id).toBe('answerProcedureQuestion')
		expect(answerProcedureQuestionAgent.skills).toEqual([supportMethodsSkill])
		expect(answerProcedureQuestionAgent.tools).toEqual([builtInTools.read])
		expect(Object.isFrozen(answerProcedureQuestionAgent)).toBe(true)
	})
})
