import { HarnessError } from '@purista/harness'
import { HandledError } from '../../core/Error/HandledError.impl.js'
import { UnhandledError } from '../../core/Error/UnhandledError.impl.js'
import { StatusCode } from '../../core/types/StatusCode.enum.js'

type HarnessErrorProjection = {
	code: string
	category: string
	retriable: boolean
}

type ClassifiedHandledError = HandledError & HarnessErrorProjection

const publicMessage = 'Attached agent execution failed.'

/**
 * Converts Harness failures into PURISTA transport errors without exposing provider,
 * owner, workspace, or user-content details.
 */
export function toAgentRuntimeError(error: unknown): Error {
	if (error instanceof HandledError || error instanceof UnhandledError) {
		return error
	}

	const projection = getHarnessErrorProjection(error)
	if (!projection) {
		return new UnhandledError(StatusCode.InternalServerError, publicMessage)
	}

	const mapped = new HandledError(getStatusCode(projection), publicMessage, projection) as ClassifiedHandledError
	Object.defineProperties(mapped, {
		code: { value: projection.code, enumerable: false },
		category: { value: projection.category, enumerable: false },
		retriable: { value: projection.retriable, enumerable: false },
	})
	return mapped
}

/** Returns the stable framework response for invalid agent identity or schema data. */
export function createAgentValidationError(): HandledError {
	return new HandledError(StatusCode.BadRequest, 'Attached agent input or output is invalid.')
}

/** Returns an established PURISTA validation response for static attached-agent setup mistakes. */
export function createAgentConfigurationError(message: string): HandledError {
	return new HandledError(StatusCode.BadRequest, message)
}

function getHarnessErrorProjection(error: unknown): HarnessErrorProjection | undefined {
	if (error instanceof HarnessError) {
		return { code: error.code, category: error.category, retriable: error.retriable }
	}
	if (!error || typeof error !== 'object') {
		return undefined
	}
	const candidate = error as Partial<HarnessErrorProjection>
	if (
		typeof candidate.code !== 'string' ||
		typeof candidate.category !== 'string' ||
		typeof candidate.retriable !== 'boolean'
	) {
		return undefined
	}
	return { code: candidate.code, category: candidate.category, retriable: candidate.retriable }
}

function getStatusCode(error: HarnessErrorProjection): StatusCode {
	if (error.category === 'config' || error.category === 'validation') return StatusCode.BadRequest
	if (error.category === 'permission') return StatusCode.Forbidden
	if (error.code === 'SANDBOX_CONFLICT' || error.code === 'SANDBOX_STATE_LOST') return StatusCode.Conflict
	if (error.code === 'SANDBOX_QUOTA_EXCEEDED') return StatusCode.TooManyRequests
	if (error.category === 'timeout' || error.category === 'cancelled') return StatusCode.RequestTimeout
	return StatusCode.ServiceUnavailable
}
