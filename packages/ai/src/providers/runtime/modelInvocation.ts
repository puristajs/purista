import { HandledError, StatusCode, UnhandledError } from '@purista/core'
import { createProtocolSafeErrorDetails } from '../../runtime/errorDiagnostics.js'

export type ModelInvocationRetryPolicy = {
	maxAttempts: number
	delayMs?: number
	strategy?: 'fixed' | 'exponential'
	maxDelayMs?: number
}

export type ModelInvocationPolicy = {
	timeoutMs?: number
	retry?: ModelInvocationRetryPolicy
}

export type ModelInvocationClassification = {
	kind: 'timeout' | 'schema' | 'transient' | 'unexpected'
	statusCode: StatusCode
	handled: boolean
	retryable: boolean
	message: string
}

const sleep = async (durationMs: number) => await new Promise(resolve => setTimeout(resolve, durationMs))

const isRecord = (value: unknown): value is Record<string, unknown> =>
	!!value && typeof value === 'object' && !Array.isArray(value)

const normalizeMessage = (error: unknown) => {
	if (error instanceof Error) {
		return error.message
	}
	if (typeof error === 'string') {
		return error
	}
	if (isRecord(error) && typeof error.message === 'string') {
		return error.message
	}
	return ''
}

const toLower = (value: string) => value.toLowerCase()

const isTimeoutLikeError = (error: unknown) => {
	const message = toLower(normalizeMessage(error))
	return (
		message.includes('timeout') ||
		message.includes('timed out') ||
		message.includes('aborted') ||
		message.includes('aborterror') ||
		(error instanceof Error && error.name === 'AbortError')
	)
}

const isSchemaLikeError = (error: unknown) => {
	const message = toLower(normalizeMessage(error))
	return (
		message.includes('invalid schema') ||
		message.includes('invalid_json_schema') ||
		message.includes('response_format') ||
		message.includes('propertynames is not permitted') ||
		(message.includes('tools[') && message.includes('.name'))
	)
}

const isTransientLikeError = (error: unknown) => {
	const message = toLower(normalizeMessage(error))
	if (isSchemaLikeError(error) || isTimeoutLikeError(error)) {
		return false
	}
	const code =
		isRecord(error) && typeof error.code === 'string'
			? toLower(error.code)
			: error instanceof Error && 'code' in error && typeof error.code === 'string'
				? toLower(error.code)
				: isRecord(error) && isRecord(error.cause) && typeof error.cause.code === 'string'
					? toLower(error.cause.code)
					: undefined
	return (
		message.includes('fetch failed') ||
		message.includes('enotfound') ||
		message.includes('econnrefused') ||
		message.includes('enetunreach') ||
		message.includes('eai_again') ||
		message.includes('econnreset') ||
		message.includes('etimedout') ||
		message.includes('socket hang up') ||
		message.includes('temporarily unavailable') ||
		message.includes('service unavailable') ||
		message.includes('rate limit') ||
		message.includes('too many requests') ||
		message.includes('gateway timeout') ||
		message.includes('503') ||
		message.includes('429') ||
		code === 'enotfound' ||
		code === 'econnrefused' ||
		code === 'enetunreach' ||
		code === 'eai_again' ||
		(isRecord(error) && error.isRetryable === true)
	)
}

export const classifyModelInvocationError = (error: unknown): ModelInvocationClassification => {
	if (error instanceof HandledError) {
		return {
			kind: 'unexpected',
			statusCode: error.errorCode,
			handled: true,
			retryable: false,
			message: error.message,
		}
	}
	if (error instanceof UnhandledError) {
		return {
			kind: 'unexpected',
			statusCode: error.errorCode,
			handled: false,
			retryable: false,
			message: error.message,
		}
	}
	if (isTimeoutLikeError(error)) {
		return {
			kind: 'timeout',
			statusCode: StatusCode.GatewayTimeout,
			handled: false,
			retryable: true,
			message: normalizeMessage(error) || 'Model invocation timed out',
		}
	}
	if (isSchemaLikeError(error)) {
		return {
			kind: 'schema',
			statusCode: StatusCode.InternalServerError,
			handled: false,
			retryable: false,
			message: normalizeMessage(error) || 'Model provider returned invalid structured output',
		}
	}
	if (isTransientLikeError(error)) {
		return {
			kind: 'transient',
			statusCode: StatusCode.BadGateway,
			handled: false,
			retryable: true,
			message: normalizeMessage(error) || 'Model provider invocation failed',
		}
	}
	return {
		kind: 'unexpected',
		statusCode: StatusCode.InternalServerError,
		handled: false,
		retryable: false,
		message: normalizeMessage(error) || 'Model provider invocation failed',
	}
}

