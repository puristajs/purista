import { HandledError, StatusCode, UnhandledError } from '@purista/core/adapter'
import type { SchemaObject } from 'openapi3-ts/oas31'

import { getErrorName } from './getErrorName.js'

/**
 * RFC 9457-style problem details response returned by generated Hono endpoints.
 */
export type ProblemDetails = {
	/** Problem type URI or `about:blank` when no custom base URI is configured. */
	type: string
	/** Human-readable status title. */
	title: string
	/** HTTP status code. */
	status: number
	/** Occurrence-specific error detail safe for the selected error class. */
	detail: string
	/** Request path or URI where the problem occurred. */
	instance?: string
	/** Application trace identifier propagated through the HTTP request. */
	traceId?: string
	/** Validation issues, when available. */
	errors?: unknown[]
	/** Additional safe details for handled errors or explicitly allowed internal details. */
	details?: unknown
}

/**
 * Controls generated problem type URIs.
 */
export type ProblemTypeConfig = {
	/** Base URI used for known problem type slugs. */
	typeBaseUri?: string
}

const problemTypeMap = new Map<number, string>([
	[StatusCode.BadRequest, 'bad-request'],
	[StatusCode.Unauthorized, 'unauthorized'],
	[StatusCode.Forbidden, 'forbidden'],
	[StatusCode.NotFound, 'not-found'],
	[StatusCode.Conflict, 'conflict'],
	[StatusCode.TooManyRequests, 'rate-limit'],
	[StatusCode.InternalServerError, 'internal-server-error'],
	[StatusCode.InvalidToken, 'invalid-token'],
])

const validationErrorType = 'validation-error'

const isRecord = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object'

const isValidationIssue = (value: unknown): value is Record<string, unknown> =>
	isRecord(value) && typeof value.code === 'string' && typeof value.message === 'string'

const isValidationIssueList = (value: unknown): value is Record<string, unknown>[] =>
	Array.isArray(value) && value.length > 0 && value.every(isValidationIssue)

const isProblemDetails = (value: unknown): value is ProblemDetails =>
	isRecord(value) &&
	typeof value.type === 'string' &&
	typeof value.title === 'string' &&
	typeof value.status === 'number' &&
	typeof value.detail === 'string'

const stringifyPretty = (value: unknown) => JSON.stringify(value, null, 2)

/**
 * Runs the getProblemTypeUri helper exported by @purista/hono-http-server.
 * Expose only schemas and metadata that are safe for clients to inspect.
 */
const normalizeProblemTypeBaseUri = (value: string) => {
	let end = value.length
	while (end > 0 && value[end - 1] === '/') {
		end -= 1
	}
	return value.slice(0, end)
}

/**
 * Runs the toProblemDetails helper exported by @purista/hono-http-server.
 * Expose only schemas and metadata that are safe for clients to inspect.
 */
const buildProblemTypeUri = (slug: string, config?: ProblemTypeConfig): string => {
	if (!config?.typeBaseUri) {
		return 'about:blank'
	}
	return `${normalizeProblemTypeBaseUri(config.typeBaseUri)}/${slug}`
}

/**
 * Resolves the problem type URI for an HTTP status and optional validation data.
 */
export const getProblemTypeUri = (status: number, data?: unknown, config?: ProblemTypeConfig): string => {
	if (isValidationIssueList(data)) {
		return buildProblemTypeUri(validationErrorType, config)
	}
	const slug = problemTypeMap.get(status)
	return slug ? buildProblemTypeUri(slug, config) : 'about:blank'
}

/**
 * Converts PURISTA errors and unknown thrown values into HTTP problem details.
 *
 * Server errors are intentionally minimized unless `safeInternalDetails` is set.
 */
export const toProblemDetails = (
	error: unknown,
	input: {
		statusCode?: number
		traceId?: string
		instance?: string
		safeInternalDetails?: boolean
		problemTypeConfig?: ProblemTypeConfig
	} = {},
): ProblemDetails => {
	if (isProblemDetails(error)) {
		return {
			...error,
			traceId: error.traceId ?? input.traceId,
			instance: error.instance ?? input.instance,
		}
	}

	if (error instanceof HandledError) {
		const status = error.errorCode
		const data = error.data
		const detail = error.message || getErrorName(status)
		const problem: ProblemDetails = {
			type: getProblemTypeUri(status, data, input.problemTypeConfig),
			title: getErrorName(status),
			status,
			detail,
			instance: input.instance,
			traceId: error.traceId ?? input.traceId,
		}
		if (isValidationIssueList(data)) {
			problem.errors = data
		} else if (data !== undefined) {
			problem.details = data
		}
		return problem
	}

	if (error instanceof UnhandledError) {
		const status = input.statusCode ?? error.errorCode
		const isServerError = status >= 500
		return {
			type: getProblemTypeUri(status, undefined, input.problemTypeConfig),
			title: getErrorName(status),
			status,
			detail: isServerError ? getErrorName(status) : error.message || getErrorName(status),
			instance: input.instance,
			traceId: error.traceId ?? input.traceId,
			...(input.safeInternalDetails && error.data !== undefined ? { details: error.data } : {}),
		}
	}

	if (isRecord(error)) {
		const status =
			typeof input.statusCode === 'number'
				? input.statusCode
				: typeof error.status === 'number'
					? error.status
					: StatusCode.InternalServerError
		const data = 'data' in error ? error.data : undefined
		const traceId = typeof error.traceId === 'string' ? error.traceId : input.traceId
		const detail = typeof error.message === 'string' ? error.message : getErrorName(status)
		const problem: ProblemDetails = {
			type: getProblemTypeUri(status, data, input.problemTypeConfig),
			title: getErrorName(status),
			status,
			/**
			 * Runs the renderProblemDetailsMarkdown helper exported by @purista/hono-http-server.
			 * Expose only schemas and metadata that are safe for clients to inspect.
			 */
			detail: status >= 500 && typeof error.message !== 'string' ? getErrorName(status) : detail,
			instance: input.instance,
			traceId,
		}
		if (isValidationIssueList(data)) {
			problem.errors = data
		} else if (data !== undefined) {
			problem.details = data
		}
		return problem
	}

	const status = input.statusCode ?? StatusCode.InternalServerError
	return {
		type: getProblemTypeUri(status, undefined, input.problemTypeConfig),
		title: getErrorName(status),
		status,
		detail: status >= 500 ? getErrorName(status) : String(error),
		instance: input.instance,
		traceId: input.traceId,
	}
}

