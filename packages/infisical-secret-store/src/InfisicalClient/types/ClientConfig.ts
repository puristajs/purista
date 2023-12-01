import type { HttpClientConfig, Prettify } from '@purista/core'

export type HttpClientConfigCustom = {}

export type ClientConfig = Prettify<
  Required<Pick<HttpClientConfig<HttpClientConfigCustom>, 'bearerToken'>> &
    Omit<HttpClientConfig<HttpClientConfigCustom>, 'bearerToken'>
>
