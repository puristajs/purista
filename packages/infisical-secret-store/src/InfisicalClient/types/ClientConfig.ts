import type { EmptyObject, HttpClientConfig, Prettify } from '@purista/core'

export type HttpClientConfigCustom = EmptyObject

export type ClientConfig = Prettify<
	Required<Pick<HttpClientConfig<HttpClientConfigCustom>, 'bearerToken'>> &
		Omit<HttpClientConfig<HttpClientConfigCustom>, 'bearerToken'>
>
