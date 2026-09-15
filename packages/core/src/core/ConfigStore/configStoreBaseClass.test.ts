import type { SinonSandbox } from 'sinon'
import { createSandbox } from 'sinon'

import type { ObjectWithKeysFromStringArray } from '../../helper/index.js'
import { getLoggerMock } from '../../mocks/index.js'
import { UnhandledError } from '../Error/index.js'
import { StatusCode } from '../types/index.js'
import { ConfigStoreBaseClass } from './ConfigStoreBaseClass.impl.js'

class TestClass extends ConfigStoreBaseClass {
	protected getConfigImpl<ConfigNames extends string[]>(
		..._configNames: ConfigNames
	): Promise<ObjectWithKeysFromStringArray<ConfigNames>> {
		throw new Error('Not implemented')
	}

	protected setConfigImpl(_configName: string, _configValue: unknown): Promise<void> {
		throw new Error('Not implemented')
	}

	protected removeConfigImpl(_configName: string): Promise<void> {
		throw new Error('Not implemented')
	}
}

class CacheTestClass extends ConfigStoreBaseClass {
	public readonly values = new Map<string, unknown>()
	public readonly reads: string[][] = []

	protected async getConfigImpl<ConfigNames extends string[]>(
		...configNames: ConfigNames
	): Promise<ObjectWithKeysFromStringArray<ConfigNames>> {
		this.reads.push(configNames)
		return Object.fromEntries(
			configNames.map(name => [name, this.values.get(name)]),
		) as ObjectWithKeysFromStringArray<ConfigNames>
	}

	protected async setConfigImpl(configName: string, configValue: unknown): Promise<void> {
		this.values.set(configName, configValue)
	}

	protected async removeConfigImpl(configName: string): Promise<void> {
		this.values.delete(configName)
	}
}

describe('ConfigStoreBaseClass', () => {
	let sandbox: SinonSandbox
	let configStore: ConfigStoreBaseClass
	let logger: ReturnType<typeof getLoggerMock>

	beforeEach(() => {
		sandbox = createSandbox()
		logger = getLoggerMock(sandbox)
		configStore = new TestClass('test', { logger: logger.mock })
	})

	afterEach(() => {
		sandbox.restore()
	})

	describe('getConfig', () => {
		it('should throw an UnhandledError if enableGet is false', async () => {
			sandbox.stub(configStore.config, 'enableGet').value(false)

			await expect(configStore.getConfig('test')).rejects.toEqual(
				new UnhandledError(StatusCode.Unauthorized, 'get config from store is disabled by config'),
			)

			sandbox.assert.calledOnce(logger.stubs.error)
		})

		it('should throw an UnhandledError if enableGet is true but method is not implemented', async () => {
			sandbox.stub(configStore.config, 'enableGet').value(true)

			await expect(configStore.getConfig('test')).rejects.toEqual(new Error('Not implemented'))
		})

		it('reuses enabled cache entries and refreshes them after the TTL', async () => {
			const clock = sandbox.useFakeTimers({ now: 1_000 })
			const cached = new CacheTestClass('cached', { logger: logger.mock, enableCache: true, cacheTtl: 100 })
			cached.values.set('theme', 'dark')

			await expect(cached.getConfig('theme')).resolves.toEqual({ theme: 'dark' })
			cached.values.set('theme', 'light')
			await expect(cached.getConfig('theme')).resolves.toEqual({ theme: 'dark' })
			expect(cached.reads).toHaveLength(1)

			await clock.tickAsync(101)
			await expect(cached.getConfig('theme')).resolves.toEqual({ theme: 'light' })
			expect(cached.reads).toHaveLength(2)
		})
	})

	describe('setConfig', () => {
		it('should throw an UnhandledError if enableSet is false', async () => {
			sandbox.stub(configStore.config, 'enableSet').value(false)

			await expect(configStore.setConfig('test', {})).rejects.toEqual(
				new UnhandledError(StatusCode.Unauthorized, 'set config at store is disabled by config'),
			)

			sandbox.assert.calledOnce(logger.stubs.error)
		})

		it('should throw an UnhandledError if enableSet is true but method is not implemented', async () => {
			// Arrange
			sandbox.stub(configStore.config, 'enableSet').value(true)

			await expect(configStore.setConfig('test', {})).rejects.toEqual(new Error('Not implemented'))
		})

		it('updates the enabled cache after a successful write', async () => {
			const cached = new CacheTestClass('cached', { logger: logger.mock, enableCache: true, enableSet: true })

			await cached.setConfig('theme', 'dark')
			await expect(cached.getConfig('theme')).resolves.toEqual({ theme: 'dark' })
			expect(cached.reads).toHaveLength(0)
		})
	})

	describe('removeConfig', () => {
		it('should throw an UnhandledError if enableRemove is false', async () => {
			sandbox.stub(configStore.config, 'enableRemove').value(false)

			await expect(configStore.removeConfig('test')).rejects.toMatchObject(
				new UnhandledError(StatusCode.Unauthorized, 'remove config from store is disabled by config'),
			)

			sandbox.assert.calledOnce(logger.stubs.error)
		})

		it('should throw an UnhandledError if enableRemove is true but method is not implemented', async () => {
			sandbox.stub(configStore.config, 'enableRemove').value(true)

			await expect(configStore.removeConfig('test')).rejects.toMatchObject(new Error('Not implemented'))
		})

		it('invalidates the enabled cache after a successful removal', async () => {
			const cached = new CacheTestClass('cached', { logger: logger.mock, enableCache: true, enableRemove: true })
			cached.values.set('theme', 'dark')
			await cached.getConfig('theme')

			await cached.removeConfig('theme')
			await expect(cached.getConfig('theme')).resolves.toEqual({ theme: undefined })
			expect(cached.reads).toHaveLength(2)
		})
	})
})
