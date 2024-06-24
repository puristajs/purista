import { HttpClient, UnhandledError } from '@purista/core'
import type { SinonSandbox } from 'sinon'
import { createSandbox } from 'sinon'

import { DAPR_API_VERSION } from '../types/index.js'
import { DaprStateStore } from './DaprStateStore.impl.js'

describe('DaprStateStore', () => {
	let sandbox: SinonSandbox

	const config = {
		storeName: 'myStateStore',
		enableGet: true,
		stateStoreName: 'test',
		clientConfig: {
			daprHost: 'localhost',
			daprPort: '5000',
			daprApiToken: 'myToken',
			daprApiVersion: DAPR_API_VERSION,
		},
	}

	beforeEach(() => {
		sandbox = createSandbox()
	})

	afterEach(() => {
		sandbox.restore()
		sandbox.reset()
	})

	describe('getState', () => {
		it('should fetch states from the Dapr state store', async () => {
			const stateName1 = 'myState1'
			const stateName2 = 'myState2'
			const stateValue1 = 'myStateValue1'
			const stateValue2 = 'myStateValue2'
			const httpClientGetStub = sandbox.stub(HttpClient.prototype, 'get')
			httpClientGetStub.onFirstCall().resolves(stateValue1)
			httpClientGetStub.onSecondCall().resolves(stateValue2)

			const stateStore = new DaprStateStore(config)
			const result = await stateStore.getState(stateName1, stateName2)

			expect(result).toStrictEqual({
				[stateName1]: stateValue1,
				[stateName2]: stateValue2,
			})

			expect(httpClientGetStub.callCount).toBe(2)
		})

		it('should throw an error if get state is disabled by config', async () => {
			const disabledConfig = {
				storeName: 'myStateStore',
				enableGet: false,
				config: {
					stateStoreName: 'test',
					clientConfig: {
						daprHost: 'localhost',
						daprPort: '5000',
						daprApiToken: 'myToken',
						daprApiVersion: DAPR_API_VERSION,
					},
				},
			}
			const disabledstateStore = new DaprStateStore(disabledConfig)

			await expect(disabledstateStore.getState('myState')).rejects.toThrow('get state from store is disabled by config')
		})
	})

	describe('setState', () => {
		it('should set the status', async () => {
			const stateName = 'test-state'

			const httpClientGetStub = sandbox.stub(HttpClient.prototype, 'post')
			httpClientGetStub.onFirstCall().resolves()

			const stateStore = new DaprStateStore({
				...config,
				enableGet: true,
				enableSet: true,
				enableRemove: true,
			})

			await expect(stateStore.setState(stateName, {})).resolves.toBeUndefined()
		})

		it('should throw an UnhandledError with StatusCode.Unauthorized if enableSet is false', async () => {
			const stateName = 'test-state'
			const stateStore = new DaprStateStore({
				...config,
				enableGet: true,
				enableSet: false,
				enableRemove: true,
			})

			try {
				await stateStore.setState(stateName, {})
			} catch (err) {
				expect(err).toBeInstanceOf(UnhandledError)
				expect((err as UnhandledError).errorCode).toBe(401)
				expect((err as UnhandledError).message).toBe('set state at store is disabled by config')
			}
		})
	})

	describe('removeState', () => {
		it('should remove the status', async () => {
			const stateName = 'test-state'

			const httpClientGetStub = sandbox.stub(HttpClient.prototype, 'delete')
			httpClientGetStub.onFirstCall().resolves()

			const stateStore = new DaprStateStore({
				...config,
				enableGet: true,
				enableSet: true,
				enableRemove: true,
			})

			await expect(stateStore.removeState(stateName)).resolves.toBeUndefined()
		})

		it('should throw an UnhandledError with StatusCode.Unauthorized if enableSet is false', async () => {
			const stateName = 'test-state'
			const stateStore = new DaprStateStore({
				...config,
				enableGet: false,
				enableSet: false,
				enableRemove: false,
			})

			try {
				await stateStore.removeState(stateName)
			} catch (err) {
				expect(err).toBeInstanceOf(UnhandledError)
				expect((err as UnhandledError).errorCode).toBe(401)
				expect((err as UnhandledError).message).toBe('remove state from store is disabled by config')
			}
		})
	})
})
