import { StatusCode } from '@purista/core'

/**
 * Runs the getErrorName helper exported by @purista/hono-http-server.
 * Expose only schemas and metadata that are safe for clients to inspect.
 */
/**
 * Converts a PURISTA status code enum member into a human-readable HTTP title.
 */
export const getErrorName = (code: StatusCode) =>
	StatusCode[code]
		.replace(/[A-Z]/g, letter => ` ${letter}`)
		.replace(/^./, str => {
			return str.toUpperCase()
		})
		.trim()
		.replace(/^O K$/g, 'OK')
