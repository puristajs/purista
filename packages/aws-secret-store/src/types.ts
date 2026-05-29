import type { SecretsManagerClientConfigType } from '@aws-sdk/client-secrets-manager'

/**
 * AWS Secrets Manager store configuration.
 *
 * The `client` object is passed to the AWS SDK `SecretsManagerClient`. Prefer
 * IAM roles or the default AWS credential provider chain over embedding
 * credentials in source code or examples.
 */
export type AWSSecretStoreConfig = {
	/**
	 * AWS SDK `SecretsManagerClient` options such as `region`, `endpoint`, or
	 * custom credentials for local tests.
	 *
	 * @example
	 * ```typescript
	 * const config: AWSSecretStoreConfig = {
	 *   client: { region: 'eu-central-1' },
	 * }
	 * ```
	 */
	client: SecretsManagerClientConfigType
}
