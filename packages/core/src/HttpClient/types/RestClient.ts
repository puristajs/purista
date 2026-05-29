import type { HttpClientRequestOptions } from './HttpClientRequestOptions.js'

/**
 * REST API client abstraction for JSON-oriented HTTP calls.
 *
 * Implementations should normalize timeout/provider failures to PURISTA errors
 * and avoid logging request/response payloads by default.
 */
export interface RestClient {
	/**
	 * Set the Auth-Bearer-Token for all following requests
	 * @param token the bearer token
	 */
	setBearerToken(token: string | undefined): void

	/**
	 * Make a GET request against baseUrl+path
	 * Returns body text if response content type is not set to `application/json`.
	 * If response content type is `application/json`, the JSON parsed result will be returned
	 * @param path
	 * @param options
	 */
	get<T>(path: string, options: HttpClientRequestOptions): Promise<T>

	/**
	 * Make a POST request against baseUrl+path
	 * Returns body text if response content type is not set to `application/json`.
	 * If response content type is `application/json`, the JSON parsed result will be returned
	 * @param path
	 * @param payload
	 * @param options
	 */
	post<T>(path: string, payload: unknown, options: HttpClientRequestOptions): Promise<T>

	/**
	 * Make a PUT request against baseUrl+path
	 * Returns body text if response content type is not set to `application/json`.
	 * If response content type is `application/json`, the JSON parsed result will be returned
	 * @param path
	 * @param payload
	 * @param options
	 */
	put<T>(path: string, payload: unknown, options: HttpClientRequestOptions): Promise<T>

	/**
	 * Make a PATCH request against baseUrl+path
	 * Returns body text if response content type is not set to `application/json`.
	 * If response content type is `application/json`, the JSON parsed result will be returned
	 * @param path
	 * @param payload
	 * @param options
	 */
	patch<T>(path: string, payload: unknown, options: HttpClientRequestOptions): Promise<T>

	/**
	 * Make a DELETE request against baseUrl+path
	 * Returns body text if response content type is not set to `application/json`.
	 * If response content type is `application/json`, the JSON parsed result will be returned
	 * @param path
	 * @param options
	 */
	delete<T>(path: string, options: HttpClientRequestOptions): Promise<T>
}
