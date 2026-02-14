import { createSandbox } from 'sinon'
import { createOpenStreamFunctionProxy } from './createOpenStreamFunctionProxy.impl.js'

describe('createOpenStreamFunctionProxy', () => {
	it('forwards service, version, target, payload and parameter', async () => {
		const sandbox = createSandbox()
		const openStream = sandbox.stub().resolves({ sessionId: 'stream-1' })

		const proxy = createOpenStreamFunctionProxy<{
			UserService: {
				1: {
					searchUsers: (payload: { search: string }, parameter: { limit: number }) => Promise<{ sessionId: string }>
				}
			}
		}>(openStream)

		const result = await proxy.UserService[1].searchUsers({ search: 'alice' }, { limit: 25 })

		expect(result).toEqual({ sessionId: 'stream-1' })
		expect(openStream.callCount).toBe(1)
		expect(openStream.firstCall.args[0]).toEqual({
			serviceName: 'UserService',
			serviceVersion: '1',
			serviceTarget: 'searchUsers',
		})
		expect(openStream.firstCall.args[1]).toEqual({ search: 'alice' })
		expect(openStream.firstCall.args[2]).toEqual({ limit: 25 })
	})
})
