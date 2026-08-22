import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

import { getLoggerMock } from '@purista/core/adapter'

import { InfisicalSecretStore } from '../src/InfisicalSecretStore.impl.js'

/*
read and write:
st.647467a4fd775a75b3f6dd67.9a0a41e44f1847dd83f5710179011997.4a5b4c1e8e4380aca242ca20915762b1

readonly:
st.64746e08fd775a75b3f6e6db.82cd9d993fa4e5981a8132bdadea6adc.0c902c3ca70cb49d99660537d30c0cdc
*/

const infisicalTestsEnabled = ['1', 'true'].includes(process.env.PURISTA_INFISICAL_SECRET_STORE_TESTS ?? '')
const infisicalToken = process.env.PURISTA_INFISICAL_TOKEN
const describeWithInfisical = infisicalTestsEnabled && infisicalToken ? describe : describe.skip

describeWithInfisical('Infisical secret store', () => {
	const baseUrl = process.env.PURISTA_INFISICAL_BASE_URL ?? 'http://localhost:8080/'
	let store!: InfisicalSecretStore

	beforeAll(async () => {
		execSync(`cd ${resolve(__dirname, '../')} && npm run env:up`)

		await new Promise(resolve => {
			setTimeout(() => {
				resolve(undefined)
			}, 5000)
		})

		if (!infisicalToken) {
			throw new Error('PURISTA_INFISICAL_TOKEN is required for Infisical integration tests')
		}

		store = new InfisicalSecretStore({
			bearerToken: infisicalToken,
			baseUrl,
			enableGet: true,
			enableRemove: true,
			enableSet: true,
			logger: getLoggerMock().mock,
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
