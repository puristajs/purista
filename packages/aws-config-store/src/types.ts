import type { SSMClientConfig } from '@aws-sdk/client-ssm'

/**
 * AWS Systems Manager Parameter Store configuration.
 *
 * The `client` object is passed to the AWS SDK `SSMClient`. Prefer IAM roles or
 * the default AWS credential provider chain over embedding credentials in source
 * code or examples.
 */
export type AWSConfigStoreConfig = {
	/**
	 * AWS SDK `SSMClient` options such as `region`, `endpoint`, or custom
	 * credentials for local tests.
	 *
	 * @example
	 * ```typescript
	 * const config: AWSConfigStoreConfig = {
	 *   client: { region: 'eu-central-1' },
	 * }
	 * ```
	 */
	client: SSMClientConfig
}
