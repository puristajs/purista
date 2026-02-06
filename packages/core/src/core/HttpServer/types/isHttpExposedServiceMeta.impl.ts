import type { HttpExposedServiceMeta } from './HttpExposedServiceMeta.js'

/**
 * Checks if given input is type of HttpExposedServiceMeta
 * @param input
 * @returns boolean - true if input is type of HttpExposedServiceMeta
 */
export const isHttpExposedServiceMeta = (input?: unknown): input is HttpExposedServiceMeta => {
	if (!input || typeof input !== 'object') {
		return false
	}
	const candidate = input as Partial<HttpExposedServiceMeta>
	if (!candidate.expose?.http) {
		return false
	}
	return true
}
