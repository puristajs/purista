/**
 * Environment and path scope granted to an Infisical service token.
 */
export type Scope = {
	/**
	 * Infisical environment name, for example `dev` or `prod`.
	 */
	environment: string
	/**
	 * Secret path within the Infisical project.
	 */
	secretPath: string
	/**
	 * Infisical scope identifier.
	 */
	_id: string
}