/**
 * Renders problem details as Markdown for clients that prefer `text/markdown`.
 */
export const renderProblemDetailsMarkdown = (problem: ProblemDetails): string => {
	const lines = [`# ${problem.title}`, '', problem.detail]
	if (problem.errors && problem.errors.length > 0) {
		lines.push('', '## Validation errors')
		for (const issue of problem.errors) {
			if (isRecord(issue)) {
				const path = Array.isArray(issue.path) ? issue.path.join('.') : undefined
				const message = typeof issue.message === 'string' ? issue.message : 'Validation error'
				lines.push(`- ${path ?? 'input'}: ${message}`)
			} else {
				lines.push(`- ${String(issue)}`)
			}
		}
	}
	if (problem.details !== undefined) {
		lines.push('', '## Details', '```json', stringifyPretty(problem.details), '```')
	}
	lines.push('', '## Metadata', `- \`status\`: ${problem.status}`, `- \`type\`: ${problem.type}`)
	if (problem.instance) {
		/**
		 * Runs the negotiateProblemRepresentation helper exported by @purista/hono-http-server.
		 * Expose only schemas and metadata that are safe for clients to inspect.
		 */
		lines.push(`- \`instance\`: ${problem.instance}`)
	}
	if (problem.traceId) {
		lines.push(`- \`traceId\`: ${problem.traceId}`)
	}
	return lines.join('\n')
}

const parseAcceptToken = (token: string) => {
	const [mediaTypeRaw, ...params] = token.split(';').map(value => value.trim())
	if (!mediaTypeRaw) {
		return undefined
	}
	let q = 1
	for (const param of params) {
		const [name, value] = param.split('=').map(entry => entry.trim())
		if (name === 'q') {
			const parsed = Number(value)
			if (!Number.isNaN(parsed)) {
				q = parsed
			}
		}
	}
	return { mediaType: mediaTypeRaw.toLowerCase(), q }
}

/**
 * Chooses the problem details response representation from an HTTP `Accept` header.
 */
export const negotiateProblemRepresentation = (acceptHeader?: string): 'json' | 'markdown' => {
	if (!acceptHeader) {
		return 'json'
	}
	const parsed = acceptHeader
		.split(',')
		.map(token => parseAcceptToken(token))
		.filter((value): value is { mediaType: string; q: number } => !!value)
		.sort((a, b) => b.q - a.q)

	for (const item of parsed) {
		if (item.mediaType === 'text/markdown' || item.mediaType === 'text/*') {
			return 'markdown'
		}
		if (
			item.mediaType === 'application/problem+json' ||
			item.mediaType === 'application/json' ||
			item.mediaType === 'application/*' ||
			item.mediaType === '*/*'
		) {
			return 'json'
		}
	}

	return 'json'
}

/**
 * Builds an OpenAPI schema for problem details responses.
 */
export const getProblemDetailsSchema = (
	code: StatusCode,
	message: string,
	schema?: SchemaObject,
	problemTypeConfig?: ProblemTypeConfig,
): SchemaObject => {
	const detailsSchema: SchemaObject = {
		type: 'object',
		properties: {
			type: {
				type: 'string',
				title: 'problem type URI',
				example: getProblemTypeUri(
					code,
					code === StatusCode.BadRequest ? [{ code: 'invalid_type', message: 'invalid' }] : undefined,
					problemTypeConfig,
				),
			},
			title: {
				type: 'string',
				title: 'problem title',
				example: getErrorName(code),
			},
			status: {
				type: 'number',
				minimum: 100,
				title: 'the HTTP status code',
				example: code,
			},
			detail: {
				type: 'string',
				title: 'occurrence-specific problem detail',
				example: message,
			},
			instance: {
				type: 'string',
				title: 'problem instance URI or path',
				example: '/api/v1/example',
			},
			traceId: {
				type: 'string',
				title: 'trace id',
				example: 'd5dbb17eec16e3c9fce9cf8adc766999',
			},
		},
		required: ['type', 'title', 'status', 'detail'],
	}

	if (schema) {
		detailsSchema.properties = {
			...detailsSchema.properties,
			details: schema,
		}
	} else if (code === StatusCode.BadRequest) {
		detailsSchema.properties = {
			...detailsSchema.properties,
			errors: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						validation: { type: 'string', example: 'invalid_string' },
						code: { type: 'string', example: 'invalid_string' },
						message: { type: 'string', example: 'String must contain at least 3 character(s)' },
						expected: { type: 'string', example: 'string' },
						received: { type: 'string', example: 'object' },
						keys: { type: 'array', items: { type: 'string' } },
						minimum: { type: 'number', example: 3 },
						maximum: { type: 'number', example: 32 },
						path: { type: 'array', items: { type: 'string', example: 'username' } },
					},
					required: ['message', 'code'],
				},
			},
		}
	}

	return detailsSchema
}
