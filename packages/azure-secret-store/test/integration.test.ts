import { execSync } from 'node:child_process'
import https from 'node:https'
import net from 'node:net'
import { resolve } from 'node:path'

import { DefaultAzureCredential } from '@azure/identity'
import { getLoggerMock } from '@purista/core'
import { stub } from 'sinon'

import { AzureSecretStore } from '../src/AzureSecretStore.impl.js'

const azureTestsEnabled = ['1', 'true'].includes(process.env.PURISTA_AZURE_SECRET_STORE_TESTS ?? '')
const describeWithAzure = azureTestsEnabled ? describe : describe.skip

const waitForPort = async (port: number, host = '127.0.0.1', timeoutMs = 60_000) => {
	const start = Date.now()

	while (Date.now() - start < timeoutMs) {
		try {
			await new Promise<void>((resolve, reject) => {
				const socket = net.createConnection({ host, port }, () => {
					socket.end()
					resolve()
				})
				socket.setTimeout(3_000, () => {
					socket.destroy(new Error('connection timeout'))
				})
				socket.once('error', err => {
					socket.destroy()
					reject(err)
				})
			})
			return
		} catch {
			await new Promise(resolve => setTimeout(resolve, 500))
		}
	}

	throw new Error(`Timed out waiting for ${host}:${port}`)
}

const waitForHttpsEndpoint = async (url: URL, timeoutMs = 60_000) => {
	const start = Date.now()
	const agent = new https.Agent({ rejectUnauthorized: false })

	while (Date.now() - start < timeoutMs) {
		try {
			await new Promise<void>((resolve, reject) => {
				const request = https.request(url, { method: 'GET', agent }, response => {
					response.resume()
					response.on('end', resolve)
				})
				request.setTimeout(3_000, () => {
					request.destroy(new Error('timeout'))
				})
				request.once('error', reject)
				request.end()
			})
			return
		} catch {
			await new Promise(resolve => setTimeout(resolve, 500))
		}
	}

	throw new Error(`Timed out waiting for ${url.href}`)
}

describeWithAzure('Azure Secret Manager secret store', () => {
	let store: AzureSecretStore
	beforeAll(async () => {
		const vaultUrlString = process.env.PURISTA_AZURE_VAULT_URL ?? 'https://localhost:8443'
		const vaultUrl = new URL(vaultUrlString)

		execSync(`cd ${resolve(__dirname, '../')} && npm run env:up`)

		const vaultPort = vaultUrl.port ? Number.parseInt(vaultUrl.port, 10) : 443
		await Promise.all([waitForPort(vaultPort), waitForPort(8081)])
		await waitForHttpsEndpoint(vaultUrl)

		// temporary workaround as assumed-identity-nodejs does not work by setting AZURE_POD_IDENTITY_AUTHORITY_HOST
		stub(DefaultAzureCredential.prototype, 'getToken').resolves({
			expiresOnTimestamp: Date.now() + 30000,
			token: 'noop',
		})

		store = new AzureSecretStore({
			enableGet: true,
			enableRemove: true,
			enableSet: true,
			logger: getLoggerMock().mock,
			allowInsecureConnection: true,
			vaultUrl: vaultUrlString,
			options: {
				serviceVersion: '7.4',
				disableChallengeResourceVerification: true,
			},
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
