import { describe, expect, it } from 'vitest'
import { lookupTransactionTool, transactionSummaryForAgentSchema } from './lookupTransactionTool.js'

describe('lookupTransactionTool', () => {
	it('keeps the service-owned tool contract explicit', () => {
		expect(lookupTransactionTool.id).toBe('lookupTransaction')
		expect(lookupTransactionTool.kind).toBe('tool')
		expect(lookupTransactionTool.output).toBe(transactionSummaryForAgentSchema)
		expect(Object.isFrozen(lookupTransactionTool)).toBe(true)
	})
})