const normalizeRetryPolicy = (retry?: ModelInvocationRetryPolicy) => {
	if (!retry) {
		return undefined
	}
	return {
		maxAttempts: Math.max(1, Math.trunc(retry.maxAttempts || 0)),
		delayMs: Math.max(0, Math.trunc(retry.delayMs ?? 0)),
		strategy: retry.strategy ?? 'fixed',
		maxDelayMs: retry.maxDelayMs === undefined ? undefined : Math.max(0, Math.trunc(retry.maxDelayMs)),
	}
}

const computeRetryDelay = (policy: ReturnType<typeof normalizeRetryPolicy>, attemptIndex: number) => {
	if (!policy) {
		return 0
	}
	const baseDelay = policy.delayMs ?? 0
	if (policy.strategy !== 'exponential') {
		return baseDelay
	}
	const delay = baseDelay * Math.max(1, 2 ** Math.max(0, attemptIndex - 1))
	return policy.maxDelayMs === undefined ? delay : Math.min(delay, policy.maxDelayMs)
}

const runWithTimeout = async <T>(operation: () => Promise<T>, timeoutMs: number, label: string): Promise<T> => {
	let timer: ReturnType<typeof setTimeout> | undefined
	try {
		return await Promise.race([
			operation(),
			new Promise<T>((_, reject) => {
				timer = setTimeout(() => {
					reject(new Error(`Model invocation for ${label} timed out after ${timeoutMs}ms`))
				}, timeoutMs)
			}),
		])
	} finally {
		if (timer) {
			clearTimeout(timer)
		}
	}
}

/**
 * Runs a model invocation with optional timeout and retry policy.
 *
 * Provider/runtime failures surface as `UnhandledError`.
 * Business validation and insufficient-context outcomes should stay in handlers as `HandledError`.
 */
export const runBoundedModelInvocation = async <T>(input: {
	label: string
	operation: () => Promise<T>
	policy?: ModelInvocationPolicy
}): Promise<T> => {
	const retryPolicy = normalizeRetryPolicy(input.policy?.retry)
	const maxAttempts = retryPolicy?.maxAttempts ?? 1
	const timeoutMs = input.policy?.timeoutMs

	let attempt = 0
	let lastError: unknown
	while (attempt < maxAttempts) {
		attempt += 1
		try {
			return timeoutMs === undefined
				? await input.operation()
				: await runWithTimeout(input.operation, timeoutMs, input.label)
		} catch (error) {
			lastError = error
			const classification = classifyModelInvocationError(error)
			const shouldRetry = attempt < maxAttempts && classification.retryable
			if (shouldRetry) {
				const retryDelayMs = computeRetryDelay(retryPolicy, attempt)
				if (retryDelayMs > 0) {
					await sleep(retryDelayMs)
				}
				continue
			}
			if (classification.handled) {
				throw new HandledError(classification.statusCode, classification.message, {
					label: input.label,
					attempts: attempt,
				})
			}
			const wrappedError = new UnhandledError(classification.statusCode, classification.message, {
				label: input.label,
				attempts: attempt,
				timeoutMs,
				kind: classification.kind,
				details: createProtocolSafeErrorDetails(error),
			})
			wrappedError.cause = error
			throw wrappedError
		}
	}

	const fallbackError = new UnhandledError(
		StatusCode.InternalServerError,
		`Model invocation for ${input.label} failed`,
		{
			label: input.label,
			attempts: maxAttempts,
			details: createProtocolSafeErrorDetails(lastError),
		},
	)
	fallbackError.cause = lastError
	throw fallbackError
}
