/**
 * Options for a single HTTP request.
 */
export type HttpClientRequestOptions = {
	/**
	 * Additional headers for this request.
	 *
	 * These are sent over the wire and may be visible to telemetry processors.
	 * Avoid secrets unless explicitly required and governed by policy.
	 */
	headers?: Record<string, string>
	/**
	 * Query/search string parameters.
	 *
	 * Avoid secrets and PII in query strings.
	 */
	query?: Record<string, string>
	/**
	 * url hash
	 * @example: http://example.com/index.html#hash
	 */
	hash?: string
	/**
	 * Timeout for the request in ms
	 * @default 30000
	 */
	timeout?: number
}
