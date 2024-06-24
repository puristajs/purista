import type { SSMClientConfig } from '@aws-sdk/client-ssm'

/**
 * AWS System Manager config
 */
export type AWSConfigStoreConfig = {
	/**
	 * AWS client options
	 */
	client: SSMClientConfig
}
