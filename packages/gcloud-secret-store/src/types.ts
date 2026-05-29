import type { ClientOptions } from 'google-gax'

/**
 * Google Secret Manager store configuration.
 */
export type GoogleSecretStoreConfig = {
	/**
	 * Google Cloud project resource name in `projects/*` format, without a
	 * trailing `/secrets` segment.
	 *
	 * @example
	 * ```typescript
	 * 'projects/example-project'
	 * ```
	 */
	project: string
	/**
	 * Options passed to `SecretManagerServiceClient`.
	 *
	 * Prefer Application Default Credentials or workload identity over static
	 * service account keys.
	 */
	client?: ClientOptions
}
