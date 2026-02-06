import { mkdir, readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { ClientBuilder } from '../src/index.js'

describe('client-builder', () => {
	const workPath = join(fileURLToPath(new URL('.', import.meta.url)))
	const outputPath = join(workPath, 'tmp')

	let clientBuilder: ClientBuilder

	beforeEach(async () => {
		await rm(outputPath, { force: true, recursive: true })
		await mkdir(outputPath)
		clientBuilder = new ClientBuilder()
	})

	afterEach(async () => {
		await rm(outputPath, { force: true, recursive: true })
		await mkdir(outputPath)
		clientBuilder.destroy()
	})

	it('can load a config from file', async () => {
		clientBuilder.rootPath = workPath
		await expect(clientBuilder.loadConfig()).resolves.toBeUndefined()
	})

	it('can write a config file', async () => {
		const path = join(outputPath, 'testconf.output.json')
		await clientBuilder.writeConfig(path)
		const content = await readFile(path)
		expect(content.toString('utf-8')).toBeDefined()
	})

	it('can create a HTTP client', async () => {
		clientBuilder.rootPath = outputPath

		const definitions = await clientBuilder.loadDefinitionFiles(join(workPath, 'definitions'))
		await clientBuilder.cleanDistFolder()
		await clientBuilder.generateHttpClient(definitions)
		await clientBuilder.createIndex()
		await clientBuilder.createPackageJson()
		clientBuilder.build()
	})

	it('can create an eventbridge client via canonical method', async () => {
		clientBuilder.rootPath = outputPath

		const definitions = await clientBuilder.loadDefinitionFiles(join(workPath, 'definitions'))
		await clientBuilder.cleanDistFolder()
		await clientBuilder.generateEventBridgeClient(definitions)
		await clientBuilder.createIndex()
		await clientBuilder.createPackageJson()
		clientBuilder.build()
	})

	it('can create an eventbridge client via deprecated alias', async () => {
		clientBuilder.rootPath = outputPath

		const definitions = await clientBuilder.loadDefinitionFiles(join(workPath, 'definitions'))
		await clientBuilder.cleanDistFolder()
		await clientBuilder.generateHEventBridgeClient(definitions)
		await clientBuilder.createIndex()
		await clientBuilder.createPackageJson()
		clientBuilder.build()
	})
})
