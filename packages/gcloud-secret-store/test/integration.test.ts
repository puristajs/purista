import { getLoggerMock } from '@purista/core'
import { randomUUID } from 'node:crypto'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { GoogleSecretStore } from '../src/GoogleSecretStore.impl.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const keyFilename = process.env.PURISTA_GCLOUD_CREDENTIALS ?? path.join(__dirname, './gcloud-credentials.json')
const hasCredentials = existsSync(keyFilename)
const gcloudTestsEnabled = ['1', 'true'].includes(process.env.PURISTA_GCLOUD_SECRET_STORE_TESTS ?? '')
const describeWithCredentials = hasCredentials && gcloudTestsEnabled ? describe : describe.skip

describeWithCredentials('Google Secret Manager secret store', () => {
	const secretName = randomUUID()

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
