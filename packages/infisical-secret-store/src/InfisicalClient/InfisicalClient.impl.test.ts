import { StatusCode, type UnhandledError } from '@purista/core'
import { describe, expect, it } from 'vitest'
import { InfisicalClient } from './InfisicalClient.impl.js'

describe('InfisicalClient', () => {
	it('throws a typed error when bearer token is missing', () => {
		expect(
			() =>
				new InfisicalClient({
					bearerToken: '' as unknown as string,
				}),
		).toThrowError(
			expect.objectContaining<Partial<UnhandledError>>({
				errorCode: StatusCode.InvalidToken,
				message: 'Invalid service token - bearer token is missing',
			}),
		)
	})

	it('throws a typed error when bearer token has no secret segment', () => {
		expect(
			() =>
				new InfisicalClient({
					bearerToken: 'token-without-secret-segment.',
				}),
		).toThrowError(
			expect.objectContaining<Partial<UnhandledError>>({
				errorCode: StatusCode.InvalidToken,
				message: 'Invalid service token - token secret segment is missing',
			}),
		)
	})
})
