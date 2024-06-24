import type { SecretsManagerClientConfigType } from '@aws-sdk/client-secrets-manager'

/**
 * AWS Secret Manager store config
 */
export type AWSSecretStoreConfig = {
	/**
	 * AWS client options
	 */
	client: SecretsManagerClientConfigType
}
