import { HandledError, UnhandledError } from '@purista/core'
import type { AgentManifest } from '../types/AgentManifest.js'
import type { AgentInvocationIdentity } from './invocationIdentity.js'

export type SanitizedErrorKind = 'provider' | 'network' | 'timeout' | 'schema' | 'sandbox' | 'runtime' | 'business'

export type SanitizedErrorDiagnostics = {
	kind: SanitizedErrorKind
	name?: string
	message: string
	statusCode?: number
	providerCode?: string
	retryable?: boolean
	url?: string
	requestId?: string
	responseHeaders?: Record<string, string>
	responseBody?: unknown
	attempts?: number
	reason?: string
	data?: unknown
}

const SENSITIVE_KEYS = new Set([
	'attachments',
	'bindings',
	'content',
	'developerinstruction',
	'input',
	'inputs',
	'messages',
	'prompt',
	'request',
	'requestbody',
	'requestbodyvalues',
	'references',
	'skills',
	'stderr',
	'stdout',
	'system',
	'text',
	'toolarguments',
	'toolargs',
	'transcript',
])

const ALLOWED_RESPONSE_HEADER_KEYS = new Set([
	'cf-ray',
	'openai-processing-ms',
	'openai-request-id',
	'request-id',
	'retry-after',
	'x-request-id',
	'x-ratelimit-limit-requests',
	'x-ratelimit-limit-tokens',
	'x-ratelimit-remaining-requests',
	'x-ratelimit-remaining-tokens',
	'x-ratelimit-reset-requests',
	'x-ratelimit-reset-tokens',
])

const REQUEST_ID_HEADER_KEYS = ['x-request-id', 'request-id', 'openai-request-id']
const MAX_STRING_LENGTH = 1_000
const MAX_ARRAY_ENTRIES = 20
const MAX_OBJECT_ENTRIES = 40
const MAX_DEPTH = 6

const isRecord = (value: unknown): value is Record<string, unknown> =>
	!!value && typeof value === 'object' && !Array.isArray(value)

const normalizeMessage = (error: unknown): string => {
	if (error instanceof Error) {
		return error.message
	}
	if (typeof error === 'string') {
		return error
	}
	if (isRecord(error) && typeof error.message === 'string') {
		return error.message
	}
	return 'Unknown error'
}

const toLower = (value: string) => value.toLowerCase()

const truncateString = (value: string) =>
	value.length <= MAX_STRING_LENGTH ? value : `${value.slice(0, MAX_STRING_LENGTH)}…`

const extractErrorCode = (error: unknown): string | undefined => {
	if (isRecord(error) && typeof error.code === 'string') {
		return error.code
	}
	if (error instanceof Error && 'code' in error && typeof error.code === 'string') {
		return error.code
	}
	return undefined
}

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

const isNetworkLikeError = (error: unknown) => {
	const message = toLower(normalizeMessage(error))
	const code = toLower(extractErrorCode(error) ?? '')
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
		code === 'enotfound' ||
		code === 'econnrefused' ||
		code === 'enetunreach' ||
		code === 'eai_again' ||
		code === 'econnreset' ||
		code === 'etimedout'
	)
}

const isProviderLikeError = (error: unknown) =>
	isRecord(error) &&
	(typeof error.url === 'string' ||
		typeof error.statusCode === 'number' ||
		typeof error.responseBody === 'string' ||
		isRecord(error.responseHeaders) ||
		error.isRetryable === true ||
		'requestBodyValues' in error)

const isRetryError = (
	error: unknown,
): error is {
	name: 'AI_RetryError'
	reason: string
	errors: unknown[]
	lastError?: unknown
} =>
	isRecord(error) && error.name === 'AI_RetryError' && Array.isArray(error.errors) && typeof error.reason === 'string'

const safeJsonParse = (value: string): unknown => {
	try {
		return JSON.parse(value)
	} catch {
		return value
	}
}

