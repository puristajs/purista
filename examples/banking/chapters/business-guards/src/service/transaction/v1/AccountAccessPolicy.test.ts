import { describe, expect, test } from 'vitest'
import { localAccountAccessPolicy } from './AccountAccessPolicy.js'

const request = {
	tenantId: 'tenant-example',
	accountId: 'account-operating',
} as const

describe('localAccountAccessPolicy', () => {
	test('allows Alex to read and record the operating account', () => {
		expect(localAccountAccessPolicy.isAllowed({ ...request, principalId: 'principal-alex', action: 'read' })).toBe(true)
		expect(localAccountAccessPolicy.isAllowed({ ...request, principalId: 'principal-alex', action: 'record' })).toBe(true)
	})

	test('allows Sam to read but denies recording on the operating account', () => {
		expect(localAccountAccessPolicy.isAllowed({ ...request, principalId: 'principal-sam', action: 'read' })).toBe(true)
		expect(localAccountAccessPolicy.isAllowed({ ...request, principalId: 'principal-sam', action: 'record' })).toBe(false)
	})

	test('denies an account outside the principal or tenant scope', () => {
		expect(localAccountAccessPolicy.isAllowed({ ...request, accountId: 'account-review', principalId: 'principal-alex', action: 'read' })).toBe(false)
		expect(localAccountAccessPolicy.isAllowed({ ...request, tenantId: 'tenant-other', principalId: 'principal-alex', action: 'read' })).toBe(false)
	})
})
