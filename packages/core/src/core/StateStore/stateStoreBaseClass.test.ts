import type { SinonSandbox } from 'sinon'
import { createSandbox } from 'sinon'

import type { ObjectWithKeysFromStringArray } from '../../helper/index.js'
import { getLoggerMock } from '../../mocks/index.js'
import { UnhandledError } from '../Error/index.js'
import { StatusCode } from '../types/StatusCode.enum.js'
import { StateStoreBaseClass } from './StateStoreBaseClass.impl.js'
import type { ResolvedStateWriteOptions } from './types/StateRetention.js'

class TestClass extends StateStoreBaseClass {
	protected getStateImpl<StateNames extends string[]>(
		..._stateNames: StateNames
	): Promise<ObjectWithKeysFromStringArray<StateNames>> {
		throw new Error('Not implemented')
	}

	protected setStateImpl(_stateName: string, _stateValue: unknown, _options: ResolvedStateWriteOptions): Promise<void> {
		throw new Error('Not implemented')
	}

	protected removeStateImpl(_stateName: string): Promise<void> {
		throw new Error('Not implemented')
	}
}

class AtomicExpiryTestClass extends StateStoreBaseClass {
	lastOptions: ResolvedStateWriteOptions | undefined

	constructor() {
		super('atomic-expiry-test', { logger: getLoggerMock().mock }, { retention: { atomicExpiry: true } })
	}

	protected getStateImpl<StateNames extends string[]>(
		..._stateNames: StateNames
	): Promise<ObjectWithKeysFromStringArray<StateNames>> {
		throw new Error('Not implemented')
	}

	protected async setStateImpl(_stateName: string, _stateValue: unknown, options: ResolvedStateWriteOptions) {
		this.lastOptions = options
	}

	protected removeStateImpl(_stateName: string): Promise<void> {
		throw new Error('Not implemented')
	}
}

describe('StateStoreBaseClass', () => {
	let sandbox: SinonSandbox
	let stateStore: StateStoreBaseClass
	let logger: ReturnType<typeof getLoggerMock>

	beforeEach(() => {
		sandbox = createSandbox()
		logger = getLoggerMock(sandbox)
		stateStore = new TestClass('test', { logger: logger.mock })
	})

	afterEach(() => {
		sandbox.restore()
	})

	describe('getState', () => {
		it('should throw an UnhandledError if enableGet is false', async () => {
			sandbox.stub(stateStore.config, 'enableGet').value(false)

			await expect(stateStore.getState('test')).rejects.toEqual(
				new UnhandledError(StatusCode.Unauthorized, 'get state from store is disabled by config'),
			)

			sandbox.assert.calledOnce(logger.stubs.error)
		})

		it('should throw an UnhandledError if enableGet is true but method is not implemented', async () => {
			sandbox.stub(stateStore.config, 'enableGet').value(true)

			await expect(stateStore.getState('test')).rejects.toEqual(new Error('Not implemented'))
		})
	})

	describe('setState', () => {
		it('should throw an UnhandledError if enableSet is false', async () => {
			sandbox.stub(stateStore.config, 'enableSet').value(false)

			await expect(stateStore.setState('test', 'state_value')).rejects.toEqual(
				new UnhandledError(StatusCode.Unauthorized, 'set state at store is disabled by config'),
			)

			sandbox.assert.calledOnce(logger.stubs.error)
		})

		it('should throw an UnhandledError if enableSet is true but method is not implemented', async () => {
			// Arrange
			sandbox.stub(stateStore.config, 'enableSet').value(true)

			await expect(stateStore.setState('test', 'state_value')).rejects.toEqual(new Error('Not implemented'))
		})

		it('rejects expiry when the adapter has not declared atomic expiry support', async () => {
			await expect(
				stateStore.setState('test', 'state_value', { retention: { mode: 'expire', ttlMs: 1_000 } }),
			).rejects.toEqual(
				new UnhandledError(StatusCode.NotImplemented, 'state store "test" does not support atomic expiry'),
			)

			sandbox.assert.calledOnce(logger.stubs.error)
		})

		it('validates expiry durations before calling an adapter', async () => {
			await expect(
				stateStore.setState('test', 'state_value', { retention: { mode: 'expire', ttlMs: 0 } }),
			).rejects.toThrow('state retention ttlMs must be a positive finite number of milliseconds')
		})

		it('resolves permanent retention and forwards native expiry options to an capable adapter', async () => {
			const store = new AtomicExpiryTestClass()

			await store.setState('permanent', 'value')
			expect(store.lastOptions).toEqual({ retention: { mode: 'forever' } })

			await store.setState('temporary', 'value', { retention: { mode: 'expire', ttlMs: 1_000 } })
			expect(store.lastOptions).toEqual({ retention: { mode: 'expire', ttlMs: 1_000 } })
		})
	})

	describe('removeState', () => {
		it('should throw an UnhandledError if enableRemove is false', async () => {
			sandbox.stub(stateStore.config, 'enableRemove').value(false)

			await expect(stateStore.removeState('test')).rejects.toMatchObject(
				new UnhandledError(StatusCode.Unauthorized, 'remove state from store is disabled by config'),
			)

			sandbox.assert.calledOnce(logger.stubs.error)
		})

		it('should throw an UnhandledError if enableRemove is true but method is not implemented', async () => {
			sandbox.stub(stateStore.config, 'enableRemove').value(true)

			await expect(stateStore.removeState('test')).rejects.toMatchObject(new Error('Not implemented'))
		})
	})
})
