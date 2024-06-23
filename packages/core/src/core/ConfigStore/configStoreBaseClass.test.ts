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
	})
})
