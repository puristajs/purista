import type { SecretClient } from '@azure/keyvault-secrets'
import { StatusCode } from '@purista/core/adapter'
import { describe, expect, it, vi } from 'vitest'
import { AzureSecretStore } from './AzureSecretStore.impl.js'

describe('AzureSecretStore', () => {
	it('returns undefined for missing secret (404)', async () => {
		const store = new AzureSecretStore({
			vaultUrl: 'https://example.vault.azure.net',
		})
		store.client = {
			getSecret: vi.fn().mockRejectedValue({ statusCode: 404 }),
		} as unknown as SecretClient

		await expect(store.getSecret('missing-secret')).resolves.toStrictEqual({
			'missing-secret': undefined,
		})
	})

	it('throws internal server error for non-404 failures', async () => {
		const store = new AzureSecretStore({
			vaultUrl: 'https://example.vault.azure.net',
		})
		store.client = {
			getSecret: vi.fn().mockRejectedValue({ statusCode: 500, message: 'azure unavailable' }),
		} as unknown as SecretClient

		await expect(store.getSecret('boom')).rejects.toMatchObject({
			errorCode: StatusCode.InternalServerError,
		})
	})
})
