import { createCommandContextMock, getEventBridgeMock, getLoggerMock, safeBind, type StateStore } from '@purista/core'
import { createSandbox } from 'sinon'
import { afterEach, describe, expect, test } from 'vitest'
import { loginCommandBuilder } from './command/login/loginCommandBuilder.js'
import type { LocalIdentityProvider } from './LocalIdentityProvider.js'
import { identityV1ServiceBuilder } from './identityV1ServiceBuilder.js'
import { readActiveSession, sessionStateKey } from './session.js'

const sandbox = createSandbox()
afterEach(() => sandbox.restore())

async function loginHandler(provider: LocalIdentityProvider) {
	const service = await identityV1ServiceBuilder.getInstance(getEventBridgeMock(sandbox).mock, {
		logger: getLoggerMock(sandbox).mock,
		serviceConfig: { sessionTtlMs: 60_000 },
		resources: { identityProvider: provider },
	})
	const input = { username: 'alex@example.test', password: 'demo-password' }
	const mocked = createCommandContextMock(loginCommandBuilder, {
		payload: input, parameter: {}, resources: { identityProvider: provider }, sandbox,
	})
	mocked.stubs.setState.resolves()
	return { service, input, mocked, handler: safeBind(loginCommandBuilder.getCommandFunction(), service) }
}

describe('Identity session commands', () => {
	test('authenticates through the resource and writes only opaque session state', async () => {
		const provider: LocalIdentityProvider = { authenticate: sandbox.stub().resolves({ principalId: 'principal-alex', tenantId: 'tenant-example', displayName: 'Alex Example' }) }
		const { service, input, mocked, handler } = await loginHandler(provider)
		try {
			const result = await handler(mocked.context, input, {})
			expect(result.sessionToken).toMatch(/^[0-9a-f-]{36}$/)
			expect(mocked.stubs.setState.calledOnce).toBe(true)
			expect(mocked.stubs.setState.firstCall.args[0]).toBe(sessionStateKey(result.sessionToken))
			expect(mocked.stubs.setState.firstCall.args[1]).toMatchObject({ principalId: 'principal-alex', tenantId: 'tenant-example' })
		} finally { await service.destroy() }
	})

	test('does not write state when the provider rejects credentials', async () => {
		const provider: LocalIdentityProvider = { authenticate: sandbox.stub().resolves(undefined) }
		const { service, input, mocked, handler } = await loginHandler(provider)
		try {
			await expect(handler(mocked.context, input, {})).rejects.toMatchObject({ errorCode: 401 })
			expect(mocked.stubs.setState.called).toBe(false)
		} finally { await service.destroy() }
	})

	test.each([
		['missing', undefined, false],
		['corrupt', { principalId: 7 }, true],
		['expired', { principalId: 'p', tenantId: 't', displayName: 'Alex', expiresAt: Date.now() - 1 }, true],
	])('rejects %s state and removes unsafe stored values', async (_name, value, shouldRemove) => {
		const token = crypto.randomUUID()
		const key = sessionStateKey(token)
		const removeState = sandbox.stub().resolves()
		const states = {
			getState: sandbox.stub().resolves({ [key]: value }),
			removeState,
		} as unknown as Pick<StateStore, 'getState' | 'removeState'>
		await expect(readActiveSession(states, token)).rejects.toMatchObject({ errorCode: 401 })
		expect(removeState.called).toBe(shouldRemove)
	})
})
