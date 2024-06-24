import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

import { DefaultAzureCredential } from '@azure/identity'
import { getLoggerMock } from '@purista/core'
import { stub } from 'sinon'

import { AzureSecretStore } from '../src/AzureSecretStore.impl.js'

describe.skip('Azure Secret Manager secret store', () => {
	let store: AzureSecretStore
	beforeAll(async () => {
		execSync(`cd ${resolve(__dirname, '../')} && npm run env:up`)

		await new Promise(resolve => {
			setTimeout(() => {
				resolve(undefined)
			}, 5000)
		})

		// temporary workaround as assumed-identity-nodejs does not work by setting AZURE_POD_IDENTITY_AUTHORITY_HOST
		stub(DefaultAzureCredential.prototype, 'getToken').resolves({
			expiresOnTimestamp: new Date().getTime() + 30000,
			token: 'noop',
		})

		store = new AzureSecretStore({
			enableGet: true,
			enableRemove: true,
			enableSet: true,
			logger: getLoggerMock().mock,
			vaultUrl: 'https://localhost:8443',
			options: { serviceVersion: '7.4', disableChallengeResourceVerification: true },
		})
	})

	afterAll(async () => {
		execSync(`cd ${resolve(__dirname, '../')} && npm run env:down`)
	})

	it('set a secret key', async () => {
		await expect(store.setSecret('test', 'my-value')).resolves.toBeUndefined()
	})

	it('gets a secret key', async () => {
		await expect(store.getSecret('test')).resolves.toStrictEqual({ test: 'my-value' })
	})

	it('updates a secret key', async () => {
		await expect(store.setSecret('test', 'my-value-updated')).resolves.toBeUndefined()
		await expect(store.getSecret('test')).resolves.toStrictEqual({ test: 'my-value-updated' })
	})

	it('removes a secret key', async () => {
		await expect(store.getSecret('test')).resolves.toStrictEqual({ test: 'my-value-updated' })
		await expect(store.removeSecret('test')).resolves.toBeUndefined()
		await expect(store.getSecret('test')).resolves.toStrictEqual({ test: undefined })
	})
})
