/**
 * HTTP authentication information
 */
export type AuthCredentials = {
	/** Basic-Auth information */
	basicAuth?: {
		/** Basic-Auth username */
		username: string
		/** Basic-Auth password */
		password: string
	}
	/** Bearer token header */
	bearerToken?: string
}