const sanitizeUnknownInternal = (
	value: unknown,
	state: { seen: WeakSet<object>; depth: number; preserveResponseBody?: boolean },
): unknown => {
	if (value === undefined || value === null || typeof value === 'boolean' || typeof value === 'number') {
		return value
	}
	if (typeof value === 'string') {
		return truncateString(value)
	}
	if (typeof value === 'bigint') {
		return value.toString()
	}
	if (typeof value === 'function' || typeof value === 'symbol') {
		return undefined
	}
	if (value instanceof Error) {
		return createSanitizedErrorDiagnostics(value)
	}
	if (!isRecord(value) && !Array.isArray(value)) {
		return String(value)
	}
	if (state.depth >= MAX_DEPTH) {
		return '[truncated]'
	}
	if (typeof value === 'object' && value !== null) {
		if (state.seen.has(value)) {
			return '[circular]'
		}
		state.seen.add(value)
	}
	if (Array.isArray(value)) {
		return value
			.slice(0, MAX_ARRAY_ENTRIES)
			.map(entry => sanitizeUnknownInternal(entry, { ...state, depth: state.depth + 1 }))
	}
	const next: Record<string, unknown> = {}
	for (const [key, entry] of Object.entries(value).slice(0, MAX_OBJECT_ENTRIES)) {
		const normalizedKey = key.toLowerCase()
		if (SENSITIVE_KEYS.has(normalizedKey)) {
			continue
		}
		if (!state.preserveResponseBody && normalizedKey === 'body') {
			continue
		}
		next[key] = sanitizeUnknownInternal(entry, { ...state, depth: state.depth + 1 })
	}
	return next
}

export const sanitizeUnknown = (value: unknown, options?: { preserveResponseBody?: boolean }): unknown =>
	sanitizeUnknownInternal(value, {
		seen: new WeakSet<object>(),
		depth: 0,
		preserveResponseBody: options?.preserveResponseBody,
	})

const getStatusCode = (error: unknown): number | undefined => {
	if (error instanceof HandledError || error instanceof UnhandledError) {
		return error.errorCode
	}
	if (isRecord(error) && typeof error.statusCode === 'number') {
		return error.statusCode
	}
	return undefined
}

const getAttempts = (error: unknown): number | undefined => {
	if (isRetryError(error)) {
		return error.errors.length
	}
	if (isRecord(error) && isRecord(error.data) && typeof error.data.attempts === 'number') {
		return error.data.attempts
	}
	return undefined
}

const collectErrorChain = (error: unknown, seen = new WeakSet<object>(), chain: unknown[] = []): unknown[] => {
	if (error === undefined || error === null) {
		return chain
	}
	if (typeof error === 'object') {
		if (seen.has(error)) {
			return chain
		}
		seen.add(error)
	}
	chain.push(error)
	if (isRetryError(error)) {
		for (const entry of error.errors) {
			collectErrorChain(entry, seen, chain)
		}
	}
	if (isRecord(error) && 'lastError' in error) {
		collectErrorChain(error.lastError, seen, chain)
	}
	if (error instanceof Error && error.cause !== undefined) {
		collectErrorChain(error.cause, seen, chain)
	} else if (isRecord(error) && 'cause' in error) {
		collectErrorChain(error.cause, seen, chain)
	}
	return chain
}

const extractResponseHeaders = (errorChain: unknown[]): Record<string, string> | undefined => {
	for (const entry of errorChain) {
		if (!isRecord(entry) || !isRecord(entry.responseHeaders)) {
			continue
		}
		const sanitized = Object.fromEntries(
			Object.entries(entry.responseHeaders)
				.filter(([key, value]) => typeof value === 'string' && ALLOWED_RESPONSE_HEADER_KEYS.has(key.toLowerCase()))
				.map(([key, value]) => [key, truncateString(value as string)]),
		)
		if (Object.keys(sanitized).length > 0) {
			return sanitized
		}
	}
	return undefined
}

const extractRequestId = (headers: Record<string, string> | undefined, errorChain: unknown[]): string | undefined => {
	for (const [key, value] of Object.entries(headers ?? {})) {
		if (REQUEST_ID_HEADER_KEYS.includes(key.toLowerCase())) {
			return value
		}
	}
	for (const entry of errorChain) {
		if (isRecord(entry) && typeof entry.requestId === 'string') {
			return truncateString(entry.requestId)
		}
	}
	return undefined
}

const extractResponseBody = (errorChain: unknown[]): unknown => {
	for (const entry of errorChain) {
		if (!isRecord(entry) || entry.responseBody === undefined) {
			continue
		}
		if (typeof entry.responseBody === 'string') {
			return sanitizeUnknown(safeJsonParse(entry.responseBody), { preserveResponseBody: true })
		}
		return sanitizeUnknown(entry.responseBody, { preserveResponseBody: true })
	}
	return undefined
}

const extractProviderCode = (errorChain: unknown[]): string | undefined => {
	for (const entry of errorChain) {
		const direct = extractErrorCode(entry)
		if (typeof direct === 'string') {
			return truncateString(direct)
		}
		if (isRecord(entry) && isRecord(entry.data) && typeof entry.data.code === 'string') {
			return truncateString(entry.data.code)
		}
	}
	return undefined
}

