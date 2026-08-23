import type { EmptyObject, HttpClientConfig, Prettify } from '@purista/core/adapter'

/**
 * Infisical client-specific HTTP configuration extension.
 *
 * The current client does not add custom HTTP configuration fields.
 */
export type HttpClientConfigCustom = EmptyObject

/**
 * HTTP client configuration for `InfisicalClient`.
 *
 * `bearerToken` is required and should contain an Infisical service token loaded
 * from runtime secret management. Do not log or persist this object with real
 * credentials.
 */
export type ClientConfig = Prettify<
	Required<Pick<HttpClientConfig<HttpClientConfigCustom>, 'bearerToken'>> &
		Omit<HttpClientConfig<HttpClientConfigCustom>, 'bearerToken'>
>
