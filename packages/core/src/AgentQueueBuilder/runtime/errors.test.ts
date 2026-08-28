import {
	HarnessConfigError,
	OperationTimeoutError,
	SandboxPermissionDeniedError,
	SandboxQuotaExceededError,
	SandboxStateLostError,
} from '@purista/harness'
import { describe, expect, it } from 'vitest'
import { HandledError, StatusCode, UnhandledError } from '../../index.js'
import { toAgentRuntimeError } from './errors.js'
import { AgentRunError } from './executor.js'

describe('attached agent error mapping', () => {
	it.each([
		[new HarnessConfigError('private config detail', { reason: 'invalid' }), StatusCode.BadRequest],
		[new SandboxPermissionDeniedError('owner_not_authorized'), StatusCode.Forbidden],
		[new SandboxStateLostError('private owner', { reason: 'owner_missing', lifetime: 'session' }), StatusCode.Conflict],
		[new SandboxQuotaExceededError({ quota: 'catalog_entries', limit: 1, actual: 1 }), StatusCode.TooManyRequests],
		[new OperationTimeoutError('private timeout', { scope: 'run', timeout_ms: 1 }), StatusCode.RequestTimeout],
	] as const)('maps known Harness errors without private details', (source, statusCode) => {
		const error = toAgentRuntimeError(source)

		expect(error).toBeInstanceOf(HandledError)
		expect((error as HandledError).errorCode).toBe(statusCode)
		expect(error.message).toBe('Attached agent execution failed.')
		expect((error as HandledError).data).toEqual({
			code: source.code,
			category: source.category,
			retriable: source.retriable,
		})
		expect(error.message).not.toContain('private')
	})

	it('preserves serialized run classification without metadata or cause', () => {
		const error = toAgentRuntimeError(
			new AgentRunError({
				code: 'MODEL_UNAVAILABLE',
				category: 'model',
				retriable: true,
				message: 'PRIVATE_PROVIDER_FAILURE',
				meta: { token: 'secret' },
			}),
		)

		expect(error).toBeInstanceOf(HandledError)
		expect((error as HandledError).errorCode).toBe(StatusCode.ServiceUnavailable)
		expect(error).toMatchObject({ code: 'MODEL_UNAVAILABLE', category: 'model', retriable: true })
		expect((error as HandledError).data).toEqual({ code: 'MODEL_UNAVAILABLE', category: 'model', retriable: true })
		expect(error.message).not.toContain('PRIVATE_PROVIDER_FAILURE')
	})

	it('keeps framework application errors and hides unknown failures', () => {
		const handled = new HandledError(StatusCode.NotFound, 'Application error', { public: true })
		expect(toAgentRuntimeError(handled)).toBe(handled)

		const unknown = toAgentRuntimeError(new Error('PRIVATE_UNKNOWN_FAILURE'))
		expect(unknown).toBeInstanceOf(UnhandledError)
		expect(unknown.message).toBe('Attached agent execution failed.')
		expect((unknown as UnhandledError).data).toBeUndefined()
	})
})
