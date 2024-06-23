/**
 * Options for a single request
 */
export type HttpClientRequestOptions = {
	/**
	 * additional headers
	 */
	headers?: Record<string, string>
	/**
	 * query/search string parameter
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
