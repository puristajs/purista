import type { SSMClient } from '@aws-sdk/client-ssm'
import { ParameterNotFound } from '@aws-sdk/client-ssm'
import { StatusCode } from '@purista/core'
import { describe, expect, it, vi } from 'vitest'
import { AWSConfigStore } from './AWSConfigStore.impl.js'

describe('AWSConfigStore', () => {
	it('returns undefined for missing config (ParameterNotFound)', async () => {
		const store = new AWSConfigStore({ client: {} })
		store.client = {
			send: vi.fn().mockRejectedValue(new ParameterNotFound({ $metadata: {}, message: 'missing parameter' })),
		} as unknown as SSMClient

		await expect(store.getConfig('missing-config')).resolves.toStrictEqual({
			'missing-config': undefined,
		})
	})

	it('throws internal server error for non-not-found get failures', async () => {
		const store = new AWSConfigStore({ client: {} })
		store.client = {
			send: vi.fn().mockRejectedValue(new Error('aws unavailable')),
		} as unknown as SSMClient

		await expect(store.getConfig('boom')).rejects.toMatchObject({
			errorCode: StatusCode.InternalServerError,
		})
	})

	it('throws internal server error for set failures', async () => {
		const store = new AWSConfigStore({ enableSet: true, client: {} })
		store.client = {
			send: vi.fn().mockRejectedValue(new Error('aws unavailable')),
		} as unknown as SSMClient

		await expect(store.setConfig('foo', 'bar')).rejects.toMatchObject({
			errorCode: StatusCode.InternalServerError,
		})
	})

	it('throws internal server error for remove failures', async () => {
		const store = new AWSConfigStore({ enableRemove: true, client: {} })
		store.client = {
			send: vi.fn().mockRejectedValue(new Error('aws unavailable')),
		} as unknown as SSMClient

		await expect(store.removeConfig('foo')).rejects.toMatchObject({
			errorCode: StatusCode.InternalServerError,
		})
	})
})
