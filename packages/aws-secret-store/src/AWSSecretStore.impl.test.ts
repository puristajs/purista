import type { SecretsManagerClient } from '@aws-sdk/client-secrets-manager'
import { CreateSecretCommand, ResourceNotFoundException, UpdateSecretCommand } from '@aws-sdk/client-secrets-manager'
import { StatusCode } from '@purista/core'
import { describe, expect, it, vi } from 'vitest'
import { AWSSecretStore } from './AWSSecretStore.impl.js'

describe('AWSSecretStore', () => {
	it('throws internal server error for non-resource-not-found failures on set', async () => {
		const store = new AWSSecretStore({ enableSet: true, client: {} })
		store.client = {
			send: vi.fn().mockRejectedValue(new Error('aws unavailable')),
		} as unknown as SecretsManagerClient

		await expect(store.setSecret('foo', 'bar')).rejects.toMatchObject({
			errorCode: StatusCode.InternalServerError,
		})
	})

	it('creates secret and retries update on resource-not-found during set', async () => {
		const store = new AWSSecretStore({ enableSet: true, client: {} })
		const send = vi
			.fn()
			.mockRejectedValueOnce(new ResourceNotFoundException({ $metadata: {}, message: 'missing secret' }))
			.mockResolvedValueOnce({})
			.mockResolvedValueOnce({})

		store.client = { send } as unknown as SecretsManagerClient

		await expect(store.setSecret('foo', 'bar')).resolves.toBeUndefined()
		expect(send).toHaveBeenCalledTimes(3)
		expect(send.mock.calls[0][0]).toBeInstanceOf(UpdateSecretCommand)
		expect(send.mock.calls[1][0]).toBeInstanceOf(CreateSecretCommand)
		expect(send.mock.calls[2][0]).toBeInstanceOf(UpdateSecretCommand)
	})
})
