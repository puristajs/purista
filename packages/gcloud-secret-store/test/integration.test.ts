import { randomUUID } from 'node:crypto'

import { getLoggerMock } from '@purista/core'

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { GoogleSecretStore } from '../src/GoogleSecretStore.impl.js'

describe('Google Secret Manager secret store', () => {
	const secretName = randomUUID()

	const __filename = fileURLToPath(import.meta.url)
	const __dirname = path.dirname(__filename)

	const keyFilename = path.join(__dirname, './gcloud-credentials.json')

	const store = new GoogleSecretStore({
		client: {
			keyFilename,
		},
		project: 'projects/428371962963',
		enableGet: true,
		enableRemove: true,
		enableSet: true,
		logger: getLoggerMock().mock,
	})

	it('set a secret key', async () => {
		await expect(store.setSecret(secretName, 'my-value')).resolves.toBeUndefined()
	})

	it('gets a secret key', async () => {
		await expect(store.getSecret(secretName)).resolves.toStrictEqual({ [secretName]: 'my-value' })
	})

	it('updates a secret key', async () => {
		await expect(store.setSecret(secretName, 'my-value-updated')).resolves.toBeUndefined()
		await expect(store.getSecret(secretName)).resolves.toStrictEqual({ [secretName]: 'my-value-updated' })
	})

	it('removes a secret key', async () => {
		await expect(store.getSecret(secretName)).resolves.toStrictEqual({ [secretName]: 'my-value-updated' })
		await expect(store.removeSecret(secretName)).resolves.toBeUndefined()
		await expect(store.getSecret(secretName)).resolves.toStrictEqual({ [secretName]: undefined })
	})
})
