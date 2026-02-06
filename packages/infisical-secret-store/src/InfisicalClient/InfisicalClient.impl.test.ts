import { StatusCode, UnhandledError, type UnhandledError as UnhandledErrorType } from '@purista/core'
import { describe, expect, it, vi } from 'vitest'
import { InfisicalClient } from './InfisicalClient.impl.js'
import type { TokenData } from './types/TokenData.js'

const tokenData: TokenData = {
	_id: 'token-id',
	name: 'token',
	workspace: 'workspace-id',
	scopes: [{ _id: 'scope-id', environment: 'dev', secretPath: '/' }],
	user: {
		_id: 'user-id',
		authMethods: ['service-token'],
		email: 'user@example.com',
		firstName: 'First',
		lastName: 'Last',
	},
	serviceAccount: 'service-account',
	lastUsed: new Date(),
	expiresAt: new Date(),
	encryptedKey: 'encrypted-key',
	iv: 'iv',
	tag: 'tag',
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	permissions: [],
}

describe('InfisicalClient', () => {
	it('throws a typed error when bearer token is missing', () => {
		expect(
			() =>
				new InfisicalClient({
					bearerToken: '' as unknown as string,
				}),
		).toThrowError(
			expect.objectContaining<Partial<UnhandledErrorType>>({
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
			expect.objectContaining<Partial<UnhandledErrorType>>({
				errorCode: StatusCode.InvalidToken,
				message: 'Invalid service token - token secret segment is missing',
			}),
		)
	})

	it('falls back to create when patch fails with not found', async () => {
		const client = new InfisicalClient({
			bearerToken: 'header.payload.secret',
		})
		const mutableClient = client as unknown as { tokenData?: TokenData; projectKey?: string }
		mutableClient.tokenData = tokenData
		mutableClient.projectKey = '0123456789abcdef0123456789abcdef'

		const patchSpy = vi
			.spyOn(client as unknown as { patch: (...args: unknown[]) => Promise<unknown> }, 'patch')
			.mockRejectedValue(new UnhandledError(StatusCode.NotFound, 'missing secret'))
		const postSpy = vi
			.spyOn(client as unknown as { post: (...args: unknown[]) => Promise<unknown> }, 'post')
			.mockResolvedValue({})

		await expect(client.setSecret('foo', 'bar')).resolves.toBeUndefined()
		expect(patchSpy).toHaveBeenCalledOnce()
		expect(postSpy).toHaveBeenCalledOnce()
	})

	it('does not fall back to create when patch fails with a non-not-found error', async () => {
		const client = new InfisicalClient({
			bearerToken: 'header.payload.secret',
		})
		const mutableClient = client as unknown as { tokenData?: TokenData; projectKey?: string }
		mutableClient.tokenData = tokenData
		mutableClient.projectKey = '0123456789abcdef0123456789abcdef'

		const patchSpy = vi
			.spyOn(client as unknown as { patch: (...args: unknown[]) => Promise<unknown> }, 'patch')
			.mockRejectedValue(new UnhandledError(StatusCode.InternalServerError, 'patch failed'))
		const postSpy = vi
			.spyOn(client as unknown as { post: (...args: unknown[]) => Promise<unknown> }, 'post')
			.mockResolvedValue({})

		await expect(client.setSecret('foo', 'bar')).rejects.toMatchObject({
			errorCode: StatusCode.InternalServerError,
		})
		expect(patchSpy).toHaveBeenCalledOnce()
		expect(postSpy).not.toHaveBeenCalled()
	})
})
