import type { SinonSandbox } from 'sinon'
import { createSandbox } from 'sinon'

import type { ObjectWithKeysFromStringArray } from '../../helper/index.js'
import { getLoggerMock } from '../../mocks/index.js'
import { UnhandledError } from '../Error/index.js'
import { StatusCode } from '../types/index.js'
import { SecretStoreBaseClass } from './SecretStoreBaseClass.impl.js'

class TestClass extends SecretStoreBaseClass {
	protected getSecretImpl<SecretNames extends string[]>(
		..._secretNames: SecretNames
	): Promise<ObjectWithKeysFromStringArray<SecretNames, string | undefined>> {
		throw new Error('Not implemented')
	}

	protected setSecretImpl(_secretName: string, _secretValue: string): Promise<void> {
		throw new Error('Not implemented')
	}

	protected removeSecretImpl(_secretName: string): Promise<void> {
		throw new Error('Not implemented')
	}
}

describe('SecretStoreBaseClass', () => {
	let sandbox: SinonSandbox
	let secretStore: SecretStoreBaseClass
	let logger: ReturnType<typeof getLoggerMock>

	beforeEach(() => {
		sandbox = createSandbox()
		logger = getLoggerMock(sandbox)
		secretStore = new TestClass('test', { logger: logger.mock })
	})

	afterEach(() => {
		sandbox.restore()
	})

	describe('getSecret', () => {
		it('should throw an UnhandledError if enableGet is false', async () => {
			sandbox.stub(secretStore.config, 'enableGet').value(false)

			await expect(secretStore.getSecret('test')).rejects.toEqual(
				new UnhandledError(StatusCode.Unauthorized, 'get secret from store is disabled by config'),
			)

			sandbox.assert.calledOnce(logger.stubs.error)
		})

		it('should throw an UnhandledError if enableGet is true but method is not implemented', async () => {
			sandbox.stub(secretStore.config, 'enableGet').value(true)

			await expect(secretStore.getSecret('test')).rejects.toEqual(new Error('Not implemented'))
		})
	})

	describe('setSecret', () => {
		it('should throw an UnhandledError if enableSet is false', async () => {
			sandbox.stub(secretStore.config, 'enableSet').value(false)

			await expect(secretStore.setSecret('test', 'secret_value')).rejects.toEqual(
				new UnhandledError(StatusCode.Unauthorized, 'set secret at store is disabled by config'),
			)

			sandbox.assert.calledOnce(logger.stubs.error)
		})

		it('should throw an UnhandledError if enableSet is true but method is not implemented', async () => {
			// Arrange
			sandbox.stub(secretStore.config, 'enableSet').value(true)

			await expect(secretStore.setSecret('test', 'secret_value')).rejects.toEqual(new Error('Not implemented'))
		})
	})

	describe('removeSecret', () => {
		it('should throw an UnhandledError if enableRemove is false', async () => {
			sandbox.stub(secretStore.config, 'enableRemove').value(false)

			await expect(secretStore.removeSecret('test')).rejects.toMatchObject(
				new UnhandledError(StatusCode.Unauthorized, 'remove secret from store is disabled by config'),
			)

			sandbox.assert.calledOnce(logger.stubs.error)
		})

		it('should throw an UnhandledError if enableRemove is true but method is not implemented', async () => {
			sandbox.stub(secretStore.config, 'enableRemove').value(true)

			await expect(secretStore.removeSecret('test')).rejects.toMatchObject(new Error('Not implemented'))
		})
	})
})
