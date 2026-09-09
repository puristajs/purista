import { describe, expect, it } from 'vitest'
import { supportQuestionSessionId } from './requireSupportQuestion.js'

describe('supportQuestionSessionId', () => {
	it('keeps structured identity fields unambiguous', () => {
		const first = supportQuestionSessionId({ tenantId: 'a:b', principalId: 'c' }, 'question-1')
		const second = supportQuestionSessionId({ tenantId: 'a', principalId: 'b:c' }, 'question-1')

		expect(first).not.toBe(second)
		expect(first).toBe(supportQuestionSessionId({ tenantId: 'a:b', principalId: 'c' }, 'question-1'))
	})
})