const extractRetryable = (errorChain: unknown[]): boolean | undefined => {
	for (const entry of errorChain) {
		if (isRecord(entry) && typeof entry.isRetryable === 'boolean') {
			return entry.isRetryable
		}
		if (isRetryError(entry)) {
			return entry.reason !== 'errorNotRetryable'
		}
	}
	return undefined
}

const extractReason = (errorChain: unknown[]): string | undefined => {
	for (const entry of errorChain) {
		if (isRetryError(entry)) {
			return entry.reason
		}
	}
	return undefined
}

const extractData = (error: unknown): unknown => {
	if (error instanceof HandledError || error instanceof UnhandledError) {
		return error.data
	}
	if (isRecord(error) && 'data' in error) {
		return error.data
	}
	return undefined
}

const deriveKind = (
	error: unknown,
	errorChain: unknown[],
	fallbackKind: SanitizedErrorKind | undefined,
): SanitizedErrorKind => {
	if (error instanceof HandledError) {
		return 'business'
	}
	const runtimeKind =
		isRecord(error) && isRecord(error.data) && typeof error.data.kind === 'string' ? error.data.kind : undefined
	if (runtimeKind === 'timeout') {
		return 'timeout'
	}
	if (runtimeKind === 'schema') {
		return 'schema'
	}
	if (runtimeKind === 'transient') {
		return 'network'
	}
	if (errorChain.some(isTimeoutLikeError)) {
		return 'timeout'
	}
	if (errorChain.some(isSchemaLikeError)) {
		return 'schema'
	}
	if (errorChain.some(isNetworkLikeError)) {
		return 'network'
	}
	if (errorChain.some(isProviderLikeError)) {
		return 'provider'
	}
	if (fallbackKind) {
		return fallbackKind
	}
	return 'runtime'
}

export const createSanitizedErrorDiagnostics = (
	error: unknown,
	options?: { fallbackKind?: SanitizedErrorKind },
): SanitizedErrorDiagnostics => {
	const errorChain = collectErrorChain(error)
	const headers = extractResponseHeaders(errorChain)
	const errorName =
		error instanceof Error ? error.name : isRecord(error) && typeof error.name === 'string' ? error.name : undefined
	const urlEntry = errorChain.find(entry => isRecord(entry) && typeof entry.url === 'string') as
		| { url: string }
		| undefined
	return {
		kind: deriveKind(error, errorChain, options?.fallbackKind),
		name: errorName,
		message: normalizeMessage(error),
		statusCode: getStatusCode(error) ?? errorChain.map(getStatusCode).find(value => value !== undefined),
		providerCode: extractProviderCode(errorChain),
		retryable: extractRetryable(errorChain),
		url: urlEntry ? truncateString(urlEntry.url) : undefined,
		requestId: extractRequestId(headers, errorChain),
		responseHeaders: headers,
		responseBody: extractResponseBody(errorChain),
		attempts: getAttempts(error) ?? errorChain.map(getAttempts).find(value => value !== undefined),
		reason: extractReason(errorChain),
		data: sanitizeUnknown(extractData(error)),
	}
}

export const createProtocolSafeErrorDetails = (
	error: unknown,
	options?: { fallbackKind?: SanitizedErrorKind; provider?: string },
) => {
	const diagnostics = createSanitizedErrorDiagnostics(error, options)
	return {
		kind: diagnostics.kind,
		statusCode: diagnostics.statusCode,
		provider: options?.provider,
		providerCode: diagnostics.providerCode,
		requestId: diagnostics.requestId,
		retryable: diagnostics.retryable,
		attempts: diagnostics.attempts,
		reason: diagnostics.reason,
	}
}

export const createRuntimeLogContext = (input: {
	manifest: AgentManifest
	identity: AgentInvocationIdentity
	provider?: string
	modelAlias?: string
	capability?: string
	durationMs?: number
}): Record<string, string | number | undefined> => ({
	agentName: input.manifest.agentName,
	serviceVersion: input.manifest.serviceVersion,
	traceId: input.identity.traceId,
	correlationId: input.identity.correlationId,
	baseSessionId: input.identity.baseSessionId,
	conversationId: input.identity.conversationId,
	tenantId: input.identity.tenantId,
	principalId: input.identity.principalId,
	provider: input.provider,
	modelAlias: input.modelAlias,
	capability: input.capability,
	durationMs: input.durationMs,
})
