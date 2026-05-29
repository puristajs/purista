/** HTTP authentication information kept in memory by {@link HttpClient}. */
export type AuthCredentials = {
	/** Basic-Auth information */
	basicAuth?: {
		/** Basic-Auth username */
		username: string
		/** Basic-Auth password */
		password: string
	}
	/** Bearer token header value. Do not log or expose in telemetry. */
	bearerToken?: string
}
