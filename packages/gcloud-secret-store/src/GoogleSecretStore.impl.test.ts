import type { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { StatusCode } from '@purista/core/adapter'
import { describe, expect, it, vi } from 'vitest'
import { GoogleSecretStore } from './GoogleSecretStore.impl.js'

describe('GoogleSecretStore', () => {
	it('returns undefined for missing secret (gRPC code 5)', async () => {
		const store = new GoogleSecretStore({
			project: 'projects/demo',
		})
		store.client = {
			accessSecretVersion: vi.fn().mockRejectedValue({ code: 5 }),
		} as unknown as SecretManagerServiceClient

		await expect(store.getSecret('missing-secret')).resolves.toStrictEqual({
			'missing-secret': undefined,
		})
	})

	it('throws internal server error for non-not-found failures', async () => {
		const store = new GoogleSecretStore({
			project: 'projects/demo',
		})
		store.client = {
			accessSecretVersion: vi.fn().mockRejectedValue({ code: 13, message: 'gcloud unavailable' }),
		} as unknown as SecretManagerServiceClient

		await expect(store.getSecret('boom')).rejects.toMatchObject({
			errorCode: StatusCode.InternalServerError,
		})
	})

	it('creates a secret when setting a missing secret', async () => {
		const accessSecretVersion = vi.fn().mockRejectedValue({ code: 5 })
		const createSecret = vi.fn().mockResolvedValue({})
		const addSecretVersion = vi.fn().mockResolvedValue({})

		const store = new GoogleSecretStore({
			project: 'projects/demo',
			enableSet: true,
		})
		store.client = {
			accessSecretVersion,
			createSecret,
			addSecretVersion,
		} as unknown as SecretManagerServiceClient

		await expect(store.setSecret('foo', 'bar')).resolves.toBeUndefined()
		expect(accessSecretVersion).toHaveBeenCalledOnce()
		expect(createSecret).toHaveBeenCalledOnce()
		expect(addSecretVersion).toHaveBeenCalledOnce()
	})
})
